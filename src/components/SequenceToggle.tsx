'use client';

import { JumpElement } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

interface SequenceToggleProps {
  element: JumpElement;
  onChange: (element: JumpElement) => void;
}

export function SequenceToggle({ element, onChange }: SequenceToggleProps) {
  const handleToggle = (isSequence: boolean) => {
    onChange({
      ...element,
      isSequence
    });
  };

  // コンボジャンプの場合のみ表示
  if (element.atoms.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
      <div className="flex items-center gap-2">
        <Label htmlFor="sequence-toggle" className="text-sm font-medium">
          シーケンス扱い
        </Label>
        <div className="group relative">
          <Info className="h-4 w-4 text-gray-400 cursor-help" />
          <div className="absolute left-0 top-6 hidden group-hover:block z-10">
            <div className="bg-black text-white text-xs rounded p-2 max-w-xs">
              シーケンス扱いにすると基礎点が80%になります
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {element.isSequence && (
          <Badge variant="secondary" className="text-xs">
            基礎点 × 0.8
          </Badge>
        )}
        <Switch
          id="sequence-toggle"
          checked={element.isSequence || false}
          onCheckedChange={handleToggle}
        />
      </div>
    </div>
  );
}