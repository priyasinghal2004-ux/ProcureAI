export type UserRole = 'government' | 'startup' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  department?: string;
  avatar?: string;
  dpiitNumber?: string;
}

export interface KPI {
  id: string;
  title: string;
  description: string;
  unit: string;
  target: number | string;
  baseline: number | string;
  baselineQuestion: string;
  direction: 'higher' | 'lower'; // higher is better vs lower is better
  weight: number; // percentage, sum = 100
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  sector: string;
  location: string;
  requirements: string[];
  budgetMin: number;
  budgetMax: number;
  currency: string;
  kpis: KPI[];
  department: string;
  departmentEmail: string;
  status: 'draft' | 'published' | 'under_evaluation' | 'pilot_awarded' | 'closed';
  createdAt: string;
  applicationDeadline: string;
  pilotDurationMonths: number;
}

export interface KPIClaim {
  kpiId: string;
  kpiTitle: string;
  target?: string | number;
  baseline?: string | number;
  claimedValue: string | number;
  unit: string;
  approach?: string;
  howAchieved?: string;
  testedIn: 'Real World' | 'Lab Environment' | 'Theoretical / Simulation' | 'real_world' | 'lab' | 'theoretical' | string;
  evidenceDocName?: string;
  evidenceSummary?: string;
}

export interface StartupApplication {
  id: string;
  challengeId: string;
  challengeTitle?: string;
  startupId: string;
  startupName: string;
  dpiitNumber: string;
  companyAgeYears: number;
  teamSize: number;
  founderName: string;
  email?: string;
  phone?: string;
  
  solutionTitle: string;
  solutionDescription?: string;
  description?: string;
  technicalApproach: string;
  technologiesUsed: string[];
  
  totalCost?: number;
  costINR?: number;
  costBreakdown?: { item: string; amount: number }[] | string;
  implementationTimelineWeeks?: number;
  timelineWeeks?: number;
  
  pastProjects: string;
  caseStudies: string;
  relevantExperience: string;
  
  kpiClaims: KPIClaim[];
  
  documents?: {
    dpiitCertificate?: string;
    financials?: string;
    caseStudiesDoc?: string;
    technicalEvidence?: string;
  } | string[];
  
  status: 'submitted' | 'evaluated' | 'shortlisted' | 'selected_for_pilot' | 'rejected' | string;
  submittedAt: string;
  evaluation?: Evaluation;
}

export interface KPICredibilityAssessment {
  kpiId: string;
  kpiTitle: string;
  target?: string | number;
  governmentTarget?: string | number;
  claimedValue?: string | number;
  startupClaim?: string | number;
  unit: string;
  evidence?: string;
  evidenceCited?: string;
  assessment: string;
  credibilityScore?: number; // 0 to 100
  score?: number;
  isInconsistent?: boolean;
  inconsistencyFlag?: string;
}

export interface Evaluation {
  id: string;
  applicationId: string;
  challengeId: string;
  overallScore: number; // 0 to 100
  kpiCredibilityScore?: number; // 40% weight
  kpiScore?: number;
  technicalFeasibilityScore?: number; // 20% weight
  technicalScore?: number;
  solutionRelevanceScore?: number; // 20% weight
  relevanceScore?: number;
  costEffectivenessScore?: number; // 10% weight
  costScore?: number;
  teamCapabilityScore?: number; // 10% weight
  teamScore?: number;
  
  strengths: string[]; // exactly 3
  weaknesses: string[]; // exactly 3
  riskFlags: string[];
  recommendation: 'STRONGLY RECOMMENDED' | 'RECOMMENDED' | 'NEEDS REVIEW' | 'NOT RECOMMENDED' | string;
  reasoning?: string;
  summary?: string;
  kpiAnalysis: KPICredibilityAssessment[];
  evaluatedAt: string;
  rank?: number;
}

export interface KPIObservation {
  id: string;
  pilotId: string;
  kpiId: string;
  month: number; // 1, 2, 3...
  submittedByRole: 'government' | 'startup';
  submittedByName: string;
  value: number;
  unit: string;
  evidenceDoc?: string;
  notes: string;
  submittedAt: string;
}

export interface MonthlyKPISummary {
  month: number;
  kpiId: string;
  kpiTitle: string;
  unit: string;
  target: number;
  baseline: number;
  direction: 'higher' | 'lower';
  govValue?: number;
  startupValue?: number;
  agreedValue?: number;
  difference?: number;
  hasConflict: boolean;
  conflictDetails?: string;
  status: 'PENDING_INPUT' | 'TARGET_MET' | 'IN_PROGRESS' | 'DISCREPANCY_DETECTED' | 'BELOW_TARGET';
}

export interface Pilot {
  id: string;
  challengeId: string;
  challengeTitle: string;
  startupId: string;
  startupName: string;
  department: string;
  location: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  currentMonth: number;
  status: 'SETUP' | 'ACTIVE' | 'COMPLETED' | 'PROCURED' | 'REJECTED' | 'EXTENDED';
  lockedKPIs: KPI[];
  milestones: { title: string; month: number; description: string; status: 'completed' | 'in_progress' | 'pending' }[];
  finalReport?: FinalPilotReport;
  procurementDetails?: ProcurementRecord;
}

export interface FinalPilotReport {
  id: string;
  pilotId: string;
  kpisEvaluated: {
    kpiId: string;
    title: string;
    baseline: string | number;
    target: string | number;
    achieved: string | number;
    unit: string;
    percentImprovement: number;
    status: 'EXCEEDED' | 'MET' | 'BELOW TARGET';
    evidenceSummary: string;
  }[];
  kpisMetCount: number;
  totalKpis: number;
  aiRecommendation: string;
  executiveSummary: string;
  generatedAt: string;
  decision?: 'APPROVE_PROCUREMENT' | 'REJECT' | 'EXTEND_PILOT';
  decisionDate?: string;
  decisionNotes?: string;
}

export interface ProcurementRecord {
  id: string;
  pilotId: string;
  challengeId: string;
  startupName: string;
  department: string;
  procurementDate: string;
  certificateId: string;
  contractValue: number;
  status: 'PROCURED';
  scaleUpPlan: {
    phase: string;
    title: string;
    targetCoverage: string;
    timeline: string;
    description: string;
    estimatedBudget: string;
  }[];
}
