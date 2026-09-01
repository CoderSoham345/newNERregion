import React from 'react';
import { AiAssistantModal } from '../components/AiAssistantModal';
import { Bot, Sparkles, Database, ShieldAlert, Cpu } from 'lucide-react';
import { SourceBadge } from '../components/SourceBadge';

export const AiAssistantPage: React.FC = () => {
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight">UttarPURV AI Intelligence Assistant</h1>
            <SourceBadge status="derived" confidence="high" />
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            UttarPURV Grounded Multi-Source Intelligence Engine. Formulates real-time corridor risk assessments, weather analysis, nearest hospital/police locator, and safe route recommendations across all 8 Northeast States.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Context: Live Telemetry</span>
          </div>
        </div>
      </div>

      {/* Embedded Assistant Console */}
      <div className="h-[680px]">
        <AiAssistantModal isInlinePage={true} />
      </div>
    </div>
  );
};
