import { Element, JumpElement, SpinElement, StepElement, ScoreResult } from './types';
import { calculateJumpScore as calculateComboJumpScore } from './combo-calc';
import goeTable from '@/data/goe_table.json';

export function calculateJumpScore(element: JumpElement): ScoreResult {
  // 新しいコンボ対応の計算を使用
  return calculateComboJumpScore(element);
}

export function calculateSpinScore(element: SpinElement): ScoreResult {
  // 仮実装（将来的に詳細なSOVテーブルを追加）
  const baseValues: Record<string, number> = {
    'USp': 0.5,
    'SSp': 1.1,
    'CSp': 1.4,
    'LSp': 1.5,
    'FSSp': 1.7,
    'CSSp': 1.9,
    'CoSp': 1.7,
    'FCSp': 1.9,
    'CCoSp': 2.0,
    'FCCoSp': 2.5
  };
  
  const levelBonus: Record<string, number> = {
    'B': 0,
    '1': 0.5,
    '2': 1.1,
    '3': 1.8,
    '4': 2.4
  };
  
  const baseCode = element.code.replace(/[B1234]/, '');
  const baseValue = (baseValues[baseCode] || 1.0) + (levelBonus[element.level || 'B'] || 0);
  
  const goeValues = goeTable.spins[element.level || 'B'];
  const goeIndex = element.goe + 5;
  const goeValue = goeValues ? (goeValues[goeIndex] || 0) : 0;
  
  const totalScore = Math.round((baseValue + goeValue) * 100) / 100;
  
  return {
    baseValue: Math.round(baseValue * 100) / 100,
    goeValue: Math.round(goeValue * 100) / 100,
    totalScore
  };
}

export function calculateStepScore(element: StepElement): ScoreResult {
  // 仮実装
  const baseValues: Record<string, number> = {
    'StSqB': 1.5,
    'StSq1': 1.8,
    'StSq2': 2.6,
    'StSq3': 3.3,
    'StSq4': 3.9,
    'ChSq1': 3.0
  };
  
  const elementKey = element.code + (element.level || '');
  const baseValue = baseValues[elementKey] || 1.5;
  
  const goeValues = goeTable.steps[element.level || 'B'];
  const goeIndex = element.goe + 5;
  const goeValue = goeValues ? (goeValues[goeIndex] || 0) : 0;
  
  const totalScore = Math.round((baseValue + goeValue) * 100) / 100;
  
  return {
    baseValue: Math.round(baseValue * 100) / 100,
    goeValue: Math.round(goeValue * 100) / 100,
    totalScore
  };
}

export function calculateElementScore(element: Element): ScoreResult | null {
  if (!element) return null;
  
  switch (element.kind) {
    case 'jump':
      return calculateJumpScore(element);
    case 'spin':
      return calculateSpinScore(element);
    case 'step':
      return calculateStepScore(element);
    default:
      return null;
  }
}

export function calculateTotalScore(elements: Element[]): number {
  return elements.reduce((total, element) => {
    const score = calculateElementScore(element);
    return total + (score?.totalScore || 0);
  }, 0);
}