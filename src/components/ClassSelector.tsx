'use client';

import { getClasses } from '@/lib/rules';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ClassSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClassSelector({ value, onChange }: ClassSelectorProps) {
  const classes = getClasses();

  return (
    <div className="space-y-2">
      <Label htmlFor="class-select">大会の級</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="class-select" className="w-full">
          <SelectValue placeholder="級を選択してください" />
        </SelectTrigger>
        <SelectContent>
          {classes.map((cls) => (
            <SelectItem key={cls.id} value={cls.id}>
              {cls.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}