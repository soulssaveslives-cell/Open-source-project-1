export type AssessmentTier = 'Novice' | 'Capable' | 'Advanced' | 'Champion';

export interface SkillForSuccess {
  id: string;
  name: string;
  description: string;
}

export interface RubricRequirements {
  novice: string;
  capable: string;
  advanced: string;
  champion: string;
}

export interface Competency {
  id: string;
  name: string;
  category: string;
  tier: AssessmentTier;
  summary: string;
  skillsMapped: string[];
  rubricRequirements: RubricRequirements;
  verifiedEvidenceCount: number;
  lastAssessed: string;
}

export type EvidenceType = 
  | 'Code & Tests' 
  | 'Source Record & Tests'
  | 'Project Documentation & Benchmark' 
  | 'Security Audit & PR' 
  | 'Documentation & Case Study'
  | 'Failure Postmortem & Learning';

export type VerificationStatus = 'Verified' | 'Pending Review' | 'Flagged';

export interface EvidenceItem {
  id: string;
  competencyId: string;
  title: string;
  type: EvidenceType;
  tierClaimed: AssessmentTier;
  status: VerificationStatus;
  sourceRef: string;
  sha256Hash: string;
  description: string;
  verifiedBy: string;
  verificationDate: string;
  testCoveragePct: number;
  skillsDemonstrated: string[];
}

export type ExperimentOutcome = 'Validated' | 'Failed / Falsified' | 'Inconclusive';

export interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  technicalDomain: string;
  competencyId: string;
  methodology: string;
  outcome: ExperimentOutcome;
  keyLearnings: string;
  pivotAction: string;
  date: string;
  evidenceArtifactId?: string;
  tags: string[];
}

export interface QACheck {
  name: string;
  category: string;
  passed: boolean;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

export interface QAAuditResult {
  success: boolean;
  timestamp: string;
  overallPassed: boolean;
  summary: string;
  checks: QACheck[];
}
