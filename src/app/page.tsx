'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClassSelector } from '@/components/ClassSelector';
import { DisciplineSelector } from '@/components/DisciplineSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getClassById } from '@/lib/rules';
import { DisciplineId } from '@/lib/types';
import { useProgramStore } from '@/store/program';

export default function Home() {
  const router = useRouter();
  const { setClass, setDiscipline } = useProgramStore();
  const [selectedClass, setSelectedClass] = useState<string>('novice');
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineId>('SP');
  
  const classConfig = getClassById(selectedClass);
  const hasSingleDiscipline = classConfig?.disciplines.length === 1;
  
  const handleStart = () => {
    setClass(selectedClass);
    const discipline = hasSingleDiscipline 
      ? classConfig!.disciplines[0].id 
      : selectedDiscipline;
    setDiscipline(discipline);
    router.push('/editor');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skaten Score Calculator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            フィギュアスケート得点計算システム
          </p>
        </header>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>プログラム設定</CardTitle>
            <CardDescription>
              大会の級と種目を選択してプログラムの採点を開始します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ClassSelector 
              value={selectedClass}
              onChange={setSelectedClass}
            />
            
            {!hasSingleDiscipline && (
              <DisciplineSelector
                classId={selectedClass}
                value={selectedDiscipline}
                onChange={setSelectedDiscipline}
              />
            )}
            
            <div className="pt-4">
              <Button 
                onClick={handleStart}
                className="w-full"
                size="lg"
              >
                採点を開始
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">機能紹介</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">リアルタイム計算</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  要素を入力すると即座に基礎点とGOEを計算し、合計スコアを表示します
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ルール準拠</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ISUルールに基づいた正確な採点計算とバリデーション機能
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">共有機能</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  作成したプログラムをURLやJSONで簡単に共有・保存できます
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
