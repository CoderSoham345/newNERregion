import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { OperatingProvider, useOperating } from './context/OperatingContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RoadIntelligenceDrawer } from './components/RoadIntelligenceDrawer';
import { DataSourceModal } from './components/DataSourceModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileSecondaryDrawer } from './components/MobileSecondaryDrawer';
import { Bot, Sparkles } from 'lucide-react';

// Pages
import { CommandCenter } from './pages/CommandCenter';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LiveRoadMapPage } from './pages/LiveRoadMapPage';
import { RoadNetworkPage } from './pages/RoadNetworkPage';
import { AiRoutesPage } from './pages/AiRoutesPage';
import { CargoReadinessPage } from './pages/CargoReadinessPage';
import { MyCargoPage } from './pages/MyCargoPage';
import { LiveVehiclesPage } from './pages/LiveVehiclesPage';
import { DisasterIntelligencePage } from './pages/DisasterIntelligencePage';
import { LandslideRiskPage } from './pages/LandslideRiskPage';
import { FloodRiskPage } from './pages/FloodRiskPage';
import { TrafficIntelligencePage } from './pages/TrafficIntelligencePage';
import { AiRoadRiskPage } from './pages/AiRoadRiskPage';
import { WeatherIntelligencePage } from './pages/WeatherIntelligencePage';
import { ReportIncidentPage } from './pages/ReportIncidentPage';
import { CitizenReportsTrackingPage } from './pages/CitizenReportsTrackingPage';
import { GovernancePage } from './pages/GovernancePage';
import { NearestHelpPage } from './pages/NearestHelpPage';
import { HelpNearMePage } from './pages/HelpNearMePage';
import { EmergencyHelplinesPage } from './pages/EmergencyHelplinesPage';
import { NearestServicesPage } from './pages/NearestServicesPage';
import { AlertCenterPage } from './pages/AlertCenterPage';
import { NerNewsPage } from './pages/NerNewsPage';
import { StateIntelligencePage } from './pages/StateIntelligencePage';
import { DistrictIntelligencePage } from './pages/DistrictIntelligencePage';
import { StateComparisonPage } from './pages/StateComparisonPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { DataSourceMatrixPage } from './pages/DataSourceMatrixPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { AssamSmartCorridorPage } from './pages/AssamSmartCorridorPage';

const queryClient = new QueryClient();

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ component: React.ComponentType<any> }> = ({ component: Component }) => {
  const { userProfile } = useOperating();
  if (!userProfile.isAuthenticated) {
    return <LoginPage />;
  }
  return <Component />;
};

const AppLayout: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSecondaryMenuOpen, setMobileSecondaryMenuOpen] = useState(false);
  const [floatingAiOpen, setFloatingAiOpen] = useState(false);
  const { emergencyMode, activeProvenanceModal, closeProvenanceModal, userProfile } = useOperating();

  return (
    <div
      className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors ${
        emergencyMode ? 'ring-4 ring-red-500 ring-inset' : ''
      }`}
    >
      {/* Top Government Banner & Navigation */}
      <Navbar
        onToggleSidebar={() => setSidebarCollapsed(prev => !prev)}
        onToggleMobileMenu={() => setMobileNavOpen(prev => !prev)}
        isSidebarCollapsed={sidebarCollapsed}
        isMobileSidebarOpen={mobileNavOpen}
      />

      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Nav (Large screens) */}
        {userProfile.isAuthenticated && (
          <Sidebar
            collapsed={sidebarCollapsed}
            isOpenMobile={mobileNavOpen}
            onCloseMobile={() => setMobileNavOpen(false)}
            onOpenAiAssistant={() => setFloatingAiOpen(true)}
          />
        )}

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-100/70 dark:bg-slate-950/80 custom-scrollbar min-h-[calc(100vh-4rem)]">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/" component={() => <ProtectedRoute component={CommandCenter} />} />
            <Route path="/map" component={() => <ProtectedRoute component={LiveRoadMapPage} />} />
            <Route path="/roads" component={() => <ProtectedRoute component={RoadNetworkPage} />} />
            <Route path="/traffic" component={() => <ProtectedRoute component={TrafficIntelligencePage} />} />
            <Route path="/states" component={() => <ProtectedRoute component={StateIntelligencePage} />} />
            <Route path="/districts" component={() => <ProtectedRoute component={DistrictIntelligencePage} />} />
            <Route path="/weather" component={() => <ProtectedRoute component={WeatherIntelligencePage} />} />
            <Route path="/landslide-risk" component={() => <ProtectedRoute component={LandslideRiskPage} />} />
            <Route path="/flood-risk" component={() => <ProtectedRoute component={FloodRiskPage} />} />
            <Route path="/news" component={() => <ProtectedRoute component={NerNewsPage} />} />
            <Route path="/risk" component={() => <ProtectedRoute component={AiRoadRiskPage} />} />
            <Route path="/routes" component={() => <ProtectedRoute component={AiRoutesPage} />} />
            <Route path="/ai-routes" component={() => <ProtectedRoute component={AiRoutesPage} />} />
            <Route path="/assam-corridor" component={() => <ProtectedRoute component={AssamSmartCorridorPage} />} />
            <Route path="/pilot-corridor" component={() => <ProtectedRoute component={AssamSmartCorridorPage} />} />
            <Route path="/ai-assistant" component={() => <ProtectedRoute component={AiAssistantPage} />} />
            <Route path="/cargo" component={() => <ProtectedRoute component={CargoReadinessPage} />} />
            <Route path="/vehicles" component={() => <ProtectedRoute component={LiveVehiclesPage} />} />
            <Route path="/my-cargo" component={() => <ProtectedRoute component={MyCargoPage} />} />
            <Route path="/track-delivery" component={() => <ProtectedRoute component={MyCargoPage} />} />
            <Route path="/disaster" component={() => <ProtectedRoute component={DisasterIntelligencePage} />} />
            <Route path="/alerts" component={() => <ProtectedRoute component={AlertCenterPage} />} />
            <Route path="/report" component={() => <ProtectedRoute component={ReportIncidentPage} />} />
            <Route path="/reports/track" component={() => <ProtectedRoute component={CitizenReportsTrackingPage} />} />
            <Route path="/governance" component={() => <ProtectedRoute component={GovernancePage} />} />
            <Route path="/nearest-help" component={() => <ProtectedRoute component={NearestHelpPage} />} />
            <Route path="/help-near-me" component={() => <ProtectedRoute component={HelpNearMePage} />} />
            <Route path="/nearest-services" component={() => <ProtectedRoute component={NearestServicesPage} />} />
            <Route path="/emergency-services" component={() => <ProtectedRoute component={NearestServicesPage} />} />
            <Route path="/helplines" component={() => <ProtectedRoute component={EmergencyHelplinesPage} />} />
            <Route path="/profile" component={() => <ProtectedRoute component={MyProfilePage} />} />
            <Route path="/data-sources" component={() => <ProtectedRoute component={DataSourceMatrixPage} />} />
            <Route path="/compare" component={() => <ProtectedRoute component={StateComparisonPage} />} />
            <Route path="/audit" component={() => <ProtectedRoute component={AuditLogPage} />} />
            <Route component={() => <ProtectedRoute component={CommandCenter} />} />
          </Switch>
        </main>
      </div>

      {/* Global Floating "Ask NER AI" button (Hidden on small mobile since bottom nav already provides instant AI tab) */}
      <button
        onClick={() => setFloatingAiOpen(true)}
        className="hidden md:flex fixed bottom-5 right-5 z-40 px-4 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full font-bold text-xs shadow-2xl items-center gap-2 border border-emerald-500/30 transition-all hover:scale-105 cursor-pointer"
        aria-label="Open NER AI Assistant"
      >
        <Bot className="w-5 h-5 text-white" />
        <span>Ask NER AI</span>
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
      </button>

      {/* Mobile Android Bottom Navigation Bar (Visible on mobile screens) */}
      <MobileBottomNav onOpenSecondaryMenu={() => setMobileSecondaryMenuOpen(true)} />

      {/* Mobile Secondary Menu Drawer */}
      <MobileSecondaryDrawer
        isOpen={mobileSecondaryMenuOpen}
        onClose={() => setMobileSecondaryMenuOpen(false)}
      />

      {/* Floating AI Assistant Modal */}
      <AiAssistantModal isOpen={floatingAiOpen} onClose={() => setFloatingAiOpen(false)} />

      {/* Road Intelligence Details Drawer (Desktop) */}
      <div className="hidden md:block">
        <RoadIntelligenceDrawer />
      </div>

      {/* Data Source Provenance Modal */}
      {activeProvenanceModal && (
        <DataSourceModal info={activeProvenanceModal} onClose={closeProvenanceModal} />
      )}
    </div>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OperatingProvider>
        <LanguageProvider>
          <WouterRouter
            base={import.meta.env.BASE_URL ? import.meta.env.BASE_URL.replace(/\/$/, '') : ''}
          >
            <AppLayout />
          </WouterRouter>
        </LanguageProvider>
      </OperatingProvider>
    </QueryClientProvider>
  );
}

export default App;
