import React, { useState } from 'react';
import { Link } from 'wouter';
import { useOperating } from '../context/OperatingContext';
import {
  Cpu,
  Layers,
  Activity,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Compass,
  FileCode,
  Sliders,
  Database,
  Truck,
  Sparkles,
  HelpCircle,
  BarChart3,
  Search,
} from 'lucide-react';

interface PipelineStage {
  id: string;
  step: number;
  title: string;
  shortDesc: string;
  inputs: string[];
  algorithms: string[];
  outputs: string[];
  juryExplanation: string;
  formulaOrLogic?: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'sources',
    step: 1,
    title: 'Data Ingestion & Multi-Source Telemetry',
    shortDesc: 'Aggregates Doppler rainfall radars, terrain elevation, GPS transponders, and field reports.',
    inputs: [
      'Open-Meteo Doppler precipitation radar (1-hour resolution)',
      'SRTM 30m Digital Elevation Model (DEM)',
      'GSI Geotechnical landslide susceptibility atlas',
      'Live AIS-140 GPS transponders & freight logs',
      'Citizen & field official crowd-verified reports',
    ],
    algorithms: ['Asynchronous Polling Engine', 'Spatial GeoJSON Binning', 'Data Integrity Validation'],
    outputs: ['Raw multi-layer geospatial data packets', 'Normalized sensor arrays'],
    juryExplanation:
      'Continuous sensor streams are ingested from open satellite APIs, official digital elevation grids, and live field telemetry, then geo-rectified into unified coordinate tensors.',
    formulaOrLogic: 'Data_Stream(t) = [ Rain(t), Elevation(x,y), Slope(θ), SoilMoisture(t), Transponder(v,lat,lng) ]',
  },
  {
    id: 'validation',
    step: 2,
    title: 'Data Quality & Anomaly Cleansing',
    shortDesc: 'Eliminates GPS drift, false precipitation spikes, and duplicate citizen incident reports.',
    inputs: ['Raw Geo-coordinate packets', 'Unfiltered sensor telemetry', 'Citizen SOS inputs'],
    algorithms: ['Kalman Filtering for GPS drift', 'Spatial Deduplication Hash', 'Outlier Rejection Filter'],
    outputs: ['Cleaned kinematic tracks', 'Deduplicated incident tickets with confidence weights'],
    juryExplanation:
      'In rugged mountain topography, GPS signals experience multi-path reflection. The Kalman filter smoothes vehicle locations while spatial hash rings consolidate nearby citizen hazard submissions into single verified events.',
    formulaOrLogic: 'x̂(k) = x̂⁻(k) + K(k) [ z(k) - H x̂⁻(k) ] (Optimal State Estimation)',
  },
  {
    id: 'features',
    step: 3,
    title: 'Geotechnical Feature Engineering',
    shortDesc: 'Computes antecedent precipitation index (API), slope gradient, and pore-water pressure.',
    inputs: ['Elevation models', 'Cumulative 72-hour precipitation', 'Lithological soil classes'],
    algorithms: ['Finite Slope Stability Analysis', 'Antecedent Precipitation Index (API)', 'Terrain Curvature Extraction'],
    outputs: ['Factor of Safety (FoS) index', 'Pore pressure ratio (ru)', 'Catchment runoff velocity'],
    juryExplanation:
      'Calculates physical slope equilibrium. Heavy monsoon rainfall saturates sub-surface regolith, increasing pore pressure and decreasing effective shear strength along mountain road cuts.',
    formulaOrLogic: 'API(t) = P(t) + k · API(t-1)  (where k = 0.85 degradation coefficient)',
  },
  {
    id: 'ai_ml',
    step: 4,
    title: 'AI / ML Risk Prediction Engine',
    shortDesc: 'Ensemble gradient boosted trees & spatial heuristic models forecast slope failure and flood inundation.',
    inputs: ['Engineered terrain features', 'Historical blockage records', 'Active weather forecasts (+24h)'],
    algorithms: ['XGBoost Slope Failure Classifier', 'Spatial Flood Inundation Modeler', 'Monte Carlo Corridor Simulator'],
    outputs: ['Segment Disruption Probability (0-100%)', 'Estimated Delay Impact (minutes)'],
    juryExplanation:
      'Predicts failure likelihood before physical rockfall occurs. Combines historical landslide catalogs with real-time saturation gradients to classify road segment risk into Safe, Moderate, High, or Critical.',
    formulaOrLogic: 'P(Disruption | Features) = σ( ∑ w_i · f_i + b )  (Calibrated Ensemble Probability)',
  },
  {
    id: 'explainability',
    step: 5,
    title: 'Transparent Explainable AI (XAI)',
    shortDesc: 'Generates transparent factor contributions so highway authorities understand why a road is at risk.',
    inputs: ['Model feature weights', 'Local SHAP / attribution gradients', 'Threshold triggers'],
    algorithms: ['SHAP (Shapley Additive Explanations)', 'Decision Rule Distillation'],
    outputs: ['Factor contribution % (e.g. Rainfall 42%, Slope 31%, Soil 17%, History 10%)', 'Human-readable diagnostic summary'],
    juryExplanation:
      'Eliminates black-box AI hesitation. For every red alert, UttarPURV explicitly details the physical drivers—allowing engineers at BRO or PWD to verify the exact causal mechanisms.',
    formulaOrLogic: 'Attribution(Feature_i) = |φ_i| / ( ∑ |φ_j| ) · 100%',
  },
  {
    id: 'route_opt',
    step: 6,
    title: 'Multi-Objective Route Optimization',
    shortDesc: 'Computes risk-penalized shortest path tailored for emergency medicine, fuel, and relief cargo.',
    inputs: ['Road network graph', 'Dynamic risk scores', 'Vehicle physical dimensions', 'Cargo priority rank'],
    algorithms: ['Risk-Constrained Modified Dijkstra / A*', 'Dynamic Edge-Weight Penalty Function'],
    outputs: ['Optimal alternative path', 'Net ETA differential', 'Avoided risk score'],
    juryExplanation:
      'Standard GPS navigators minimize only travel time or distance, often leading heavy trucks into mountain landslide bottlenecks. UttarPURV applies exponential penalty costs to high-hazard edges.',
    formulaOrLogic: 'Route Cost = Travel_Time + ( α · Risk_Penalty ) + ( β · Delay_Cost ) + ( γ · Accessibility_Cost )',
  },
  {
    id: 'alert_dispatch',
    step: 7,
    title: 'Automated Alert & Authority Dispatch',
    shortDesc: 'Instantly broadcasts actionable alerts to SEOC, district disaster rooms, and connected freight drivers.',
    inputs: ['Risk threshold crossings', 'Blocked corridor events', 'Emergency SOS triggers'],
    algorithms: ['CAP (Common Alerting Protocol) Formatter', 'Priority Webhook Dispatcher', 'Driver Push Broker'],
    outputs: ['National CAP-compliant XML alerts', 'In-cab turnarounds', 'Automated BRO work orders'],
    juryExplanation:
      'When probability exceeds 80%, automated dispatches trigger to the State Emergency Operations Center (1070) and Border Roads Task Forces, while holding commercial convoys at safe upstream checkpoints.',
    formulaOrLogic: 'If P(Risk) > Threshold_Critical → Broadcast(CAP_Alert, SEOC, Convoy_Telematics)',
  },
  {
    id: 'resolve',
    step: 8,
    title: 'Post-Incident Audit & Verification',
    shortDesc: 'Verifies physical clearance, logs response latency, and retrains AI models for lifelong learning.',
    inputs: ['BRO clearance reports', 'GPS restoration velocity', 'Field officer photographic proof'],
    algorithms: ['Traffic Flow Restoration Verifier', 'Automated Audit Trail Generator', 'Model Retraining Pipeline'],
    outputs: ['Verified road reopening stamp', 'SLA compliance logs', 'Updated historical landslide catalog'],
    juryExplanation:
      'Closes the loop. Once earthmovers clear the debris and traffic speeds normalize above 30 km/h, the system verifies reopening and updates the historical memory bank to improve future predictive accuracy.',
    formulaOrLogic: 'Segment_Status = Reopened IF ( Field_Verify == True AND Mean_Traffic_Speed > 25 km/h )',
  },
];

export const AlgorithmEnginePage: React.FC = () => {
  const { isSimulatingIncident, runAiIncidentSimulation, simulationStep } = useOperating();
  const [activeStageId, setActiveStageId] = useState<string>('ai_ml');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'modules' | 'workflow'>('pipeline');

  const currentStage = PIPELINE_STAGES.find((s) => s.id === activeStageId) || PIPELINE_STAGES[3];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-purple-900 text-purple-200 border border-purple-700 tracking-wider uppercase">
                Architecture & Methodology
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                SIH PS ID 26002 AI Spec
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              How UttarPURV&apos;s Intelligence Engine Works
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Complete technical transparency: Mathematical formulations, geotechnical risk models, explainable attribution, and multi-objective corridor optimization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runAiIncidentSimulation}
              disabled={isSimulatingIncident}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                isSimulatingIncident
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSimulatingIncident ? 'Running Simulation...' : 'Test AI Live'}</span>
            </button>
            <Link
              href="/map"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Inspect on Map</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            1. Interactive AI Pipeline
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'modules'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            2. Core Intelligence Modules (A–G)
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'workflow'
                ? 'bg-purple-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            3. Incident → Response Workflow
          </button>
        </div>
      </div>

      {/* Simulation status if active */}
      {isSimulatingIncident && (
        <div className="bg-amber-950/80 border border-amber-600 p-4 rounded-xl flex items-center gap-3 text-amber-200 text-xs font-semibold animate-pulse">
          <Activity className="w-5 h-5 text-amber-400 shrink-0 animate-spin" />
          <span>{simulationStep}</span>
        </div>
      )}

      {/* TAB 1: INTERACTIVE AI PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Visual Step Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Click any stage in the 8-step pipeline to inspect inputs, math, and outputs:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {PIPELINE_STAGES.map((stg) => {
                const isActive = stg.id === activeStageId;
                return (
                  <button
                    key={stg.id}
                    onClick={() => setActiveStageId(stg.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 dark:border-purple-600 ring-2 ring-purple-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                          isActive
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {stg.step}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                        {stg.title.split('&')[0].trim()}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deep Stage Inspector */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black text-lg flex items-center justify-center">
                  {currentStage.step}
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {currentStage.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{currentStage.shortDesc}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 self-start sm:self-auto">
                Stage {currentStage.step} of 8
              </span>
            </div>

            {/* Jury Friendly Explanation Box */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 p-4 rounded-xl border border-purple-200 dark:border-purple-800/60">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Jury Assessment Brief</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {currentStage.juryExplanation}
              </p>
            </div>

            {/* Mathematical / Technical Formula */}
            {currentStage.formulaOrLogic && (
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-sans mb-1 font-bold">
                  Mathematical Formulation & Algorithmic Representation:
                </div>
                <code>{currentStage.formulaOrLogic}</code>
              </div>
            )}

            {/* 3-Column Inputs, Algorithms, Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Inputs */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span>Input Variables & Datasets</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {currentStage.inputs.map((inp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Algorithms */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-purple-500" />
                  <span>Algorithms & Transformations</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {currentStage.algorithms.map((alg, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{alg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outputs */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Engine Outputs & Directives</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {currentStage.outputs.map((out, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CORE INTELLIGENCE MODULES (A to G) */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Module A */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              <span>Section A</span>
              <span>•</span>
              <span>Road Disruption Risk Prediction</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Multi-Factor Environmental & Geotechnical Disruption Estimator
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Combines environmental, terrain kinematics, historical occurrence rates, and live road conditions to estimate risk percentage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <strong className="text-slate-900 dark:text-white">Input Feature Matrix:</strong>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  <li>• <strong>Rainfall Intensity:</strong> Hourly precipitation rate (mm/h) & 3-day antecedent total</li>
                  <li>• <strong>Terrain Gradient:</strong> Slope angle in degrees extracted from SRTM DEM</li>
                  <li>• <strong>Soil Saturation:</strong> Volumetric soil moisture index & pore-water ratio</li>
                  <li>• <strong>Historical Failures:</strong> GSI recorded recurrence frequency at specific coordinate pins</li>
                  <li>• <strong>Road Integrity:</strong> Pavement surface quality and structural retaining wall status</li>
                  <li>• <strong>Short-term Forecast:</strong> Projected IMD / Open-Meteo precipitation (+6h to +24h)</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 space-y-2">
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Disruption Risk Function</div>
                <div className="p-2 bg-slate-950 rounded text-emerald-300 text-[11px] leading-relaxed">
                  Risk_Score = 0.35 × Normalized_Rainfall + 0.25 × Slope_Factor + 0.20 × Soil_Pore_Pressure + 0.10 × Historical_Rate + 0.10 × Forecast_Spike
                </div>
                <div className="text-[11px] text-slate-400">
                  Classified into: 🟢 Safe (0–39%), 🟡 Moderate (40–64%), 🟠 High (65–79%), 🔴 Critical (80–100%)
                </div>
              </div>
            </div>
          </div>

          {/* Module B */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <span>Section B</span>
              <span>•</span>
              <span>Dynamic Route Optimization</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Risk-Penalized Multi-Constraint Shortest Path Algorithm
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Standard commercial navigation selects shortest time, often leading drivers into landslide chokepoints. UttarPURV computes a dynamic Route Score incorporating hazard exposure and vehicle payload criticality.
            </p>

            <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold text-sm">
                Route Score = Travel_Cost + Risk_Cost + Delay_Cost + Accessibility_Cost
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-2 border-t border-slate-800">
                <div>• <strong>Travel Cost:</strong> Physical distance (km) and free-flow transit duration</div>
                <div>• <strong>Risk Cost:</strong> Exponential multiplier on segments with landslide/flood risk &gt; 65%</div>
                <div>• <strong>Delay Cost:</strong> Real-time convoy queueing and bridge bottleneck lag</div>
                <div>• <strong>Accessibility Cost:</strong> Penalties for single-lane mountain passes and unpaved stretches</div>
              </div>
            </div>
          </div>

          {/* Module C & D */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* C: Anomaly Detection */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <span>Section C</span>
                <span>•</span>
                <span>Spatial Anomaly Detection</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Live Sensor & Convoy Anomaly Triggers
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Detects emergent hazards before formal reporting through behavioral telemetry heuristics:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>• <strong>Unexpected Stoppage:</strong> Vehicle stationary &gt; 15 mins outside scheduled halts</li>
                <li>• <strong>Sudden Speed Reduction:</strong> Mean segment velocity dropping from 45 km/h to &lt; 8 km/h</li>
                <li>• <strong>Abnormal Rainfall Spikes:</strong> Rainfall rate exceeding 35 mm/hour (cloudburst indicator)</li>
                <li>• <strong>Incident Cluster Frequency:</strong> &gt; 2 SOS tickets in a 3 km radius within 30 minutes</li>
              </ul>
            </div>

            {/* D: ETA Prediction */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <span>Section D</span>
                <span>•</span>
                <span>Weather-Aware ETA Engine</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Dynamic Delay Forecasting
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Accounts for mountain terrain degradation factors rather than assuming flat highway cruising speeds:
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300">
                ETA_Adjusted = Distance / Speed_Base + Delay_Ghat + Delay_Precip + Delay_Bottleneck
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provides guaranteed confidence intervals for hospital blood banks, oxygen deliveries, and disaster relief convoys.
              </p>
            </div>
          </div>

          {/* Module E, F, G */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* E: Priority Engine */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Section E • Logistics Priority
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Configurable Cargo Hierarchy
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                During highway capacity rationing, routing preference allocates automatically:
              </p>
              <ol className="space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300 list-decimal list-inside">
                <li>Critical Medicine & Vaccines</li>
                <li>Emergency Relief Supplies</li>
                <li>Food Grains & Daily Staples</li>
                <li>Agricultural Perishables</li>
                <li>Construction / Heavy Materials</li>
                <li>General Commercial Freight</li>
              </ol>
            </div>

            {/* F: Risk Scoring */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Section F • Risk Scoring
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Holistic Operational Risk
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Synthesizes vulnerability from six distinct dimensions:
              </p>
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div>• Hazard (Rain/Slope)</div>
                <div>• Exposure (Vehicles on road)</div>
                <div>• Accessibility (Alternate connectivity)</div>
                <div>• Historical evidence (GSI records)</div>
                <div>• Current telemetry (GPS speeds)</div>
                <div>• Short-range forecast</div>
              </div>
            </div>

            {/* G: Explainable AI */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Section G • Explainable AI
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Zero Black-Box Transparency
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Every single prediction displays:
              </p>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <li>• <strong>Risk Category:</strong> (Safe/Mod/High/Critical)</li>
                <li>• <strong>Why:</strong> Exact contributing factor weights</li>
                <li>• <strong>Confidence:</strong> Sensor data quality index</li>
                <li>• <strong>Action:</strong> Specific tactical mandate</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INCIDENT -> RESPONSE WORKFLOW */}
      {activeTab === 'workflow' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                9-Step Incident to Resolution Lifecycle
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                End-to-end automation from initial anomaly detection through inter-agency clearance and route restoration.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Interactive Blueprint
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: 1,
                title: 'Incident Detected',
                desc: 'Rainfall sensor threshold exceeded or citizen lodges GPS-tagged report.',
                color: 'border-blue-500 text-blue-600',
              },
              {
                step: 2,
                title: 'AI Classifies Incident',
                desc: 'Identifies type (Landslide, Flash Flood, Structural Bridge Damage) with severity.',
                color: 'border-purple-500 text-purple-600',
              },
              {
                step: 3,
                title: 'Risk Score Generated',
                desc: 'Calculates probability percentage (e.g. 89% Critical) and factor attributions.',
                color: 'border-red-500 text-red-600',
              },
              {
                step: 4,
                title: 'Impact Area Identified',
                desc: 'Geo-fences downstream highway segments, trapped vehicles, and cut-off villages.',
                color: 'border-amber-500 text-amber-600',
              },
              {
                step: 5,
                title: 'Emergency Resources Located',
                desc: 'Automatically maps nearest BRO dozer stations, SDRF teams, and ICU trauma centers.',
                color: 'border-cyan-500 text-cyan-600',
              },
              {
                step: 6,
                title: 'Authority Alert Dispatched',
                desc: 'Pushes CAP alert to State Emergency Ops Center (1070) & District Police control rooms.',
                color: 'border-orange-500 text-orange-600',
              },
              {
                step: 7,
                title: 'Alternative Route Generated',
                desc: 'Re-evaluates network graph and pushes detour coordinates to active freight cabs.',
                color: 'border-emerald-500 text-emerald-600',
              },
              {
                step: 8,
                title: 'Vehicle Monitoring Active',
                desc: 'Monitors rerouted freight until safe crossing beyond the affected hazard zone.',
                color: 'border-indigo-500 text-indigo-600',
              },
              {
                step: 9,
                title: 'Incident Resolved & Audited',
                desc: 'Field verification clears the road; audit log recorded and AI models retrained.',
                color: 'border-emerald-600 text-emerald-600',
              },
            ].map((wf) => (
              <div
                key={wf.step}
                className={`p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-4 ${wf.color} border-t border-r border-b border-slate-200 dark:border-slate-700/60 space-y-1.5`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Step 0{wf.step}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{wf.title}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{wf.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
