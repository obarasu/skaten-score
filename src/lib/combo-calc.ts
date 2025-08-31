import { JumpAtom, JumpElement, ScoreResult, JumpCode } from './types';
import sovData from '@/data/sov_jumps.json';
import comboData from '@/data/jump_combo.json';

export function calculateJumpAtomScore(atom: JumpAtom): number {
  let baseValue = 0;
  let effectiveTurn = atom.turn;
  let effectiveCall = atom.call;
  
  // ダウングレード処理
  if (effectiveCall === '<<' && effectiveTurn > 1) {
    effectiveTurn = Math.max(1, effectiveTurn - 1) as 1 | 2 | 3;
    effectiveCall = null;
  }
  
  // 基礎点取得
  const jumpBase = sovData.jumps[atom.code];
  if (jumpBase) {
    const turnKey = effectiveTurn.toString() as keyof typeof jumpBase;
    if (jumpBase[turnKey]) {
      baseValue = jumpBase[turnKey];
    }
  }
  
  // アンダーローテーション処理
  if (effectiveCall === '<') {
    baseValue = baseValue * 0.8;
  }
  
  return Math.round(baseValue * 100) / 100;
}

export function calculateComboBaseScore(atoms: JumpAtom[], isSequence: boolean = false): number {
  const totalBase = atoms.reduce((sum, atom) => {
    return sum + calculateJumpAtomScore(atom);
  }, 0);
  
  // シーケンス扱いの場合は係数を適用
  if (isSequence) {
    return totalBase * comboData.sequence.baseMultiplier;
  }
  
  return Math.round(totalBase * 100) / 100;
}

export function calculateComboGOE(atoms: JumpAtom[], goeInput: number): number {
  // コール別のGOEペナルティを計算
  let totalPenalty = 0;
  
  atoms.forEach(atom => {
    if (atom.call && atom.call !== 'none') {
      const penalty = comboData.callPenalties[atom.call as keyof typeof comboData.callPenalties];
      if (penalty) {
        totalPenalty += penalty;
      }
    }
  });
  
  // 実効GOEを計算
  const effectiveGOE = Math.max(-5, Math.min(5, goeInput + totalPenalty));
  
  // MVP: 簡易計算式
  const baseValue = calculateComboBaseScore(atoms, false);
  const goeValue = baseValue * effectiveGOE * 0.1;
  
  return Math.round(goeValue * 100) / 100;
}

export function calculateJumpScore(element: JumpElement): ScoreResult {
  const baseValue = calculateComboBaseScore(element.atoms, element.isSequence);
  const goeValue = calculateComboGOE(element.atoms, element.goe);
  const totalScore = Math.round((baseValue + goeValue) * 100) / 100;
  
  return {
    baseValue,
    goeValue,
    totalScore
  };
}

export function formatComboLabel(atoms: JumpAtom[]): string {
  return atoms.map(atom => {
    let label = `${atom.turn}${atom.code}`;
    if (atom.call && atom.call !== 'none') {
      label += atom.call;
    }
    return label;
  }).join('+');
}

export function isValidCombo(atoms: JumpAtom[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // 最大数チェック
  if (atoms.length > comboData.combo.maxJumpsPerElement) {
    errors.push(`コンボジャンプは最大${comboData.combo.maxJumpsPerElement}個まで`);
  }
  
  // Eulerの位置チェック
  if (comboData.combo.allowEuler && comboData.combo.eulerConstraints.position === 'middleOnly') {
    atoms.forEach((atom, index) => {
      if (atom.code === 'Eu') {
        // 最初または最後にEuが来てはいけない
        if (index === 0 || index === atoms.length - 1) {
          errors.push('Eulerジャンプは中間にのみ配置できます');
        }
        
        // Euは1回転固定
        if (atom.turn !== 1) {
          errors.push('Eulerジャンプは1回転のみです');
        }
        
        // Euの前後の回転数チェック
        if (index > 0) {
          const before = atoms[index - 1];
          if (before.turn < comboData.combo.eulerConstraints.minTurnsBefore) {
            errors.push('Eulerの前は最低1回転以上のジャンプが必要');
          }
        }
        
        if (index < atoms.length - 1) {
          const after = atoms[index + 1];
          if (after.turn < comboData.combo.eulerConstraints.minTurnsAfter) {
            errors.push('Eulerの後は最低1回転以上のジャンプが必要');
          }
        }
      }
    });
  }
  
  // 連続Eulerチェック
  for (let i = 0; i < atoms.length - 1; i++) {
    if (atoms[i].code === 'Eu' && atoms[i + 1].code === 'Eu') {
      errors.push('Eulerジャンプを連続で配置することはできません');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}