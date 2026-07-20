import React, { useState } from "react";
import { 
  UserCheck, 
  CheckSquare, 
  Award, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AdmissionFlowchart() {
  const [showFullDetails, setShowFullDetails] = useState(false);

  const steps = [
    {
      step: "01",
      title: "Online CAP Registration",
      subtitle: "Register & Verify Documents",
      desc: "Register on mahacet.org, upload documents, and complete e-Scrutiny or FC verification.",
      icon: UserCheck,
      color: "from-blue-500 to-indigo-600",
      accentBg: "bg-blue-50 text-blue-700 border-blue-200",
      tag: "Step 1"
    },
    {
      step: "02",
      title: "Merit Rank & Option Form",
      subtitle: "Lock College Preferences",
      desc: "Check your Merit List rank and fill Option Form preferences (IMV Choice Code: 16173).",
      icon: CheckSquare,
      color: "from-indigo-500 to-purple-600",
      accentBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      tag: "Step 2"
    },
    {
      step: "03",
      title: "CAP Seat Allotment",
      subtitle: "Freeze or Float Option",
      desc: "View allotment result. Choose Freeze (accept seat) or Betterment (participate in next round).",
      icon: Award,
      color: "from-amber-500 to-orange-600",
      accentBg: "bg-amber-50 text-amber-800 border-amber-200",
      tag: "Step 3"
    },
    {
      step: "04",
      title: "Institute Admission",
      subtitle: "Confirm at College Campus",
      desc: "Report to Indrayani Mahavidyalaya, submit original documents & confirm final admission.",
      icon: Building2,
      color: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      tag: "Step 4"
    }
  ];

  return (
    <div className="space-y-6 w-full select-none">
      
      {/* Top Quick Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-blue-950 p-4 sm:p-5 rounded-2xl text-white shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 text-accent flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              DTE Admission Process 2026–27
            </h3>
            <p className="text-xs text-slate-300">
              Simple 4-Step Admission Journey for BBA, BCA, MBA & MCA
            </p>
          </div>
        </div>

        <a
          href="https://cetcell.mahacet.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-amber-300 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
        >
          Visit CET Portal <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 4-Step Visual Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card 
              key={idx} 
              className="relative overflow-hidden border border-border/60 hover:border-primary/40 shadow-sm hover:shadow-md transition-all group duration-200"
            >
              {/* Colored Top Bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${s.color}`} />

              <CardContent className="p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${s.accentBg}`}>
                    {s.tag}
                  </span>
                  <span className="text-xl font-extrabold text-slate-300 group-hover:text-primary transition-colors">
                    {s.step}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className={`w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                      {s.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {s.subtitle}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-slate-100">
                  {s.desc}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Option Guide Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-amber-950">
        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500 text-slate-950 font-bold px-2.5 py-0.5">CAP Seat Options</Badge>
          <span className="font-semibold text-slate-800">Key options after Seat Allotment:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Freeze (Accept & Pay Fee)
          </span>
          <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Betterment (Float for Next CAP Round)
          </span>
          <span className="px-2.5 py-1 rounded bg-purple-100 text-purple-800 border border-purple-300">
            Spot / Institute Round
          </span>
        </div>
      </div>

      {/* Expandable Button for Full Breakdown */}
      <div className="text-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFullDetails(!showFullDetails)}
          className="text-xs font-semibold text-slate-700 hover:text-primary border-slate-300 rounded-lg px-4"
        >
          <FileText className="w-3.5 h-3.5 mr-1.5 text-accent" />
          {showFullDetails ? "Hide Detailed Breakdown" : "View Detailed 19-Step Breakdown"}
          {showFullDetails ? <ChevronUp className="w-3.5 h-3.5 ml-1.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-1.5" />}
        </Button>
      </div>

      {/* Expandable Detailed Checklist (Only when toggled) */}
      {showFullDetails && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 animate-in fade-in-50 duration-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-200">
            Detailed 19-Step CAP Admission Checklist
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="space-y-2">
              <span className="font-bold text-primary block">Phase 1: Registration & Scrutiny</span>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li>1. Official Admission Notification Released</li>
                <li>2. Read Information Brochure Carefully</li>
                <li>3. Check Eligibility & Required Certificates</li>
                <li>4. Online Registration on Maharashtra CET Portal</li>
                <li>5. Upload Documents & Fill Personal Details</li>
                <li>6. Online Application Fee Payment</li>
                <li>7. e-Scrutiny / FC Physical Verification</li>
                <li>8. Application Confirmation by Facilitation Centre</li>
                <li>9. Provisional Merit List Publication</li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-primary block">Phase 2: Option Form & Allotment</span>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li>10. Submit Grievance (if any) & Final Merit List</li>
                <li>11. Display of Seat Matrix for CAP Round-I</li>
                <li>12. Option Form Choice Code Locking (IMV: 16173)</li>
                <li>13. CAP Round-I Allotment Result</li>
                <li>14. Freeze Seat / Betterment Float Option</li>
                <li>15. CAP Round-II & Round-III Allotments</li>
                <li>16. Reporting & Confirmation at Institute</li>
                <li>17. Original Document Submission at College</li>
                <li>18. Institute Session Commencement</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
