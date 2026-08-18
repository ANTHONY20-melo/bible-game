'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface GameBoardProps {
  userId: string;
}

export function GameBoard({ userId }: GameBoardProps) {
  const [stats, setStats] = useState({
    totalScore: 0,
    gamesPlayed: 0,
    streakDays: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data } = await supabase
      .from('rankings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      setStats({
        totalScore: data.total_score,
        gamesPlayed: data.games_played,
        streakDays: data.streak_days,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-3xl font-bold text-primary-600">{stats.totalScore}</p>
          <p className="text-sm text-gray-600">Pontuação Total</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-3xl font-bold text-primary-600">{stats.gamesPlayed}</p>
          <p className="text-sm text-gray-600">Jogos Jogados</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-3xl font-bold text-primary-600">{stats.streakDays}</p>
          <p className="text-sm text-gray-600">Dias Seguidos</p>
        </div>
      </div>

      {/* Ações */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/play"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center"
        >
          <span className="text-4xl block mb-2">🎮</span>
          <h3 className="text-lg font-semibold text-primary-700">Jogar Agora</h3>
          <p className="text-sm text-gray-600">Complete versículos bíblicos</p>
        </Link>

        <Link
          href="/ranking"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center"
        >
          <span className="text-4xl block mb-2">🏆</span>
          <h3 className="text-lg font-semibold text-primary-700">Ranking</h3>
          <p className="text-sm text-gray-600">Veja os melhores jogadores</p>
        </Link>
      </div>

      {/* Logout */}
      <div className="text-center">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sair da conta
          </button>
        </form>
      </div>
    </div>
  );
}
