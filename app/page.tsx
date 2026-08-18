import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { GameBoard } from '@/components/GameBoard';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-700 mb-4">
            📖 Bible Game
          </h1>
          <p className="text-xl text-primary-600">
            Explore a Bíblia de forma divertida e interativa
          </p>
        </header>

        {user ? (
          <GameBoard userId={user.id} />
        ) : (
          <div className="text-center space-y-6">
            <p className="text-lg text-gray-600">
              Faça login para salvar seu progresso e competir no ranking!
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
              >
                Criar Conta
              </Link>
            </div>
            <GuestGame />
          </div>
        )}
      </div>
    </main>
  );
}

function GuestGame() {
  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-primary-700 mb-4">
        🎮 Jogar como Visitante
      </h2>
      <p className="text-gray-600 mb-4">
        Você pode jogar sem login, mas seu progresso não será salvo.
      </p>
      <Link
        href="/play"
        className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
      >
        Começar a Jogar
      </Link>
    </div>
  );
}
