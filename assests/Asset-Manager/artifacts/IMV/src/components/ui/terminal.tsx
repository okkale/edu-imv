import * as React from "react";
import { cn } from "@/lib/utils";

export interface TerminalProps {
  commands: string[];
  outputs: Record<number, string[] | string>;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  onComplete?: () => void;
  className?: string;
  loop?: boolean;
  active?: boolean;
  standbyMessage?: string;
}

export function Terminal({
  commands,
  outputs,
  typingSpeed = 45,
  delayBetweenCommands = 1000,
  onComplete,
  className,
  loop = true,
  active = true,
  standbyMessage = "System standby. Waiting for motion sensor scan...",
}: TerminalProps) {
  const [history, setHistory] = React.useState<{ type: "cmd" | "output"; text: string }[]>([]);
  const [currentCmdIndex, setCurrentCmdIndex] = React.useState(0);
  const [typedText, setTypedText] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Reset helper
  const handleReset = () => {
    setHistory([]);
    setCurrentCmdIndex(0);
    setTypedText("");
    setIsTyping(false);
  };

  // Reset if active turns false
  React.useEffect(() => {
    if (!active) {
      handleReset();
    }
  }, [active]);

  const timeoutRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!active) return;

    if (currentCmdIndex >= commands.length) {
      if (onComplete) onComplete();
      if (loop) {
        const timeout = setTimeout(() => {
          handleReset();
        }, 8000); // Wait 8 seconds before restarting when looping
        return () => clearTimeout(timeout);
      }
      return;
    }

    const command = commands[currentCmdIndex];
    setTypedText("");
    setIsTyping(true);
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex < command.length) {
        setTypedText((prev) => prev + command.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        
        // Add command to history
        setHistory((prev) => [...prev, { type: "cmd", text: command }]);
        
        // Add outputs to history
        const cmdOutputs = outputs[currentCmdIndex];
        if (cmdOutputs) {
          const outputLines = Array.isArray(cmdOutputs) ? cmdOutputs : [cmdOutputs];
          setHistory((prev) => [
            ...prev,
            ...outputLines.map((line) => ({ type: "output" as const, text: line })),
          ]);
        }

        // Delay before next command
        timeoutRef.current = setTimeout(() => {
          setCurrentCmdIndex((prev) => prev + 1);
        }, delayBetweenCommands);
      }
    }, typingSpeed);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentCmdIndex, commands, outputs, typingSpeed, delayBetweenCommands, loop, active]);

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, typedText]);

  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl flex flex-col font-mono text-xs md:text-sm text-slate-300",
        className
      )}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800/50 select-none">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer" />
        </div>
        <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
          bash - atul-crawler
        </div>
        <div className="w-12 text-right">
          <button 
            type="button"
            onClick={handleReset}
            className="text-[10px] text-slate-500 hover:text-slate-300 font-bold uppercase tracking-wide transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={containerRef}
        className="p-5 md:p-6 space-y-3 overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent text-left"
      >
        {!active && (
          <div className="text-slate-500 italic flex items-center gap-2">
            <span className="w-1.5 h-4 bg-slate-600 animate-pulse inline-block" />
            <span>{standbyMessage}</span>
          </div>
        )}

        {/* Command History */}
        {active && history.map((line, idx) => (
          <div key={idx} className="space-y-1.5">
            {line.type === "cmd" ? (
              <div className="flex items-start gap-2 text-slate-200">
                <span className="text-amber-500 font-bold">~</span>
                <span className="text-[#f59e0b] font-bold">$</span>
                <span className="font-medium">{line.text}</span>
              </div>
            ) : (
              <div className={cn(
                "pl-5 whitespace-pre-wrap leading-relaxed",
                line.text.includes("[SUCCESS]") || line.text.includes("✔")
                  ? "text-emerald-400 font-medium" 
                  : line.text.includes("error") || line.text.includes("FAIL")
                    ? "text-rose-400 font-medium" 
                    : "text-slate-400"
              )}>
                {line.text}
              </div>
            )}
          </div>
        ))}

        {/* Current Command Input Line */}
        {active && currentCmdIndex < commands.length && (
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold">~</span>
            <span className="text-[#f59e0b] font-bold">$</span>
            <span className="text-white font-medium">{typedText}</span>
            <span className="w-1.5 h-4 bg-slate-400 animate-pulse inline-block" />
          </div>
        )}

        {/* Idle/Idle Done Cursor */}
        {currentCmdIndex >= commands.length && (
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold">~</span>
            <span className="text-[#f59e0b] font-bold">$</span>
            <span className="w-1.5 h-4 bg-slate-400 animate-pulse inline-block" />
          </div>
        )}
      </div>
    </div>
  );
}
