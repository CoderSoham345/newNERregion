import React, { useState } from 'react';
import { useOperating } from '../context/OperatingContext';
import { ALL_STATES, STATES_DATA, type StateId, type OperatingState } from '../data/statesAndDistricts';
import {
  Newspaper,
  ExternalLink,
  ShieldCheck,
  Clock,
  MapPin,
  Filter,
  Search,
  AlertTriangle,
  Building,
  Flame,
  Radio,
} from 'lucide-react';
import { SourceBadge } from '../components/SourceBadge';

export const NerNewsPage: React.FC = () => {
  const { news, selectedState, setSelectedState } = useOperating();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Road Closure',
    'Rainfall',
    'Landslide',
    'Flood',
    'Logistics',
    'Advisory',
  ];

  const filteredNews = news.filter((item) => {
    // State filter
    if (selectedState !== 'All states' && item.stateId !== selectedState && item.stateId !== 'Regional') {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.stateId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Verified North Eastern Region Situation Bulletins
            </h1>
            <SourceBadge status="official" confidence="high" />
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            SIH26002 Official Dispatch Stream • Authentic Press Releases from Ministry of DoNER, NHAI PIUs, Border Roads Organisation (BRO), State Disaster Management Authorities (SDMA), and IMD Regional Met Center Guwahati.
          </p>
        </div>

        {/* State Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-bold hidden sm:inline">Jurisdiction:</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as OperatingState)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {ALL_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified news releases by highway (NH-6), district, or agency..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Stream */}
      <div className="space-y-4">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => {
            const isBreaking =
              item.category === 'Road Closure' ||
              item.category === 'Landslide' ||
              item.impactRating === 'High' ||
              item.title.toLowerCase().includes('emergency') ||
              item.title.toLowerCase().includes('alert');

            return (
              <article
                key={item.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isBreaking && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white animate-pulse">
                        HIGH PRIORITY
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {item.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.summary}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    Jurisdiction: <strong>{item.stateId}</strong>
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verified Government Feed</span>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <Newspaper className="w-8 h-8 mx-auto text-slate-400" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              No bulletins matching selected criteria
            </div>
            <p className="text-xs text-slate-500">
              Try switching state jurisdiction or clearing category filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
