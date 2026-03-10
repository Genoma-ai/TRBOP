import React, { useState, useRef, useCallback } from 'react';
import Map from './components/Map';
import Manifesto from './components/Manifesto';
import SignatureModal from './components/SignatureModal';
import ConflictModal from './components/ConflictModal';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import CookiePolicyModal from './components/CookiePolicyModal';
import ShareStoryModal from './components/ShareStoryModal';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [hasSigned, setHasSigned] = useState(() => !!localStorage.getItem('trwop_signed'));
  const [signerName, setSignerName] = useState('');
  const [view, setView] = useState('map'); // 'map' or 'manifesto'
  const [showConflicts, setShowConflicts] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [lightCount, setLightCount] = useState(null);
  const [warCount, setWarCount] = useState(null);
  const getMapSnapshot = useRef(null);

  const handleMapReady = useCallback((snapshotFn) => {
    getMapSnapshot.current = snapshotFn;
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 flex flex-col items-center overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0 pointer-events-none opacity-80" />

      {view === 'map' ? (
        <>
          {/* Header over Map */}
          <div className="relative z-20 w-full pt-8 pb-4 px-4 md:px-6 flex flex-col items-center pointer-events-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-100 to-slate-500 pb-1 text-center leading-tight">
              The Real Board of Peace
            </h1>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-[10px] md:text-xs mt-2 text-center max-w-[280px] md:max-w-none">
              A declaration by the people, for the people
            </p>

            {/* Lights counter - centered on mobile, right on desktop */}
            {lightCount !== null && (
              <div className="mt-4 md:mt-0 md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm pointer-events-none">
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
          </div>



          {/* Map Layer - Primary Focus */}
          <div className="relative z-10 w-full flex-grow flex items-center justify-center opacity-90 mix-blend-screen min-h-[60vh]">
            <Map showConflicts={showConflicts} /* onConflictClick={setSelectedConflict} */ onLightCountChange={setLightCount} onWarCountChange={setWarCount} onMapReady={handleMapReady} />
          </div>

          {/* Floating Actions */}
          <div className="fixed bottom-14 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center pointer-events-auto w-[90%] sm:w-auto max-w-sm sm:max-w-none">
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
            {hasSigned && (
              <button
                onClick={() => setShowShare(true)}
                className="px-5 py-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-200 font-medium rounded-full text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            )}
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

      {/* Footer — centered on mobile, left on desktop */}
      <footer className="fixed bottom-3 left-0 sm:left-28 w-full sm:w-auto z-20 flex justify-center sm:justify-start gap-3 text-[10px] sm:text-xs text-slate-500 pointer-events-auto">
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
          onSuccess={(name) => {
            setShowModal(false);
            setHasSigned(true);
            setSignerName(name || '');
            setView('map');
            // Small delay so the map is in view before the share modal opens
            setTimeout(() => setShowShare(true), 600);
          }}
          onOpenPrivacy={() => setShowPrivacy(true)}
        />
      )}

      {/* Share Story Modal */}
      {showShare && (
        <ShareStoryModal
          onClose={() => setShowShare(false)}
          lightCount={lightCount}
          signerName={signerName}
          getMapSnapshot={getMapSnapshot}
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
