import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBar } from './components/DemoBar';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { ReportSurplus } from './pages/ReportSurplus';
import { RiskAssessmentPage } from './pages/RiskAssessment';
import { MatchingPage } from './pages/Matching';
import { VerificationPage } from './pages/Verification';
import { FoodPassportPage } from './pages/FoodPassportPage';
import { RecoveryPage } from './pages/Recovery';
import { ImpactPage } from './pages/Impact';

const Pages: React.FC = () => {
  const { activePage } = useApp();
  const map: Record<string, React.ReactNode> = {
    landing: <Landing />,
    dashboard: <Dashboard />,
    report: <ReportSurplus />,
    risk: <RiskAssessmentPage />,
    'trust-token': <RiskAssessmentPage />,
    matching: <MatchingPage />,
    verification: <VerificationPage />,
    passport: <FoodPassportPage />,
    recovery: <RecoveryPage />,
    impact: <ImpactPage />,
  };
  return <>{map[activePage] ?? <Landing />}</>;
};

const AppShell: React.FC = () => {
  const { activePage } = useApp();
  const isLanding = activePage === 'landing';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: isLanding ? '#071912' : '#f8faf9',
      }}
    >
      {!isLanding && <DemoBar />}
      <Navbar />
      <main style={{ flex: 1 }}>
        <Pages />
      </main>
      <footer
        style={{
          borderTop: isLanding ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8e4',
          background: isLanding ? '#04100b' : '#ffffff',
          padding: '24px 16px',
          textAlign: 'center',
          fontSize: 12,
          color: isLanding ? '#94a3b8' : '#64748b',
          fontWeight: 500,
        }}
      >
        <p className="font-['Lora'] italic text-sm mb-1 text-emerald-600 font-semibold">AnnaDhara</p>
        <p className="text-[11px] opacity-80">Every surplus finds purpose · Institutional Food Redistribution & Recovery</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppShell />
  </AppProvider>
);

export default App;
