import React, { useEffect, useState } from 'react';
import { 
  fetchCompetencies, 
  fetchEvidence, 
  fetchExperiments, 
  saveCompetency, 
  updateCompetency, 
  saveEvidence, 
  deleteEvidence, 
  saveExperiment, 
  deleteExperiment, 
  runQAAudit, 
  validateSchema, 
  importData, 
  resetToBaseline 
} from './services/api';
import { Competency, EvidenceItem, Experiment, QAAuditResult, SkillForSuccess } from './types';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { CompetencyRegistry } from './components/CompetencyRegistry';
import { EvidenceLedgerView } from './components/EvidenceLedgerView';
import { InnovationLabView } from './components/InnovationLabView';
import { CollaborationAndQAView } from './components/CollaborationAndQAView';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [skillsForSuccess, setSkillsForSuccess] = useState<SkillForSuccess[]>([]);
  const [evidenceLedger, setEvidenceLedger] = useState<EvidenceItem[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isQALoading, setIsQALoading] = useState(false);
  const [qaResult, setQaResult] = useState<QAAuditResult | null>(null);
  
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedCompetencyForLedger, setSelectedCompetencyForLedger] = useState<string | null>(null);
  const [selectedCompetencyForInspection, setSelectedCompetencyForInspection] = useState<Competency | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [compRes, evList, expList] = await Promise.all([
        fetchCompetencies(),
        fetchEvidence(),
        fetchExperiments(),
      ]);
      setCompetencies(compRes.data);
      setSkillsForSuccess(compRes.skillsForSuccess);
      setEvidenceLedger(evList);
      setExperiments(expList);
    } catch (err: any) {
      console.error('Error loading initial data:', err);
      showNotification('Failed to load toolkit database', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleRunQA = async () => {
    setIsQALoading(true);
    try {
      const result = await runQAAudit();
      setQaResult(result);
      if (activeTab !== 'collaboration') {
        setActiveTab('collaboration');
      }
      showNotification(
        result.overallPassed ? 'QA Audit: All 5 continuous verification checks passed' : 'QA Audit completed with warnings',
        result.overallPassed ? 'success' : 'error'
      );
    } catch (err: any) {
      showNotification(err.message || 'QA Audit failed', 'error');
    } finally {
      setIsQALoading(false);
    }
  };

  const handleAddCompetency = async (compData: Partial<Competency>) => {
    try {
      const saved = await saveCompetency(compData);
      setCompetencies(prev => [...prev, saved]);
      showNotification(`Competency "${saved.name}" registered successfully.`);
    } catch (err: any) {
      showNotification(err.message || 'Failed to save competency', 'error');
      throw err;
    }
  };

  const handleUpdateCompetency = async (id: string, compData: Partial<Competency>) => {
    try {
      const updated = await updateCompetency(id, compData);
      setCompetencies(prev => prev.map(c => (c.id === id ? updated : c)));
      showNotification(`Competency "${updated.name}" updated to tier ${updated.tier}.`);
    } catch (err: any) {
      showNotification(err.message || 'Failed to update competency', 'error');
      throw err;
    }
  };

  const handleAddEvidence = async (itemData: Partial<EvidenceItem>) => {
    try {
      const saved = await saveEvidence(itemData);
      setEvidenceLedger(prev => [saved, ...prev]);
      // update competency count in local state
      setCompetencies(prev =>
        prev.map(c =>
          c.id === saved.competencyId
            ? { ...c, verifiedEvidenceCount: c.verifiedEvidenceCount + 1 }
            : c
        )
      );
      showNotification(`Evidence "${saved.title}" registered with SHA-256 seal.`);
    } catch (err: any) {
      showNotification(err.message || 'Failed to add evidence', 'error');
      throw err;
    }
  };

  const handleDeleteEvidence = async (id: string) => {
    try {
      await deleteEvidence(id);
      setEvidenceLedger(prev => prev.filter(e => e.id !== id));
      showNotification('Evidence record removed from ledger.');
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete evidence', 'error');
    }
  };

  const handleAddExperiment = async (expData: Partial<Experiment>) => {
    try {
      const saved = await saveExperiment(expData);
      setExperiments(prev => [saved, ...prev]);
      showNotification(`Experiment "${saved.title}" and postmortem learnings recorded.`);
    } catch (err: any) {
      showNotification(err.message || 'Failed to log experiment', 'error');
      throw err;
    }
  };

  const handleDeleteExperiment = async (id: string) => {
    try {
      await deleteExperiment(id);
      setExperiments(prev => prev.filter(e => e.id !== id));
      showNotification('Experiment postmortem removed.');
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete experiment', 'error');
    }
  };

  const handleImportData = async (rawText: string, format: 'json' | 'yaml') => {
    await importData(rawText, format);
    await loadAllData();
    showNotification('Dataset imported successfully.');
  };

  const handleResetData = async () => {
    if (window.confirm('Reset the toolkit database to the verified baseline standard?')) {
      await resetToBaseline();
      await loadAllData();
      showNotification('Dataset restored to initial baseline.');
    }
  };

  const handleViewEvidenceForCompetency = (comp: Competency) => {
    setSelectedCompetencyForLedger(comp.id);
    setActiveTab('evidence');
  };

  const handleSelectCompetencyFromOverview = (comp: Competency) => {
    setSelectedCompetencyForInspection(comp);
    setActiveTab('competencies');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-300">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'evidence') setSelectedCompetencyForLedger(null);
        }}
        onRunQA={handleRunQA}
        isQALoading={isQALoading}
      />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className={`px-4 py-3 rounded-lg border text-xs shadow-xl flex items-center gap-2.5 ${
            notification.type === 'success'
              ? 'bg-slate-900 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900 border-red-500/50 text-red-300'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className="font-medium text-slate-200">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-500 hover:text-slate-300 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <div className="text-xs text-slate-500 font-mono">
              Loading structured competency ledger &amp; evidence files...
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewDashboard
                competencies={competencies}
                skillsForSuccess={skillsForSuccess}
                evidenceLedger={evidenceLedger}
                experiments={experiments}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  if (tab !== 'evidence') setSelectedCompetencyForLedger(null);
                }}
                onSelectCompetency={handleSelectCompetencyFromOverview}
              />
            )}

            {activeTab === 'competencies' && (
              <CompetencyRegistry
                competencies={competencies}
                skillsForSuccess={skillsForSuccess}
                onAddCompetency={handleAddCompetency}
                onUpdateCompetency={handleUpdateCompetency}
                onViewEvidenceForCompetency={handleViewEvidenceForCompetency}
                selectedCompetencyFromOverview={selectedCompetencyForInspection}
              />
            )}

            {activeTab === 'evidence' && (
              <EvidenceLedgerView
                evidenceLedger={evidenceLedger}
                competencies={competencies}
                skillsForSuccess={skillsForSuccess}
                onAddEvidence={handleAddEvidence}
                onDeleteEvidence={handleDeleteEvidence}
                initialCompetencyFilter={selectedCompetencyForLedger}
              />
            )}

            {activeTab === 'innovation' && (
              <InnovationLabView
                experiments={experiments}
                competencies={competencies}
                onAddExperiment={handleAddExperiment}
                onDeleteExperiment={handleDeleteExperiment}
              />
            )}

            {activeTab === 'collaboration' && (
              <CollaborationAndQAView
                qaResult={qaResult}
                isQALoading={isQALoading}
                onRunQA={handleRunQA}
                onValidateSchema={validateSchema}
                onImportData={handleImportData}
                onResetData={handleResetData}
              />
            )}
          </>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Open-Source Competency &amp; Innovation Toolkit</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-slate-600">Research Dashboard Module</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>Nine Skills for Success Mapped</span>
            <span aria-hidden="true">·</span>
            <span>Four-Tier Assessment Ledger</span>
            <span aria-hidden="true">·</span>
            <span>SHA-256 Verifiable Seals</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
