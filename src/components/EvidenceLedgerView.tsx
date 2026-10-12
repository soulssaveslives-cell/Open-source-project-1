import React, { useState } from 'react';
import { AssessmentTier, Competency, EvidenceItem, EvidenceType, SkillForSuccess, VerificationStatus } from '../types';
import { 
  Plus, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Filter, 
  FileCode, 
  Trash2, 
  Lock, 
  X,
  AlertCircle
} from 'lucide-react';

interface EvidenceLedgerViewProps {
  evidenceLedger: EvidenceItem[];
  competencies: Competency[];
  skillsForSuccess: SkillForSuccess[];
  onAddEvidence: (item: Partial<EvidenceItem>) => Promise<void>;
  onDeleteEvidence: (id: string) => Promise<void>;
  initialCompetencyFilter?: string | null;
}

export const EvidenceLedgerView: React.FC<EvidenceLedgerViewProps> = ({
  evidenceLedger,
  competencies,
  skillsForSuccess,
  onAddEvidence,
  onDeleteEvidence,
  initialCompetencyFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [competencyFilter, setCompetencyFilter] = useState<string>(initialCompetencyFilter || 'All');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeModal, setActiveModal] = useState<'create' | 'inspect-seal' | null>(null);
  const [inspectedItem, setInspectedItem] = useState<EvidenceItem | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Form State
  const [formCompetencyId, setFormCompetencyId] = useState(competencies[0]?.id || 'comp-python');
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<EvidenceType>('Code & Tests');
  const [formTier, setFormTier] = useState<AssessmentTier>('Capable');
  const [formSourceRef, setFormSourceRef] = useState('https://github.com/toolkit/core/commit/');
  const [formDescription, setFormDescription] = useState('');
  const [formTestCoverage, setFormTestCoverage] = useState(94.5);
  const [formVerifiedBy, setFormVerifiedBy] = useState('Senior Peer Reviewer (PR Guild)');
  const [formSkills, setFormSkills] = useState<string[]>(['digital', 'problem-solving']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter evidence
  const filteredEvidence = evidenceLedger.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sourceRef.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesComp = competencyFilter === 'All' || item.competencyId === competencyFilter;
    const matchesTier = tierFilter === 'All' || item.tierClaimed === tierFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesComp && matchesTier && matchesStatus;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddEvidence({
        competencyId: formCompetencyId,
        title: formTitle,
        type: formType,
        tierClaimed: formTier,
        sourceRef: formSourceRef,
        description: formDescription,
        testCoveragePct: formTestCoverage,
        verifiedBy: formVerifiedBy,
        skillsDemonstrated: formSkills,
        status: 'Verified',
      });
      setActiveModal(null);
      setFormTitle('');
      setFormDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Immutable Evidence Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Verifiable source records, code commits, test suites, and cryptographic digests proving competency claims.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('create')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Evidence Artifact</span>
        </button>
      </div>

      {/* Filter and Query Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-slate-800 bg-slate-900/40 rounded-lg text-xs">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search commits, SHA hashes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Competency Dropdown */}
        <div>
          <select
            value={competencyFilter}
            onChange={(e) => setCompetencyFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Competencies ({evidenceLedger.length})</option>
            {competencies.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.name} ({evidenceLedger.filter(e => e.competencyId === comp.id).length})
              </option>
            ))}
          </select>
        </div>

        {/* Tier Dropdown */}
        <div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Assessment Tiers</option>
            <option value="Novice">Novice</option>
            <option value="Capable">Capable</option>
            <option value="Advanced">Advanced</option>
            <option value="Champion">Champion</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Verification States</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* High-Density Evidence Table */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-3 px-4 font-semibold w-24">Record ID</th>
                <th className="py-3 px-4 font-semibold">Artifact Title &amp; Source</th>
                <th className="py-3 px-4 font-semibold w-32">Competency</th>
                <th className="py-3 px-4 font-semibold w-24 text-center">Tier</th>
                <th className="py-3 px-4 font-semibold w-28 text-center">Coverage</th>
                <th className="py-3 px-4 font-semibold w-36">SHA-256 Digest</th>
                <th className="py-3 px-4 font-semibold w-28">Audited By</th>
                <th className="py-3 px-4 font-semibold w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvidence.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No evidence records found matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEvidence.map((item) => {
                  const comp = competencies.find(c => c.id === item.competencyId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                      {/* ID */}
                      <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {item.id}
                      </td>

                      {/* Title & Ref */}
                      <td className="py-3 px-4 space-y-1">
                        <div className="font-medium text-slate-200">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>{item.type}</span>
                          <span aria-hidden="true">·</span>
                          <a
                            href={item.sourceRef}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
                          >
                            <span className="truncate max-w-[200px]">{item.sourceRef}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </div>
                      </td>

                      {/* Competency */}
                      <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap">
                        {comp?.name || item.competencyId}
                      </td>

                      {/* Tier */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="font-mono text-[11px] text-indigo-300">
                          {item.tierClaimed}
                        </span>
                      </td>

                      {/* Test Coverage */}
                      <td className="py-3 px-4 text-center font-mono tabular-nums whitespace-nowrap text-emerald-400">
                        {item.testCoveragePct.toFixed(1)}%
                      </td>

                      {/* SHA-256 Digest */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setInspectedItem(item);
                            setActiveModal('inspect-seal');
                          }}
                          className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors group"
                          title="Inspect Cryptographic Seal"
                        >
                          <Lock className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
                          <span>{item.sha256Hash.substring(0, 8)}...</span>
                        </button>
                      </td>

                      {/* Audited By */}
                      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        <div className="truncate max-w-[120px]" title={item.verifiedBy}>
                          {item.verifiedBy}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {item.verificationDate}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onDeleteEvidence(item.id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                          title="Remove evidence record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Seal Modal */}
      {activeModal === 'inspect-seal' && inspectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cryptographic Digest Seal</h3>
                  <div className="text-xs text-slate-400">Evidence ID: {inspectedItem.id}</div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="border border-slate-800 bg-slate-950 p-3 rounded-lg space-y-1">
                <div className="text-slate-400">SHA-256 Checksum:</div>
                <div className="font-mono text-emerald-400 break-all text-[11px] select-all">
                  {inspectedItem.sha256Hash}
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleCopyHash(inspectedItem.sha256Hash)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-slate-400">Evidence Description:</div>
                <p className="text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                  {inspectedItem.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="border border-slate-800 bg-slate-950/60 p-2.5 rounded">
                  <span className="text-slate-500 block text-[10px]">Verified By</span>
                  <span className="text-slate-200 font-medium">{inspectedItem.verifiedBy}</span>
                </div>
                <div className="border border-slate-800 bg-slate-950/60 p-2.5 rounded">
                  <span className="text-slate-500 block text-[10px]">Test Coverage Invariant</span>
                  <span className="text-emerald-400 font-mono tabular-nums">{inspectedItem.testCoveragePct}% Passing</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register New Evidence Modal */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Register Evidence Artifact</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deposit code, tests, or documentation linked to a competency.
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Target Competency *
                  </label>
                  <select
                    value={formCompetencyId}
                    onChange={(e) => setFormCompetencyId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                  >
                    {competencies.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name} ({comp.tier})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Assessment Tier Claimed *
                  </label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as AssessmentTier)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                  >
                    <option value="Novice">Novice</option>
                    <option value="Capable">Capable</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Champion">Champion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Artifact Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asynchronous Harvester Engine with Backoff Rate Limiting"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Artifact Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as EvidenceType)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                  >
                    <option value="Code & Tests">Code &amp; Tests</option>
                    <option value="Source Record & Tests">Source Record &amp; Tests</option>
                    <option value="Project Documentation & Benchmark">Project Documentation &amp; Benchmark</option>
                    <option value="Security Audit & PR">Security Audit &amp; PR</option>
                    <option value="Documentation & Case Study">Documentation &amp; Case Study</option>
                    <option value="Failure Postmortem & Learning">Failure Postmortem &amp; Learning</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Test Coverage Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={formTestCoverage}
                    onChange={(e) => setFormTestCoverage(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Source Reference / Git Commit Ref *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://github.com/toolkit/repo/commit/..."
                  value={formSourceRef}
                  onChange={(e) => setFormSourceRef(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Evidence Description &amp; Reproducibility
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the technical implementation, benchmark metrics, test suite command, and why this satisfies the tier criteria."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Peer Reviewer / Auditor
                </label>
                <input
                  type="text"
                  value={formVerifiedBy}
                  onChange={(e) => setFormVerifiedBy(e.target.value)}
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
                  disabled={isSubmitting || !formTitle.trim()}
                  className="px-4 py-1.5 font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Sealing...' : 'Deposit Evidence & Generate Seal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
