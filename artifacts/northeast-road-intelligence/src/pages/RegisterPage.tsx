import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useOperating, type UserRole } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId } from '../data/statesAndDistricts';
import {
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building,
  MapPin,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  UserPlus,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { registerUser, userProfile } = useOperating();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Field Officer');
  const [department, setDepartment] = useState('Northeast Disaster Response');
  const [assignedState, setAssignedState] = useState<StateId | 'All states'>('All states');
  const [assignedDistrict, setAssignedDistrict] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (userProfile.isAuthenticated && userProfile.email) {
      setLocation('/');
    }
  }, [userProfile.isAuthenticated, userProfile.email, setLocation]);

  const availableDistricts =
    assignedState !== 'All states' && STATES_DATA[assignedState as StateId]
      ? STATES_DATA[assignedState as StateId].districts
      : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError('Please enter your full name');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerUser({
        name: cleanName,
        email: cleanEmail,
        password,
        role,
        department: department.trim() || 'Northeast Disaster Response',
        assignedState,
        assignedDistrict: assignedDistrict || undefined,
      });

      if (res.success) {
        setSuccessMsg('Account registered successfully! Redirecting to dashboard...');
        setTimeout(() => {
          setLocation('/');
        }, 800);
      } else {
        setError(res.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed due to a network or server error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 dark:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 mb-2">
              <UserPlus className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Official Registration
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create UttarPURV Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Join the official North East India road, disaster and emergency intelligence network
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-800 dark:text-red-200 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. N. Sangma"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. officer@uttarpurv.gov.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password *
                  </label>
                  <span className="text-[11px] text-slate-400">Min. 6 chars</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Role / Designation
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="Field Officer">Field Officer (Patrol & Inspection)</option>
                  <option value="Emergency Responder">Emergency Responder (BRO / SDRF / Police)</option>
                  <option value="Government Official">Government Official (State / Central)</option>
                  <option value="District Official">District Official (DC / SDMA)</option>
                  <option value="Logistics Operator">Logistics Operator (Freight / Cargo)</option>
                  <option value="Transporter">Transporter / Highway Fleet Driver</option>
                  <option value="Citizen / Viewer">Citizen / Public Commuter</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department / Organization
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. SDMA / PWD / Police"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Assigned State */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary State Coverage
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    value={assignedState}
                    onChange={(e) => {
                      setAssignedState(e.target.value as StateId | 'All states');
                      setAssignedDistrict('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="All states">All 8 NER States (Regional)</option>
                    {ALL_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned District (Optional)
                </label>
                <select
                  value={assignedDistrict}
                  onChange={(e) => setAssignedDistrict(e.target.value)}
                  disabled={assignedState === 'All states'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
                >
                  <option value="">All districts in {assignedState}</option>
                  {availableDistricts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer switch to Login */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500 dark:text-slate-500 space-y-1">
          <p>Protected by end-to-end PBKDF2 credential hashing & Supabase PostgreSQL infrastructure.</p>
          <p>© 2025 UttarPURV • North East Road, Disaster & Emergency Intelligence System</p>
        </div>
      </div>
    </div>
  );
};
