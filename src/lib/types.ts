export type DisciplineId = 'SP' | 'FS';

export type JumpCode = 'T' | 'S' | 'Lo' | 'F' | 'Lz' | 'A' | 'Eu';
export type JumpTurn = 1 | 2 | 3;
export type Call = 'none' | 'q' | '<' | '<<' | 'e' | '!' | null;
export type GOE = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5;

export type ElementKind = 'jump' | 'spin' | 'step';
export type SpinLevel = 'B' | '1' | '2' | '3' | '4';
export type StepLevel = 'B' | '1' | '2' | '3' | '4';

export interface JumpAtom {
  turn: JumpTurn;
  code: JumpCode;
  call?: Call;
}

export interface JumpElement {
  kind: 'jump';
  atoms: JumpAtom[];
  isSequence?: boolean;
  goe: GOE;
}

export interface SpinElement {
  kind: 'spin';
  code: string;
  level?: SpinLevel;
  goe: GOE;
}

export interface StepElement {
  kind: 'step';
  code: string;
  level?: StepLevel;
  goe: GOE;
}

export type Element = JumpElement | SpinElement | StepElement | null;

export interface Program {
  classId: string;
  discipline: DisciplineId;
  elements: Element[];
}

export interface ClassConfig {
  id: string;
  label: string;
  disciplines: DisciplineConfig[];
}

export interface DisciplineConfig {
  id: DisciplineId;
  maxElements: number;
  limits: {
    jumps: { min: number; max: number };
    spins: { min: number; max: number };
    steps: { min: number; max: number };
  };
  notes?: string;
}

export interface ClassesData {
  classes: ClassConfig[];
}

export interface SOVData {
  version: string;
  source: string;
  jumps: Record<JumpCode, Record<string, number>>;
}

export interface GOETableData {
  jumps: Record<string, number[]>;
  spins: Record<SpinLevel, number[]>;
  steps: Record<StepLevel, number[]>;
}

export interface ScoreResult {
  baseValue: number;
  goeValue: number;
  totalScore: number;
}

export interface ComboRules {
  maxJumpsPerElement: number;
  allowSequence: boolean;
  allowEuler: boolean;
  eulerCode: string;
  eulerConstraints: {
    position: 'any' | 'middleOnly';
    minTurnsBefore: number;
    minTurnsAfter: number;
  };
  maxCombosPerProgram: number | null;
  duplicateRules: {
    enable: boolean;
    perJumpLimits: Record<string, number>;
  };
}

export interface SequenceRules {
  id: string;
  baseMultiplier: number;
  trigger: {
    gesture: string;
  };
}

export interface ComboData {
  combo: ComboRules;
  sequence: SequenceRules;
  callPenalties: Record<string, number>;
}

export interface ComboTemplate {
  label: string;
  atoms: JumpAtom[];
}

export interface TemplatesData {
  combos: ComboTemplate[];
}