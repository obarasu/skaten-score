'use client';

import { Element } from '@/lib/types';
import { calculateTotalScore, calculateElementScore } from '@/lib/calc';
import { formatComboLabel } from '@/lib/combo-calc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ScoreSummaryProps {
  elements: Element[];
  classLabel: string;
  disciplineId: string;
  validationErrors: string[];
}

export function ScoreSummary({ elements, classLabel, disciplineId, validationErrors }: ScoreSummaryProps) {
  const totalScore = calculateTotalScore(elements);
  const nonNullElements = elements.filter(e => e !== null);
  
  const elementCounts = {
    jumps: nonNullElements.filter(e => e?.kind === 'jump').length,
    spins: nonNullElements.filter(e => e?.kind === 'spin').length,
    steps: nonNullElements.filter(e => e?.kind === 'step').length,
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>スコアサマリー</CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge>{classLabel}</Badge>
          <Badge variant="secondary">
            {disciplineId === 'SP' ? 'ショートプログラム' : 'フリースケーティング'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">要素構成</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>ジャンプ</span>
              <span className="font-medium">{elementCounts.jumps}</span>
            </div>
            <div className="flex justify-between">
              <span>スピン</span>
              <span className="font-medium">{elementCounts.spins}</span>
            </div>
            <div className="flex justify-between">
              <span>ステップ</span>
              <span className="font-medium">{elementCounts.steps}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium text-muted-foreground">技術点 (TES)</span>
            <span className="text-3xl font-bold">{totalScore.toFixed(2)}</span>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-red-600 mb-2">注意事項</h3>
            <ul className="space-y-1">
              {validationErrors.map((error, i) => (
                <li key={i} className="text-sm text-red-600">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">要素詳細</h3>
          {nonNullElements.map((element, i) => {
            const score = calculateElementScore(element);
            if (!score) return null;
            
            let label = '';
            if (element?.kind === 'jump') {
              label = formatComboLabel(element.atoms);
              if (element.isSequence) {
                label += ' (SEQ)';
              }
            } else if (element?.kind === 'spin') {
              label = `${element.code}${element.level || ''}`;
            } else if (element?.kind === 'step') {
              label = `${element.code}${element.level || ''}`;
            }
            
            return (
              <div key={i} className="flex justify-between text-sm">
                <span className="font-mono">{label}</span>
                <span className="font-medium">{score.totalScore.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}