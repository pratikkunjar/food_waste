import React, { useState } from 'react';
import { useApp, PageId } from '../context/AppContext';
import {
  Sun,
  User,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  Mic,
  ShieldCheck,
  Users,
  QrCode,
  Recycle,
  BarChart3
} from 'lucide-react';

export const AnnaDharaLogo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 28C13 26 9 19 11 12C15 10 22 13 22 19C22 23 20.5 26.5 19 28Z"
      fill="#f59e0b"
    />
    <path
      d="M13 16C16 18 18 21.5 19 28"
      stroke="#d97706"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M19 31C20.5 23 25.5 11 34 9C35 16 30.5 24 23.5 27.5C21.5 28.5 20 30 19 31Z"
      fill="#22c55e"
    />
    <path
      d="M22 26.5C26 21.5 28.5 15.5 34 9"
      stroke="#16a34a"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const Navbar: React.FC = () => {
  const { activePage, navigateTo } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const mainNav = [
    { label: 'Home', id: 'landing' as PageId },
    { label: 'About', id: 'dashboard' as PageId },
    { label: 'How It Works', id: 'report' as PageId },
    { label: 'Impact', id: 'impact' as PageId },
  ];

  const prototypePages = [
    { label: 'Dashboard', id: 'dashboard' as PageId, icon: <LayoutDashboard size={13} /> },
    { label: 'Report', id: 'report' as PageId, icon: <Mic size={13} /> },
    { label: 'Risk AI', id: 'risk' as PageId, icon: <ShieldCheck size={13} /> },
    { label: 'Match', id: 'matching' as PageId, icon: <Users size={13} /> },
    { label: 'Passport', id: 'passport' as PageId, icon: <QrCode size={13} /> },
    { label: 'Recovery', id: 'recovery' as PageId, icon: <Recycle size={13} /> },
    { label: 'Impact', id: 'impact' as PageId, icon: <BarChart3 size={13} /> },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(8, 25, 18, 0.96)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(52, 211, 153, 0.16)',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Main Navbar Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
          {/* Brand Logo & Title */}
          <button
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-3 text-left bg-transparent border-none cursor-pointer group"
          >
            <div className="transition-transform group-hover:scale-105">
              <AnnaDharaLogo size={36} />
            </div>
            <div>
              <div className="flex items-center gap-1 font-['Outfit'] font-black text-lg tracking-tight leading-none">
                <span className="text-white">ANNA</span>
                <span className="text-[#34d399]">DHARA</span>
              </div>
              <p className="text-[10px] tracking-wider uppercase font-semibold mt-0.5 text-slate-300">
                Every surplus finds purpose
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {mainNav.map(item => {
              const isCurrent = activePage === item.id;
              return (
                <button
                  key={item.label}
                  onClick={() => navigateTo(item.id)}
                  className={`text-sm font-semibold transition-all relative py-1 cursor-pointer bg-transparent border-none ${
                    isCurrent ? 'text-white' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isCurrent && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: -3,
                        left: 0,
                        right: 0,
                        height: 2.5,
                        background: '#f59e0b',
                        borderRadius: 2,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              title="Toggle theme"
              className="p-2 rounded-full transition-colors cursor-pointer border-none bg-transparent text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Sun size={17} />
            </button>

            <button
              onClick={() => setLoginModalOpen(true)}
              className="px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/20 text-white hover:bg-white/10"
            >
              <User size={13} />
              Login
            </button>

            <button
              onClick={() => navigateTo('report')}
              className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#d97706] hover:to-[#f59e0b] text-slate-950 font-extrabold text-xs px-4 py-2 rounded-full flex items-center gap-1 shadow-md hover:scale-105 transition-transform cursor-pointer border-none"
            >
              Get Started
              <ArrowRight size={13} />
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg cursor-pointer bg-transparent border-none text-white"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Prototype Sub-Navigation Bar for Quick Flow Switching — Slightly Adjusted Downwards with More Breathing Room */}
        <div
          style={{
            background: 'rgba(5, 17, 12, 0.94)',
            borderTop: '1px solid rgba(52, 211, 153, 0.12)',
            padding: '9px 20px',
            overflowX: 'auto',
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#34d399',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginRight: 8,
                flexShrink: 0,
              }}
            >
              PROTOTYPE SCREENS:
            </span>
            {prototypePages.map(page => {
              const active = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => navigateTo(page.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 13px',
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: active
                      ? '1.5px solid #34d399'
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    background: active
                      ? 'rgba(52, 211, 153, 0.22)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: active ? '#6ee7b7' : '#cbd5e1',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {page.icon}
                  {page.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 space-y-2 border-t bg-[#081912] border-white/10 text-white">
            {mainNav.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  navigateTo(item.id);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold hover:bg-emerald-500/15 block text-white"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigateTo('report');
                  setMobileMenuOpen(false);
                }}
                className="btn-primary w-full text-center py-2.5 text-xs font-bold"
              >
                Report Food Surplus →
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {loginModalOpen && (
        <div
          onClick={() => setLoginModalOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#0a2318] border border-emerald-500/35 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-[#34d399]">
              <User size={24} />
            </div>
            <h3 className="font-['Outfit'] font-bold text-lg text-white">Sign in to AnnaDhara</h3>
            <p className="text-xs text-slate-300">
              Select institutional role to test prototype permission flows:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigateTo('report');
                  setLoginModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/25 bg-black/30 text-left text-xs font-semibold text-slate-200 hover:border-emerald-400 hover:bg-emerald-950/60 flex items-center justify-between"
              >
                <span>🏢 Hostel Mess Manager (Hostel 4)</span>
                <span className="text-[#34d399]">Enter →</span>
              </button>
              <button
                onClick={() => {
                  navigateTo('matching');
                  setLoginModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/25 bg-black/30 text-left text-xs font-semibold text-slate-200 hover:border-emerald-400 hover:bg-emerald-950/60 flex items-center justify-between"
              >
                <span>🚚 Logistics / NGO Partner (Robin Hood)</span>
                <span className="text-[#34d399]">Enter →</span>
              </button>
              <button
                onClick={() => {
                  navigateTo('dashboard');
                  setLoginModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/25 bg-black/30 text-left text-xs font-semibold text-slate-200 hover:border-emerald-400 hover:bg-emerald-950/60 flex items-center justify-between"
              >
                <span>📊 Sustainability Auditor (FSSAI)</span>
                <span className="text-[#34d399]">Enter →</span>
              </button>
            </div>
            <button
              onClick={() => setLoginModalOpen(false)}
              className="text-xs text-slate-400 hover:text-white mt-2 block mx-auto cursor-pointer bg-transparent border-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
