'use client';

import { useState } from 'react';
import { JumpAtom, JumpCode, JumpTurn, Call, ComboTemplate } from '@/lib/types';
import { formatComboLabel, isValidCombo, calculateJumpAtomScore } from '@/lib/combo-calc';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, X, Edit3, AlertTriangle } from 'lucide-react';
import templatesData from '@/data/templates.json';

interface ComboBuilderProps {
  atoms: JumpAtom[];
  onChange: (atoms: JumpAtom[]) => void;
  maxJumps?: number;
}

export function ComboBuilder({ atoms, onChange, maxJumps = 3 }: ComboBuilderProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingAtom, setEditingAtom] = useState<JumpAtom | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const validation = isValidCombo(atoms);
  const templates = templatesData.combos as ComboTemplate[];

  const addJump = () => {
    if (atoms.length < maxJumps) {
      onChange([...atoms, { turn: 1, code: 'T', call: null }]);
    }
  };

  const removeJump = (index: number) => {
    onChange(atoms.filter((_, i) => i !== index));
  };

  const editJump = (index: number) => {
    setEditingIndex(index);
    setEditingAtom({ ...atoms[index] });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingAtom) {
      const newAtoms = [...atoms];
      newAtoms[editingIndex] = editingAtom;
      onChange(newAtoms);
      setEditingIndex(null);
      setEditingAtom(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingAtom(null);
  };

  const moveJump = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= atoms.length) return;
    const newAtoms = [...atoms];
    const [moved] = newAtoms.splice(fromIndex, 1);
    newAtoms.splice(toIndex, 0, moved);
    onChange(newAtoms);
  };

  const applyTemplate = (template: ComboTemplate) => {
    onChange([...template.atoms]);
    setShowTemplates(false);
  };

  const getAtomLabel = (atom: JumpAtom) => {
    let label = `${atom.turn}${atom.code}`;
    if (atom.call && atom.call !== 'none') {
      label += atom.call;
    }
    return label;
  };

  const getAtomScore = (atom: JumpAtom) => {
    return calculateJumpAtomScore(atom);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">コンボジャンプ</CardTitle>
          <div className="flex gap-2">
            {templates.length > 0 && (
              <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    テンプレート
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>コンボテンプレート</DialogTitle>
                    <DialogDescription>
                      よく使用されるコンボを選択できます
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {templates.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => applyTemplate(template)}
                        className="h-auto p-3 text-left"
                      >
                        <div>
                          <div className="font-medium">{template.label}</div>
                          <div className="text-xs text-gray-500">
                            {formatComboLabel(template.atoms)}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Button 
              onClick={addJump}
              disabled={atoms.length >= maxJumps}
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              ジャンプ追加
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {atoms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            「ジャンプ追加」ボタンでコンボを作成
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {atoms.map((atom, index) => (
                <div key={index} className="relative">
                  <Badge
                    variant={validation.valid ? "default" : "destructive"}
                    className="cursor-pointer hover:bg-opacity-80 px-3 py-2 text-sm flex items-center gap-2"
                    onClick={() => editJump(index)}
                  >
                    <span>{getAtomLabel(atom)}</span>
                    <span className="text-xs opacity-75">
                      {getAtomScore(atom).toFixed(2)}
                    </span>
                    {/* コールバッジ */}
                    {atom.call && atom.call !== 'none' && (
                      <span className="text-xs bg-black/20 px-1 rounded">
                        {atom.call}
                      </span>
                    )}
                  </Badge>
                  
                  <button
                    onClick={() => removeJump(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="h-2 w-2" />
                  </button>
                  
                  {/* 移動ボタン */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {index > 0 && (
                      <button
                        onClick={() => moveJump(index, index - 1)}
                        className="bg-gray-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs hover:bg-gray-600"
                      >
                        ←
                      </button>
                    )}
                    {index < atoms.length - 1 && (
                      <button
                        onClick={() => moveJump(index, index + 1)}
                        className="bg-gray-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs hover:bg-gray-600"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!validation.valid && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm text-red-700">
                  <ul className="space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}

        {/* 編集ダイアログ */}
        <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && cancelEdit()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ジャンプ編集</DialogTitle>
              <DialogDescription>
                ジャンプの詳細を設定してください
              </DialogDescription>
            </DialogHeader>
            
            {editingAtom && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>回転数</Label>
                    <Select
                      value={editingAtom.turn.toString()}
                      onValueChange={(v) => 
                        setEditingAtom({
                          ...editingAtom,
                          turn: parseInt(v) as JumpTurn
                        })
                      }
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
                    <Label>種類</Label>
                    <Select
                      value={editingAtom.code}
                      onValueChange={(v) => 
                        setEditingAtom({
                          ...editingAtom,
                          code: v as JumpCode,
                          // Euの場合は1回転に固定
                          turn: v === 'Eu' ? 1 : editingAtom.turn
                        })
                      }
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
                        <SelectItem value="Eu">オイラー (Eu)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>記号（コール）</Label>
                  <Select
                    value={editingAtom.call || 'none'}
                    onValueChange={(v) => 
                      setEditingAtom({
                        ...editingAtom,
                        call: v === 'none' ? null : v as Call
                      })
                    }
                    disabled={editingAtom.code === 'Eu'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">なし</SelectItem>
                      <SelectItem value="q">q (クォーター)</SelectItem>
                      <SelectItem value="<">{'<'} (アンダーローテーション)</SelectItem>
                      <SelectItem value="<<">{'<<'} (ダウングレード)</SelectItem>
                      {(editingAtom.code === 'F' || editingAtom.code === 'Lz') && (
                        <>
                          <SelectItem value="e">e (エッジエラー)</SelectItem>
                          <SelectItem value="!">! (アテンション)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={cancelEdit}>
                    キャンセル
                  </Button>
                  <Button onClick={saveEdit}>
                    保存
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}