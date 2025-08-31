'use client';

import { DisciplineId } from '@/lib/types';
import { getClassById } from '@/lib/rules';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DisciplineSelectorProps {
  classId: string;
  value: DisciplineId;
  onChange: (value: DisciplineId) => void;
}

export function DisciplineSelector({ classId, value, onChange }: DisciplineSelectorProps) {
  const classConfig = getClassById(classId);
  
  if (!classConfig || classConfig.disciplines.length === 1) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="discipline-select">種目</Label>
      <Select value={value} onValueChange={(v) => onChange(v as DisciplineId)}>
        <SelectTrigger id="discipline-select" className="w-full">
          <SelectValue placeholder="種目を選択してください" />
        </SelectTrigger>
        <SelectContent>
          {classConfig.disciplines.map((disc) => (
            <SelectItem key={disc.id} value={disc.id}>
              {disc.id === 'SP' ? 'ショートプログラム' : 'フリースケーティング'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}