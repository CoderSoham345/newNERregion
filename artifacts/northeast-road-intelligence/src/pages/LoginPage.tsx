import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useOperating, type UserRole } from '../context/OperatingContext';
import { LANGUAGES, type SupportedLanguage } from '../data/translations';
import {
  Shield,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Smartphone,
  ChevronLeft,
  Globe,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { loginUser, userProfile, currentLanguage, setLanguage } = useOperating();

  // Login steps: 'phone' | 'otp'
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (userProfile.isAuthenticated && (userProfile.email || userProfile.mobile)) {
      setLocation('/');
    }
  }, [userProfile.isAuthenticated, userProfile.email, userProfile.mobile, setLocation]);

  // Resend countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNum = mobileNumber.replace(/\D/g, '');
    if (cleanNum.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsLoading(true);
    setSuccessMsg(null);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setResendTimer(30);
      setCanResend(false);
      setSuccessMsg(`OTP sent successfully to +91 ${mobileNumber}`);
    }, 700);
  };

  // Handle Verify OTP & Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    try {
      // For SIH Demo, OTP 123456 verifies N. Sangma (Field Officer, Meghalaya)
      if (otp !== '123456') {
        setError('Incorrect OTP. For SIH evaluation demo, use code: 123456');
        setIsLoading(false);
        return;
      }

      // Successful verification
      const res = await loginUser({
        email: 'officer@uttarpurv.gov.in',
        mobile: `+91 ${mobileNumber}`,
        name: 'N. Sangma',
        role: 'Field Officer',
        department: 'Meghalaya Disaster Management Authority',
        assignedState: 'Meghalaya',
        assignedDistrict: 'East Khasi Hills (Shillong)',
        badgeId: 'UP-891',
      });

      if (res.success) {
        setSuccessMsg('✅ Verified! Loading UttarPURV Command Center...');
        setTimeout(() => {
          setLocation('/');
        }, 600);
      } else {
        setError(res.error || 'Authentication failed. Please retry.');
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Quick Demo Role Sign-In
  const handleQuickDemoLogin = async (
    role: UserRole,
    name: string,
    mobile: string,
    email: string,
    state: any,
    dept: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginUser({
        email,
        mobile,
        name,
        role,
        department: dept,
        assignedState: state,
        badgeId: `UP-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      if (res.success) {
        setSuccessMsg(`Welcome, ${name} (${role})! Redirecting...`);
        setTimeout(() => {
          setLocation('/');
        }, 500);
      } else {
        setError('Quick login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6 bg-slate-950">
      <div className="w-full max-w-md space-y-5">
        
        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100">
          
          {/* Language Selector Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Language:</span>
            </div>
            <div className="flex items-center gap-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentLanguage === lang.code
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 mb-1">
              <Shield className="w-7 h-7" />
            </div>
            <div className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 inline-block">
              NER-INTEL OFFICIAL PORTAL
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              UttarPURV
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              North Eastern Region Road, Logistics & Disaster Intelligence System
            </p>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-emerald-200 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-red-200 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: MOBILE NUMBER INPUT */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Field Officer Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-3.5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 select-none">
                    🇮🇳 +91
                  </div>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      required
                      className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">Enter 10-digit registered Indian mobile number</p>
              </div>

              <button
                type="submit"
                disabled={isLoading || mobileNumber.length < 10}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                    }}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Change mobile number</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">+91 {mobileNumber}</span>
                </div>

                <label className="block text-xs font-bold text-slate-300">
                  Enter 6-Digit Verification Code
                </label>
                
                {/* DEMO MODE NOTICE */}
                <div className="p-2.5 bg-amber-950/60 border border-amber-500/40 rounded-xl text-[11px] text-amber-200 flex items-center justify-between">
                  <span className="font-semibold">DEMO MODE ACTIVE</span>
                  <span className="font-mono bg-amber-900/80 px-2 py-0.5 rounded text-amber-100 font-bold">OTP: 123456</span>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="1 2 3 4 5 6"
                  autoFocus
                  required
                  className="w-full py-3.5 bg-slate-950 border border-emerald-500/60 rounded-xl text-center text-xl font-mono tracking-widest text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Didn’t receive code?'}
                  </span>
                  <button
                    type="button"
                    disabled={!canResend}
                    onClick={() => {
                      setResendTimer(30);
                      setCanResend(false);
                      setSuccessMsg('New demo OTP sent: 123456');
                    }}
                    className={`font-bold transition-colors ${canResend ? 'text-emerald-400 hover:underline cursor-pointer' : 'text-slate-600 cursor-not-allowed'}`}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Role Demo Logins */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">
              Quick Government Role Sign-In
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Field Officer', 'N. Sangma', '+91 94361 22891', 'officer@uttarpurv.gov.in', 'Meghalaya', 'Meghalaya Disaster Management')}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left text-[11px] border border-slate-700/80 transition-colors cursor-pointer"
              >
                <div className="font-bold text-white truncate">N. Sangma</div>
                <div className="text-[9px] text-emerald-400">Field Officer (Meghalaya)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('Emergency Responder', 'Col. R. Sharma', '+91 98640 11223', 'commander@uttarpurv.gov.in', 'Assam', 'Border Roads Organisation')}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-left text-[11px] border border-slate-700/80 transition-colors cursor-pointer"
              >
                <div className="font-bold text-white truncate">Col. R. Sharma</div>
                <div className="text-[9px] text-red-400">BRO Commander (Assam)</div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p>Secure government field operations • Offline-ready after sign-in</p>
          <p>© 2025-2026 UttarPURV • Ministry of DONER & SIH Initiative</p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
