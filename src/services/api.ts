import { Competency, EvidenceItem, Experiment, QAAuditResult, SkillForSuccess } from '../types';

export async function fetchCompetencies(): Promise<{ data: Competency[]; skillsForSuccess: SkillForSuccess[] }> {
  const res = await fetch('/api/competencies');
  if (!res.ok) throw new Error('Failed to load competencies');
  return res.json();
}

export async function saveCompetency(comp: Partial<Competency>): Promise<Competency> {
  const res = await fetch('/api/competencies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comp),
  });
  if (!res.ok) throw new Error('Failed to create competency');
  const json = await res.json();
  return json.data;
}

export async function updateCompetency(id: string, comp: Partial<Competency>): Promise<Competency> {
  const res = await fetch(`/api/competencies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comp),
  });
  if (!res.ok) throw new Error('Failed to update competency');
  const json = await res.json();
  return json.data;
}

export async function deleteCompetency(id: string): Promise<void> {
  const res = await fetch(`/api/competencies/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete competency');
}

export async function fetchEvidence(): Promise<EvidenceItem[]> {
  const res = await fetch('/api/evidence');
  if (!res.ok) throw new Error('Failed to load evidence ledger');
  const json = await res.json();
  return json.data;
}

export async function saveEvidence(item: Partial<EvidenceItem>): Promise<EvidenceItem> {
  const res = await fetch('/api/evidence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to create evidence record');
  const json = await res.json();
  return json.data;
}

export async function deleteEvidence(id: string): Promise<void> {
  const res = await fetch(`/api/evidence/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete evidence record');
}

export async function fetchExperiments(): Promise<Experiment[]> {
  const res = await fetch('/api/experiments');
  if (!res.ok) throw new Error('Failed to load experiments');
  const json = await res.json();
  return json.data;
}

export async function saveExperiment(exp: Partial<Experiment>): Promise<Experiment> {
  const res = await fetch('/api/experiments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exp),
  });
  if (!res.ok) throw new Error('Failed to log experiment');
  const json = await res.json();
  return json.data;
}

export async function deleteExperiment(id: string): Promise<void> {
  const res = await fetch(`/api/experiments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete experiment');
}

export async function runQAAudit(): Promise<QAAuditResult> {
  const res = await fetch('/api/run-qa-audit', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to run QA audit');
  return res.json();
}

export async function validateSchema(content: string, format: 'json' | 'yaml', schemaType: string): Promise<{
  isValid: boolean;
  errors: string[];
  parsedObject: any;
}> {
  const res = await fetch('/api/validate-schema', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, format, schemaType }),
  });
  if (!res.ok) throw new Error('Validation request failed');
  return res.json();
}

export async function importData(rawText: string, format: 'json' | 'yaml'): Promise<any> {
  const res = await fetch('/api/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText, format }),
  });
  if (!res.ok) {
    const errorJson = await res.json();
    throw new Error(errorJson.error || 'Failed to import data');
  }
  return res.json();
}

export async function resetToBaseline(): Promise<void> {
  const res = await fetch('/api/reset-data', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset dataset');
}
