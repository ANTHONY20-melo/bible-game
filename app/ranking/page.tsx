import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">
            🏆 Ranking
          </h1>
          <Link href="/" className="text-primary-600 hover:underline">
            ← Voltar
          </Link>
        </div>

        {!rankings || rankings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhum jogador no ranking ainda.
            </p>
            <p className="text-gray-500 mt-2">
              Faça login e jogue para aparecer aqui!
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
                  <th className="px-6 py-3 text-right text-sm font-semibold text-primary-700">Sequência</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((ranking, index) => (
                  <tr
                    key={ranking.id}
                    className={`border-t ${
                      index < 3 ? 'bg-primary-50/50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && (
                        <span className="text-gray-500">{index + 1}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {(ranking as Record<string, unknown>).profiles
                        ? ((ranking as Record<string, unknown>).profiles as Record<string, unknown>).display_name || 'Anônimo'
                        : 'Anônimo'}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
