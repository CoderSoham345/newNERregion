import { Router, type IRouter } from "express";
import crypto from "crypto";
import { getDb, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// In-memory fallback user store if PostgreSQL connection is unavailable or not yet provisioned
interface FallbackUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  role: string;
  department: string;
  assignedState: string;
  assignedDistrict?: string;
  badgeId: string;
}

const fallbackUsers: Map<string, FallbackUser> = new Map();

// Helper to hash password with crypto PBKDF2
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

// Generate simple secure session token
function generateToken(userId: string, email: string): string {
  const payload = `${userId}:${email}:${Date.now()}`;
  const secret = process.env.SESSION_SECRET || "uttarpurv-ner-intel-secret-key-2025";
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64");
}

// Pre-seed demo fallback accounts
function initFallbackUsers() {
  if (fallbackUsers.size === 0) {
    const demoAccounts = [
      {
        id: "usr_officer_1",
        email: "officer@uttarpurv.gov.in",
        password: "Password@123",
        name: "N. Sangma",
        role: "Field Officer",
        department: "Meghalaya Disaster Management Authority",
        assignedState: "Meghalaya",
        badgeId: "NER-OFF-101",
      },
      {
        id: "usr_commander_2",
        email: "commander@uttarpurv.gov.in",
        password: "Password@123",
        name: "Col. R. Sharma",
        role: "Emergency Responder",
        department: "Border Roads Organisation (BRO)",
        assignedState: "Assam",
        badgeId: "BRO-NER-889",
      },
      {
        id: "usr_logistics_3",
        email: "logistics@uttarpurv.gov.in",
        password: "Password@123",
        name: "T. Ao",
        role: "Logistics Operator",
        department: "Northeast Essential Cargo Corridor",
        assignedState: "Nagaland",
        badgeId: "LOG-NAG-412",
      },
      {
        id: "usr_citizen_4",
        email: "citizen@uttarpurv.gov.in",
        password: "Password@123",
        name: "A. Debbarma",
        role: "Citizen / Viewer",
        department: "Tripura Highway Commuter",
        assignedState: "Tripura",
        badgeId: "CIT-TRP-007",
      },
    ];

    for (const acc of demoAccounts) {
      const salt = crypto.randomBytes(16).toString("hex");
      const passwordHash = hashPassword(acc.password, salt);
      fallbackUsers.set(acc.email.toLowerCase(), {
        id: acc.id,
        email: acc.email.toLowerCase(),
        passwordHash,
        salt,
        name: acc.name,
        role: acc.role,
        department: acc.department,
        assignedState: acc.assignedState,
        badgeId: acc.badgeId,
      });
    }
  }
}

initFallbackUsers();

// ============================================================================
// POST /api/auth/register - Register new user account
// ============================================================================
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, department, assignedState, assignedDistrict } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Full Name is required" });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Valid email address is required" });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const userRole = role || "Field Officer";
    const userDept = department || "Northeast Disaster Response";
    const userState = assignedState || "All states";
    const badgeId = `UP-${Math.floor(1000 + Math.random() * 9000)}`;

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = hashPassword(password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Try saving to PostgreSQL database first
    const database = getDb();
    let dbSuccess = false;

    if (database) {
      try {
        const existingUsers = await database.select().from(users).where(eq(users.email, normalizedEmail));
        if (existingUsers.length > 0) {
          return res.status(409).json({ success: false, error: "An account with this email already exists" });
        }

        await database.insert(users).values({
          id: userId,
          email: normalizedEmail,
          passwordHash,
          salt,
          name: cleanName,
          role: userRole,
          department: userDept,
          assignedState: userState,
          assignedDistrict: assignedDistrict || "",
          badgeId,
        });
        dbSuccess = true;
      } catch (dbErr: any) {
        logger.warn({ err: dbErr?.message }, "Postgres user insert failed; saving to memory fallback");
      }
    }

    // Always maintain in fallback memory
    if (fallbackUsers.has(normalizedEmail)) {
      return res.status(409).json({ success: false, error: "An account with this email already exists" });
    }

    fallbackUsers.set(normalizedEmail, {
      id: userId,
      email: normalizedEmail,
      passwordHash,
      salt,
      name: cleanName,
      role: userRole,
      department: userDept,
      assignedState: userState,
      assignedDistrict,
      badgeId,
    });

    const token = generateToken(userId, normalizedEmail);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: userId,
        email: normalizedEmail,
        name: cleanName,
        role: userRole,
        department: userDept,
        assignedState: userState,
        assignedDistrict,
        badgeId,
        token,
      },
    });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error registering user");
    return res.status(500).json({ success: false, error: "Internal server error during registration" });
  }
});

// ============================================================================
// POST /api/auth/login - Authenticate user with Email + Password
// ============================================================================
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check Postgres DB
    const database = getDb();
    if (database) {
      try {
        const found = await database.select().from(users).where(eq(users.email, normalizedEmail));
        if (found.length > 0) {
          const userRow = found[0];
          const testHash = hashPassword(password, userRow.salt);
          if (testHash === userRow.passwordHash) {
            const token = generateToken(userRow.id, userRow.email);
            return res.status(200).json({
              success: true,
              message: "Login successful",
              user: {
                id: userRow.id,
                email: userRow.email,
                name: userRow.name,
                role: userRow.role,
                department: userRow.department,
                assignedState: userRow.assignedState,
                assignedDistrict: userRow.assignedDistrict,
                badgeId: userRow.badgeId,
                token,
              },
            });
          }
        }
      } catch (dbErr: any) {
        logger.warn({ err: dbErr?.message }, "Postgres user lookup failed; checking fallback memory");
      }
    }

    // Check fallback memory
    initFallbackUsers();
    const fallbackUser = fallbackUsers.get(normalizedEmail);
    if (fallbackUser) {
      const testHash = hashPassword(password, fallbackUser.salt);
      if (testHash === fallbackUser.passwordHash) {
        const token = generateToken(fallbackUser.id, fallbackUser.email);
        return res.status(200).json({
          success: true,
          message: "Login successful",
          user: {
            id: fallbackUser.id,
            email: fallbackUser.email,
            name: fallbackUser.name,
            role: fallbackUser.role,
            department: fallbackUser.department,
            assignedState: fallbackUser.assignedState,
            assignedDistrict: fallbackUser.assignedDistrict,
            badgeId: fallbackUser.badgeId,
            token,
          },
        });
      }
    }

    return res.status(401).json({ success: false, error: "Invalid email or password. Please try again." });
  } catch (error: any) {
    logger.error({ err: error.message }, "Error during login");
    return res.status(500).json({ success: false, error: "Authentication failed due to server error" });
  }
});

// ============================================================================
// GET /api/auth/me - Verify current session
// ============================================================================
router.get("/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Unauthorized: Missing or invalid token" });
    }

    const token = authHeader.substring(7);
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId, email, timestamp, signature] = decoded.split(":");

    const secret = process.env.SESSION_SECRET || "uttarpurv-ner-intel-secret-key-2025";
    const expectedSig = crypto.createHmac("sha256", secret).update(`${userId}:${email}:${timestamp}`).digest("hex");

    if (signature !== expectedSig) {
      return res.status(401).json({ success: false, error: "Invalid session token" });
    }

    // Try finding user in DB
    const database = getDb();
    if (database) {
      try {
        const found = await database.select().from(users).where(eq(users.id, userId));
        if (found.length > 0) {
          const userRow = found[0];
          return res.status(200).json({
            success: true,
            user: {
              id: userRow.id,
              email: userRow.email,
              name: userRow.name,
              role: userRow.role,
              department: userRow.department,
              assignedState: userRow.assignedState,
              assignedDistrict: userRow.assignedDistrict,
              badgeId: userRow.badgeId,
            },
          });
        }
      } catch (e) {
        // Fallback to memory
      }
    }

    initFallbackUsers();
    const fallbackUser = fallbackUsers.get(email.toLowerCase());
    if (fallbackUser) {
      return res.status(200).json({
        success: true,
        user: {
          id: fallbackUser.id,
          email: fallbackUser.email,
          name: fallbackUser.name,
          role: fallbackUser.role,
          department: fallbackUser.department,
          assignedState: fallbackUser.assignedState,
          assignedDistrict: fallbackUser.assignedDistrict,
          badgeId: fallbackUser.badgeId,
        },
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        email,
        name: "Officer",
        role: "Field Officer",
        department: "Northeast Emergency Cell",
        assignedState: "All states",
        badgeId: "UP-990",
      },
    });
  } catch (error: any) {
    return res.status(401).json({ success: false, error: "Invalid session token" });
  }
});

// ============================================================================
// POST /api/auth/logout - Confirm logout
// ============================================================================
router.post("/auth/logout", (_req, res) => {
  return res.status(200).json({ success: true, message: "Logged out successfully" });
});

export default router;
