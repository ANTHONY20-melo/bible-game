-- ============================================
-- BIBLE GAME - Schema para Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- ============================================

-- Tabela de perfis (extendendo auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de passagens bíblicas
CREATE TABLE IF NOT EXISTS public.passages (
  id SERIAL PRIMARY KEY,
  book TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER,
  content TEXT NOT NULL,
  version TEXT DEFAULT 'NVI',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de progresso do jogo
CREATE TABLE IF NOT EXISTS public.game_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  passage_id INTEGER REFERENCES public.passages(id) ON DELETE CASCADE NOT NULL,
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, passage_id)
);

-- Tabela de ranking
CREATE TABLE IF NOT EXISTS public.rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can read passages" ON public.passages
  FOR SELECT USING (true);

CREATE POLICY "Users can view own progress" ON public.game_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.game_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.game_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view rankings" ON public.rankings
  FOR SELECT USING (true);

CREATE POLICY "Users can update own ranking" ON public.rankings
  FOR UPDATE USING (auth.uid() = user_id);

-- Função para auto-criar profile após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.rankings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar profile automaticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir passagens de exemplo
INSERT INTO public.passages (book, chapter, verse_start, content, version) VALUES
('Gênesis', 1, 1, 'No princípio, Deus criou os céus e a terra.', 'NVI'),
('João', 3, 16, 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.', 'NVI'),
('Salmos', 23, 1, 'O Senhor é o meu pastor; nada me faltará.', 'NVI'),
('Provérbios', 3, 5, 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.', 'NVI'),
('Isaías', 41, 10, 'Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.', 'NVI'),
('Romanos', 8, 28, 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.', 'NVI'),
('Filipenses', 4, 13, 'Posso todas as coisas naquele que me fortalece.', 'NVI'),
('Jeremias', 29, 11, 'Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.', 'NVI'),
('Mateus', 11, 28, 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.', 'NVI'),
('Efésios', 2, 8, 'Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus.', 'NVI');
