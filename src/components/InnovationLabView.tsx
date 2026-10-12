import React, { useState } from 'react';
import { Competency, Experiment, ExperimentOutcome } from '../types';
import { 
  Plus, 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  Trash2, 
  X, 
  Tag
} from 'lucide-react';

interface InnovationLabViewProps {
  experiments: Experiment[];
  competencies: Competency[];
  onAddExperiment: (exp: Partial<Experiment>) => Promise<void>;
  onDeleteExperiment: (id: string) => Promise<void>;
}

export const InnovationLabView: React.FC<InnovationLabViewProps> = ({
  experiments,
  competencies,
  onAddExperiment,
  onDeleteExperiment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('All');
  const [activeModal, setActiveModal] = useState<'create' | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [technicalDomain, setTechnicalDomain] = useState('Distributed Systems & Architecture');
  const [competencyId, setCompetencyId] = useState(competencies[0]?.id || 'comp-python');
  const [methodology, setMethodology] = useState('');
  const [outcome, setOutcome] = useState<ExperimentOutcome>('Failed / Falsified');
  const [keyLearnings, setKeyLearnings] = useState('');
  const [pivotAction, setPivotAction] = useState('');
  const [tagsInput, setTagsInput] = useState('performance, architecture');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter experiments
  const filteredExperiments = experiments.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.hypothesis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.keyLearnings.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.pivotAction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOutcome = outcomeFilter === 'All' || exp.outcome === outcomeFilter;
    return matchesSearch && matchesOutcome;
  });

  const validatedCount = experiments.filter(e => e.outcome === 'Validated').length;
  const failedCount = experiments.filter(e => e.outcome.toLowerCase().includes('fail') || e.outcome.toLowerCase().includes('falsif')).length;
  const pivotRate = experiments.length > 0 ? ((failedCount / experiments.length) * 100).toFixed(0) : '0';

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !hypothesis.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddExperiment({
        title,
        hypothesis,
        technicalDomain,
        competencyId,
        methodology,
        outcome,
        keyLearnings,
        pivotAction,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      });
      setActiveModal(null);
      setTitle('');
      setHypothesis('');
      setKeyLearnings('');
      setPivotAction('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Innovation Lab &amp; Experiment Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Testing hypotheses, documenting fast-failure postmortems, extracting engineering pivots, and tracking research velocity.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('create')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Formulate New Hypothesis</span>
        </button>
      </div>

      {/* Innovation Philosophy & Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Total Hypotheses Formulated</div>
          <div className="text-2xl font-bold text-slate-100 font-mono tabular-nums">
            {experiments.length}
          </div>
          <div className="text-xs text-slate-500">
            {validatedCount} validated · {failedCount} falsified
          </div>
        </div>

        <div className="border border-amber-900/30 bg-amber-950/10 rounded-lg p-4 space-y-1">
          <div className="text-xs text-amber-400/90 font-medium">Failed Experiments Learning Rate</div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {pivotRate}%
          </div>
          <div className="text-xs text-amber-400/70">
            100% of failures documented with architectural pivots
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-4 space-y-1">
          <div className="text-xs text-slate-400">Anti-Fragile Framework</div>
          <div className="text-xs text-slate-300 leading-relaxed pt-1">
            Treating falsified hypotheses as high-value discoveries prevents duplicate architectural errors across the research team.
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-3 border border-slate-800 bg-slate-900/40 rounded-lg text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search experiments, learnings, or pivot actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md overflow-x-auto">
          {['All', 'Validated', 'Failed / Falsified', 'Inconclusive'].map((item) => (
            <button
              key={item}
              onClick={() => setOutcomeFilter(item)}
              className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                outcomeFilter === item
                  ? 'bg-slate-800 text-indigo-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Experiments Board */}
      <div className="space-y-4">
        {filteredExperiments.map((exp) => {
          const comp = competencies.find(c => c.id === exp.competencyId);
          const isFailed = exp.outcome.toLowerCase().includes('fail') || exp.outcome.toLowerCase().includes('falsif');
          const isValidated = exp.outcome === 'Validated';

          return (
            <div
              key={exp.id}
              className={`border rounded-xl p-5 space-y-4 transition-all ${
                isFailed
                  ? 'border-slate-800 bg-slate-900/40 hover:border-amber-900/50'
                  : 'border-slate-800 bg-slate-900/40 hover:border-indigo-900/50'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-slate-500">{exp.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-indigo-400 font-medium">{comp?.name || exp.competencyId}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.technicalDomain}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{exp.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    {exp.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-mono font-medium px-2.5 py-1 rounded border ${
                      isValidated
                        ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20'
                        : isFailed
                        ? 'text-amber-400 border-amber-900/50 bg-amber-950/20'
                        : 'text-slate-400 border-slate-700 bg-slate-900'
                    }`}
                  >
                    {exp.outcome}
                  </span>

                  <button
                    onClick={() => onDeleteExperiment(exp.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                    title="Delete experiment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Hypothesis & Methodology */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                  <span className="text-slate-500 font-semibold block">Hypothesis</span>
                  <p className="text-slate-300 leading-relaxed">{exp.hypothesis}</p>
                </div>

                <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                  <span className="text-slate-500 font-semibold block">Methodology &amp; Test Matrix</span>
                  <p className="text-slate-400 leading-relaxed">{exp.methodology}</p>
                </div>
              </div>

              {/* Learning Postmortem and Pivot Vector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                {/* Key Learnings */}
                <div className={`p-3.5 rounded-lg border space-y-1.5 ${
                  isFailed
                    ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                    : 'bg-indigo-950/20 border-indigo-900/40 text-indigo-200'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-slate-300">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Key Engineering Learnings</span>
                  </div>
                  <p className="leading-relaxed text-xs text-slate-200">{exp.keyLearnings}</p>
                </div>

                {/* Pivot Vector */}
                <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-slate-300">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Subsequent Pivot / Architectural Action</span>
                  </div>
                  <p className="leading-relaxed text-xs text-slate-300">{exp.pivotAction}</p>
                </div>
              </div>

              {/* Tags */}
              {exp.tags && exp.tags.length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
                  <Tag className="w-3 h-3" />
                  <div className="flex items-center gap-1.5">
                    {exp.tags.map((t, idx) => (
                      <span key={idx} className="font-mono text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Formulate New Hypothesis */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Formulate Hypothesis &amp; Experiment</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test ideas and structure clear failure-tolerant learning postmortems.
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Experiment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus over UDP vs TCP Under 10% Packet Loss"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Related Competency
                  </label>
                  <select
                    value={competencyId}
                    onChange={(e) => setCompetencyId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                  >
                    {competencies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Experiment Outcome *
                  </label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value as ExperimentOutcome)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                  >
                    <option value="Failed / Falsified">Failed / Falsified (Valuable Postmortem)</option>
                    <option value="Validated">Validated</option>
                    <option value="Inconclusive">Inconclusive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Formal Hypothesis Statement *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="If [we do X], then [measurable outcome Y], because [technical mechanism Z]..."
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Methodology &amp; Benchmarking Framework
                </label>
                <textarea
                  rows={2}
                  placeholder="Harness used, sample sizes, hardware specs, stress profiling criteria..."
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Key Learnings (Postmortem Analysis) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="What unexpected behavior occurred? Why did the hypothesis fail or succeed? What was uncovered?"
                  value={keyLearnings}
                  onChange={(e) => setKeyLearnings(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Pivot Action / Architectural Next Step *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="What was built or re-architected as a direct consequence of this test?"
                  value={pivotAction}
                  onChange={(e) => setPivotAction(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="postmortem, concurrency, benchmark"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="px-4 py-1.5 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording...' : 'Record Experiment & Pivot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
