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
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-2">
            スケート基礎点計算ツール
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">
            参照：ISU Communication No. 2656（2024‑25シーズン）
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

      </div>
    </main>
  );
}
