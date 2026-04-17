import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { simulationEngine } from './systems/SimulationEngine';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';

import DashboardPage from './pages/DashboardPage';
import TacticalMapPage from './pages/TacticalMapPage';
import IntelFeedPage from './pages/IntelFeedPage';
import SurveillancePage from './pages/SurveillancePage';
import VideoFeedPage from './pages/VideoFeedPage';
import MissionPlannerPage from './pages/MissionPlannerPage';
import BiometricsPage from './pages/BiometricsPage';
import WeatherPage from './pages/WeatherPage';
import BattleDamagePage from './pages/BattleDamagePage';
import UnitsPage from './pages/UnitsPage';
import CommsPage from './pages/CommsPage';
import AlertsPage from './pages/AlertsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

const pages = {
  dashboard: DashboardPage,
  map: TacticalMapPage,
  feed: IntelFeedPage,
  surveillance: SurveillancePage,
  video: VideoFeedPage,
  planner: MissionPlannerPage,
  biometrics: BiometricsPage,
  weather: WeatherPage,
  bda: BattleDamagePage,
  units: UnitsPage,
  comm: CommsPage,
  alerts: AlertsPage,
  analytics: AnalyticsPage,
  settings: SettingsPage,
};

function App() {
  useEffect(() => {
    simulationEngine.start(2000);
    return () => simulationEngine.stop();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const PageComponent = pages[currentPage];

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#0a0f0d]">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentPage={currentPage} onLogout={() => setIsLoggedIn(false)} />
        <main className="flex-1 overflow-y-auto">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}

export default App;
