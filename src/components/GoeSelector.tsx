'use client';

import { GOE } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface GoeSelectorProps {
  value: GOE;
  onChange: (value: GOE) => void;
}

export function GoeSelector({ value, onChange }: GoeSelectorProps) {
  const goeValues: GOE[] = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  
  return (
    <div className="space-y-2">
      <Label>GOE (出来栄え点)</Label>
      <div className="flex flex-wrap gap-1">
        {goeValues.map((goe) => (
          <Button
            key={goe}
            variant={value === goe ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(goe)}
            className={`w-10 h-8 p-0 ${
              goe < 0 ? 'text-red-600' : goe > 0 ? 'text-green-600' : ''
            }`}
          >
            {goe > 0 ? `+${goe}` : goe.toString()}
          </Button>
        ))}
      </div>
    </div>
  );
}