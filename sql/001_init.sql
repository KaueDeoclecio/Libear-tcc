CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL, 
  password_hash TEXT,          
  google_id TEXT UNIQUE,       
  avatar_url TEXT,
  total_xp INT NOT NULL DEFAULT 0, 
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de lições
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  level INT NOT NULL DEFAULT 1,
  xp_reward INT NOT NULL DEFAULT 10,
  media_url TEXT,
  description TEXT
);

-- Tabela de questões/atividades dentro das lições
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice','match','input')),
  prompt TEXT NOT NULL,
  media_url TEXT,
  options JSONB,
  correct_answer JSONB NOT NULL
);

-- Tabela de progresso do usuário nas lições
CREATE TABLE IF NOT EXISTS progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  best_score INT DEFAULT 0,
  last_played TIMESTAMPTZ,
  PRIMARY KEY (user_id, lesson_id)
);

-- Tabela para controle de ofensivas (streaks)
CREATE TABLE IF NOT EXISTS streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  last_day DATE
);

-- Tabela de log de experiência (XP)
CREATE TABLE IF NOT EXISTS xp_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  delta INT NOT NULL,
  source TEXT, 
  created_at TIMESTAMPTZ DEFAULT now()
);

-- MELHORIA: Índices para otimizar consultas frequentes
CREATE INDEX IF NOT EXISTS idx_questions_lesson_id ON questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_user_id ON xp_log(user_id);