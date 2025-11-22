const crypto = require('crypto');

let users = [];
let progress = {};

// --- TABELA DE LIÇÕES
const lessons = [
  { 
    id: 'l1-1', 
    slug: 'alfabeto', 
    title: 'Alfabeto', 
    level: 1, 
    xp_reward: 10, 
    description: 'Aprenda as letras A, B, C, D, E.' 
  },
  { 
    id: 'l1-2', 
    slug: 'saudacoes', 
    title: 'Saudações ', 
    level: 1, 
    xp_reward: 15, 
    description: 'Diga "Oi", "Bom dia" e "Tchau".' 
  },
  { 
    id: 'l1-3', 
    slug: 'pronomes', 
    title: 'Eu e Você', 
    level: 1, 
    xp_reward: 10, 
    description: 'Aprenda os sinais para "Eu" e "Você".' 
  },
  { 
    id: 'l2-1', 
    slug: 'familia', 
    title: 'Família', 
    level: 2, 
    xp_reward: 20, 
    description: 'Aprenda "Mãe" e "Pai".' 
  },
  { 
    id: 'l2-2', 
    slug: 'alimentos-1', 
    title: 'Hora de Comer', 
    level: 2, 
    xp_reward: 20, 
    description: 'Sinais para "Comer" e "Água".' 
  },
  { 
    id: 'l2-3', 
    slug: 'perguntas-1', 
    title: 'Perguntas Básicas', 
    level: 2, 
    xp_reward: 25, 
    description: 'Pergunte "O que?" e "Onde?".' 
  },
  { 
    id: 'l3-1', 
    slug: 'verbos-1', 
    title: 'Ações', 
    level: 3, 
    xp_reward: 30, 
    description: 'Aprenda os verbos "Querer" e "Gostar".' 
  },
  { 
    id: 'l3-2', 
    slug: 'cores-1', 
    title: 'Cores Primárias', 
    level: 3, 
    xp_reward: 30, 
    description: 'Aprenda "Azul", "Amarelo" e "Vermelho".' 
  }
];

// --- TABELA DE PERGUNTAS (CONTEÚDO DAS LIÇÕES) ---
const questions = {
  'l1-1': [
    { id: crypto.randomUUID(), type: 'multiple_choice', prompt: 'Que letra é esta?', 
      media_url: "/frontend/media/alfabeto/A.png", 
      options: JSON.stringify(['A', 'B', 'C', 'E']), correct_answer: JSON.stringify({ answer: 'A' }) },
    
    { id: crypto.randomUUID(), type: 'multiple_choice', prompt: 'Que letra é esta?', 
      media_url: "/frontend/media/alfabeto/B.png", 
      options: JSON.stringify(['D', 'A', 'E', 'B']), correct_answer: JSON.stringify({ answer: 'B' }) },
    
    { id: crypto.randomUUID(), type: 'multiple_choice', prompt: 'Que letra é esta?', 
      media_url: "/frontend/media/alfabeto/C.png", 
      options: JSON.stringify(['D', 'A', 'C', 'B']), correct_answer: JSON.stringify({ answer: 'C' }) }
  ],

  
  
  'l2-1': [
    { id: crypto.randomUUID(), type: 'multiple_choice', prompt: 'Este sinal significa:', media_url: '/frontend/media/familia/Mãe.png',
      options: JSON.stringify(['Pai', 'Irmã', 'Mãe', 'Tia']), correct_answer: JSON.stringify({ answer: 'Mãe' }) },
    { id: crypto.randomUUID(), type: 'multiple_choice', prompt: 'Este sinal significa:', media_url: '/frontend/media/familia/Pai.png',
      options: JSON.stringify(['Pai', 'Avô', 'Mãe', 'Irmão']), correct_answer: JSON.stringify({ answer: 'Pai' }) }
  ],
  
  
  'l3-1': [
    { id: crypto.randomUUID(), type: 'multiple_choice', prompt: 'O que este sinal significa?', media_url: '/frontend/media/verbos/Tchau.png',
      options: JSON.stringify(['Gostar', 'Ter', 'Tchau', 'Ir']), correct_answer: JSON.stringify({ answer: 'Tchau' }) },
    { id: crypto.randomUUID(), type: 'multiple_choice', prompt: 'O que este sinal significa?', media_url: '/frontend/media/verbos/Gostar.jpg',
      options: JSON.stringify(['Odiar', 'Gostar', 'Querer', 'Não querer']), correct_answer: JSON.stringify({ answer: 'Gostar' }) }
  ],
};

// --- FUNÇÕES DE ACESSO AO BANCO FALSO
const mockDb = {
    findUserByEmail: (email) => users.find(u => u.email === email),
    findUserById: (id) => users.find(u => u.id === id),
    getAllUsers: () => users,
    createUser: (name, email, password_hash) => {
        const newUser = { id: crypto.randomUUID(), name, email, password_hash, total_xp: 0 };
        users.push(newUser);
        return newUser;
    },
    getAllLessons: () => lessons,
    getLessonBySlug: (slug) => lessons.find(l => l.slug === slug),
    getQuestionsByLessonId: (lessonId) => questions[lessonId] || [],
    getUserProgress: (userId) => {
        const user = mockDb.findUserById(userId);
        if (!user) return { completed: 0, points: 0 };
        const userProgress = progress[userId] || [];
        const completedCount = userProgress.filter(p => p.completed).length;
        return { completed: completedCount, points: user.total_xp };
    },
    submitUserProgress: (userId, lessonId, score) => {
        const user = mockDb.findUserById(userId);
        if (!user) return;
        if (!progress[userId]) progress[userId] = [];
        const lessonProgress = progress[userId].find(p => p.lesson_id === lessonId);
        const firstTimeCompleting = !lessonProgress;
        
        if (firstTimeCompleting) {
            progress[userId].push({ lesson_id: lessonId, completed: true, best_score: score });
        } else {
            lessonProgress.completed = true;
            lessonProgress.best_score = Math.max(lessonProgress.best_score, score);
        }

        const lesson = lessons.find(l => l.id === lessonId);
        if (lesson && firstTimeCompleting) {
            user.total_xp += lesson.xp_reward;
        }
    }
};

module.exports = mockDb;