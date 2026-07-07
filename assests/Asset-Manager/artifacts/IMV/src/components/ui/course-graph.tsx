import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Custom hook to detect when element is in view (replacing react-intersection-observer)
function useElementInView(options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(element);
      }
    }, options);

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options]);

  return [ref, inView] as const;
}

interface CourseGraphProps {
  type: "bba" | "mba";
}

const CourseGraph: React.FC<CourseGraphProps> = ({ type }) => {
  const controls = useAnimation();
  const [ref, inView] = useElementInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Premium, snappy ease curve for the Netflix opening window reveal
  const windowVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  // Line drawing animation variant
  const lineVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { delay: 0.4, duration: 1.5, ease: 'easeInOut' as const }
    }
  };

  // Text fade-in synchronization variant
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 1.2, duration: 0.4 }
    }
  };

  // Data config based on course type
  const isBba = type === "bba";
  const title = isBba ? "BBA Curriculum & Placement Trajectory" : "MBA Leadership & Placement Trajectory";
  const node1Title = isBba ? "94% Placements" : "98% Placements";
  const node1Desc = isBba ? "Leading Corporate Recruitment" : "Top-Tier Multinational Placements";
  
  const node2Title = isBba ? "12 Core Skill Modules" : "4 Specialization Tracks";
  const node2Desc = isBba ? "Continuous Learning & Career Readiness" : "Finance, Marketing, HR & Operations";

  const node3Title = isBba ? "3 Years Full-Time" : "2 Years Full-Time";
  const node3Desc = isBba ? "SPPU Affiliated Program" : "Elite Leadership Development";

  const axisLabels = isBba 
    ? ["YEAR 1 (FOUNDATION)", "YEAR 2 (CORE SPECIALIZATION)", "YEAR 3 (INDUSTRY INTERNSHIP)"]
    : ["SEMESTER I & II (CORE)", "SEMESTER III (ELECTIVES & SIP)", "SEMESTER IV (STRATEGY)"];

  return (
    <div ref={ref} className="w-full bg-[#0b1329] py-16 px-4 md:px-12 flex justify-center border-t border-slate-900 border-b">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={windowVariants}
        className="w-full max-w-5xl bg-[#121824] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Header Title Layer */}
        <div className="mb-6 text-left">
          <span className="text-orange-500 font-semibold tracking-wider text-xs uppercase font-mono">Dynamic Performance Analytics</span>
          <h3 className="text-white text-2xl font-bold mt-1 font-sans">{title}</h3>
        </div>

        {/* Main Interactive Canvas */}
        <div className="w-full h-[320px] bg-[#0C101A]/80 border border-gray-800/60 rounded-xl p-4 relative flex flex-col justify-between">
          
          {/* The Graph Layer */}
          <div className="absolute inset-0 p-6">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Horizontal Grid Guides */}
              {[40, 90, 140].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#1F2937" strokeWidth="0.75" strokeDasharray="4" />
              ))}

              {/* Dynamic Animated Path Line */}
              <motion.path
                variants={lineVariants}
                d="M 10,150 Q 150,140 200,90 T 420,110 T 590,30"
                fill="none"
                stroke="#F97316"
                strokeWidth="4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]"
              />
            </svg>
          </div>

          {/* Integrated Information Nodes pinned directly over the graph space */}
          <div className="relative w-full h-full flex flex-col justify-between pointer-events-none select-none z-10">
            
            {/* Node 1: Top Right Placement Data */}
            <motion.div variants={textVariants} className="absolute right-[4%] top-[2%] text-right bg-[#121824]/90 border border-orange-500/30 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-orange-500 font-bold text-lg md:text-xl font-mono">{node1Title}</p>
              <p className="text-gray-400 text-xs mt-0.5 font-sans">{node1Desc}</p>
            </motion.div>

            {/* Node 2: Center Skill Metrics */}
            <motion.div variants={textVariants} className="absolute left-[28%] top-[32%] bg-[#121824]/90 border border-gray-800 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-white font-bold text-sm font-sans">{node2Title}</p>
              <p className="text-gray-400 text-[11px] mt-0.5">{node2Desc}</p>
            </motion.div>

            {/* Node 3: Bottom Left Structure */}
            <motion.div variants={textVariants} className="absolute left-[2%] bottom-[12%] bg-[#121824]/90 border border-gray-800 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-gray-300 font-semibold text-xs font-mono">{node3Title}</p>
              <p className="text-gray-500 text-[10px]">{node3Desc}</p>
            </motion.div>

          </div>

          {/* Timeline X-Axis Labels */}
          <div className="w-full flex justify-between text-[10px] md:text-[11px] text-gray-500 font-mono px-2 pt-2 border-t border-gray-800/40 z-10">
            <span>{axisLabels[0]}</span>
            <span>{axisLabels[1]}</span>
            <span>{axisLabels[2]}</span>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default CourseGraph;
