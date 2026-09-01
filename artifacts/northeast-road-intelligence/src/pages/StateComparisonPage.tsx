import React from 'react';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId } from '../data/statesAndDistricts';
import { BarChart3, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';

export const StateComparisonPage: React.FC = () => {
  const { roadSegments, setSelectedState } = useOperating();
  const [, setLocation] = useLocation();

  const stateComparisonList = ALL_STATES.filter((s) => s !== 'All states').map((st) => {
    const sId = st as StateId;
    const data = STATES_DATA[sId];
    const segments = roadSegments.filter((r) => r.stateId === sId);
    const accessible = segments.filter((r) => r.roadStatus === 'Accessible').length;
    const blocked = segments.filter((r) => r.roadStatus === 'Blocked').length;
    const atRisk = segments.filter((r) => r.roadStatus === 'At risk').length;
    const avgRisk = segments.length > 0
      ? Math.round(segments.reduce((acc, r) => acc + r.riskScore, 0) / segments.length)
      : 20;
    const accessibilityPct = segments.length > 0 ? Math.round((accessible / segments.length) * 100) : 100;

    return {
      stateId: sId,
      name: data.name,
      capital: data.capital,
      districts: data.districtCount,
      totalRoads: segments.length,
      accessible,
      blocked,
      atRisk,
      avgRisk,
      accessibilityPct,
    };
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            North Eastern States Accessibility & Risk Benchmarking
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Comparative cross-state metrics covering highway resilience, seasonal flood vulnerability, and clearance response speed.
        </p>
      </div>

      {/* Benchmarking Comparison Matrix Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Capital HQ</th>
                <th className="py-3 px-4">Districts</th>
                <th className="py-3 px-4">Monitored Roads</th>
                <th className="py-3 px-4">Accessibility %</th>
                <th className="py-3 px-4">Blocked</th>
                <th className="py-3 px-4">Avg Hazard Risk</th>
                <th className="py-3 px-4 text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {stateComparisonList.map((st) => (
                <tr
                  key={st.stateId}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedState(st.stateId);
                    setLocation('/states');
                  }}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {st.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {st.capital}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {st.districts}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {st.totalRoads}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        {st.accessibilityPct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-red-600">
                    {st.blocked}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold ${
                        st.avgRisk >= 60
                          ? 'text-red-600'
                          : st.avgRisk >= 40
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {st.avgRisk}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
