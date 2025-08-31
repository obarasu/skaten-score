'use client';

import { StepElement, StepLevel, GOE } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GoeSelector } from './GoeSelector';

interface StepPickerProps {
  value: StepElement | null;
  onChange: (value: StepElement) => void;
}

const stepTypes = [
  { code: 'StSq', label: 'ステップシークエンス' },
  { code: 'ChSq', label: 'コレオグラフィックシークエンス' },
];

export function StepPicker({ value, onChange }: StepPickerProps) {
  const defaultStep: StepElement = {
    kind: 'step',
    code: 'StSq',
    level: 'B',
    goe: 0
  };
  
  const step = value || defaultStep;
  
  const updateStep = (updates: Partial<StepElement>) => {
    onChange({ ...step, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>ステップ種類</Label>
        <Select 
          value={step.code} 
          onValueChange={(v) => updateStep({ code: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stepTypes.map((type) => (
              <SelectItem key={type.code} value={type.code}>
                {type.label} ({type.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {step.code === 'StSq' && (
        <div className="space-y-2">
          <Label>レベル</Label>
          <Select 
            value={step.level || 'B'} 
            onValueChange={(v) => updateStep({ level: v as StepLevel })}
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
      )}
      
      <GoeSelector 
        value={step.goe} 
        onChange={(goe) => updateStep({ goe })}
      />
    </div>
  );
}