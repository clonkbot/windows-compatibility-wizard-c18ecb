import { useState, useEffect, useCallback } from 'react';

type CheckStatus = 'idle' | 'checking' | 'success' | 'error';

interface CheckResult {
  name: string;
  status: 'pending' | 'checking' | 'passed' | 'failed';
  delay: number;
}

export default function App() {
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [checks, setChecks] = useState<CheckResult[]>([
    { name: 'Scanning system registry...', status: 'pending', delay: 400 },
    { name: 'Checking DirectX compatibility...', status: 'pending', delay: 700 },
    { name: 'Verifying DLL dependencies...', status: 'pending', delay: 500 },
    { name: 'Testing window handle allocation...', status: 'pending', delay: 600 },
    { name: 'Analyzing visual styles...', status: 'pending', delay: 450 },
    { name: 'Finalizing compatibility report...', status: 'pending', delay: 800 },
  ]);

  const runChecks = useCallback(async () => {
    setStatus('checking');
    setProgress(0);
    setShowResult(false);

    const newChecks = checks.map(c => ({ ...c, status: 'pending' as const }));
    setChecks(newChecks);

    for (let i = 0; i < newChecks.length; i++) {
      setChecks(prev => prev.map((c, idx) =>
        idx === i ? { ...c, status: 'checking' as const } : c
      ));

      await new Promise(r => setTimeout(r, newChecks[i].delay));

      setChecks(prev => prev.map((c, idx) =>
        idx === i ? { ...c, status: 'passed' as const } : c
      ));

      setProgress(((i + 1) / newChecks.length) * 100);
    }

    await new Promise(r => setTimeout(r, 500));
    setStatus('success');
    setShowResult(true);
  }, [checks]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - dragPosition.x,
      y: e.clientY - dragPosition.y
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - dragPosition.x,
      y: touch.clientY - dragPosition.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setDragPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      setDragPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    };

    const handleEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragStart]);

  return (
    <div className="min-h-screen bg-[#008080] flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-['VT323',monospace]">
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-6 hidden md:flex">
        <DesktopIcon icon="💻" label="My Computer" />
        <DesktopIcon icon="🗑️" label="Recycle Bin" />
        <DesktopIcon icon="📁" label="My Documents" />
      </div>

      {/* Main Window */}
      <div
        className="w-full max-w-lg relative"
        style={{
          transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
        }}
      >
        {/* Window */}
        <div className="bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_#0a0a0a,inset_1px_1px_0_#ffffff,inset_-2px_-2px_0_#808080,inset_2px_2px_0_#dfdfdf]">
          {/* Title Bar */}
          <div
            className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-2 py-1 flex items-center justify-between cursor-move select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🪟</span>
              <span className="text-white text-lg md:text-xl font-bold tracking-wide">
                Windows Compatibility Wizard
              </span>
            </div>
            <div className="flex gap-1">
              <WindowButton>_</WindowButton>
              <WindowButton>□</WindowButton>
              <WindowButton className="bg-[#c0c0c0] hover:bg-red-500 hover:text-white">✕</WindowButton>
            </div>
          </div>

          {/* Menu Bar */}
          <div className="bg-[#c0c0c0] border-b border-[#808080] px-2 py-1 flex gap-4 text-sm">
            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">File</span>
            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Edit</span>
            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">View</span>
            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Help</span>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="text-5xl md:text-6xl animate-bounce">🖥️</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#000080] mb-1">
                  Does it work on Windows?
                </h1>
                <p className="text-sm md:text-base text-[#444]">
                  Let our advanced compatibility wizard analyze your application for Windows support.
                </p>
              </div>
            </div>

            {/* Separator */}
            <div className="h-[2px] bg-gradient-to-r from-[#808080] via-[#dfdfdf] to-[#808080] mb-6" />

            {/* Check List */}
            {status === 'checking' && (
              <div className="bg-white border-2 border-[#808080] shadow-[inset_1px_1px_0_#0a0a0a,inset_-1px_-1px_0_#ffffff] p-3 mb-4">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2 py-1 text-sm md:text-base">
                    <span className="w-5 text-center">
                      {check.status === 'pending' && '⬜'}
                      {check.status === 'checking' && <span className="animate-spin inline-block">⏳</span>}
                      {check.status === 'passed' && '✅'}
                      {check.status === 'failed' && '❌'}
                    </span>
                    <span className={check.status === 'checking' ? 'text-[#000080] font-bold' : ''}>
                      {check.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Progress Bar */}
            {status === 'checking' && (
              <div className="mb-6">
                <div className="bg-[#c0c0c0] border-2 border-[#808080] shadow-[inset_1px_1px_0_#0a0a0a,inset_-1px_-1px_0_#ffffff] h-6 relative overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 ease-out"
                    style={{
                      width: `${progress}%`,
                      background: 'repeating-linear-gradient(90deg, #000080 0px, #000080 10px, #1084d0 10px, #1084d0 20px)'
                    }}
                  />
                </div>
                <p className="text-center text-sm mt-2 text-[#444]">
                  {Math.round(progress)}% complete
                </p>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className="bg-[#ffffcc] border-2 border-[#808080] shadow-[inset_1px_1px_0_#ffffff,inset_-1px_-1px_0_#0a0a0a] p-4 mb-6 animate-pulse">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">✨</span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-green-700">
                      YES! It works on Windows!
                    </h2>
                    <p className="text-sm text-[#555]">
                      All compatibility checks passed successfully.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Win95Button onClick={runChecks} disabled={status === 'checking'}>
                {status === 'idle' ? '🔍 Check Compatibility' :
                 status === 'checking' ? '⏳ Checking...' :
                 '🔄 Check Again'}
              </Win95Button>
              {showResult && (
                <Win95Button onClick={() => {
                  setStatus('idle');
                  setShowResult(false);
                  setProgress(0);
                  setChecks(prev => prev.map(c => ({ ...c, status: 'pending' as const })));
                }}>
                  ❌ Close
                </Win95Button>
              )}
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-[#c0c0c0] border-t-2 border-[#dfdfdf] px-2 py-1 flex justify-between text-xs md:text-sm text-[#444]">
            <span>Ready</span>
            <span>Windows 95 Compatible</span>
          </div>
        </div>

        {/* Taskbar */}
        <div className="mt-4 bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_#0a0a0a,inset_1px_1px_0_#ffffff] p-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_#0a0a0a,inset_1px_1px_0_#ffffff,inset_-2px_-2px_0_#808080,inset_2px_2px_0_#dfdfdf] px-3 py-1 flex items-center gap-2 font-bold text-sm active:shadow-[inset_1px_1px_0_#0a0a0a,inset_-1px_-1px_0_#ffffff]">
              <span>🪟</span>
              <span>Start</span>
            </button>
            <div className="h-6 w-[2px] bg-[#808080] mx-1" />
            <div className="bg-[#dfdfdf] shadow-[inset_1px_1px_0_#0a0a0a] px-2 py-1 text-xs flex items-center gap-1">
              <span>🖥️</span>
              <span className="hidden sm:inline">Windows Compatibility Wizard</span>
            </div>
          </div>
          <div className="bg-[#dfdfdf] shadow-[inset_1px_1px_0_#0a0a0a] px-2 py-1 text-xs">
            <Clock />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 text-center text-[#004040] text-xs opacity-70">
        Requested by @fynqii · Built by @clonkbot
      </footer>
    </div>
  );
}

function DesktopIcon({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer group">
      <div className="text-3xl group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-white text-xs text-center px-1 group-hover:bg-[#000080]">{label}</span>
    </div>
  );
}

function WindowButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <button className={`w-5 h-5 md:w-6 md:h-6 bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_#0a0a0a,inset_1px_1px_0_#ffffff] flex items-center justify-center text-xs font-bold active:shadow-[inset_1px_1px_0_#0a0a0a,inset_-1px_-1px_0_#ffffff] ${className}`}>
      {children}
    </button>
  );
}

function Win95Button({ children, onClick, disabled = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 md:px-6 py-2 md:py-3 bg-[#c0c0c0] shadow-[inset_-1px_-1px_0_#0a0a0a,inset_1px_1px_0_#ffffff,inset_-2px_-2px_0_#808080,inset_2px_2px_0_#dfdfdf] font-bold text-sm md:text-base active:shadow-[inset_1px_1px_0_#0a0a0a,inset_-1px_-1px_0_#ffffff,inset_2px_2px_0_#808080,inset_-2px_-2px_0_#dfdfdf] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4d4d4] transition-colors min-h-[44px]`}
    >
      {children}
    </button>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span>
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}
