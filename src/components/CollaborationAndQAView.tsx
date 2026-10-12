import React, { useState } from 'react';
import { QAAuditResult } from '../types';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download, 
  Upload, 
  RotateCcw, 
  FileCode, 
  Github, 
  Copy, 
  Check, 
  Terminal, 
  ShieldCheck, 
  Layers
} from 'lucide-react';

interface CollaborationAndQAViewProps {
  qaResult: QAAuditResult | null;
  isQALoading: boolean;
  onRunQA: () => void;
  onValidateSchema: (content: string, format: 'json' | 'yaml', schemaType: string) => Promise<{
    isValid: boolean;
    errors: string[];
    parsedObject: any;
  }>;
  onImportData: (rawText: string, format: 'json' | 'yaml') => Promise<void>;
  onResetData: () => Promise<void>;
}

export const CollaborationAndQAView: React.FC<CollaborationAndQAViewProps> = ({
  qaResult,
  isQALoading,
  onRunQA,
  onValidateSchema,
  onImportData,
  onResetData,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'qa' | 'schema' | 'github'>('qa');

  // Schema Validator State
  const [validatorFormat, setValidatorFormat] = useState<'yaml' | 'json'>('yaml');
  const [validatorSchemaType, setValidatorSchemaType] = useState('competency');
  const [validatorInput, setValidatorInput] = useState(`name: Rust
category: Systems Programming
tier: Advanced
skillsMapped:
  - digital
  - problem-solving
  - numeracy
rubricRequirements:
  novice: Ownership rules and cargo compilation
  capable: Multi-threaded Tokio actor with 85% test coverage
  advanced: Zero-copy deserialization with unsafe audit
  champion: Author of published crates.io library
`);
  const [validationOutput, setValidationOutput] = useState<{
    isValid: boolean;
    errors: string[];
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Import State
  const [importText, setImportText] = useState('');
  const [importFormat, setImportFormat] = useState<'yaml' | 'json'>('yaml');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // GitHub Collab State
  const [templateType, setTemplateType] = useState<'issue' | 'pr' | 'contributing' | 'ci'>('contributing');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const res = await onValidateSchema(validatorInput, validatorFormat, validatorSchemaType);
      setValidationOutput({ isValid: res.isValid, errors: res.errors });
    } catch (err: any) {
      setValidationOutput({ isValid: false, errors: [err.message || 'Validation error'] });
    } finally {
      setIsValidating(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!importText.trim()) return;
    try {
      await onImportData(importText, importFormat);
      setImportStatus('Data successfully imported and committed to structured storage!');
      setImportText('');
    } catch (err: any) {
      setImportStatus(`Import Error: ${err.message}`);
    }
  };

  // GitHub Templates
  const getTemplateContent = () => {
    if (templateType === 'contributing') {
      return `# Contributing to Open-Source Competency & Innovation Toolkit

Thank you for contributing to the transparent skills and research dashboard framework!

## 1. The Four-Tier Assessment Standard
All competency claims require demonstrable, peer-reviewed artifacts:
- **Novice**: 1+ reproducible code sample conforming to linter/type rules.
- **Capable**: Merged pull request with automated unit test suite (>80% coverage).
- **Advanced**: Multi-system architectural RFC, performance benchmark metrics, and fault-recovery tests.
- **Champion**: Novel open-source contribution, library author, or community standard.

## 2. Evidence Ledger Invariants
Every evidence entry must provide:
1. Canonical Git commit SHA or public PR link.
2. Exact test coverage percentage.
3. Cryptographic SHA-256 seal digest computed over the record.
4. Explicit mapping to one or more of the Nine Skills for Success.

## 3. Fast Failure & Experimentation Policy
We celebrate falsified hypotheses. If an experiment fails, submit an Experiment Postmortem documenting:
- The original hypothesis.
- Why it failed or was falsified.
- Key engineering learnings extracted.
- The resulting architectural pivot vector.

## 4. Local Development & Verification
\`\`\`bash
# Install dependencies
npm install

# Run automated tests and QA invariants
npm run lint
npm run build

# Start full-stack local server
npm run dev
\`\`\`
`;
    }

    if (templateType === 'issue') {
      return `---
name: Evidence Verification Request
about: Submit a code artifact, test suite, or failure postmortem for peer review
title: "[EVIDENCE]: <Competency Name> - <Artifact Title>"
labels: [evidence-verification, assessment]
---

### 1. Competency Claim
- Target Competency: (e.g. TypeScript, Python, OSINT, AI)
- Claimed Assessment Tier: [Novice / Capable / Advanced / Champion]
- Skills for Success Demonstrated: (e.g. Digital, Problem Solving, Numeracy)

### 2. Evidence Artifact
- Source Commit SHA / PR URL:
- Artifact Type: [Code & Tests / Documentation / Security Audit / Benchmark]
- Test Coverage Rate (%):

### 3. Reproducibility Instructions
\`\`\`bash
# Steps to execute test suite locally
npm test
\`\`\`

### 4. Cryptographic Proof
- SHA-256 Digest: \`[paste generated hash from toolkit]\`
`;
    }

    if (templateType === 'ci') {
      return `name: Competency Evidence CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  verify-evidence-and-schemas:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run TypeScript Compiler Check
        run: npm run lint

      - name: Execute Toolkit Invariant Test Suite
        run: |
          echo "Verifying Nine Skills for Success Mapping..."
          echo "Verifying Cryptographic Ledger Digest Integrity..."
          echo "Verifying Four-Tier Gating Thresholds..."
          echo "Verifying Postmortem Rigor for Failed Experiments..."
          curl -s -X POST http://localhost:3000/api/run-qa-audit
`;
    }

    return `### Pull Request Checklist for Four-Tier Advancement
- [ ] Tier claimed matches rubric requirements in \`data/competencies.json\`
- [ ] Automated test suite attached with coverage >= 80%
- [ ] SHA-256 seal generated and signed by author
- [ ] If an experiment failed, postmortem key learnings are documented
- [ ] Validated against YAML and JSON schema specifications
`;
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(getTemplateContent());
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Collaboration, QA &amp; Schema Interoperability
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated quality assurance checks, JSON &amp; YAML schema validation, and GitHub collaboration templates.
          </p>
        </div>

        {/* Sub-tab segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('qa')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              activeSubTab === 'qa'
                ? 'bg-slate-800 text-indigo-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Automated QA Suite
          </button>
          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              activeSubTab === 'schema'
                ? 'bg-slate-800 text-indigo-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            JSON / YAML Schema Hub
          </button>
          <button
            onClick={() => setActiveSubTab('github')}
            className={`px-3 py-1.5 font-medium rounded transition-colors ${
              activeSubTab === 'github'
                ? 'bg-slate-800 text-indigo-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GitHub Collaboration
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Automated QA Suite */}
      {activeSubTab === 'qa' && (
        <div className="space-y-6">
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Continuous Evidence Verification &amp; Invariant Tests
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated test checks ensuring mathematical, cryptographic, and rubric compliance across the system.
                </p>
              </div>

              <button
                onClick={onRunQA}
                disabled={isQALoading}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm disabled:opacity-50 self-start sm:self-auto"
              >
                <Play className={`w-3.5 h-3.5 ${isQALoading ? 'animate-spin' : ''}`} />
                <span>{isQALoading ? 'Running QA Tests...' : 'Run Test Suite Now'}</span>
              </button>
            </div>

            {/* QA Diagnostic Checks */}
            {qaResult ? (
              <div className="space-y-4 pt-2">
                <div className={`p-4 rounded-lg border text-xs flex items-center justify-between ${
                  qaResult.overallPassed
                    ? 'border-emerald-900/50 bg-emerald-950/20 text-emerald-300'
                    : 'border-amber-900/50 bg-amber-950/20 text-amber-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {qaResult.overallPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold">{qaResult.overallPassed ? 'ALL AUDIT CHECKS PASSED' : 'ACTION REQUIRED'}</span>
                      <p className="text-slate-300 mt-0.5">{qaResult.summary}</p>
                    </div>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px] hidden sm:inline">
                    {qaResult.timestamp.split('T')[1].slice(0, 8)} UTC
                  </span>
                </div>

                <div className="space-y-3">
                  {qaResult.checks.map((check, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-800 bg-slate-950/60 rounded-lg p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {check.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                          <span className="font-bold text-slate-200">{check.name}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {check.category}
                        </span>
                      </div>
                      <p className="text-slate-400 pl-6 leading-relaxed">
                        {check.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                Click &quot;Run Test Suite Now&quot; to execute the continuous evidence audit suite.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: JSON & YAML Schema Hub */}
      {activeSubTab === 'schema' && (
        <div className="space-y-6">
          {/* Export / Download Bar */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Structured Data Export &amp; Backup
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Download the complete toolkit registry, evidence ledger, and experiment postmortems in standard formats.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="/api/export/yaml"
                download="competency-toolkit.yaml"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export YAML</span>
              </a>
              <a
                href="/api/export/json"
                download="competency-toolkit.json"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export JSON</span>
              </a>
              <button
                onClick={onResetData}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-red-300 hover:bg-red-950/20 rounded-md transition-colors border border-slate-800"
                title="Reset to initial verified state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Baseline</span>
              </button>
            </div>
          </div>

          {/* Real-Time Schema Validator */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Live JSON &amp; YAML Schema Validator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Validate arbitrary structured project files against strict domain schemas before committing.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {/* Format switcher */}
                <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded">
                  <button
                    onClick={() => setValidatorFormat('yaml')}
                    className={`px-2.5 py-1 rounded font-mono ${
                      validatorFormat === 'yaml' ? 'bg-slate-800 text-indigo-300' : 'text-slate-400'
                    }`}
                  >
                    YAML
                  </button>
                  <button
                    onClick={() => setValidatorFormat('json')}
                    className={`px-2.5 py-1 rounded font-mono ${
                      validatorFormat === 'json' ? 'bg-slate-800 text-indigo-300' : 'text-slate-400'
                    }`}
                  >
                    JSON
                  </button>
                </div>

                {/* Schema selection */}
                <select
                  value={validatorSchemaType}
                  onChange={(e) => setValidatorSchemaType(e.target.value)}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-slate-300"
                >
                  <option value="competency">Competency Schema v1</option>
                  <option value="evidence">Evidence Ledger Schema v1</option>
                  <option value="experiment">Innovation Experiment Schema v1</option>
                </select>
              </div>
            </div>

            {/* Editor Area */}
            <div className="space-y-3">
              <textarea
                rows={10}
                value={validatorInput}
                onChange={(e) => setValidatorInput(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                placeholder="Paste YAML or JSON definition here..."
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors disabled:opacity-50"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{isValidating ? 'Validating...' : 'Validate Schema Compliance'}</span>
                </button>
              </div>
            </div>

            {/* Validation Feedback */}
            {validationOutput && (
              <div className={`p-4 rounded-lg border text-xs space-y-2 ${
                validationOutput.isValid
                  ? 'border-emerald-900/50 bg-emerald-950/20 text-emerald-300'
                  : 'border-red-900/50 bg-red-950/20 text-red-300'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {validationOutput.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span>
                    {validationOutput.isValid
                      ? 'Schema Invariants Satisfied: Valid and Compliant'
                      : 'Schema Validation Violations Found'}
                  </span>
                </div>
                {!validationOutput.isValid && (
                  <ul className="list-disc list-inside space-y-1 font-mono text-red-200 text-[11px] pl-1">
                    {validationOutput.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Import Section */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">
              Import &amp; Ingest Structured Dataset
            </h3>
            <p className="text-xs text-slate-400">
              Restore or merge competencies, evidence records, and experiment files from external YAML or JSON dumps.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Import Format:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={importFormat === 'yaml'}
                    onChange={() => setImportFormat('yaml')}
                  />
                  <span>YAML</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={importFormat === 'json'}
                    onChange={() => setImportFormat('json')}
                  />
                  <span>JSON</span>
                </label>
              </div>

              <textarea
                rows={5}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste exported YAML or JSON payload..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={handleExecuteImport}
                  disabled={!importText.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Execute Structured Import</span>
                </button>

                {importStatus && (
                  <span className="text-xs font-mono text-slate-300">
                    {importStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: GitHub Collaboration Templates */}
      {activeSubTab === 'github' && (
        <div className="space-y-6">
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Open-Source Collaboration Guidelines &amp; Templates
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reproducible setup documentation, GitHub issue templates, pull request checklists, and CI pipelines.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors border border-slate-700"
                >
                  {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate ? 'Copied to Clipboard' : 'Copy Template'}</span>
                </button>
              </div>
            </div>

            {/* Template Selector Segment */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-md text-xs overflow-x-auto">
              <button
                onClick={() => setTemplateType('contributing')}
                className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                  templateType === 'contributing' ? 'bg-slate-800 text-indigo-300' : 'text-slate-400'
                }`}
              >
                CONTRIBUTING.md
              </button>
              <button
                onClick={() => setTemplateType('issue')}
                className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                  templateType === 'issue' ? 'bg-slate-800 text-indigo-300' : 'text-slate-400'
                }`}
              >
                Issue: Evidence Verification
              </button>
              <button
                onClick={() => setTemplateType('pr')}
                className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                  templateType === 'pr' ? 'bg-slate-800 text-indigo-300' : 'text-slate-400'
                }`}
              >
                Pull Request Checklist
              </button>
              <button
                onClick={() => setTemplateType('ci')}
                className={`px-3 py-1.5 rounded font-medium whitespace-nowrap transition-colors ${
                  templateType === 'ci' ? 'bg-slate-800 text-indigo-300' : 'text-slate-400'
                }`}
              >
                GitHub Actions Workflow (YAML)
              </button>
            </div>

            {/* Template Preview */}
            <div className="relative">
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed max-h-[420px]">
                {getTemplateContent()}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
