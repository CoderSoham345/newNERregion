import React, { useState, useRef, useEffect } from 'react';
import { useOperating } from '../context/OperatingContext';
import {
  parseUserQuery,
  executeOperationalIntent,
  type AiOperationalResponse,
  type AiConversationContext,
  type StructuredAiAction,
  type DataBadgeType,
} from '../lib/uttarPurvAiEngine';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  MapPin,
  Compass,
  Truck,
  ShieldAlert,
  PhoneCall,
  Activity,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useLocation } from 'wouter';

interface AiAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInlinePage?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text?: string;
  timestamp: string;
  responsePayload?: AiOperationalResponse;
}

export const AiAssistantModal: React.FC<AiAssistantProps> = ({
  isOpen = false,
  onClose,
  isInlinePage = false,
}) => {
  const [, setLocation] = useLocation();
  const {
    currentLanguage,
    selectedState,
    setSelectedState,
    selectedDistrictId,
    setSelectedDistrictId,
    roadSegments,
    highways,
    incidents,
    alerts,
    cargoList,
    vehicles,
    infrastructure,
    facilities,
    helplines,
    liveWeather,
    userProfile,
    inspectRoad,
    inspectCargo,
    inspectVehicle,
    inspectIncident,
  } = useOperating();

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Conversational Context Memory
  const [conversationContext, setConversationContext] = useState<AiConversationContext>({
    queryHistory: [],
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${userProfile.name}. I am the UttarPURV Operational Intelligence Assistant for Northeast India. I provide real-time, data-grounded answers for corridor risk profiles, road closures, active landslide incidents, delayed medical/cargo shipments, vehicle telematics, and verified emergency directories across all 8 NER states.`,
      timestamp: 'Just now',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Curated Preset Action Queries matching core operational workflows
  const PRESET_QUERIES = [
    'Show risky corridors near Shillong',
    'Which roads are currently blocked in Meghalaya?',
    'Show landslide incidents near East Khasi Hills',
    'Which medicine deliveries are delayed?',
    'Show vehicles near Shillong',
    'Give me a safer route from Guwahati to Shillong',
    'What is the current accessibility status of Assam?',
    'Show critical logistics bottlenecks in Meghalaya',
    'Nearest emergency services to this incident',
    'What are the risky corridors near Shillong in the next 6 hours?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      try {
        // 1. Structured intent & entity parsing
        const parsedParams = parseUserQuery(query, conversationContext);

        // 2. Query application data context & compile operational grounded response
        const { response, updatedContext } = executeOperationalIntent(
          parsedParams,
          {
            roadSegments,
            highways,
            incidents,
            alerts,
            cargoList,
            vehicles,
            infrastructure,
            facilities,
            helplines,
            liveWeather,
            selectedState,
            selectedDistrictId,
            userName: userProfile.name,
          },
          conversationContext,
          currentLanguage
        );

        // 3. Update conversation memory
        setConversationContext(updatedContext);

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          timestamp: response.lastUpdated,
          responsePayload: response,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (err) {
        console.error('AI execution error:', err);
        const fallbackMsg: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          text: 'Unable to complete intent query against current telemetry. Please retry with specific corridor name or district.',
          timestamp: 'Now',
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsThinking(false);
      }
    }, 350);
  };

  // Handle Action Button Execution
  const handleActionClick = (action: StructuredAiAction) => {
    const { actionType, payload, url } = action;

    if (payload?.stateId && payload.stateId !== 'All states') {
      setSelectedState(payload.stateId);
    }
    if (payload?.districtId) {
      setSelectedDistrictId(payload.districtId);
    }

    if (actionType === 'SELECT_ROAD' && payload?.roadSegmentId) {
      inspectRoad(payload.roadSegmentId);
      if (url) setLocation(url);
    } else if (actionType === 'SELECT_INCIDENT' && payload?.incidentId) {
      inspectIncident(payload.incidentId);
      if (url) setLocation(url);
    } else if (actionType === 'SELECT_CARGO' && payload?.cargoId) {
      inspectCargo(payload.cargoId);
      if (url) setLocation(url);
    } else if (actionType === 'SELECT_VEHICLE' && payload?.vehicleId) {
      inspectVehicle(payload.vehicleId);
      if (url) setLocation(url);
    } else if (url) {
      if (url.startsWith('tel:')) {
        window.location.href = url;
        return;
      }
      setLocation(url);
    }

    if (!isInlinePage && onClose) {
      onClose();
    }
  };

  const getBadgeStyle = (badgeType: DataBadgeType) => {
    switch (badgeType) {
      case 'LIVE':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'SIMULATION':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30';
      case 'FORECAST':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'HISTORICAL':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Top Header */}
      <div className="px-4 py-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                UttarPURV Operational AI Assistant
              </h2>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Action-Grounded v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Zero hallucination · Direct GIS, incident, logistics & weather query engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isInlinePage && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Action Chips Bar */}
      <div className="px-3 py-2 bg-slate-100/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 pl-1">
          Quick Queries:
        </span>
        {PRESET_QUERIES.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pq)}
            className="shrink-0 px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-800 rounded-lg text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Message Chat Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                m.sender === 'user'
                  ? 'bg-emerald-700 text-white font-medium rounded-tr-xs'
                  : 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-xs space-y-3'
              }`}
            >
              {/* Simple Text Message */}
              {m.text && (
                <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>
              )}

              {/* Rich Operational Response Payload */}
              {m.responsePayload && (
                <div className="space-y-3">
                  {/* Response Header & Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[13px] text-slate-900 dark:text-white uppercase tracking-tight">
                        {m.responsePayload.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${getBadgeStyle(
                          m.responsePayload.dataScopeBadge
                        )}`}
                      >
                        [{m.responsePayload.dataScopeBadge}]
                      </span>
                      {m.responsePayload.locationScope && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" />
                          {m.responsePayload.locationScope}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary / Direct Answer */}
                  <div className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 leading-relaxed">
                    {m.responsePayload.summary}
                  </div>

                  {/* Structured Items Grid */}
                  {m.responsePayload.items.length > 0 && (
                    <div className="space-y-2.5">
                      {m.responsePayload.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-50/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                        >
                          {/* Item Title & Badge */}
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                              <span>{item.title}</span>
                            </div>
                            {item.badge && (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.badge.variant === 'critical'
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                                    : item.badge.variant === 'high'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                                    : item.badge.variant === 'success'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                                    : item.badge.variant === 'simulation'
                                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900'
                                    : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {item.badge.text}
                              </span>
                            )}
                          </div>

                          {item.subtitle && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {item.subtitle}
                            </div>
                          )}

                          {/* Key Metrics Badges */}
                          {item.metrics && item.metrics.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                              {item.metrics.map((met, mIdx) => (
                                <div
                                  key={mIdx}
                                  className={`p-1.5 rounded-lg border text-[10px] ${
                                    met.alert
                                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-bold'
                                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  <div className="text-[9px] text-slate-400 uppercase tracking-tight font-medium">
                                    {met.label}
                                  </div>
                                  <div className="truncate font-semibold mt-0.5">
                                    {met.value}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Details Bullet Points */}
                          {item.details && item.details.length > 0 && (
                            <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 bg-white/70 dark:bg-slate-950/70 p-2 rounded-lg border border-slate-100 dark:border-slate-850">
                              {item.details.map((det, dIdx) => (
                                <div key={dIdx} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500 font-bold">•</span>
                                  <span>{det}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Item Recommendation */}
                          {item.recommendation && (
                            <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-start gap-1.5 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span>
                                <strong className="text-emerald-800 dark:text-emerald-300">Action: </strong>
                                {item.recommendation}
                              </span>
                            </div>
                          )}

                          {/* Item Specific Actions */}
                          {item.actions && item.actions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {item.actions.map((act, aIdx) => (
                                <button
                                  key={aIdx}
                                  onClick={() => handleActionClick(act)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
                                >
                                  <span>{act.label}</span>
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Contributing Factors & Explainability */}
                  {m.responsePayload.contributingFactors && m.responsePayload.contributingFactors.length > 0 && (
                    <div className="p-2.5 bg-slate-100/70 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Why / Key Contributing Risk Factors:</span>
                      </div>
                      <div className="space-y-1">
                        {m.responsePayload.contributingFactors.map((cf, cfIdx) => (
                          <div key={cfIdx} className="flex items-start justify-between gap-2 text-[11px]">
                            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{cf.factor}:</span>
                              <span>{cf.impact}</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                              {cf.weightPct}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overall Recommended Action */}
                  {m.responsePayload.recommendedAction && (
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2">
                      <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-emerald-900 dark:text-emerald-200">
                        <strong>Recommended Operational Directive: </strong>
                        {m.responsePayload.recommendedAction}
                      </div>
                    </div>
                  )}

                  {/* Context Action Buttons */}
                  {m.responsePayload.actionButtons.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                      {m.responsePayload.actionButtons.map((btn, bIdx) => (
                        <button
                          key={bIdx}
                          onClick={() => handleActionClick(btn)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs hover:shadow-sm transition-all cursor-pointer"
                        >
                          <span>{btn.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Verifiable Provenance & Sources */}
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Sources:</span>
                      {m.responsePayload.sources.map((src, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[9px] text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        {m.responsePayload.lastUpdated}
                      </span>
                      <span className="px-1.5 py-0.5 rounded font-bold text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {m.responsePayload.confidence} Confidence
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2.5 p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl max-w-sm text-xs text-slate-600 dark:text-slate-300 shadow-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 dark:text-white">Synthesizing telemetry...</div>
              <div className="text-[10px] text-slate-400">Extracting entity parameters & verifying GIS road state</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask an operational question (e.g., 'Show risky corridors near Shillong', 'Which medicine deliveries are delayed?')..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>
        </form>
        <div className="text-[10px] text-slate-400 text-center mt-1.5 flex items-center justify-center gap-2">
          <span>🛡 Zero-hallucination operational telemetry</span>
          <span>•</span>
          <span>⚡ Live Open-Meteo REST & SEOC Registry</span>
        </div>
      </div>
    </div>
  );

  if (isInlinePage) {
    return <div className="h-full w-full">{content}</div>;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl h-[680px] max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-700 animate-in fade-in zoom-in-95 duration-150">
        {content}
      </div>
    </div>
  );
};
