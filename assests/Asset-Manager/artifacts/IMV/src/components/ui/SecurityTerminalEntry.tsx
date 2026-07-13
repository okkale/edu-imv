import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityTerminalEntryProps {
  courseId: string;
  courseName: string;
  vision: string;
  mission: string[];
  duration: string;
  intake: number;
}

const BCA_PSEUDOCODE = `--------------------------------------------------

> INIT_SENSOR();

if (motionDetected == TRUE)
{
    establishSecureConnection();

    user = authenticateVisitor();

    if(user.status == VERIFIED)
    {
        decrypt("BCA_DATABASE");

        loadDepartmentInformation();

        renderFacultyProfiles();

        initializeAnimations();

        displayContent();
    }
    else
    {
        requestVerification();
    }
}

> EXECUTION COMPLETE

--------------------------------------------------`;

const MCA_PSEUDOCODE = `--------------------------------------------------

import security_hub as sh
import database_layer as db

def authenticate_and_decrypt():
    # Initialize hardware peripherals
    sensor = sh.MotionSensor()
    sensor.calibrate()
    
    if sensor.is_active():
        # Establish encrypted channel
        channel = sh.secure_handshake()
        user = channel.authenticate_handshake()
        
        if user.clearance_level >= sh.AccessLevel.VERIFIED:
            # Decrypt course information database
            mca_node = db.decrypt_node("MCA_DATABASE")
            mca_node.load_curriculum_structure()
            mca_node.render_faculty_profiles()
            mca_node.initialize_ui_transitions()
            
            return mca_node.deploy_frontend()
    return False

# Execute decrypter sequence
authenticate_and_decrypt()

> EXECUTION COMPLETE

--------------------------------------------------`;

export default function SecurityTerminalEntry({
  courseId,
  courseName,
  vision,
  mission,
  duration,
  intake
}: SecurityTerminalEntryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const motionResolverRef = useRef<(() => void) | null>(null);

  // States
  const [isVisible, setIsVisible] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [bootStep, setBootStep] = useState(0); // 0: standby, 1: booting logs, 2: waiting motion, 3: motion detected, 4: typing code, 5: complete

  const handleMouseMove = () => {
    if (motionResolverRef.current) {
      motionResolverRef.current();
      motionResolverRef.current = null;
    }
  };

  // Intersection Observer to detect scroll visibility and trigger reset
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset completely when leaving viewport
          setIsVisible(false);
          setIsUnlocked(false);
          setTerminalLines([]);
          setBootStep(0);
          motionResolverRef.current = null;
        }
      },
      {
        threshold: 0.15, // Trigger when 15% visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-scroll terminal content
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalLines, bootStep]);

  // Unified robust terminal logs manager
  useEffect(() => {
    if (!isVisible) {
      setTerminalLines([]);
      setBootStep(0);
      setIsUnlocked(false);
      motionResolverRef.current = null;
      return;
    }

    let isMounted = true;
    const timeoutIds: NodeJS.Timeout[] = [];

    const runLogsSequence = async () => {
      // 1. Initializing logs
      setBootStep(1);
      const initialLogs = [
        "Initializing Secure Environment...",
        "Loading Security Protocols...",
        "Scanning Sector..."
      ];

      for (let i = 0; i < initialLogs.length; i++) {
        if (!isMounted) return;
        await new Promise((resolve) => {
          const id = setTimeout(resolve, 150);
          timeoutIds.push(id);
        });
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, `[SYSTEM] ${initialLogs[i]}`]);
      }

      // 2. Waiting for Motion
      if (!isMounted) return;
      await new Promise((resolve) => {
        const id = setTimeout(resolve, 100);
        timeoutIds.push(id);
      });
      if (!isMounted) return;
      setTerminalLines((prev) => [...prev, "[SYSTEM] Waiting for Motion..."]);
      setBootStep(2);

      // Wait for cursor movement
      if (!isMounted) return;
      await new Promise<void>((resolve) => {
        motionResolverRef.current = resolve;
      });

      // 3. Motion Detected
      if (!isMounted) return;
      setTerminalLines((prev) => [...prev, "", ">>> MOTION DETECTED", ""]);
      setBootStep(3);

      await new Promise((resolve) => {
        const id = setTimeout(resolve, 300);
        timeoutIds.push(id);
      });
      if (!isMounted) return;

      // 4. Print Pseudocode
      const code = courseId === "bca" ? BCA_PSEUDOCODE : MCA_PSEUDOCODE;
      const lines = code.split("\n");
      setBootStep(4);

      for (let i = 0; i < lines.length; i++) {
        if (!isMounted) return;
        const lineText = lines[i];
        
        const delay = lineText.trim().startsWith(">") || lineText.trim().startsWith("-") 
          ? 80 
          : 10 + Math.random() * 10;

        await new Promise((resolve) => {
          const id = setTimeout(resolve, delay);
          timeoutIds.push(id);
        });
        
        if (!isMounted) return;
        setTerminalLines((prev) => [...prev, lineText]);
      }

      // 5. Complete
      if (!isMounted) return;
      await new Promise((resolve) => {
        const id = setTimeout(resolve, 150);
        timeoutIds.push(id);
      });
      if (!isMounted) return;
      setBootStep(5);
      setIsUnlocked(true);
    };

    runLogsSequence();

    return () => {
      isMounted = false;
      timeoutIds.forEach((id) => clearTimeout(id));
      motionResolverRef.current = null;
    };
  }, [isVisible, courseId]);

  const isBCA = courseId === "bca" || courseId === "mca";
  
  // Theme Configuration mapping
  const theme = {
    terminalText: isBCA ? "text-emerald-400" : "text-purple-400",
    terminalBorder: isBCA ? "border-emerald-950/60" : "border-purple-950/60",
    titleBarBorder: isBCA ? "border-emerald-950/40" : "border-purple-950/40",
    titleText: isBCA ? "text-emerald-500/70" : "text-purple-500/70",
    onlinePulse: isBCA ? "bg-emerald-500" : "bg-purple-500",
    onlineText: isBCA ? "text-emerald-500/50" : "text-purple-500/50",
    scrollbarThumb: isBCA ? "scrollbar-thumb-emerald-950" : "scrollbar-thumb-purple-950",
    standbyText: isBCA ? "text-emerald-600/60" : "text-purple-600/60",
    standbyPulse: isBCA ? "bg-emerald-500/30" : "bg-purple-500/30",
    cursorBg: isBCA ? "bg-emerald-500" : "bg-purple-500",
    footerStatusText: isBCA ? "text-emerald-500" : "text-purple-500",
    footerStatusBorder: isBCA ? "border-emerald-950/30" : "border-purple-950/30",
    unlockIconText: isBCA ? "text-emerald-400" : "text-purple-400",
    dbDecryptedText: isBCA ? "text-emerald-400" : "text-purple-400",
    securePingBg: isBCA ? "bg-emerald-500" : "bg-purple-500",
    securePingText: isBCA ? "text-emerald-500" : "text-purple-500",
    visionBarBg: isBCA ? "bg-emerald-500" : "bg-purple-500",
    visionTitleText: isBCA ? "text-emerald-400" : "text-purple-400",
    visionLBorder: isBCA ? "border-emerald-500/20" : "border-purple-500/20",
    glowLeft: isBCA ? "bg-emerald-500/5" : "bg-purple-500/5",
    glowRight: isBCA ? "bg-[#f59e0b]/5" : "bg-pink-500/5",
    primaryAccent: isBCA ? "text-[#f59e0b]" : "text-pink-500",
    primaryAccentBg: isBCA ? "bg-[#f59e0b]" : "bg-pink-500",
    primaryAccentBorder: isBCA ? "border-[#f59e0b]/20" : "border-pink-500/20",
    indicatorColor: isBCA ? "bg-emerald-500/60" : "bg-purple-500/60",
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="py-20 bg-slate-955 border-t border-slate-900 text-white relative overflow-hidden min-h-[650px] flex items-center"
    >
      {/* Decorative Sci-Fi Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-40"></div>
      
      {/* Radial glow background */}
      <div className={cn("absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none", theme.glowLeft)}></div>
      <div className={cn("absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none", theme.glowRight)}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          
          {/* Left Column: Interactive Monospaced Terminal (45%) */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center">
            <div className={cn("w-full rounded-xl overflow-hidden bg-black border shadow-2xl flex flex-col font-mono text-xs md:text-sm min-h-[460px] max-h-[500px]", theme.terminalBorder, theme.terminalText)}>
              
              {/* Terminal Titlebar */}
              <div className={cn("flex items-center justify-between px-4 py-3 bg-slate-950 border-b select-none", theme.titleBarBorder)}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                  <div className={cn("w-3 h-3 rounded-full", theme.indicatorColor)} />
                </div>
                <div className={cn("text-[10px] font-bold uppercase tracking-widest font-mono", theme.titleText)}>
                  SECURITY_SHELL // {courseId.toUpperCase()}
                </div>
                <div className={cn("flex items-center gap-1.5 text-[10px]", theme.onlineText)}>
                  <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", theme.onlinePulse)} />
                  ONLINE
                </div>
              </div>

              {/* Terminal Body */}
              <div
                ref={terminalBodyRef}
                className={cn("p-5 md:p-6 space-y-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-track-transparent text-left font-mono", theme.scrollbarThumb)}
              >
                {/* Boot screen before motion detected */}
                {bootStep === 0 && (
                  <div className={cn("italic flex items-center gap-2 font-mono", theme.standbyText)}>
                    <span className={cn("w-1.5 h-4 animate-pulse inline-block", theme.standbyPulse)} />
                    <span>System standby. Calibrating motion sensors...</span>
                  </div>
                )}

                {/* Animated typing logs */}
                {terminalLines.map((line, idx) => {
                  let lineStyle = isBCA ? "text-emerald-500" : "text-purple-500";
                  if (line.startsWith("[SYSTEM]")) {
                    lineStyle = isBCA ? "text-emerald-600/70" : "text-purple-600/70";
                  } else if (line.startsWith(">>>")) {
                    lineStyle = "text-[#f59e0b] font-bold tracking-widest text-sm animate-pulse my-2";
                  } else if (line.includes("EXECUTION COMPLETE")) {
                    lineStyle = "text-[#f59e0b] font-bold";
                  } else if (line.trim().startsWith(">")) {
                    lineStyle = "text-white font-semibold";
                  } else if (
                    line.trim().startsWith("if") || 
                    line.trim().startsWith("else") ||
                    line.trim().startsWith("def") ||
                    line.trim().startsWith("import") ||
                    line.trim().startsWith("@")
                  ) {
                    lineStyle = "text-cyan-400";
                  }

                  return (
                    <div key={idx} className={cn("whitespace-pre-wrap leading-relaxed font-mono", lineStyle)}>
                      {line}
                    </div>
                  );
                })}

                {/* Blinking input cursor line */}
                {bootStep > 0 && bootStep < 5 && (
                  <div className={cn("flex items-center gap-1", theme.terminalText)}>
                    <span className={cn("w-1.5 h-4 animate-pulse inline-block", theme.cursorBg)} />
                  </div>
                )}

                {/* Completed Cursor */}
                {bootStep === 5 && (
                  <div className={cn("flex items-center gap-2 mt-4 pt-2 border-t", theme.footerStatusText, theme.footerStatusBorder)}>
                    <span>$ system_access --granted</span>
                    <span className={cn("w-1.5 h-4 animate-pulse inline-block", theme.cursorBg)} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Encrypted Content Panel (55%) */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center">
            <div className="relative rounded-xl border border-slate-900 bg-slate-950/70 p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl min-h-[460px] transition-all duration-500">
              
              {/* Scanline overlay for high-tech aesthetic */}
              <div className="absolute inset-0 bg-scanlines pointer-events-none opacity-[0.03] z-20"></div>

              {/* Locked view overlay when terminal has not run */}
              <AnimatePresence>
                {!isUnlocked && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                    className="absolute inset-0 bg-slate-955/95 backdrop-blur-xl z-30 flex flex-col items-center justify-center p-8 text-center border border-red-500/10"
                  >
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500/80 mb-4 animate-pulse">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="text-red-500 font-mono text-sm tracking-widest font-bold uppercase mb-2">
                      [ ACCESS DECREED: RESTRICTED ]
                    </div>
                    <p className="text-slate-500 text-xs font-mono max-w-sm leading-relaxed">
                      {bootStep > 0
                        ? "AUTHENTICATING CONNECTION... PROCESSING SECURE DATABASE LINK..."
                        : "SYSTEM SECURED. MOTION SENSOR SCAN REQUIRED FOR DECRYPTION."
                      }
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Unlocked / Decrypted Content Reveal */}
              <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                
                {/* Header panel */}
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
                  <div className="flex items-center gap-2">
                    <Unlock className={cn("w-4 h-4", theme.unlockIconText)} />
                    <span className={cn("text-xs font-mono font-bold tracking-widest uppercase", theme.dbDecryptedText)}>
                      DATABASE_DECRYPTED // {courseId.toUpperCase()}_OUT
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={cn("w-2 h-2 rounded-full animate-ping", theme.securePingBg)} />
                    <span className={cn("text-[10px] font-mono font-bold tracking-wider", theme.securePingText)}>SECURE</span>
                  </div>
                </div>

                {/* Staggered content reveals using Framer Motion */}
                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  
                  {/* Department Name Block */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={isUnlocked ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="text-left"
                  >
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {courseName}
                    </h3>
                    <p className={cn("text-xs font-mono mt-1 uppercase tracking-wider", theme.primaryAccent)}>
                      Academic Scope: {duration} / Intake Capacity: {intake} Seats
                    </p>
                  </motion.div>

                  {/* Vision Statement Block */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={isUnlocked ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                    className="space-y-2 text-left"
                  >
                    <h4 className={cn("text-xs font-bold font-mono flex items-center gap-2 uppercase tracking-wider", theme.visionTitleText)}>
                      <span className={cn("w-1 h-3 inline-block", theme.visionBarBg)} />
                      Department Vision
                    </h4>
                    <p className={cn("text-slate-300 text-xs md:text-sm leading-relaxed pl-3 border-l font-sans", theme.visionLBorder)}>
                      {vision}
                    </p>
                  </motion.div>

                  {/* Mission Statements Block */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={isUnlocked ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.8 }}
                    className="space-y-2 text-left"
                  >
                    <h4 className={cn("text-xs font-bold font-mono flex items-center gap-2 uppercase tracking-wider", theme.primaryAccent)}>
                      <span className={cn("w-1 h-3 inline-block", theme.primaryAccentBg)} />
                      Mission Protocols
                    </h4>
                    <ul className={cn("space-y-2 pl-3 border-l font-sans", theme.primaryAccentBorder)}>
                      {mission.map((m, idx) => (
                        <li key={idx} className="text-slate-300 text-xs md:text-sm leading-relaxed flex items-start gap-2">
                          <span className={cn("font-bold mt-0.5", theme.primaryAccent)}>&bull;</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Footer status line */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isUnlocked ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="border-t border-slate-900/60 pt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono"
                >
                  <span>SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  <span>VERIFICATION_SUCCESSFUL</span>
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
