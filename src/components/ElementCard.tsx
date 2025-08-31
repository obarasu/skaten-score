'use client';

import { Element, ElementKind } from '@/lib/types';
import { calculateElementScore } from '@/lib/calc';
import { formatComboLabel } from '@/lib/combo-calc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JumpPicker } from './JumpPicker';
import { SpinPicker } from './SpinPicker';
import { StepPicker } from './StepPicker';
import { X } from 'lucide-react';

interface ElementCardProps {
  index: number;
  element: Element;
  onChange: (element: Element) => void;
  onClear: () => void;
}

export function ElementCard({ index, element, onChange, onClear }: ElementCardProps) {
  const score = calculateElementScore(element);
  
  const handleKindChange = (kind: ElementKind) => {
    if (kind === 'jump') {
      onChange({ kind: 'jump', atoms: [{ turn: 1, code: 'T', call: null }], goe: 0 });
    } else if (kind === 'spin') {
      onChange({ kind: 'spin', code: 'USp', level: 'B', goe: 0 });
    } else if (kind === 'step') {
      onChange({ kind: 'step', code: 'StSq', level: 'B', goe: 0 });
    }
  };

  const getElementLabel = () => {
    if (!element) return '未入力';
    
    if (element.kind === 'jump') {
      let label = formatComboLabel(element.atoms);
      if (element.isSequence) {
        label += ' (SEQ)';
      }
      return label;
    } else if (element.kind === 'spin') {
      return `${element.code}${element.level || ''}`;
    } else if (element.kind === 'step') {
      return `${element.code}${element.level || ''}`;
    }
    
    return '';
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            要素 {index + 1}
          </CardTitle>
          {element && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{getElementLabel()}</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!element ? (
          <div className="space-y-2">
            <Label>要素種別</Label>
            <Select onValueChange={handleKindChange}>
              <SelectTrigger>
                <SelectValue placeholder="要素を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jump">ジャンプ</SelectItem>
                <SelectItem value="spin">スピン</SelectItem>
                <SelectItem value="step">ステップ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <>
            {element.kind === 'jump' && (
              <JumpPicker value={element} onChange={onChange} />
            )}
            {element.kind === 'spin' && (
              <SpinPicker value={element} onChange={onChange} />
            )}
            {element.kind === 'step' && (
              <StepPicker value={element} onChange={onChange} />
            )}
            
            {score && (
              <div className="pt-3 border-t">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">基礎点</span>
                    <p className="font-semibold">{score.baseValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">GOE</span>
                    <p className={`font-semibold ${
                      score.goeValue > 0 ? 'text-green-600' : 
                      score.goeValue < 0 ? 'text-red-600' : ''
                    }`}>
                      {score.goeValue > 0 ? '+' : ''}{score.goeValue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">合計</span>
                    <p className="font-bold text-lg">{score.totalScore.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}