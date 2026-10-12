import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import YAML from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const COMPETENCIES_FILE = path.join(DATA_DIR, 'competencies.json');
const EVIDENCE_FILE = path.join(DATA_DIR, 'evidence.json');
const EXPERIMENTS_FILE = path.join(DATA_DIR, 'experiments.json');

// --- Seed Data Definition ---
export const NINE_SKILLS_FOR_SUCCESS = [
  { id: 'adaptability', name: 'Adaptability', description: 'Ability to achieve goals in dynamic environments, respond to feedback, and pivot strategy.' },
  { id: 'collaboration', name: 'Collaboration', description: 'Working effectively with diverse team members, peer review, and shared codebase stewardship.' },
  { id: 'communication', name: 'Communication', description: 'Clear technical documentation, commit messages, architectural RFCs, and code review feedback.' },
  { id: 'creativity-innovation', name: 'Creativity & Innovation', description: 'Formulating hypotheses, pioneering novel architectures, and extracting learnings from failed experiments.' },
  { id: 'digital', name: 'Digital', description: 'Proficiency with modern developer toolchains, CI/CD pipelines, version control, and cloud platforms.' },
  { id: 'problem-solving', name: 'Problem Solving', description: 'Root-cause debugging, algorithmic optimization, threat modeling, and resolving distributed race conditions.' },
  { id: 'reading', name: 'Reading', description: 'Deep comprehension of RFCs, technical specs, security advisories, vulnerability CVEs, and upstream API docs.' },
  { id: 'writing', name: 'Writing', description: 'Authoring clean documentation, READMEs, test specifications, incident postmortems, and issue descriptions.' },
  { id: 'numeracy', name: 'Numeracy', description: 'Quantitative performance profiling, complexity analysis, cryptography verification, and test coverage metrics.' },
];

const INITIAL_COMPETENCIES = [
  {
    id: 'comp-python',
    name: 'Python',
    category: 'Backend & Data Engineering',
    tier: 'Advanced',
    summary: 'Asynchronous event loops, data pipelines, typing with Mypy, and PyTest harness integration.',
    skillsMapped: ['digital', 'problem-solving', 'numeracy', 'adaptability'],
    rubricRequirements: {
      novice: 'Basic scripts, PEP8 conformity, virtualenv setup.',
      capable: 'Type annotations, unit testing with pytest >80%, package builds.',
      advanced: 'Asyncio optimization, concurrency profiling, custom C-extensions or metaclasses.',
      champion: 'Core library maintainer, author of published PyPI package, org-wide architectural guidelines.'
    },
    verifiedEvidenceCount: 5,
    lastAssessed: '2026-03-28'
  },
  {
    id: 'comp-react',
    name: 'React',
    category: 'Frontend Engineering',
    tier: 'Capable',
    summary: 'Modern component lifecycle, custom hooks, state coordination, and server components.',
    skillsMapped: ['digital', 'problem-solving', 'creativity-innovation', 'collaboration', 'communication'],
    rubricRequirements: {
      novice: 'JSX syntax, standard state/effects, single page navigation.',
      capable: 'Custom hooks, memoization strategy, accessibility WCAG AA, testing library tests.',
      advanced: 'Micro-frontend architecture, custom reconciliation, zero-bundle optimization.',
      champion: 'Author of open-source design system, state engine contributor, conference speaker.'
    },
    verifiedEvidenceCount: 4,
    lastAssessed: '2026-03-15'
  },
  {
    id: 'comp-typescript',
    name: 'TypeScript',
    category: 'Type Systems & Compilers',
    tier: 'Advanced',
    summary: 'Strict compiler configuration, conditional types, template literal types, and AST transformations.',
    skillsMapped: ['digital', 'problem-solving', 'reading', 'numeracy'],
    rubricRequirements: {
      novice: 'Basic interfaces, primitives, tsconfig compilation.',
      capable: 'Generics, union discriminating types, strictNullChecks, library d.ts typings.',
      advanced: 'Mapped & conditional types, recursive AST types, custom ESLint/TS compiler plugins.',
      champion: 'Compiler contributor, RFC author for type system evolutions, community educator.'
    },
    verifiedEvidenceCount: 6,
    lastAssessed: '2026-04-02'
  },
  {
    id: 'comp-osint',
    name: 'OSINT (Open Source Intelligence)',
    category: 'Security & Research',
    tier: 'Capable',
    summary: 'Public record synthesis, domain telemetry mapping, certificate transparency analysis, and structured report generation.',
    skillsMapped: ['reading', 'problem-solving', 'digital', 'writing', 'communication'],
    rubricRequirements: {
      novice: 'Search operators, DNS queries, public repository audits.',
      capable: 'Automated footprint collection, SOCMINT workflows, correlation matrices, clean provenance chains.',
      advanced: 'Custom scraping pipelines, maltego/spiderfoot extensions, counter-deception detection.',
      champion: 'Published investigative reports cited by peer research, forensic framework author.'
    },
    verifiedEvidenceCount: 3,
    lastAssessed: '2026-02-19'
  },
  {
    id: 'comp-ai',
    name: 'AI & Machine Learning Engineering',
    category: 'Emerging Technologies',
    tier: 'Champion',
    summary: 'Prompt engineering harnesses, fine-tuning evaluations, vector retrieval systems, and multimodal tool calling.',
    skillsMapped: ['creativity-innovation', 'numeracy', 'problem-solving', 'digital', 'adaptability'],
    rubricRequirements: {
      novice: 'API client calls, basic prompt structure, deterministic temperature tuning.',
      capable: 'RAG architecture, embeddings distance evaluation, automated eval benchmark suites.',
      advanced: 'LoRA fine-tuning, quantized inference hosting, latency budget optimization.',
      champion: 'Novel model architecture or evaluation benchmark published, widespread production impact.'
    },
    verifiedEvidenceCount: 8,
    lastAssessed: '2026-04-10'
  },
  {
    id: 'comp-cybersecurity',
    name: 'Cybersecurity & Threat Modeling',
    tier: 'Advanced',
    category: 'Security & Compliance',
    summary: 'Zero Trust architecture, automated SAST/DAST pipelines, memory safety audits, and container hardening.',
    skillsMapped: ['problem-solving', 'digital', 'reading', 'writing', 'adaptability'],
    rubricRequirements: {
      novice: 'OWASP Top 10 awareness, dependency vulnerability auditing (npm audit, Snyk).',
      capable: 'Threat modeling with STRIDE, cryptographic signature validation, secret scanning CI gates.',
      advanced: 'Zero-day vulnerability reproduction, custom eBPF kernel telemetry, automated fuzzing harnesses.',
      champion: 'Coordinated CVE disclosure, author of security standards or cryptographic protocols.'
    },
    verifiedEvidenceCount: 5,
    lastAssessed: '2026-04-05'
  }
];

const INITIAL_EVIDENCE = [
  {
    id: 'ev-001',
    competencyId: 'comp-typescript',
    title: 'Type-Safe Schema Validator with Zero Runtime Overhead',
    type: 'Code & Tests',
    tierClaimed: 'Advanced',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/core/commit/8f2c39d',
    sha256Hash: 'a7c93e4812f8bc20387b99320eec9a16f6b1580d0d8291079369cb7e72808c14',
    description: 'Engineered a compile-time JSON/YAML schema generator using recursive conditional types that guarantees zero runtime penalty while emitting typed deserializers.',
    verifiedBy: 'Core Architecture Reviewer (ID: 881)',
    verificationDate: '2026-04-02',
    testCoveragePct: 98.4,
    skillsDemonstrated: ['digital', 'problem-solving', 'numeracy']
  },
  {
    id: 'ev-002',
    competencyId: 'comp-ai',
    title: 'Self-Correction Retrieval Benchmark Suite for LLMs',
    type: 'Project Documentation & Benchmark',
    tierClaimed: 'Champion',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/benchmarks/tree/main/rag-eval',
    sha256Hash: 'd35b91b984025a1e2f754ce69929559c5d1fa2782e584f937eec28bc3a67041a',
    description: 'Published an empirical evaluation suite assessing automated hallucinations reduction across 12,000 synthetic technical questions, proving an 89.2% accuracy improvement.',
    verifiedBy: 'Peer Advisory Committee',
    verificationDate: '2026-04-10',
    testCoveragePct: 95.0,
    skillsDemonstrated: ['creativity-innovation', 'numeracy', 'writing', 'problem-solving']
  },
  {
    id: 'ev-003',
    competencyId: 'comp-cybersecurity',
    title: 'Automated Cryptographic Hash Seal for Evidence Ledger',
    type: 'Security Audit & PR',
    tierClaimed: 'Advanced',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/security/pull/42',
    sha256Hash: '5e7f22b91845c48b71d643198a0026e632b7a4891bce47101a0937b83ecff3c8',
    description: 'Designed Merkle-tree chained cryptographic evidence ledger preventing historical tampering of competency verification logs.',
    verifiedBy: 'Lead Security Auditor',
    verificationDate: '2026-04-05',
    testCoveragePct: 100.0,
    skillsDemonstrated: ['problem-solving', 'digital', 'reading']
  },
  {
    id: 'ev-004',
    competencyId: 'comp-react',
    title: 'High-Density Accessible Matrix Component with Keyboard Navigation',
    type: 'Code & Tests',
    tierClaimed: 'Capable',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/ui/commit/c410b2a',
    sha256Hash: '9312ea1bc8324e6ff175d9e564bc7754a10df768f3a3889c3e46c76dbbf91102',
    description: 'Implemented full roving tabindex keyboard navigation and aria-grid compliance across complex 9x6 skill mapping tables.',
    verifiedBy: 'UI Accessibility Guild',
    verificationDate: '2026-03-15',
    testCoveragePct: 92.0,
    skillsDemonstrated: ['digital', 'collaboration', 'problem-solving']
  },
  {
    id: 'ev-005',
    competencyId: 'comp-python',
    title: 'High-Throughput Asynchronous OSINT Harvester Engine',
    type: 'Source Record & Tests',
    tierClaimed: 'Advanced',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/harvester/blob/main/engine.py',
    sha256Hash: '2019baf4101cc7a4e60f089856ef9a7776418c3933c1d936ec88f547145781a9',
    description: 'Engineered an asyncio + uvloop scraper processing 2,500 target records per minute with adaptive backoff rate-limiting.',
    verifiedBy: 'Performance Reviewer',
    verificationDate: '2026-03-28',
    testCoveragePct: 91.5,
    skillsDemonstrated: ['digital', 'numeracy', 'adaptability']
  },
  {
    id: 'ev-006',
    competencyId: 'comp-osint',
    title: 'Cross-Jurisdiction DNS & Certificate Chain Correlation Guide',
    type: 'Documentation & Case Study',
    tierClaimed: 'Capable',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/research-docs/wiki/DNS-Chains',
    sha256Hash: '8b7899653a991f24d9c792f397f2aa25e64811fcf12360bba7216a9a08e622b1',
    description: 'Documented a repeatable, ethical methodology for unraveling cloud infrastructure ownership across 40 disparate autonomous systems.',
    verifiedBy: 'Senior Intelligence Analyst',
    verificationDate: '2026-02-19',
    testCoveragePct: 88.0,
    skillsDemonstrated: ['reading', 'writing', 'problem-solving']
  },
  {
    id: 'ev-007',
    competencyId: 'comp-python',
    title: 'PyTest Integration Suite for Resilient Concurrency',
    type: 'Code & Tests',
    tierClaimed: 'Advanced',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/harvester/pull/18',
    sha256Hash: '34a1bc8f029411d9a5b3ee099182374bbac192aef31828cbdf217a9e10283f91',
    description: 'Developed automated chaos and network failure injection fixtures evaluating graceful thread degradation.',
    verifiedBy: 'Senior QA Architect',
    verificationDate: '2026-04-01',
    testCoveragePct: 96.0,
    skillsDemonstrated: ['problem-solving', 'digital', 'adaptability']
  },
  {
    id: 'ev-008',
    competencyId: 'comp-typescript',
    title: 'Recursive AST Transformer for Schema Invariant Enforcement',
    type: 'Code & Tests',
    tierClaimed: 'Advanced',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/core/commit/51fa0b2',
    sha256Hash: '7c82e1d0339ab315e90218841cf628ea13b019da52148b4382e718ccab019d3f',
    description: 'Wrote custom TypeScript compiler transformer plugin checking promotion gate invariants at compilation time.',
    verifiedBy: 'Compiler WG Member',
    verificationDate: '2026-04-07',
    testCoveragePct: 94.2,
    skillsDemonstrated: ['digital', 'reading', 'problem-solving']
  },
  {
    id: 'ev-009',
    competencyId: 'comp-ai',
    title: 'LoRA Quantized Adapter Evaluation on Edge Hardware',
    type: 'Project Documentation & Benchmark',
    tierClaimed: 'Champion',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/ai-research/pull/88',
    sha256Hash: '1a938fe410dc394200b3419df9419ca882839bce41029ba88f34918274a10df9',
    description: 'Empirical study comparing INT4 vs FP8 inference degradation across reasoning tasks, resulting in 65% latency reduction.',
    verifiedBy: 'AI Systems Advisory Board',
    verificationDate: '2026-04-09',
    testCoveragePct: 93.5,
    skillsDemonstrated: ['creativity-innovation', 'numeracy', 'digital']
  },
  {
    id: 'ev-010',
    competencyId: 'comp-ai',
    title: 'Multi-Agent Consensus Protocol for Code Review Attestations',
    type: 'Code & Tests',
    tierClaimed: 'Champion',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/ai-consensus/commit/e8103df',
    sha256Hash: 'e9420a9bf48218da02919374029410ea8391cb094812ea019481029cbde01928',
    description: 'Engineered an asynchronous multi-agent deliberation harness reducing false-positive rubric rejections by 91%.',
    verifiedBy: 'Steering Committee',
    verificationDate: '2026-04-11',
    testCoveragePct: 97.0,
    skillsDemonstrated: ['creativity-innovation', 'communication', 'problem-solving']
  },
  {
    id: 'ev-011',
    competencyId: 'comp-cybersecurity',
    title: 'Kernel eBPF Telemetry Pipeline for Memory Safety Audits',
    type: 'Security Audit & PR',
    tierClaimed: 'Advanced',
    status: 'Verified',
    sourceRef: 'https://github.com/toolkit/security/commit/19f8a20',
    sha256Hash: '98f10294bc102938a19283740192837401928340192834019283401928340192',
    description: 'Implemented zero-overhead kernel probe monitoring memory allocations and detecting buffer overflows in real time.',
    verifiedBy: 'AppSec Lead',
    verificationDate: '2026-04-06',
    testCoveragePct: 95.8,
    skillsDemonstrated: ['problem-solving', 'digital', 'writing']
  }
];

const INITIAL_EXPERIMENTS = [
  {
    id: 'exp-101',
    title: 'WASM-Based Client-Side Schema Validation vs Node Server Endpoint',
    hypothesis: 'Compiling Rust schema validation to WASM will reduce client validation latency below 5ms for 500KB JSON payloads.',
    technicalDomain: 'TypeScript & WebAssembly',
    competencyId: 'comp-typescript',
    methodology: 'Benchmarked 1,000 iterations against Ajv in V8 vs Wasm binary loaded via Web Worker.',
    outcome: 'Validated',
    keyLearnings: 'WASM execution was 3.4x faster for large documents (>200KB), but serialization boundary overhead made it 1.8x slower for small payloads under 15KB. Hybrid threshold routing is required.',
    pivotAction: 'Implemented a size-aware dispatch: payloads under 30KB run pure JS validator; larger payloads invoke WASM/worker thread.',
    date: '2026-03-22',
    evidenceArtifactId: 'ev-001',
    tags: ['performance', 'wasm', 'validation']
  },
  {
    id: 'exp-102',
    title: 'Zero-Knowledge Cryptographic Proof of Skill Assessment',
    hypothesis: 'zk-SNARK proofs can verify candidate code test pass rates without revealing proprietary test cases or source repository IP.',
    technicalDomain: 'Cybersecurity & Cryptography',
    competencyId: 'comp-cybersecurity',
    methodology: 'Constructed Circom circuits calculating Merkle root verification of test execution trace files.',
    outcome: 'Failed / Falsified',
    keyLearnings: 'Circuit constraint generation exceeded 1.8GB memory on developer workstations, resulting in 45-second proof times for even small test matrices. The proof generation overhead is prohibitive for interactive dashboard workflows.',
    pivotAction: 'Pivoted away from zk-SNARK circuits to HMAC-signed test runner attestations backed by SHA-256 Merkle ledger hashes. Achieved 99.9% tamper resistance with sub-millisecond overhead.',
    date: '2026-04-01',
    evidenceArtifactId: 'ev-003',
    tags: ['cryptography', 'failed-experiment', 'learning-postmortem']
  },
  {
    id: 'exp-103',
    title: 'Dynamic Temperature Decay in Recursive LLM Prompt Evaluator',
    hypothesis: 'Decaying sampling temperature exponentially with each reflection pass reduces catastrophic drift in autonomous code reviews.',
    technicalDomain: 'AI & Machine Learning Engineering',
    competencyId: 'comp-ai',
    methodology: 'Evaluated 400 complex TypeScript pull requests across static temperature (0.2) vs decayed temperature (0.7 -> 0.3 -> 0.05).',
    outcome: 'Validated',
    keyLearnings: 'High initial temperature surfaced novel edge cases in exploratory phases; subsequent frozen low temperature locked in rigorous syntactic and rubric compliance.',
    pivotAction: 'Integrated temperature decay scheduler as standard policy in automated PR rubric evaluator.',
    date: '2026-04-08',
    evidenceArtifactId: 'ev-002',
    tags: ['ai-eval', 'prompt-engineering', 'innovation']
  },
  {
    id: 'exp-104',
    title: 'Automated Dark Web OSINT Onion Scraping over Headless Tor Browser Cluster',
    hypothesis: 'Distributing headless Chromium instances across Tor control ports will achieve 99% uptime for threat intelligence feeds.',
    technicalDomain: 'OSINT & Distributed Systems',
    competencyId: 'comp-osint',
    methodology: 'Deployed a 12-pod Tor proxy cluster with automated circuit recycling every 90 seconds.',
    outcome: 'Failed / Falsified',
    keyLearnings: 'Tor circuit latency spikes caused cascade browser timeouts; circuit recycling triggered CAPTCHA and Cloudflare Onion guards on 82% of monitored nodes.',
    pivotAction: 'Abandoned headless browser rendering for dark web feeds. Switched to minimal curl/socks5 raw text extractors with persistent rendezvous circuits and manual operator escalation.',
    date: '2026-03-10',
    evidenceArtifactId: 'ev-006',
    tags: ['osint', 'postmortem', 'architecture-pivot']
  }
];

// Helper functions for loading and saving data
function loadData<T>(file: string, fallback: T): T {
  try {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
  }
  saveData(file, fallback);
  return fallback;
}

function saveData<T>(file: string, data: T): void {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving ${file}:`, err);
  }
}

// Compute SHA256
function computeHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Initialize files if not existing
let competencies = loadData(COMPETENCIES_FILE, INITIAL_COMPETENCIES);
let evidenceLedger = loadData(EVIDENCE_FILE, INITIAL_EVIDENCE);
let experiments = loadData(EXPERIMENTS_FILE, INITIAL_EXPERIMENTS);

// --- REST API Endpoints ---

// Competencies
app.get('/api/competencies', (_req: Request, res: Response) => {
  competencies = loadData(COMPETENCIES_FILE, INITIAL_COMPETENCIES);
  res.json({ success: true, data: competencies, skillsForSuccess: NINE_SKILLS_FOR_SUCCESS });
});

app.post('/api/competencies', (req: Request, res: Response) => {
  const { name, category, tier, summary, skillsMapped, rubricRequirements } = req.body;
  if (!name || !tier) {
    return res.status(400).json({ success: false, error: 'Name and Tier are required.' });
  }
  const newComp = {
    id: `comp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name,
    category: category || 'General Technical',
    tier: tier || 'Novice',
    summary: summary || '',
    skillsMapped: Array.isArray(skillsMapped) ? skillsMapped : ['digital'],
    rubricRequirements: rubricRequirements || {
      novice: 'Foundational syntax and reproducible code sample.',
      capable: 'Documented unit tests and peer-reviewed pull request.',
      advanced: 'Multi-system architecture and optimization.',
      champion: 'Novel contribution, open-source maintainer, published standard.'
    },
    verifiedEvidenceCount: 0,
    lastAssessed: new Date().toISOString().split('T')[0]
  };
  competencies.push(newComp);
  saveData(COMPETENCIES_FILE, competencies);
  res.status(201).json({ success: true, data: newComp });
});

app.put('/api/competencies/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = competencies.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Competency not found' });
  }
  competencies[index] = {
    ...competencies[index],
    ...req.body,
    id, // preserve id
    lastAssessed: new Date().toISOString().split('T')[0]
  };
  saveData(COMPETENCIES_FILE, competencies);
  res.json({ success: true, data: competencies[index] });
});

app.delete('/api/competencies/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  competencies = competencies.filter(c => c.id !== id);
  saveData(COMPETENCIES_FILE, competencies);
  res.json({ success: true });
});

// Evidence Ledger
app.get('/api/evidence', (_req: Request, res: Response) => {
  evidenceLedger = loadData(EVIDENCE_FILE, INITIAL_EVIDENCE);
  res.json({ success: true, data: evidenceLedger });
});

app.post('/api/evidence', (req: Request, res: Response) => {
  const {
    competencyId,
    title,
    type,
    tierClaimed,
    sourceRef,
    description,
    verifiedBy,
    testCoveragePct,
    skillsDemonstrated,
    status
  } = req.body;

  if (!competencyId || !title || !tierClaimed) {
    return res.status(400).json({ success: false, error: 'competencyId, title, and tierClaimed are required.' });
  }

  const generatedHash = computeHash(`${title}-${competencyId}-${Date.now()}-${description || ''}`);

  const newEvidence = {
    id: `ev-${Date.now().toString().slice(-4)}`,
    competencyId,
    title,
    type: type || 'Code & Tests',
    tierClaimed: tierClaimed || 'Novice',
    status: status || 'Verified',
    sourceRef: sourceRef || 'https://github.com/toolkit/evidence',
    sha256Hash: generatedHash,
    description: description || '',
    verifiedBy: verifiedBy || 'Automated Ledger Validator',
    verificationDate: new Date().toISOString().split('T')[0],
    testCoveragePct: typeof testCoveragePct === 'number' ? testCoveragePct : 90.0,
    skillsDemonstrated: Array.isArray(skillsDemonstrated) ? skillsDemonstrated : ['digital', 'problem-solving']
  };

  evidenceLedger.unshift(newEvidence);
  saveData(EVIDENCE_FILE, evidenceLedger);

  // Update competency count
  const comp = competencies.find(c => c.id === competencyId);
  if (comp) {
    comp.verifiedEvidenceCount = evidenceLedger.filter(e => e.competencyId === competencyId && e.status === 'Verified').length;
    saveData(COMPETENCIES_FILE, competencies);
  }

  res.status(201).json({ success: true, data: newEvidence });
});

app.put('/api/evidence/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = evidenceLedger.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Evidence item not found' });
  }
  evidenceLedger[index] = {
    ...evidenceLedger[index],
    ...req.body,
    id
  };
  saveData(EVIDENCE_FILE, evidenceLedger);
  res.json({ success: true, data: evidenceLedger[index] });
});

app.delete('/api/evidence/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  evidenceLedger = evidenceLedger.filter(e => e.id !== id);
  saveData(EVIDENCE_FILE, evidenceLedger);
  res.json({ success: true });
});

// Experiments / Innovation Tracker
app.get('/api/experiments', (_req: Request, res: Response) => {
  experiments = loadData(EXPERIMENTS_FILE, INITIAL_EXPERIMENTS);
  res.json({ success: true, data: experiments });
});

app.post('/api/experiments', (req: Request, res: Response) => {
  const {
    title,
    hypothesis,
    technicalDomain,
    competencyId,
    methodology,
    outcome,
    keyLearnings,
    pivotAction,
    tags
  } = req.body;

  if (!title || !hypothesis) {
    return res.status(400).json({ success: false, error: 'Title and Hypothesis are required.' });
  }

  const newExp = {
    id: `exp-${Date.now().toString().slice(-4)}`,
    title,
    hypothesis,
    technicalDomain: technicalDomain || 'General Systems',
    competencyId: competencyId || 'comp-typescript',
    methodology: methodology || 'Iterative benchmark run.',
    outcome: outcome || 'Failed / Falsified',
    keyLearnings: keyLearnings || 'Identified latency/resource bottleneck.',
    pivotAction: pivotAction || 'Re-architected pipeline.',
    date: new Date().toISOString().split('T')[0],
    evidenceArtifactId: req.body.evidenceArtifactId || '',
    tags: Array.isArray(tags) ? tags : ['experiment']
  };

  experiments.unshift(newExp);
  saveData(EXPERIMENTS_FILE, experiments);
  res.status(201).json({ success: true, data: newExp });
});

app.delete('/api/experiments/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  experiments = experiments.filter(e => e.id !== id);
  saveData(EXPERIMENTS_FILE, experiments);
  res.json({ success: true });
});

// QA Automated Test Suite & Audit
app.post('/api/run-qa-audit', (_req: Request, res: Response) => {
  const checks: Array<{
    name: string;
    category: string;
    passed: boolean;
    details: string;
    severity: 'low' | 'medium' | 'high';
  }> = [];

  // Check 1: 9 Skills for Success coverage
  const coveredSkills = new Set<string>();
  competencies.forEach(c => {
    c.skillsMapped.forEach(s => coveredSkills.add(s));
  });
  const missingSkills = NINE_SKILLS_FOR_SUCCESS.filter(s => !coveredSkills.has(s.id));
  checks.push({
    name: 'Nine Skills for Success Mapping Coverage',
    category: 'Framework Alignment',
    passed: missingSkills.length === 0,
    details: missingSkills.length === 0
      ? `All 9 Skills for Success are mapped across active technical competencies (${coveredSkills.size}/9).`
      : `Missing coverage for ${missingSkills.map(s => s.name).join(', ')}.`,
    severity: 'high'
  });

  // Check 2: Evidence Integrity & SHA-256 Hashes
  let invalidHashes = 0;
  evidenceLedger.forEach(ev => {
    if (!ev.sha256Hash || ev.sha256Hash.length !== 64 || !/^[a-f0-9]+$/i.test(ev.sha256Hash)) {
      invalidHashes++;
    }
  });
  checks.push({
    name: 'Cryptographic SHA-256 Evidence Seal Integrity',
    category: 'Ledger Immutability',
    passed: invalidHashes === 0,
    details: invalidHashes === 0
      ? `All ${evidenceLedger.length} evidence artifacts possess valid 256-bit cryptographic digest seals.`
      : `Detected ${invalidHashes} artifacts with corrupted or missing cryptographic hashes.`,
    severity: 'high'
  });

  // Check 3: Four-Tier Gating Verification
  let tierViolations = 0;
  competencies.forEach(c => {
    const evForComp = evidenceLedger.filter(e => e.competencyId === c.id && e.status === 'Verified');
    if (c.tier === 'Champion' && evForComp.length < 3) tierViolations++;
    if (c.tier === 'Advanced' && evForComp.length < 2) tierViolations++;
  });
  checks.push({
    name: 'Four-Tier Promotion Gate Invariants',
    category: 'Assessment Rigor',
    passed: tierViolations === 0,
    details: tierViolations === 0
      ? `All Advanced and Champion designations satisfy the minimum verified evidence threshold.`
      : `${tierViolations} competencies lack the minimum verified ledger entries required for their claimed tier.`,
    severity: 'medium'
  });

  // Check 4: Failed Experiments Learning Extraction Ratio
  const failedOrPivoted = experiments.filter(e => e.outcome.toLowerCase().includes('fail') || e.pivotAction);
  const withoutKeyLearnings = failedOrPivoted.filter(e => !e.keyLearnings || e.keyLearnings.length < 15);
  checks.push({
    name: 'Experiment Postmortem Rigor (Anti-Fragility Check)',
    category: 'Innovation Governance',
    passed: withoutKeyLearnings.length === 0,
    details: withoutKeyLearnings.length === 0
      ? `100% of failed/falsified experiments (${failedOrPivoted.length}) document actionable key learnings and pivot vectors.`
      : `${withoutKeyLearnings.length} failed experiments lack thorough learning postmortems.`,
    severity: 'medium'
  });

  // Check 5: Test Coverage Threshold
  const avgCoverage = evidenceLedger.length > 0
    ? evidenceLedger.reduce((acc, curr) => acc + (curr.testCoveragePct || 0), 0) / evidenceLedger.length
    : 0;
  checks.push({
    name: 'Empirical Test Coverage Threshold (>85%)',
    category: 'Quality Assurance',
    passed: avgCoverage >= 85.0,
    details: `Mean automated test coverage across evidence artifacts is ${avgCoverage.toFixed(1)}% (Threshold: 85.0%).`,
    severity: 'low'
  });

  const passedCount = checks.filter(c => c.passed).length;
  const overallPassed = passedCount === checks.length;

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    overallPassed,
    summary: `${passedCount} of ${checks.length} automated quality checks passed.`,
    checks
  });
});

// Schema Validation (JSON or YAML)
app.post('/api/validate-schema', (req: Request, res: Response) => {
  const { content, format, schemaType } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, error: 'Content is required.' });
  }

  let parsed: any;
  try {
    if (format === 'yaml') {
      parsed = YAML.parse(content);
    } else {
      parsed = JSON.parse(content);
    }
  } catch (err: any) {
    return res.json({
      success: false,
      isValid: false,
      errors: [`Syntax parse error in ${format.toUpperCase()}: ${err.message}`]
    });
  }

  const errors: string[] = [];
  if (schemaType === 'competency') {
    if (!parsed.name) errors.push("Missing required field 'name' (string)");
    if (!parsed.tier || !['Novice', 'Capable', 'Advanced', 'Champion'].includes(parsed.tier)) {
      errors.push("Field 'tier' must be one of: 'Novice', 'Capable', 'Advanced', 'Champion'");
    }
    if (!parsed.skillsMapped || !Array.isArray(parsed.skillsMapped) || parsed.skillsMapped.length === 0) {
      errors.push("Field 'skillsMapped' must be a non-empty array of Skills for Success IDs");
    }
  } else if (schemaType === 'evidence') {
    if (!parsed.title) errors.push("Missing required field 'title' (string)");
    if (!parsed.competencyId) errors.push("Missing required field 'competencyId' (string)");
    if (!parsed.tierClaimed) errors.push("Missing required field 'tierClaimed' (string)");
  } else if (schemaType === 'experiment') {
    if (!parsed.title) errors.push("Missing required field 'title' (string)");
    if (!parsed.hypothesis) errors.push("Missing required field 'hypothesis' (string)");
    if (!parsed.keyLearnings) errors.push("Missing required field 'keyLearnings' (string postmortem)");
  }

  res.json({
    success: true,
    isValid: errors.length === 0,
    errors,
    parsedObject: errors.length === 0 ? parsed : null
  });
});

// Full Export (YAML or JSON)
app.get('/api/export/:format', (req: Request, res: Response) => {
  const { format } = req.params;
  const payload = {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    framework: 'Open-Source Competency & Innovation Toolkit',
    nineSkillsForSuccess: NINE_SKILLS_FOR_SUCCESS,
    competencies,
    evidenceLedger,
    experiments
  };

  if (format === 'yaml') {
    res.setHeader('Content-Type', 'text/yaml');
    res.setHeader('Content-Disposition', 'attachment; filename="competency-toolkit.yaml"');
    return res.send(YAML.stringify(payload));
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="competency-toolkit.json"');
    return res.json(payload);
  }
});

// Full Import (YAML or JSON)
app.post('/api/import', (req: Request, res: Response) => {
  const { rawText, format } = req.body;
  if (!rawText) {
    return res.status(400).json({ success: false, error: 'Raw text is required for import.' });
  }

  let data: any;
  try {
    if (format === 'yaml') {
      data = YAML.parse(rawText);
    } else {
      data = JSON.parse(rawText);
    }
  } catch (err: any) {
    return res.status(400).json({ success: false, error: `Invalid ${format.toUpperCase()}: ${err.message}` });
  }

  if (Array.isArray(data.competencies)) {
    competencies = data.competencies;
    saveData(COMPETENCIES_FILE, competencies);
  }
  if (Array.isArray(data.evidenceLedger)) {
    evidenceLedger = data.evidenceLedger;
    saveData(EVIDENCE_FILE, evidenceLedger);
  }
  if (Array.isArray(data.experiments)) {
    experiments = data.experiments;
    saveData(EXPERIMENTS_FILE, experiments);
  }

  res.json({
    success: true,
    importedCounts: {
      competencies: competencies.length,
      evidence: evidenceLedger.length,
      experiments: experiments.length
    }
  });
});

// Reset Data to baseline
app.post('/api/reset-data', (_req: Request, res: Response) => {
  competencies = [...INITIAL_COMPETENCIES];
  evidenceLedger = [...INITIAL_EVIDENCE];
  experiments = [...INITIAL_EXPERIMENTS];
  saveData(COMPETENCIES_FILE, competencies);
  saveData(EVIDENCE_FILE, evidenceLedger);
  saveData(EXPERIMENTS_FILE, experiments);
  res.json({ success: true, message: 'Toolkit database reset to baseline verified state.' });
});

// Development vs Production serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Open-Source Competency & Innovation Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
