import React, { useState } from 'react';
import { AssessmentTier, Competency, SkillForSuccess } from '../types';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  Check, 
  FileText, 
  Layers, 
  Sparkles, 
  Award,
  X,
  ExternalLink
} from 'lucide-react';

interface CompetencyRegistryProps {
  competencies: Competency[];
  skillsForSuccess: SkillForSuccess[];
  onAddCompetency: (comp: Partial<Competency>) => Promise<void>;
  onUpdateCompetency: (id: string, comp: Partial<Competency>) => Promise<void>;
  onViewEvidenceForCompetency: (comp: Competency) => void;
  selectedCompetencyFromOverview?: Competency | null;
}

export const CompetencyRegistry: React.FC<CompetencyRegistryProps> = ({
  competencies,
  skillsForSuccess,
  onAddCompetency,
  onUpdateCompetency,
  onViewEvidenceForCompetency,
  selectedCompetencyFromOverview,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [activeModal, setActiveModal] = useState<'create' | 'inspect' | null>(null);
  const [currentInspected, setCurrentInspected] = useState<Competency | null>(
    selectedCompetencyFromOverview || null
  );

  // New Competency Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Systems & Infrastructure');
  const [newTier, setNewTier] = useState<AssessmentTier>('Capable');
  const [newSummary, setNewSummary] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['digital', 'problem-solving']);
  const [rubricNovice, setRubricNovice] = useState('Foundational syntax and reproducible code sample.');
  const [rubricCapable, setRubricCapable] = useState('Peer-reviewed PR and passing unit tests >80%.');
  const [rubricAdvanced, setRubricAdvanced] = useState('Multi-system architecture and performance profiling.');
  const [rubricChampion, setRubricChampion] = useState('Novel library contribution or community mentorship.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter competencies
  const filteredCompetencies = competencies.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'All' || comp.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const handleToggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddCompetency({
        name: newName,
        category: newCategory,
        tier: newTier,
        summary: newSummary,
        skillsMapped: selectedSkills,
        rubricRequirements: {
          novice: rubricNovice,
          capable: rubricCapable,
          advanced: rubricAdvanced,
          champion: rubricChampion,
        },
      });
      setActiveModal(null);
      setNewName('');
      setNewSummary('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTierColor = (tier: AssessmentTier) => {
    switch (tier) {
      case 'Champion':
        return 'text-purple-400 border-purple-500/30 bg-purple-950/20';
      case 'Advanced':
        return 'text-indigo-400 border-indigo-500/30 bg-indigo-950/20';
      case 'Capable':
        return 'text-blue-400 border-blue-500/30 bg-blue-950/20';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-900/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Technical Competency Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mapping technical disciplines directly to the nine Skills for Success with evidence-based progression rubrics.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('create')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Technical Competency</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between p-3 border border-slate-800 bg-slate-900/40 rounded-lg">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search competencies, categories, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Tier filter segmented tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md overflow-x-auto">
          {['All', 'Novice', 'Capable', 'Advanced', 'Champion'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                selectedTier === tier
                  ? 'bg-slate-800 text-indigo-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompetencies.map((comp) => {
          return (
            <div
              key={comp.id}
              className="border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 rounded-xl p-5 space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {comp.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-100">
                      {comp.name}
                    </h3>
                  </div>

                  {/* Clean unboxed tier indicator with subtle style */}
                  <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded border ${getTierColor(comp.tier)}`}>
                    {comp.tier}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {comp.summary}
                </p>

                {/* 9 Skills Mapped (Unboxed metadata with separators) */}
                <div className="pt-2 border-t border-slate-800/60">
                  <div className="text-[11px] text-slate-500 font-medium mb-1.5">
                    Mapped Skills for Success:
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-indigo-300">
                    {comp.skillsMapped.map((skillId, idx) => {
                      const skill = skillsForSuccess.find(s => s.id === skillId);
                      return (
                        <React.Fragment key={skillId}>
                          <span title={skill?.description}>
                            {skill?.name || skillId}
                          </span>
                          {idx < comp.skillsMapped.length - 1 && (
                            <span className="text-slate-600" aria-hidden="true">·</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-500 font-mono text-[11px]">
                  {comp.verifiedEvidenceCount} verified evidence {comp.verifiedEvidenceCount === 1 ? 'artifact' : 'artifacts'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentInspected(comp);
                      setActiveModal('inspect');
                    }}
                    className="text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                  >
                    Rubric
                  </button>
                  <button
                    onClick={() => onViewEvidenceForCompetency(comp)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <span>Ledger</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Rubric Modal */}
      {activeModal === 'inspect' && currentInspected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs text-indigo-400 font-mono">{currentInspected.category}</span>
                <h3 className="text-xl font-bold text-white">{currentInspected.name} Assessment Rubric</h3>
                <div className="text-xs text-slate-400 mt-1">
                  Current Assessed Tier: <span className="font-semibold text-slate-200">{currentInspected.tier}</span> · Last audited {currentInspected.lastAssessed}
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentInspected.summary}
            </p>

            {/* Rubrics Matrix */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-slate-200">Four-Tier Advancement Rubric:</div>
              
              <div className="space-y-2.5">
                <div className="border border-slate-800 bg-slate-950 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-slate-300 flex items-center justify-between">
                    <span>Novice Criteria</span>
                    {currentInspected.tier === 'Novice' && <span className="text-indigo-400 font-mono text-[10px]">CURRENT</span>}
                  </div>
                  <p className="text-slate-400">{currentInspected.rubricRequirements?.novice || 'Foundational syntax and reproducible code sample.'}</p>
                </div>

                <div className="border border-blue-900/30 bg-blue-950/10 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-blue-300 flex items-center justify-between">
                    <span>Capable Criteria</span>
                    {currentInspected.tier === 'Capable' && <span className="text-blue-400 font-mono text-[10px]">CURRENT</span>}
                  </div>
                  <p className="text-slate-300">{currentInspected.rubricRequirements?.capable || 'Peer-reviewed PR and passing tests >80%.'}</p>
                </div>

                <div className="border border-indigo-900/30 bg-indigo-950/10 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-indigo-300 flex items-center justify-between">
                    <span>Advanced Criteria</span>
                    {currentInspected.tier === 'Advanced' && <span className="text-indigo-400 font-mono text-[10px]">CURRENT</span>}
                  </div>
                  <p className="text-slate-300">{currentInspected.rubricRequirements?.advanced || 'Multi-system architecture and optimization.'}</p>
                </div>

                <div className="border border-purple-900/30 bg-purple-950/10 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-purple-300 flex items-center justify-between">
                    <span>Champion Criteria</span>
                    {currentInspected.tier === 'Champion' && <span className="text-purple-400 font-mono text-[10px]">CURRENT</span>}
                  </div>
                  <p className="text-slate-300">{currentInspected.rubricRequirements?.champion || 'Novel library contribution or community mentorship.'}</p>
                </div>
              </div>
            </div>

            {/* Quick Tier Elevation Selector */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Update Assessment Tier:
              </div>
              <div className="flex items-center gap-1.5">
                {(['Novice', 'Capable', 'Advanced', 'Champion'] as AssessmentTier[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      onUpdateCompetency(currentInspected.id, { tier: t });
                      setCurrentInspected({ ...currentInspected, tier: t });
                    }}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      currentInspected.tier === t
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register New Competency Modal */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Register Technical Competency</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Establish a technical discipline within the open-source competency framework.
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Competency Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rust Systems, Cloud Architecture, Reverse Engineering"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Initial Assessment Tier
                  </label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as AssessmentTier)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Novice">Novice</option>
                    <option value="Capable">Capable</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Champion">Champion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technical Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the competency scope, core libraries, and engineering responsibilities."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Nine Skills for Success Multi-Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Map to Skills for Success (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  {skillsForSuccess.map((skill) => {
                    const isChecked = selectedSkills.includes(skill.id);
                    return (
                      <button
                        type="button"
                        key={skill.id}
                        onClick={() => handleToggleSkill(skill.id)}
                        className={`text-left p-2 rounded text-xs transition-colors flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded flex items-center justify-center border ${
                          isChecked ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className="truncate">{skill.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rubric criteria */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Four-Tier Rubric Requirements
                </label>
                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Novice requirement..."
                    value={rubricNovice}
                    onChange={(e) => setRubricNovice(e.target.value)}
                    className="w-full px-3 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="Capable requirement..."
                    value={rubricCapable}
                    onChange={(e) => setRubricCapable(e.target.value)}
                    className="w-full px-3 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="Advanced requirement..."
                    value={rubricAdvanced}
                    onChange={(e) => setRubricAdvanced(e.target.value)}
                    className="w-full px-3 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="Champion requirement..."
                    value={rubricChampion}
                    onChange={(e) => setRubricChampion(e.target.value)}
                    className="w-full px-3 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newName.trim()}
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Save Competency'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
