'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ElementCard } from '@/components/ElementCard';
import { ScoreSummary } from '@/components/ScoreSummary';
import { useProgramStore } from '@/store/program';
import { getClassById, validateProgram } from '@/lib/rules';
import { programToURL, urlToProgram } from '@/lib/serialize';
import { ArrowLeft, Share2 } from 'lucide-react';

function EditorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { program, setElement, clearElement, loadProgram, initializeElements } = useProgramStore();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const classConfig = getClassById(program.classId);
  const validation = validateProgram(program);
  
  useEffect(() => {
    // URL からプログラムデータを復元
    const data = searchParams.get('data');
    if (data) {
      const restored = urlToProgram(location.search);
      if (restored) {
        loadProgram(restored);
      }
    } else if (program.elements.length === 0) {
      initializeElements();
    }
    setIsLoaded(true);
  }, [searchParams, loadProgram, initializeElements, program.elements.length]);
  
  const handleShare = async () => {
    const url = programToURL(program);
    const fullUrl = `${window.location.origin}/editor${url}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Skaten Score Calculator',
          text: `${classConfig?.label} - ${program.discipline} プログラム`,
          url: fullUrl
        });
        return;
      } catch (err) {
        // Fall back to clipboard
      }
    }
    
    try {
      await navigator.clipboard.writeText(fullUrl);
      alert('プログラムのURLをクリップボードにコピーしました');
    } catch (err) {
      prompt('このURLをコピーして共有してください:', fullUrl);
    }
  };
  
  
  if (!isLoaded || !classConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="flex items-center gap-2 w-fit"
              >
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">プログラム編集</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {classConfig.label} - {program.discipline === 'SP' ? 'ショートプログラム' : 'フリースケーティング'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 lg:hidden">
              <Button
                onClick={handleShare}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Share2 className="h-4 w-4" />
                共有
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-wrap gap-2">
            <Button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Share2 className="h-4 w-4" />
              共有
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>要素入力</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {program.elements.map((element, index) => (
                    <ElementCard
                      key={index}
                      index={index}
                      element={element}
                      onChange={(newElement) => setElement(index, newElement)}
                      onClear={() => clearElement(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <ScoreSummary
              elements={program.elements}
              classLabel={classConfig.label}
              disciplineId={program.discipline}
              validationErrors={validation.errors}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>読み込み中...</p>
        </div>
      </div>
    }>
      <EditorPageContent />
    </Suspense>
  );
}