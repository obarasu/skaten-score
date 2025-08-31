'use client';

import { useState } from 'react';
import { JumpElement, JumpAtom, GOE, JumpCode, Call } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GoeSelector } from './GoeSelector';
import { ComboBuilder } from './ComboBuilder';
import { SequenceToggle } from './SequenceToggle';

interface JumpPickerProps {
  value: JumpElement | null;
  onChange: (value: JumpElement) => void;
}

export function JumpPicker({ value, onChange }: JumpPickerProps) {
  const [isCombo, setIsCombo] = useState(value?.atoms?.length > 1 || false);
  
  const defaultJump: JumpElement = {
    kind: 'jump',
    atoms: [{ turn: 1, code: 'T', call: null }],
    goe: 0
  };
  
  const jump = value || defaultJump;
  
  const updateJump = (updates: Partial<JumpElement>) => {
    onChange({ ...jump, ...updates });
  };

  const handleComboToggle = (enabled: boolean) => {
    setIsCombo(enabled);
    if (enabled && jump.atoms.length === 1) {
      // コンボモードに切り替え時、2つ目のジャンプを追加
      updateJump({
        atoms: [...jump.atoms, { turn: 1, code: 'T', call: null }]
      });
    } else if (!enabled && jump.atoms.length > 1) {
      // 単発モードに切り替え時、最初のジャンプのみ残す
      updateJump({
        atoms: [jump.atoms[0]]
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>ジャンプタイプ</Label>
        <div className="flex items-center space-x-2">
          <Label htmlFor="combo-mode" className="text-sm">
            {isCombo ? 'コンボ' : '単発'}
          </Label>
          <Switch
            id="combo-mode"
            checked={isCombo}
            onCheckedChange={handleComboToggle}
          />
        </div>
      </div>

      {isCombo ? (
        <ComboBuilder
          atoms={jump.atoms}
          onChange={(atoms) => updateJump({ atoms })}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>回転数</Label>
              <Select 
                value={jump.atoms[0]?.turn?.toString() || '1'} 
                onValueChange={(v) => {
                  const newAtoms = [...jump.atoms];
                  newAtoms[0] = { ...newAtoms[0], turn: parseInt(v) as 1 | 2 | 3 };
                  updateJump({ atoms: newAtoms });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1回転</SelectItem>
                  <SelectItem value="2">2回転</SelectItem>
                  <SelectItem value="3">3回転</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>ジャンプ種類</Label>
              <Select 
                value={jump.atoms[0]?.code || 'T'} 
                onValueChange={(v) => {
                  const newAtoms = [...jump.atoms];
                  newAtoms[0] = { ...newAtoms[0], code: v as JumpCode };
                  updateJump({ atoms: newAtoms });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T">トゥループ (T)</SelectItem>
                  <SelectItem value="S">サルコウ (S)</SelectItem>
                  <SelectItem value="Lo">ループ (Lo)</SelectItem>
                  <SelectItem value="F">フリップ (F)</SelectItem>
                  <SelectItem value="Lz">ルッツ (Lz)</SelectItem>
                  <SelectItem value="A">アクセル (A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>記号（コール）</Label>
            <Select 
              value={jump.atoms[0]?.call || 'none'} 
              onValueChange={(v) => {
                const newAtoms = [...jump.atoms];
                newAtoms[0] = { ...newAtoms[0], call: v === 'none' ? null : v as Call };
                updateJump({ atoms: newAtoms });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">なし</SelectItem>
                <SelectItem value="q">q (クォーター)</SelectItem>
                <SelectItem value="<">{'<'} (アンダーローテーション)</SelectItem>
                <SelectItem value="<<">{'<<'} (ダウングレード)</SelectItem>
                {(jump.atoms[0]?.code === 'F' || jump.atoms[0]?.code === 'Lz') && (
                  <>
                    <SelectItem value="e">e (エッジエラー)</SelectItem>
                    <SelectItem value="!">! (アテンション)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <SequenceToggle
        element={jump}
        onChange={onChange}
      />
      
      <GoeSelector 
        value={jump.goe} 
        onChange={(goe) => updateJump({ goe })}
      />
    </div>
  );
}