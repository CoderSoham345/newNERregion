import React, { useState } from 'react';
import { useOperating, type UserRole } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import {
  Shield,
  User,
  Phone,
  KeyRound,
  MapPin,
  Building,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, loginUser, setSelectedState, setSelectedDistrictId } = useOperating();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [mobile, setMobile] = useState(userProfile.mobile || '+91 94361 22891');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState(userProfile.name || 'N. Sangma');
  const [role, setRole] = useState<UserRole>(userProfile.role || 'Logistics Operator');
  const [department, setDepartment] = useState(
    userProfile.department || 'Northeast Inter-State Freight Cell'
  );
  const [assignedState, setAssignedState] = useState<StateId | 'All states'>(
    userProfile.assignedState || 'Meghalaya'
  );
  const [assignedDistrict, setAssignedDistrict] = useState<string>(
    userProfile.assignedDistrict || 'East Khasi Hills (Shillong)'
  );

  const availableDistricts =
    assignedState !== 'All states' && STATES_DATA[assignedState as StateId]
      ? STATES_DATA[assignedState as StateId].districts
      : [];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) return;
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow any OTP for ease of prototype review
    setStep('profile');
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      name: name.trim() || 'Officer in Charge',
      role,
      department: department.trim() || 'NER Operations Command',
      assignedState,
    });
    if (assignedState !== 'All states') {
      setSelectedState(assignedState);
      const matchedDist = availableDistricts.find((d) => d.name === assignedDistrict);
      if (matchedDist) {
        setSelectedDistrictId(matchedDist.id);
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight">UttarPURV Identity Verification</h2>
              <p className="text-[11px] text-slate-400">Northeast India Safety & Logistics Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-center border-b border-slate-200 dark:border-slate-700">
          <div
            className={`py-2 border-b-2 ${
              step === 'phone'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500'
            }`}
          >
            1. Mobile No.
          </div>
          <div
            className={`py-2 border-b-2 ${
              step === 'otp'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500'
            }`}
          >
            2. OTP Verify
          </div>
          <div
            className={`py-2 border-b-2 ${
              step === 'profile'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                : 'border-transparent text-slate-500'
            }`}
          >
            3. Officer Role
          </div>
        </div>

        <div className="p-5">
          {/* Step 1: Mobile Phone */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Used for verified field reporting and secure logistics dispatch.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/80 text-[11px] text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <span>
                  Authorized for SDMA, NHAI, Transporters, Field Patrols, and Citizens.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Send OTP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter 4-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1 2 3 4"
                    maxLength={6}
                    autoFocus
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm tracking-widest font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px]">
                  <span className="text-slate-400">Sent to {mobile}</span>
                  <button
                    type="button"
                    onClick={() => setOtp('8912')}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Auto-Fill Test OTP (8912)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Verify & Proceed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Step 3: Profile Setup */}
          {step === 'profile' && (
            <form onSubmit={handleComplete} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / Call Sign
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. N. Sangma"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Operational Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Logistics Operator">Logistics Operator (Freight / Supply)</option>
                  <option value="Field Officer">Field Officer (Patrol / Verification)</option>
                  <option value="Emergency Responder">Emergency Responder (SDMA / NDRF)</option>
                  <option value="Government Official">Government Official (DoNER / State PWD)</option>
                  <option value="Transporter">Transporter (Fleet Owner / Driver)</option>
                  <option value="Administrator">Administrator (NER Command Center)</option>
                  <option value="Citizen / Viewer">Citizen / Public Viewer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    State Assignment
                  </label>
                  <select
                    value={assignedState}
                    onChange={(e) => {
                      const st = e.target.value as StateId | 'All states';
                      setAssignedState(st);
                      if (st !== 'All states' && STATES_DATA[st]?.districts.length > 0) {
                        setAssignedDistrict(STATES_DATA[st].districts[0].name);
                      }
                    }}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {ALL_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Operational District
                  </label>
                  <select
                    value={assignedDistrict}
                    onChange={(e) => setAssignedDistrict(e.target.value)}
                    disabled={assignedState === 'All states'}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    {assignedState === 'All states' ? (
                      <option value="All districts">All Districts</option>
                    ) : (
                      availableDistricts.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department / Agency
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Northeast Freight & Disaster Cell"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Profile & Start Operations</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
