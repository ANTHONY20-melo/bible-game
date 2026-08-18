import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface RankingWithProfile {
  id: string;
  user_id: string;
  total_score: number;
  games_played: number;
  streak_days: number;
  last_played_at: string | null;
  updated_at: string;
  profiles: { display_name: string | null } | null;
}

export default async function RankingPage() {
  const supabase = await createClient();

  const { data: rankings } = await supabase
    .from('rankings')
    .select(`
      *,
      profiles:user_id (display_name)
    `)
    .order('total_score', { ascending: false })
    .limit(50);

  const typedRankings = (rankings ?? []) as RankingWithProfile[];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">
            Ranking
          </h1>
          <Link href="/" className="text-primary-600 hover:underline">
            &larr; Voltar
          </Link>
        </div>

        {typedRankings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhum jogador no ranking ainda.
            </p>
            <p className="text-gray-500 mt-2">
              Faca login e jogue para aparecer aqui!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary-700">#</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-primary-700">Jogador</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary-700">Pontos</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary-700">Jogos</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary-700">Sequencia</th>
                </tr>
              </thead>
              <tbody>
                {typedRankings.map((ranking, index) => {
                  const displayName = ranking.profiles?.display_name ?? 'Anonimo';
                  return (
                    <tr
                      key={ranking.id}
                      className={`border-t ${
                        index < 3 ? 'bg-primary-50/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        {index === 0 && String.fromCodePoint(0x1F947)}
                        {index === 1 && String.fromCodePoint(0x1F948)}
                        {index === 2 && String.fromCodePoint(0x1F949)}
                        {index > 2 && (
                          <span className="text-gray-500">{index + 1}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {displayName}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-primary-600">
                        {ranking.total_score}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {ranking.games_played}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {ranking.streak_days} dias
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
