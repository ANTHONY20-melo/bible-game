'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PlayPage() {
  const [passages, setPassages] = useState<Array<{
    id: number;
    book: string;
    chapter: number;
    verse_start: number;
    content: string;
  }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadPassages();
  }, []);

  const loadPassages = async () => {
    const { data } = await supabase
      .from('passages')
      .select('*')
      .order('id', { ascending: true });

    if (data && data.length > 0) {
      setPassages(data);
    }
    setLoading(false);
  };

  const currentPassage = passages[currentIndex];

  const checkAnswer = () => {
    if (!currentPassage) return;

    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const normalizedContent = currentPassage.content.toLowerCase().trim();

    // Verifica se a resposta contém palavras-chave do versículo
    const keywords = normalizedContent.split(' ').filter(w => w.length > 3);
    const matchedKeywords = keywords.filter(k => normalizedAnswer.includes(k));
    const matchPercentage = matchedKeywords.length / keywords.length;

    if (matchPercentage >= 0.5 || normalizedAnswer === normalizedContent) {
      setScore(score + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setShowAnswer(true);
  };

  const nextPassage = () => {
    if (currentIndex + 1 >= passages.length) {
      setGameOver(true);
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setShowAnswer(false);
    setUserAnswer('');
    setFeedback(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-primary-600">Carregando passagens...</p>
      </main>
    );
  }

  if (passages.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-700 mb-4">
            Nenhuma passagem encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            Execute o SQL de seed no Supabase para adicionar passagens.
          </p>
          <Link href="/" className="text-primary-600 hover:underline">
            Voltar ao início
          </Link>
        </div>
      </main>
    );
  }

  if (gameOver) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-primary-700 mb-4">
            🎉 Fim de Jogo!
          </h1>
          <p className="text-2xl text-primary-600 mb-2">
            Sua pontuação: <strong>{score}</strong>
          </p>
          <p className="text-gray-600 mb-8">
            Você completou {passages.length} passagens!
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setShowAnswer(false);
                setUserAnswer('');
                setFeedback(null);
                setGameOver(false);
              }}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Jogar Novamente
            </button>
            <Link
              href="/"
              className="block w-full py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-primary-600 hover:underline">
            ← Voltar
          </Link>
          <div className="text-lg font-semibold text-primary-700">
            Pontuação: {score}
          </div>
        </div>

        {/* Progresso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progresso</span>
            <span>{currentIndex + 1} / {passages.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / passages.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Card do Jogo */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <span className="text-sm text-gray-500">
              {currentPassage.book} {currentPassage.chapter}:{currentPassage.verse_start}
            </span>
          </div>

          {!showAnswer ? (
            <>
              <h2 className="text-2xl font-bold text-primary-700 text-center mb-6">
                Complete o versículo:
              </h2>
              <p className="text-lg text-gray-600 text-center mb-8 italic">
                &quot;{currentPassage.content.substring(0, 30)}...&quot;
              </p>

              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Digite o versículo completo..."
                className="w-full p-4 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />

              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className="w-full mt-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                Verificar Resposta
              </button>
            </>
          ) : (
            <>
              <div className={`text-center p-4 rounded-lg mb-6 ${
                feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <p className={`text-lg font-semibold ${
                  feedback === 'correct' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {feedback === 'correct' ? '✅ Correto! +10 pontos' : '❌ Incorreto'}
                </p>
              </div>

              <div className="bg-primary-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-500 mb-2">Resposta completa:</p>
                <p className="text-lg text-primary-800 italic">
                  &quot;{currentPassage.content}&quot;
                </p>
              </div>

              <button
                onClick={nextPassage}
                className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Próxima Passagem →
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
