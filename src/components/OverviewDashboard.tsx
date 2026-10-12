import React, { useState } from 'react';
import { Competency, EvidenceItem, Experiment, SkillForSuccess } from '../types';
import { 
  ArrowRight, 
  ExternalLink,
  GitCommit, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Award,
  Terminal,
  Compass
} from 'lucide-react';

interface OverviewDashboardProps {
  competencies: Competency[];
  skillsForSuccess: SkillForSuccess[];
  evidenceLedger: EvidenceItem[];
  experiments: Experiment[];
  onNavigate: (tab: string) => void;
  onSelectCompetency: (comp: Competency) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  competencies,
  skillsForSuccess,
  evidenceLedger,
  experiments,
  onNavigate,
  onSelectCompetency,
}) => {
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(null);

  // Compute metrics
  const totalVerifiedEvidence = evidenceLedger.filter(e => e.status === 'Verified').length;
  const avgTestCoverage = evidenceLedger.length > 0
    ? (evidenceLedger.reduce((sum, e) => sum + (e.testCoveragePct || 0), 0) / evidenceLedger.length).toFixed(1)
    : '0';

  const tierCounts = {
    Novice: competencies.filter(c => c.tier === 'Novice').length,
    Capable: competencies.filter(c => c.tier === 'Capable').length,
    Advanced: competencies.filter(c => c.tier === 'Advanced').length,
    Champion: competencies.filter(c => c.tier === 'Champion').length,
  };

  const failedExperiments = experiments.filter(e => 
    e.outcome.toLowerCase().includes('fail') || e.outcome.toLowerCase().includes('falsif')
  );

  // Check 9 skills mapped
  const mappedSkillIds = new Set(competencies.flatMap(c => c.skillsMapped));
  const mappedCount = skillsForSuccess.filter(s => mappedSkillIds.has(s.id)).length;

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero Context */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
            <span>Research Dashboard</span>
            <span aria-hidden="true">·</span>
            <span>Open-Source Framework</span>
            <span aria-hidden="true">·</span>
            <span>Verifiable Evidence System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Competency Registry &amp; Innovation Ledger
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            A transparent framework mapping the nine Skills for Success into technical domains—tracking verifiable code evidence, testing hypotheses, embracing fast failure postmortems, and measuring peer-reviewed project progress.
          </p>
        </div>

        {/* Quick actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => onNavigate('evidence')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
          >
            <GitCommit className="w-3.5 h-3.5 text-indigo-400" />
            <span>Inspect Evidence Ledger ({evidenceLedger.length})</span>
          </button>
          <button
            onClick={() => onNavigate('innovation')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Experiment Postmortems ({experiments.length})</span>
          </button>
          <button
            onClick={() => onNavigate('collaboration')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Schema Validation &amp; CI</span>
          </button>
        </div>
      </div>

      {/* Quantitative Rigor Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="border border-slate-800/90 bg-slate-900/40 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Skills for Success Alignment</div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            {mappedCount} <span className="text-sm font-normal text-slate-500">/ {skillsForSuccess.length}</span>
          </div>
          <div className="text-xs text-slate-500">
            100% active coverage across technical domains
          </div>
        </div>

        {/* Metric 2 */}
        <div className="border border-slate-800/90 bg-slate-900/40 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Verified Evidence Ledger</div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            {totalVerifiedEvidence} <span className="text-sm font-normal text-slate-500">records</span>
          </div>
          <div className="text-xs text-slate-500">
            {avgTestCoverage}% mean automated test coverage
          </div>
        </div>

        {/* Metric 3 */}
        <div className="border border-slate-800/90 bg-slate-900/40 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Four-Tier Distribution</div>
          <div className="text-2xl font-bold text-indigo-400 font-mono tabular-nums">
            {tierCounts.Champion} <span className="text-xs font-normal text-slate-400">Champ</span> · {tierCounts.Advanced} <span className="text-xs font-normal text-slate-400">Adv</span> · {tierCounts.Capable} <span className="text-xs font-normal text-slate-400">Cap</span>
          </div>
          <div className="text-xs text-slate-500">
            {competencies.length} registered technical competencies
          </div>
        </div>

        {/* Metric 4 */}
        <div className="border border-slate-800/90 bg-slate-900/40 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Innovation Postmortems</div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {experiments.length} <span className="text-sm font-normal text-slate-500">hypotheses</span>
          </div>
          <div className="text-xs text-slate-500">
            {failedExperiments.length} falsified with actionable pivots
          </div>
        </div>
      </div>

      {/* Four-Tier Assessment Framework Visualizer */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Four-Tier Evidence-Based Assessment Ladder
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Promotion is strictly gated by immutable ledger records, peer reviews, and automated verification.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Rubric Spec v1.0
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Novice */}
          <div className="border border-slate-800 bg-slate-950/60 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tier 1</span>
              <span className="text-xs font-mono text-slate-500">{tierCounts.Novice} competencies</span>
            </div>
            <div className="text-sm font-bold text-slate-200">Novice</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Foundational syntax knowledge, PEP8/ESLint conformity, small self-contained scripts, and verified local build.
            </p>
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-900">
              Gate: 1+ reproducible code sample + syntax check
            </div>
          </div>

          {/* Capable */}
          <div className="border border-blue-900/40 bg-blue-950/10 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Tier 2</span>
              <span className="text-xs font-mono text-blue-300">{tierCounts.Capable} competencies</span>
            </div>
            <div className="text-sm font-bold text-blue-100">Capable</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Production implementation, edge-case coverage, automated unit test suites (&gt;80%), peer-reviewed merged PRs.
            </p>
            <div className="text-[11px] text-blue-400/80 pt-2 border-t border-blue-900/30">
              Gate: Peer review sign-off + passing test suite
            </div>
          </div>

          {/* Advanced */}
          <div className="border border-indigo-900/40 bg-indigo-950/10 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Tier 3</span>
              <span className="text-xs font-mono text-indigo-300">{tierCounts.Advanced} competencies</span>
            </div>
            <div className="text-sm font-bold text-indigo-100">Advanced</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Architectural RFC author, multi-system integration, performance benchmarking, and failure recovery harnesses.
            </p>
            <div className="text-[11px] text-indigo-400/80 pt-2 border-t border-indigo-900/30">
              Gate: System RFC + benchmark data + 2+ verified artifacts
            </div>
          </div>

          {/* Champion */}
          <div className="border border-purple-900/40 bg-purple-950/10 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Tier 4</span>
              <span className="text-xs font-mono text-purple-300">{tierCounts.Champion} competencies</span>
            </div>
            <div className="text-sm font-bold text-purple-100">Champion</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Novel algorithmic contribution, core open-source library maintainer, author of published industry standards, mentor.
            </p>
            <div className="text-[11px] text-purple-400/80 pt-2 border-t border-purple-900/30">
              Gate: Published RFC/package + 3+ peer committee sign-offs
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Competency Matrix: 9 Skills for Success vs Technical Domains */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Skills for Success × Technical Competency Registry Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-mapping the 9 Skills for Success against active technical disciplines. Click any cell to view evidence.
            </p>
          </div>
          {selectedSkillFilter && (
            <button
              onClick={() => setSelectedSkillFilter(null)}
              className="text-xs text-indigo-400 hover:text-indigo-300 self-start sm:self-auto"
            >
              Clear filter ({selectedSkillFilter})
            </button>
          )}
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-semibold w-52">Skills for Success</th>
                {competencies.map((comp) => (
                  <th key={comp.id} className="py-2.5 px-3 font-semibold text-center whitespace-nowrap">
                    <button
                      onClick={() => onSelectCompetency(comp)}
                      className="hover:text-indigo-300 transition-colors"
                      title={comp.summary}
                    >
                      {comp.name}
                    </button>
                    <div className="text-[10px] font-normal text-slate-500 font-mono">
                      {comp.tier}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {skillsForSuccess.map((skill) => {
                const isSelected = selectedSkillFilter === skill.id;
                return (
                  <tr
                    key={skill.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-indigo-950/30' : 'hover:bg-slate-900/70'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => setSelectedSkillFilter(isSelected ? null : skill.id)}
                        className="text-left group"
                      >
                        <div className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {skill.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                          {skill.description}
                        </div>
                      </button>
                    </td>

                    {competencies.map((comp) => {
                      const isMapped = comp.skillsMapped.includes(skill.id);
                      // count evidence demonstrating this skill
                      const matchingEvidence = evidenceLedger.filter(
                        e => e.competencyId === comp.id && e.skillsDemonstrated?.includes(skill.id)
                      );

                      return (
                        <td key={comp.id} className="py-2.5 px-3 text-center align-middle">
                          {isMapped ? (
                            <div className="inline-flex items-center justify-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                              {matchingEvidence.length > 0 && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {matchingEvidence.length}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-700">·</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Mapped &amp; Verified</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span>Numbers represent linked evidence artifacts</span>
          </div>
        </div>
      </div>

      {/* Two-Column Rest & Proof Section: Highlighting Failure Learnings & Top Evidence Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column A: Learning from Failed Experiments */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-100">
                Learning from Failed Experiments
              </h3>
            </div>
            <button
              onClick={() => onNavigate('innovation')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All Lab Entries</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Open-source innovation requires treating falsified hypotheses as first-class architectural discoveries.
          </p>

          <div className="space-y-3">
            {failedExperiments.slice(0, 2).map((exp) => (
              <div key={exp.id} className="border border-slate-800/80 bg-slate-950/60 rounded-lg p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-xs text-slate-200">{exp.title}</div>
                  <span className="text-[10px] text-amber-400 font-mono whitespace-nowrap">
                    Falsified
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  <span className="text-slate-500">Hypothesis:</span> {exp.hypothesis}
                </div>
                <div className="p-2.5 bg-amber-950/20 border border-amber-900/30 rounded text-xs text-amber-200/90 space-y-1">
                  <div className="font-semibold text-[11px] text-amber-300">Key Learning:</div>
                  <p className="text-[11px] leading-relaxed">{exp.keyLearnings}</p>
                </div>
                <div className="text-xs text-slate-300">
                  <span className="text-slate-500 font-medium">Pivot Vector:</span> {exp.pivotAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column B: Recent Verified Ledger Records */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-100">
                Latest Cryptographically Sealed Evidence
              </h3>
            </div>
            <button
              onClick={() => onNavigate('evidence')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Explore Full Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Immutable records linking competencies to code commits, tests, benchmarks, and pull requests.
          </p>

          <div className="space-y-3">
            {evidenceLedger.slice(0, 3).map((item) => {
              const comp = competencies.find(c => c.id === item.competencyId);
              return (
                <div key={item.id} className="border border-slate-800/80 bg-slate-950/60 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-medium text-slate-200">{item.title}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="text-indigo-400 font-medium">{comp?.name || item.competencyId}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.type}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{item.tierClaimed}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {item.testCoveragePct}% tests
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                    <span title={item.sha256Hash}>
                      SHA-256: {item.sha256Hash.substring(0, 16)}...
                    </span>
                    <a
                      href={item.sourceRef}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>Commit Ref</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
