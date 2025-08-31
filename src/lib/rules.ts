import { z } from 'zod';
import classesData from '@/data/classes.json';
import { ClassConfig, DisciplineConfig, DisciplineId, Element, Program } from './types';
import { isValidCombo } from './combo-calc';

export function getClasses(): ClassConfig[] {
  return classesData.classes as ClassConfig[];
}

export function getClassById(classId: string): ClassConfig | undefined {
  return (classesData.classes as ClassConfig[]).find(c => c.id === classId);
}

export function getDisciplineConfig(classId: string, disciplineId: DisciplineId): DisciplineConfig | undefined {
  const classConfig = getClassById(classId);
  return classConfig?.disciplines.find(d => d.id === disciplineId);
}

export function validateProgram(program: Program): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const disciplineConfig = getDisciplineConfig(program.classId, program.discipline);
  
  if (!disciplineConfig) {
    errors.push('Invalid class or discipline');
    return { valid: false, errors };
  }
  
  // 要素数チェック
  const nonNullElements = program.elements.filter(e => e !== null);
  if (nonNullElements.length > disciplineConfig.maxElements) {
    errors.push(`要素数が上限(${disciplineConfig.maxElements})を超えています`);
  }
  
  // 種別ごとの数をカウント
  const counts = {
    jumps: nonNullElements.filter(e => e?.kind === 'jump').length,
    spins: nonNullElements.filter(e => e?.kind === 'spin').length,
    steps: nonNullElements.filter(e => e?.kind === 'step').length
  };
  
  // 各種別の制限チェック
  const limits = disciplineConfig.limits;
  
  if (counts.jumps > limits.jumps.max) {
    errors.push(`ジャンプが多すぎます (最大: ${limits.jumps.max})`);
  }
  
  if (counts.spins > limits.spins.max) {
    errors.push(`スピンが多すぎます (最大: ${limits.spins.max})`);
  }
  
  if (counts.steps > limits.steps.max) {
    errors.push(`ステップが多すぎます (最大: ${limits.steps.max})`);
  }
  
  // コンボジャンプのバリデーション
  nonNullElements.forEach((element, index) => {
    if (element?.kind === 'jump' && element.atoms.length > 1) {
      const comboValidation = isValidCombo(element.atoms);
      if (!comboValidation.valid) {
        comboValidation.errors.forEach(error => {
          errors.push(`要素${index + 1}: ${error}`);
        });
      }
    }
  });
  
  // 最小数チェック（完成したプログラムの場合）
  if (nonNullElements.length === disciplineConfig.maxElements) {
    if (counts.jumps < limits.jumps.min) {
      errors.push(`ジャンプが足りません (最小: ${limits.jumps.min})`);
    }
    
    if (counts.spins < limits.spins.min) {
      errors.push(`スピンが足りません (最小: ${limits.spins.min})`);
    }
    
    if (counts.steps < limits.steps.min) {
      errors.push(`ステップが足りません (最小: ${limits.steps.min})`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

const JumpAtomSchema = z.object({
  turn: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  code: z.enum(['T', 'S', 'Lo', 'F', 'Lz', 'A', 'Eu']),
  call: z.enum(['none', 'q', '<', '<<', 'e', '!']).optional().nullable()
});

export const ProgramSchema = z.object({
  classId: z.string(),
  discipline: z.enum(['SP', 'FS']),
  elements: z.array(z.union([
    z.object({
      kind: z.literal('jump'),
      atoms: z.array(JumpAtomSchema),
      isSequence: z.boolean().optional(),
      goe: z.number().min(-5).max(5)
    }),
    z.object({
      kind: z.literal('spin'),
      code: z.string(),
      level: z.enum(['B', '1', '2', '3', '4']).optional(),
      goe: z.number().min(-5).max(5)
    }),
    z.object({
      kind: z.literal('step'),
      code: z.string(),
      level: z.enum(['B', '1', '2', '3', '4']).optional(),
      goe: z.number().min(-5).max(5)
    }),
    z.null()
  ]))
});