import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Star, BookOpen, Briefcase, GraduationCap } from 'lucide-react';

interface CourseGraphProps {
  type: "bba" | "mba";
  onComplete?: () => void;
  onReset?: () => void;
  isUnlocked?: boolean;
}

interface Milestone {
  label: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  description: string;
}

export const CourseGraph: React.FC<CourseGraphProps> = ({ type, onComplete, onReset, isUnlocked = false }) => {
  const [inView, setInView] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport detection that resets when scrolling completely away
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (entry.intersectionRatio === 0) {
          setInView(false);
          setProgress(0);
          if (onReset) onReset();
        }
      },
      { threshold: [0, 0.1, 0.8] }
    );

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  // Animate progress when in view
  useEffect(() => {
    if (!inView || isUnlocked) return;

    let startTime: number | null = null;
    const duration = 4500; // 4.5 seconds for complete cinematic drawing

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const nextProgress = Math.min(elapsed / duration, 1);

      setProgress(nextProgress);

      if (nextProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Pause for a beat then complete
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 600);
      }
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, isUnlocked, onComplete]);

  // Milestone Definitions
  const milestones: Milestone[] = [
    { label: "Foundation", x: 100, y: 150, icon: <BookOpen className="w-4 h-4 text-orange-500" />, description: "Core Academic Principles" },
    { label: "Skill Development", x: 300, y: 100, icon: <Star className="w-4 h-4 text-orange-500" />, description: "Critical Core Modules" },
    { label: "Practical Learning", x: 500, y: 130, icon: <Sparkles className="w-4 h-4 text-orange-500" />, description: "Hands-on Case Studies" },
    { label: "Industry Exposure", x: 700, y: 70, icon: <Briefcase className="w-4 h-4 text-orange-500" />, description: "Corporate Interactions" },
    { label: "Career Ready", x: 900, y: 40, icon: <GraduationCap className="w-4 h-4 text-orange-500" />, description: "Elite Placements" }
  ];

  // SVG Path: M 100,150 C 200,150 200,100 300,100 C 400,100 400,130 500,130 C 600,130 600,70 700,70 C 800,70 800,40 900,40
  const pathD = "M 100,150 C 200,150 200,100 300,100 C 400,100 400,130 500,130 C 600,130 600,70 700,70 C 800,70 800,40 900,40";

  // Check if a milestone is reached based on progress (0 to 1)
  const isMilestoneReached = (index: number) => {
    const threshold = index / (milestones.length - 1);
    return progress >= threshold;
  };

  const title = type === "bba" ? "BBA Curriculum & Placement Trajectory" : "MBA Leadership & Placement Trajectory";

  return (
    <div
      ref={containerRef}
      className={`w-full transition-all duration-1000 ${
        isUnlocked 
          ? "bg-slate-950/80 border-b border-orange-500/20 py-4 sticky top-0 z-50 backdrop-blur-md" 
          : "bg-[#0b1329] py-16 px-4 md:px-12 min-h-[60vh] flex flex-col justify-center items-center relative overflow-hidden"
      }`}
    >
      {/* Ambient background lights in hero mode */}
      {!isUnlocked && (
        <>
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
        </>
      )}

      <div className={`w-full max-w-6xl transition-all duration-1000 ${isUnlocked ? "px-4" : ""}`}>
        {isUnlocked ? (
          /* DOCKED MODE TIMELINE */
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-white font-bold text-xs md:text-sm tracking-wide uppercase font-sans">
                {type.toUpperCase()} Journey Timeline
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2 animate-fade-in">
                  <div className="w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/40 flex items-center justify-center text-orange-500 text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-slate-300 text-xs font-semibold">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* CINEMATIC HERO MODE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full bg-[#121824]/60 border border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm"
          >
            {/* Header Title Layer */}
            <div className="mb-8 text-center md:text-left">
              <span className="text-orange-500 font-bold tracking-widest text-xs uppercase font-mono block mb-2">
                Interactive Career Roadmap
              </span>
              <h3 className="text-white text-2xl md:text-3xl font-extrabold font-sans tracking-tight">
                {title}
              </h3>
              <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-2xl">
                Watch the trajectory unfold. Each milestone unlocks core capabilities, leading to industry readiness.
              </p>
            </div>

            {/* Interactive Canvas */}
            <div className="w-full bg-[#080d19]/90 border border-slate-800/50 rounded-2xl p-4 md:p-8 relative overflow-x-auto scrollbar-none">
              <div className="min-w-[800px] h-[280px] relative">
                {/* SVG Graph Layer */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 1000 200">
                  <defs>
                    <linearGradient id="orange-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="1" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Horizontal Grid Guides */}
                  {[50, 100, 150].map((y, idx) => (
                    <line
                      key={idx}
                      x1="50"
                      y1={y}
                      x2="950"
                      y2={y}
                      stroke="#1e293b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Background Path Trail */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Animated Foreground Glowing Path */}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke="url(#orange-glow)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    animate={{ pathLength: progress }}
                    transition={{ ease: "linear" }}
                    style={{ filter: "url(#glow)" }}
                  />

                  {/* Nodes and Milestones */}
                  {milestones.map((m, idx) => {
                    const reached = isMilestoneReached(idx);
                    return (
                      <g key={idx} className="cursor-pointer">
                        {/* Pulse Ring when reached */}
                        {reached && (
                          <circle
                            cx={m.x}
                            cy={m.y}
                            r="18"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="2"
                            className="animate-ping opacity-25"
                            style={{ transformOrigin: `${m.x}px ${m.y}px` }}
                          />
                        )}

                        {/* Outer Glow Ring */}
                        <circle
                          cx={m.x}
                          cy={m.y}
                          r="10"
                          fill={reached ? "#1e1b4b" : "#080d19"}
                          stroke={reached ? "#f97316" : "#334155"}
                          strokeWidth="3"
                          className="transition-all duration-500"
                        />

                        {/* Inner Dot */}
                        <circle
                          cx={m.x}
                          cy={m.y}
                          r="5"
                          fill={reached ? "#f97316" : "#475569"}
                          className="transition-all duration-500"
                        />

                        {/* Particle Glow effect when reached */}
                        {reached && (
                          <circle
                            cx={m.x}
                            cy={m.y}
                            r="2"
                            fill="#fff"
                            className="animate-pulse"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Information Overlays pinned over milestones */}
                {milestones.map((m, idx) => {
                  const reached = isMilestoneReached(idx);
                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: `${(m.x / 1000) * 100}%`,
                        top: `${(m.y / 200) * 100}%`,
                        transform: 'translate(-50%, -125%)',
                      }}
                      className={`w-44 text-center transition-all duration-700 pointer-events-none select-none ${
                        reached ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      <div className="bg-[#121824]/95 border border-orange-500/30 p-2.5 rounded-xl shadow-lg backdrop-blur-md flex flex-col items-center">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center mb-1">
                          {m.icon}
                        </div>
                        <span className="text-white font-bold text-xs block font-sans tracking-wide">
                          {m.label}
                        </span>
                        <span className="text-slate-400 text-[9px] mt-0.5 block font-mono">
                          {m.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseGraph;
