'use client';

import { SpinElement, SpinLevel, GOE } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GoeSelector } from './GoeSelector';

interface SpinPickerProps {
  value: SpinElement | null;
  onChange: (value: SpinElement) => void;
}

const spinTypes = [
  { code: 'USp', label: 'アップライトスピン' },
  { code: 'SSp', label: 'シットスピン' },
  { code: 'CSp', label: 'キャメルスピン' },
  { code: 'LSp', label: 'レイバックスピン' },
  { code: 'FSSp', label: 'フライングシットスピン' },
  { code: 'CSSp', label: 'チェンジシットスピン' },
  { code: 'CoSp', label: 'コンビネーションスピン' },
  { code: 'FCSp', label: 'フライングキャメルスピン' },
  { code: 'CCoSp', label: 'チェンジコンビネーションスピン' },
  { code: 'FCCoSp', label: 'フライングチェンジコンビネーションスピン' },
];

export function SpinPicker({ value, onChange }: SpinPickerProps) {
  const defaultSpin: SpinElement = {
    kind: 'spin',
    code: 'USp',
    level: 'B',
    goe: 0
  };
  
  const spin = value || defaultSpin;
  
  const updateSpin = (updates: Partial<SpinElement>) => {
    onChange({ ...spin, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>スピン種類</Label>
        <Select 
          value={spin.code} 
          onValueChange={(v) => updateSpin({ code: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {spinTypes.map((type) => (
              <SelectItem key={type.code} value={type.code}>
                {type.label} ({type.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>レベル</Label>
        <Select 
          value={spin.level || 'B'} 
          onValueChange={(v) => updateSpin({ level: v as SpinLevel })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="B">ベーシック (B)</SelectItem>
            <SelectItem value="1">レベル 1</SelectItem>
            <SelectItem value="2">レベル 2</SelectItem>
            <SelectItem value="3">レベル 3</SelectItem>
            <SelectItem value="4">レベル 4</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <GoeSelector 
        value={spin.goe} 
        onChange={(goe) => updateSpin({ goe })}
      />
    </div>
  );
}