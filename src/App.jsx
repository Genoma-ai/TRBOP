import React, { useState } from 'react';
import Map from './components/Map';
import Manifesto from './components/Manifesto';
import SignatureModal from './components/SignatureModal';
import ConflictModal from './components/ConflictModal';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import CookiePolicyModal from './components/CookiePolicyModal';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [view, setView] = useState('map'); // 'map' or 'manifesto'
  const [showConflicts, setShowConflicts] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [lightCount, setLightCount] = useState(null);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex flex-col items-center overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0 pointer-events-none opacity-80" />

      {view === 'map' ? (
        <>
          {/* Header over Map */}
          <div className="relative z-20 w-full pt-8 pb-4 px-6 flex flex-col items-center pointer-events-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-500 pb-1">
              The Real Board of Peace
            </h1>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-xs mt-2">
              A declaration by the people, for the people
            </p>
          </div>

          {/* Lights counter — fixed top-right badge */}
          {lightCount !== null && (
            <div className="fixed top-4 right-4 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm pointer-events-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,1)]"></span>
              </span>
              <span className="text-amber-300 text-sm font-semibold tracking-wide">
                {lightCount.toLocaleString()}
              </span>
              <span className="text-amber-500/80 text-xs font-medium tracking-widest uppercase">
                {lightCount === 1 ? 'light lit' : 'lights lit'}
              </span>
            </div>
          )}

          {/* Map Layer - Primary Focus */}
          <div className="relative z-10 w-full flex-grow flex items-center justify-center opacity-90 mix-blend-screen min-h-[60vh]">
            <Map showConflicts={showConflicts} /* onConflictClick={setSelectedConflict} */ onLightCountChange={setLightCount} />
          </div>

          {/* Floating Actions */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col sm:flex-row gap-4 items-center pointer-events-auto">
            <button
              onClick={() => setShowConflicts(!showConflicts)}
              className={`px-5 py-3 border font-medium rounded-full text-sm transition-all duration-300 flex items-center justify-center gap-2 ${showConflicts
                ? 'bg-red-500/20 text-red-100 border-red-500/50 shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800 backdrop-blur-md'
                }`}
            >
              <div className={`w-2 h-2 rounded-full ${showConflicts ? 'bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,1)]' : 'bg-slate-500'}`}></div>
              {showConflicts ? 'Hide Wars' : 'Show Wars'}
            </button>
            <button
              onClick={() => setView('manifesto')}
              className="px-6 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 font-medium rounded-full text-sm hover:bg-slate-800 transition-colors"
            >
              Read the Manifesto
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-amber-500 text-slate-950 font-bold rounded-full text-sm shadow-[0_0_20px_-5px_rgba(251,191,36,0.5)] hover:bg-amber-400 hover:scale-105 transition-all"
            >
              Add My Light
            </button>
          </div>
        </>
      ) : (
        <div className="relative z-20 w-full max-w-4xl mx-auto px-6 py-12 lg:py-24 h-full flex flex-col justify-center items-center pointer-events-auto min-h-screen">
          <button
            onClick={() => setView('map')}
            className="mb-12 text-slate-400 hover:text-white flex items-center gap-2 self-start transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Map
          </button>
          <Manifesto onSign={() => setShowModal(true)} hasSigned={hasSigned} />
        </div>
      )}

      {/* Footer — fixed bottom-left, away from Mapbox attribution on the right */}
      <footer className="fixed bottom-3 left-28 z-20 flex gap-3 text-xs text-slate-600 pointer-events-auto">
        <button onClick={() => setShowPrivacy(true)} className="hover:text-slate-400 transition-colors">
          Privacy Policy
        </button>
        <span>·</span>
        <button onClick={() => setShowCookies(true)} className="hover:text-slate-400 transition-colors">
          Cookie Policy
        </button>
      </footer>

      {/* Signature Modal */}
      {showModal && (
        <SignatureModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setHasSigned(true);
            setView('map');
          }}
          onOpenPrivacy={() => setShowPrivacy(true)}
        />
      )}

      {/* Conflict Opinions Modal — temporarily hidden, re-enable when ready */}
      {/* <ConflictModal
        conflict={selectedConflict}
        onClose={() => setSelectedConflict(null)}
      /> */}

      {/* Privacy Policy Modal */}
      {showPrivacy && <PrivacyPolicyModal onClose={() => setShowPrivacy(false)} />}

      {/* Cookie Policy Modal */}
      {showCookies && (
        <CookiePolicyModal
          onClose={() => setShowCookies(false)}
          onOpenPrivacy={() => { setShowCookies(false); setShowPrivacy(true); }}
        />
      )}

      {/* Cookie Consent Banner */}
      <CookieBanner
        onOpenPrivacy={() => setShowPrivacy(true)}
        onOpenCookies={() => setShowCookies(true)}
      />
    </div>
  );
}

export default App;
