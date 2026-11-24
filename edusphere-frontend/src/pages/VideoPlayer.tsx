import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { emotionAPI, getToken } from "@/lib/api";

const courseVideos: Record<string, { title: string; videos: { id: string; title: string; duration: string }[] }> = {
  mathematics: {
    title: "Mathematics Fundamentals",
    videos: [
      { id: "NnMIhxWRGNw", title: "1. Introduction to Algebra", duration: "12:30" },
      { id: "zouPoc49xbk", title: "2. Linear Equations Part 1", duration: "15:45" },
      { id: "IUCFsCNqBTY", title: "3. Quadratic Equations", duration: "18:20" },
      { id: "NybHckSEQBI", title: "4. Statistics Introduction", duration: "14:10" },
      { id: "LwCRRUa8yTU", title: "5. Mathematical Data", duration: "21:05" },
      { id: "sxPwSj6-qYw", title: "6. Central Tendency", duration: "19:30" },
      { id: "o6NshsE_6vY", title: "7. Dispersion", duration: "16:45" },
      { id: "8yG_yvR1-4M", title: "8. Correlation vs Causation", duration: "13:15" },
      { id: "uL8Z8TzV3vY", title: "9. Normal Distribution", duration: "20:00" },
      { id: "r_6Vl0u1uBM", title: "10. Advanced Algebra Prep", duration: "22:10" },
    ],
  },
  science: {
    title: "Science",
    videos: [
      { id: "QnQe0xW_JY4", title: "1. Carbon & Life", duration: "14:10" },
      { id: "H8WJ2KENlK0", title: "2. Water & Solutions", duration: "16:30" },
      { id: "PYH63o10iTE", title: "3. Biological Molecules", duration: "13:50" },
      { id: "CJTMAeQ2mGE", title: "4. Eukaryopolis (Cells)", duration: "18:20" },
      { id: "FzcTgrxMzZk", title: "5. Animal Cells", duration: "20:15" },
      { id: "URdJC_Q8Fv4", title: "6. Plant Cells", duration: "25:00" },
      { id: "aDAw2Zg4IgE", title: "7. ATP & Respiration", duration: "19:40" },
      { id: "jBmcD_Z4SyM", title: "8. Photosynthesis", duration: "15:10" },
      { id: "kXpylLs5D0U", title: "9. Heredity & DNA", duration: "22:30" },
      { id: "xHn1u8Hq2g", title: "10. DNA Structure", duration: "17:50" },
    ],
  },
  english: {
    title: "English Communication",
    videos: [
      { id: "MSYw502dJNY", title: "1. Reading Fiction", duration: "11:20" },
      { id: "oAocVTKzm_I", title: "2. The Odyssey", duration: "14:00" },
      { id: "I3KmWMxt1s", title: "3. Romeo & Juliet", duration: "12:45" },
      { id: "xw9dIByG_Xg", title: "4. The Great Gatsby", duration: "15:30" },
      { id: "3xJWxPE8G2c", title: "5. To Kill A Mockingbird", duration: "19:20" },
      { id: "MyLSnROm-Yk", title: "6. Hamlet", duration: "16:15" },
      { id: "H971YXX4J-Y", title: "7. 1984 - Part 1", duration: "13:40" },
      { id: "SY_tT47M9fA", title: "8. Frankenstein", duration: "21:00" },
      { id: "5xQppvBw0_E", title: "9. Pride & Prejudice", duration: "18:50" },
      { id: "7rA7uLqMhM", title: "10. Literature Overview", duration: "14:25" },
    ],
  },
  history: {
    title: "History",
    videos: [
      { id: "Yocja_N5s1I", title: "1. Agricultural Revolution", duration: "16:00" },
      { id: "mjj2w8C04dE", title: "2. Indus Valley Civilization", duration: "18:30" },
      { id: "sohXPx_XZ6Y", title: "3. Mesopotamia", duration: "15:20" },
      { id: "Z3Wvw6BivVI", title: "4. Ancient Egypt", duration: "20:10" },
      { id: "Q-mkVSasZIM", title: "5. Persians & Greeks", duration: "24:00" },
      { id: "8Nn5uqE3C9w", title: "6. Buddha and Ashoka", duration: "19:45" },
      { id: "ylWORyToTo4", title: "7. Ancient China", duration: "17:30" },
      { id: "0LsrkW1mKxk", title: "8. Alexander the Great", duration: "22:15" },
      { id: "vfe-eNq-Qyg", title: "9. The Silk Road", duration: "18:50" },
      { id: "oPf27gAup9U", title: "10. The Roman Empire", duration: "16:20" },
    ],
  },
  programming: {
    title: "Programming Essentials",
    videos: [
      { id: "tpIctyqH29Q", title: "1. Computer Science Intro", duration: "11:20" },
      { id: "O5nskjZ_GoI", title: "2. Early Computing", duration: "12:15" },
      { id: "LN0ucKNX0hc", title: "3. Electronic Computing", duration: "10:45" },
      { id: "1GSjbWt0c9M", title: "4. Boolean Logic", duration: "09:30" },
      { id: "fpNwcppKdGQ", title: "5. Representing Numbers", duration: "10:20" },
    ],
  },
  chemistry: {
    title: "Chemistry Fundamentals",
    videos: [
      { id: "FSyAehMdpyI", title: "1. The Nucleus", duration: "10:15" },
      { id: "QiiyvzZB48", title: "2. Unit Conversion", duration: "12:30" },
      { id: "0RRVV4Diomg", title: "3. Atomic Structure", duration: "11:00" },
      { id: "cQuUwPhInSg", title: "4. Chemical Bonds", duration: "10:55" },
      { id: "H8WJ2KENlK0", title: "5. Water & Solutions", duration: "13:40" },
    ],
  },
  physics: {
    title: "Physics Fundamentals",
    videos: [
      { id: "ZM8ECpBuQYE", title: "1. Motion in One Dimension", duration: "12:20" },
      { id: "kKKM8Y-u7ds", title: "2. Newton's Laws", duration: "15:10" },
      { id: "T7M7pXG8K6w", title: "3. Vectors & 2D Motion", duration: "14:45" },
      { id: "G-1p7S_WlYc", title: "4. Friction", duration: "11:30" },
      { id: "h58V_V7_Gz8", title: "5. Energy & Work", duration: "13:10" },
    ],
  },
  "art-&-design": {
    title: "Art & Design",
    videos: [
      { id: "YclL_C_8iXw", title: "1. Cave Art", duration: "10:50" },
      { id: "O9f8eG_jUjg", title: "2. Ancient Egypt Art", duration: "12:15" },
      { id: "4j92L_7_jY8", title: "3. The Renaissance", duration: "14:20" },
      { id: "oM8z8pW8X8k", title: "4. Impressionism", duration: "13:05" },
      { id: "z7EciXWc29c", title: "5. Post-Impressionism", duration: "12:40" },
    ],
  },
  "music-theory": {
    title: "Music Theory",
    videos: [
      { id: "vD_8I_GjGgE", title: "1. Notes & Rhythms", duration: "11:15" },
      { id: "r_6Vl0u1uBM", title: "2. Scales & Modes", duration: "14:30" },
      { id: "0LsrkW1mKxk", title: "3. Chords 101", duration: "12:50" },
      { id: "ylWORyToTo4", title: "4. Song Structure", duration: "13:10" },
      { id: "8Nn5uqE3C9w", title: "5. Musical Notation", duration: "15:05" },
    ],
  },
  "history-of-india": {
    title: "History of India",
    videos: [
      { id: "n7ndRwqJYDM", title: "1. Indus Valley", duration: "15:20" },
      { id: "mjj2w8C04dE", title: "2. Ancient India", duration: "18:40" },
      { id: "sohXPx_XZ6Y", title: "3. The Mauryan Empire", duration: "16:15" },
      { id: "Z3Wvw6BivVI", title: "4. The Mughal Empire", duration: "20:30" },
      { id: "oPf27gAup9U", title: "5. British Raj & Independence", duration: "22:10" },
    ],
  },
  "environmental-sci": {
    title: "Environmental Science",
    videos: [
      { id: "T_SgC-fG8wU", title: "1. Ecology Intro", duration: "11:50" },
      { id: "vfe-eNq-Qyg", title: "2. The Carbon Cycle", duration: "12:40" },
      { id: "oM8z8pW8X8k", title: "3. Climate Change", duration: "14:15" },
      { id: "z7EciXWc29c", title: "4. Biodiversity", duration: "13:25" },
    ],
  },
  "physical-education": {
    title: "Physical Education",
    videos: [
      { id: "qhK08p0-9pM", title: "1. Why Exercise?", duration: "10:10" },
      { id: "rCaatS_D_Lz", title: "2. Muscle Anatomy", duration: "13:40" },
      { id: "O9f8eG_jUjg", title: "3. Cardio Basics", duration: "12:55" },
      { id: "YclL_C_8iXw", title: "4. Nutrition & Sport", duration: "15:20" },
    ],
  },
};

type LearningState = "neutral" | "focused" | "bored" | "confused" | "frustrated" | "hopeless" | "sleepy" | "distracted";

const VALID_STATES: LearningState[] = ["neutral", "focused", "bored", "confused", "frustrated", "hopeless", "sleepy", "distracted"];

const stateConfig: Record<LearningState, {
  label: string; emoji: string; color: string; bgColor: string;
  title: string; message: string; action: string; type: string;
}> = {
  neutral: {
    label: "Neutral", emoji: "😐", color: "text-gray-700", bgColor: "bg-gray-50 border-gray-300",
    title: "Good Going! 👍",
    message: "You're doing great! Keep up the steady pace.",
    action: "Continue Learning", type: "message",
  },
  focused: {
    label: "Focused", emoji: "🎯", color: "text-green-700", bgColor: "bg-green-50 border-green-300",
    title: "You're in the Zone! 🔥",
    message: "Excellent focus! You're absorbing knowledge like a sponge.",
    action: "Continue Learning", type: "message",
  },
  bored: {
    label: "Bored", emoji: "😴", color: "text-yellow-700", bgColor: "bg-yellow-50 border-yellow-300",
    title: "Let's Make This Fun! 🎮",
    message: "Feeling bored? Pick a game to wake up your brain!",
    action: "Pick a Game", type: "game_select",
  },
  confused: {
    label: "Confused", emoji: "🤔", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-300",
    title: "Let's Clear This Up! 📖",
    message: "Something seems unclear. Let's go back and review.",
    action: "Review Lecture", type: "review",
  },
  frustrated: {
    label: "Frustrated", emoji: "😤", color: "text-red-700", bgColor: "bg-red-50 border-red-300",
    title: "Take a Breath 🌿",
    message: "It's okay to feel frustrated. Let's do a breathing exercise.",
    action: "Start Breathing Exercise", type: "breathing",
  },
  hopeless: {
    label: "Hopeless", emoji: "😔", color: "text-purple-700", bgColor: "bg-purple-50 border-purple-300",
    title: "You've Got This! 💪",
    message: "\"Education is the most powerful weapon which you can use to change the world.\" — Nelson Mandela\n\nEvery expert was once a beginner. You are doing amazing!",
    action: "I'm Ready to Continue", type: "motivational",
  },
  sleepy: {
    label: "Sleepy", emoji: "😪", color: "text-indigo-700", bgColor: "bg-indigo-50 border-indigo-300",
    title: "Wake Up Your Brain! 🧠",
    message: "Feeling sleepy? Let's play a quick brain game!",
    action: "Play Brain Game", type: "game",
  },
  distracted: {
    label: "Distracted", emoji: "👀", color: "text-orange-700", bgColor: "bg-orange-50 border-orange-300",
    title: "A Quick Story for You 📿",
    message: "Did you know? Aryabhata, an Indian mathematician born in 476 CE, invented the concept of zero. He changed the world with just his mind — just like you can! 🙏\n\nNow, let's come back to study!",
    action: "Let's Come Back to Study!", type: "story",
  },
};

function GameSelectPopup({ onSelect, onClose }: { onSelect: (g: string) => void; onClose: () => void }) {
  const games = [
    { id: "simon", emoji: "🎯", name: "Simon Says", desc: "Memory sequence game" },
    { id: "memory", emoji: "🃏", name: "Memory Cards", desc: "Match the pairs" },
    { id: "math", emoji: "➕", name: "Math Sprint", desc: "10 questions in 60s" },
    { id: "word", emoji: "🔤", name: "Word Scramble", desc: "Unscramble the word" },
  ];
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-900">🎮 Pick a Game!</h3>
            <p className="text-gray-500 text-sm">A quick game to refresh your brain</p>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {games.map(g => (
            <button key={g.id} onClick={() => onSelect(g.id)}
              className="p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition text-left">
              <div className="text-3xl mb-2">{g.emoji}</div>
              <p className="font-bold text-gray-900 text-sm">{g.name}</p>
              <p className="text-gray-500 text-xs mt-1">{g.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SimonGame({ onClose }: { onClose: () => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState<"watch" | "repeat" | "win" | "lose">("watch");
  const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-400"];

  const startGame = useCallback(() => {
    const seq = Array.from({ length: level + 2 }, () => Math.floor(Math.random() * 4));
    setSequence(seq); setUserSeq([]); setStatus("watch");
    let i = 0;
    const interval = setInterval(() => {
      setActive(seq[i]);
      setTimeout(() => setActive(null), 500);
      i++;
      if (i >= seq.length) { clearInterval(interval); setTimeout(() => setStatus("repeat"), 800); }
    }, 900);
  }, [level]);

  useEffect(() => { startGame(); }, [startGame]);

  const handleTap = (i: number) => {
    if (status !== "repeat") return;
    const next = [...userSeq, i];
    setUserSeq(next);
    setActive(i); setTimeout(() => setActive(null), 300);
    if (next[next.length - 1] !== sequence[next.length - 1]) { setStatus("lose"); return; }
    if (next.length === sequence.length) {
      if (level >= 3) setStatus("win");
      else { setLevel(l => l + 1); setTimeout(startGame, 1000); }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">🎯 Simon Says — Level {level}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {status === "watch" ? "👀 Watch carefully..." : status === "repeat" ? "🎯 Repeat it!" :
            status === "win" ? "🏆 You won!" : "❌ Wrong! Try again!"}
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {colors.map((color, i) => (
            <button key={i} onClick={() => handleTap(i)}
              className={`h-20 rounded-xl transition-all duration-200 ${color} ${active === i ? "opacity-100 scale-95" : "opacity-50"}`} />
          ))}
        </div>
        {(status === "win" || status === "lose") && (
          <div className="flex gap-2">
            <button onClick={startGame} className="flex-1 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-medium">Play Again</button>
            <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-semibold">Back to Study</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MemoryGame({ onClose }: { onClose: () => void }) {
  const emojis = ["🐶", "🐱", "🐭", "🐹", "🦊", "🐻", "🐼", "🐨"];
  const [cards, setCards] = useState(() => {
    const doubled = [...emojis, ...emojis].map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
    return doubled.sort(() => Math.random() - 0.5);
  });
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const flip = (id: number) => {
    if (selected.length === 2) return;
    if (cards[id].flipped || cards[id].matched) return;
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    const newSelected = [...selected, id];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newSelected;
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          setCards(c => c.map((card, i) => i === a || i === b ? { ...card, matched: true } : card));
          setSelected([]);
          if (cards.filter(c => c.matched).length + 2 === cards.length) setWon(true);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(c => c.map((card, i) => i === a || i === b ? { ...card, flipped: false } : card));
          setSelected([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">🃏 Memory Cards</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Moves: {moves}</span>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
        </div>
        {won ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🏆</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">You Won!</h4>
            <p className="text-gray-500 mb-4">Completed in {moves} moves</p>
            <button onClick={onClose} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold">Back to Study 📚</button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {cards.map((card, i) => (
              <button key={card.id} onClick={() => flip(i)}
                className={`h-14 rounded-xl text-2xl flex items-center justify-center transition-all ${card.flipped || card.matched ? "bg-indigo-100 border-2 border-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
                  } ${card.matched ? "opacity-50" : ""}`}>
                {card.flipped || card.matched ? card.emoji : ""}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MathGame({ onClose }: { onClose: () => void }) {
  const generate = () => {
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;
    if (op === "-" && b > a) [a, b] = [b, a];
    const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
    const wrong = [answer + 1, answer - 1, answer + 2, answer - 2].filter(n => n !== answer && n >= 0).slice(0, 3);
    const options = [...wrong, answer].sort(() => Math.random() - 0.5);
    return { question: `${a} ${op} ${b} = ?`, answer, options };
  };

  const [q, setQ] = useState(generate);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(tl => {
        if (tl <= 1) { clearInterval(t); setDone(true); return 0; }
        return tl - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const answer = (opt: number) => {
    if (done) return;
    const correct = opt === q.answer;
    setFlash(correct ? "correct" : "wrong");
    if (correct) setScore(s => s + 1);
    setTotal(t => t + 1);
    setTimeout(() => { setFlash(null); setQ(generate()); }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">➕ Math Sprint</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>
        {done ? (
          <div>
            <div className="text-5xl mb-3">{score >= 8 ? "🏆" : score >= 5 ? "🎉" : "💪"}</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Time's Up!</h4>
            <p className="text-4xl font-bold text-indigo-600 mb-1">{score}<span className="text-gray-400 text-xl">/{total}</span></p>
            <p className="text-gray-500 text-sm mb-4">correct answers</p>
            <button onClick={onClose} className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold">Back to Study 📚</button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">Score: {score}/{total}</span>
              <span className={`text-lg font-bold ${timeLeft <= 10 ? "text-red-500" : "text-indigo-600"}`}>⏱ {timeLeft}s</span>
            </div>
            <div className={`bg-indigo-50 rounded-xl p-6 mb-4 transition-all ${flash === "correct" ? "bg-green-100" : flash === "wrong" ? "bg-red-100" : ""}`}>
              <p className="text-3xl font-bold text-gray-900">{q.question}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => answer(opt)}
                  className="p-3 rounded-xl border-2 border-gray-200 text-gray-900 font-bold text-lg hover:border-indigo-400 hover:bg-indigo-50 transition bg-white">
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function WordGame({ onClose }: { onClose: () => void }) {
  const words = [
    { word: "SCIENCE", hint: "Study of the natural world" },
    { word: "HISTORY", hint: "Study of past events" },
    { word: "ALGEBRA", hint: "Branch of mathematics" },
    { word: "GRAVITY", hint: "Force that pulls objects down" },
    { word: "BIOLOGY", hint: "Study of living organisms" },
    { word: "CLIMATE", hint: "Long-term weather patterns" },
    { word: "PHYSICS", hint: "Study of matter and energy" },
    { word: "OXYGEN", hint: "Gas we breathe" },
  ];
  const scramble = (w: string) => w.split("").sort(() => Math.random() - 0.5).join("");
  const [index, setIndex] = useState(() => Math.floor(Math.random() * words.length));
  const [scrambled, setScrambled] = useState(() => scramble(words[Math.floor(Math.random() * words.length)].word));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [total, setTotal] = useState(0);

  const check = () => {
    const correct = input.toUpperCase() === words[index].word;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore(s => s + 1);
    setTotal(t => t + 1);
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * words.length);
      setIndex(newIndex);
      setScrambled(scramble(words[newIndex].word));
      setInput(""); setFeedback(null);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔤 Word Scramble</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{score}/{total}</span>
            <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-4">Hint: {words[index].hint}</p>
        <div className={`bg-indigo-50 rounded-xl p-4 mb-4 transition-all ${feedback === "correct" ? "bg-green-100" : feedback === "wrong" ? "bg-red-100" : ""}`}>
          <p className="text-3xl font-bold tracking-widest text-indigo-700">{scrambled}</p>
        </div>
        {feedback === "correct" && <p className="text-green-600 font-semibold mb-2">✅ Correct!</p>}
        {feedback === "wrong" && <p className="text-red-500 font-semibold mb-2">❌ Answer: {words[index].word}</p>}
        <input value={input} onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder="Type your answer..."
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-lg font-bold tracking-widest focus:outline-none focus:border-indigo-400 text-gray-900 mb-3" />
        <div className="flex gap-2">
          <button onClick={check} className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-semibold hover:bg-indigo-700 transition">Check ✓</button>
          <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-600 py-2 rounded-xl font-medium hover:bg-gray-50 transition">Done</button>
        </div>
      </div>
    </div>
  );
}

function QuizPopup({ onClose }: { onClose: () => void }) {
  const questions = [
    { q: "What is 15 × 4?", options: ["50", "60", "45", "55"], answer: 1 },
    { q: "Which planet is closest to the Sun?", options: ["Earth", "Venus", "Mercury", "Mars"], answer: 2 },
    { q: "What is H₂O commonly known as?", options: ["Salt", "Water", "Oxygen", "Acid"], answer: 1 },
    { q: "Who invented the telephone?", options: ["Edison", "Graham Bell", "Tesla", "Newton"], answer: 1 },
    { q: "What is the capital of India?", options: ["Mumbai", "Chennai", "New Delhi", "Kolkata"], answer: 2 },
  ];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === questions[current].answer) setScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (current + 1 >= questions.length) setDone(true);
      else setCurrent(c => c + 1);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        {done ? (
          <div className="text-center">
            <div className="text-6xl mb-4">{score >= 4 ? "🏆" : score >= 3 ? "🎉" : "💪"}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
            <p className="text-4xl font-bold text-indigo-600 mb-4">{score}<span className="text-gray-400 text-2xl">/5</span></p>
            <button onClick={onClose} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold">Back to Learning 📚</button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm font-semibold text-gray-700">Question {current + 1} of {questions.length}</p>
              <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
              <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${(current / questions.length) * 100}%` }} />
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 mb-5">
              <p className="text-gray-900 font-bold text-lg">{questions[current].q}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {questions[current].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i)}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${selected === null ? "border-gray-200 text-gray-800 bg-white hover:border-indigo-400 hover:bg-indigo-50"
                      : i === questions[current].answer ? "border-green-500 bg-green-50 text-green-700"
                        : i === selected ? "border-red-400 bg-red-50 text-red-600"
                          : "border-gray-100 text-gray-400 bg-gray-50"
                    }`}>{opt}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BreathingPopup({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");
  const [count, setCount] = useState(5);
  const [cycles, setCycles] = useState(0);
  const totalCycles = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhase(p => {
            if (p === "inhale") { setCount(5); return "exhale"; }
            setCycles(cy => cy + 1); setCount(5); return "inhale";
          });
          return 5;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { if (cycles >= totalCycles) setTimeout(onClose, 1500); }, [cycles, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundImage: "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200)", backgroundSize: "cover" }}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-1">🌿 Breathing Exercise</h3>
        <p className="text-gray-500 text-sm mb-6">Cycle {Math.min(cycles + 1, totalCycles)} of {totalCycles}</p>
        <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center mx-auto mb-6 transition-all duration-1000 border-4 ${phase === "inhale" ? "bg-blue-100 border-blue-400 scale-110" : "bg-green-100 border-green-400 scale-90"}`}>
          <span className="text-4xl font-bold text-gray-800">{count}</span>
          <span className="text-xs text-gray-500 mt-1">seconds</span>
        </div>
        <div className={`text-2xl font-bold mb-2 ${phase === "inhale" ? "text-blue-600" : "text-green-600"}`}>
          {phase === "inhale" ? "🌬️ Breathe In" : "😮‍💨 Breathe Out"}
        </div>
        <p className="text-gray-500 text-sm mb-6">
          {phase === "inhale" ? "Slowly inhale through your nose..." : "Slowly exhale through your mouth..."}
        </p>
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: totalCycles }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < cycles ? "bg-green-500" : i === cycles ? "bg-blue-400 animate-pulse" : "bg-gray-200"}`} />
          ))}
        </div>
        {cycles >= totalCycles ? (
          <button onClick={onClose} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold">Back to Learning 📚</button>
        ) : (
          <button onClick={onClose} className="w-full border-2 border-gray-200 text-gray-500 py-2 rounded-xl text-sm">Skip</button>
        )}
      </div>
    </div>
  );
}

function BrainGamePopup({ onClose }: { onClose: () => void }) {
  return <SimonGame onClose={onClose} />;
}

export default function VideoPlayer() {
  const { courseName, videoId } = useParams();
  const navigate = useNavigate();
  const cameraRef = useRef<HTMLVideoElement>(null);
  const [learningState, setLearningState] = useState<LearningState>("neutral");
  const [popup, setPopup] = useState<LearningState | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const popupCooldown = useRef(false);

  const course = courseVideos[courseName?.toLowerCase() || ""] || courseVideos["mathematics"];
  const currentIndex = parseInt(videoId || "1") - 1;
  const currentVideo = course.videos[currentIndex] || course.videos[0];

  // Safe config lookup with fallback
  const config = stateConfig[learningState] ?? stateConfig["neutral"];

  // Prevent screen sleep
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await (navigator as any).wakeLock.request("screen");
        }
      } catch (err) {
        console.log("Wake lock not available");
      }
    };
    requestWakeLock();
    return () => { if (wakeLock) wakeLock.release(); };
  }, []);

  useEffect(() => {
    if (!getToken()) return;
    let stream: MediaStream;
    let detectionInterval: ReturnType<typeof setInterval>;
    let cycleTimeout: ReturnType<typeof setTimeout>;

    const DETECTION_DURATION_MS = 60 * 1000;   // detect for 60 seconds
    const CYCLE_INTERVAL_MS     = 5 * 60 * 1000; // every 5 minutes

    const analyzeFrame = () => {
      const canvas = document.createElement("canvas");
      const video = cameraRef.current;
      if (!video || video.readyState < 2) return;
      canvas.width = 640; canvas.height = 480;  // higher res → better detection
      canvas.getContext("2d")?.drawImage(video, 0, 0, 640, 480);
      const base64 = canvas.toDataURL("image/jpeg", 0.9);  // higher quality
      emotionAPI.analyze(base64)
        .then((r: any) => {
          if (r.error) {
            console.error("Backend Error:", r.error);
            setBackendError(`Backend: ${r.error}`);
            return;
          }
          setBackendError(null);
          const detected = r.dominant_emotion || "neutral";
          const mapped = detected === "looking_away" ? "distracted" : detected;
          const state: LearningState = VALID_STATES.includes(mapped as LearningState)
            ? (mapped as LearningState)
            : "neutral";
          setLearningState(state);
          if (!popupCooldown.current && state !== "neutral" && state !== "focused") {
            setPopup(state);
            popupCooldown.current = true;
          }
        })
        .catch((err) => {
          console.error("Emotion API Error:", err);
          setBackendError("Cannot connect to emotion backend. Please try again.");
        });
    };

    const startDetectionWindow = () => {
      console.log("[Emotion] Detection window started (60s)");
      // Poll every 3s within the 60s detection window (keeps smoothing buffer working)
      detectionInterval = setInterval(analyzeFrame, 3000);
      // Stop detection after 60 seconds, then schedule next cycle
      cycleTimeout = setTimeout(() => {
        clearInterval(detectionInterval);
        console.log("[Emotion] Detection window ended. Next in 4 min.");
        // Wait the remaining 4 minutes before next detection window
        cycleTimeout = setTimeout(startDetectionWindow, CYCLE_INTERVAL_MS - DETECTION_DURATION_MS);
      }, DETECTION_DURATION_MS);
    };

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cameraRef.current) cameraRef.current.srcObject = stream;
        setCameraOn(true);
        // Start first detection window immediately, then repeat every 5 minutes
        startDetectionWindow();
      } catch (err) { console.error("Camera not available", err); }
    };

    startCamera();
    return () => {
      clearInterval(detectionInterval);
      clearTimeout(cycleTimeout);
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const closePopup = () => {
    setPopup(null);
    setSelectedGame(null);
    setTimeout(() => { popupCooldown.current = false; }, 60000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="flex items-center gap-4 p-4 bg-gray-900 border-b border-gray-800">
        <Button variant="ghost" onClick={() => navigate("/student-dashboard")} className="text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="font-bold text-lg flex-1">{course.title}</h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${config.bgColor} ${config.color}`}>
          <span className="text-base">{config.emoji}</span>
          <span>{config.label}</span>
          {cameraOn && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
        </div>
      </div>

      <div className="flex gap-2 px-4 py-2 bg-gray-800 flex-wrap">
        {VALID_STATES.map(s => (
          <button key={s}
            onClick={() => { setLearningState(s); setPopup(s); setSelectedGame(null); popupCooldown.current = false; }}
            className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-indigo-600 text-white transition capitalize">
            {stateConfig[s].emoji} {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        <div className="flex-1 flex flex-col">
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe key={currentVideo.id}
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0`}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
          <div className="p-4 flex items-start justify-between bg-gray-900">
            <div>
              <h2 className="text-lg font-bold">{currentVideo.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{course.title} • {currentVideo.duration}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <video ref={cameraRef} autoPlay muted className="w-20 h-14 rounded-lg object-cover border-2 border-gray-700 opacity-70" />
              <span className="text-xs text-gray-500">AI Watching 👁️</span>
            </div>
          </div>
          <div className={`mx-4 mb-4 p-3 rounded-xl border ${config.bgColor} ${config.color} flex items-center gap-3`}>
            <span className="text-2xl">{config.emoji}</span>
            <div>
              <p className="font-semibold text-sm">Learning State: {config.label}</p>
              <p className="text-xs opacity-80">{config.message.split("\n")[0].slice(0, 80)}...</p>
            </div>
          </div>
          {backendError && (
            <div className="mx-4 mb-4 p-3 rounded-xl bg-red-100 border border-red-400 text-red-700 flex items-center gap-3 animate-pulse">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold text-sm">Python Backend Error</p>
                <p className="text-xs">{backendError}</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 bg-gray-900 overflow-y-auto border-l border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-semibold">Course Videos</h3>
            <p className="text-gray-400 text-sm">{course.videos.length} lessons</p>
          </div>
          {course.videos.map((video, i) => (
            <div key={video.id} onClick={() => navigate(`/course/${courseName}/video/${i + 1}`)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-800 transition border-b border-gray-800 ${i === currentIndex ? "bg-gray-800 border-l-4 border-l-indigo-500" : ""}`}>
              <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt={video.title} className="w-24 h-14 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${i === currentIndex ? "text-indigo-400" : "text-white"}`}>{video.title}</p>
                <p className="text-gray-400 text-xs mt-1">{video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {popup === "bored" && !selectedGame && <GameSelectPopup onSelect={setSelectedGame} onClose={closePopup} />}
      {popup === "bored" && selectedGame === "simon" && <SimonGame onClose={closePopup} />}
      {popup === "bored" && selectedGame === "memory" && <MemoryGame onClose={closePopup} />}
      {popup === "bored" && selectedGame === "math" && <MathGame onClose={closePopup} />}
      {popup === "bored" && selectedGame === "word" && <WordGame onClose={closePopup} />}
      {popup === "frustrated" && <BreathingPopup onClose={closePopup} />}
      {popup === "sleepy" && <BrainGamePopup onClose={closePopup} />}

      {popup && !["bored", "frustrated", "sleepy"].includes(popup) && (
        <div className="fixed bottom-6 right-6 z-50 w-80">
          <div className={`rounded-2xl shadow-2xl border-2 p-5 ${stateConfig[popup]?.bgColor ?? "bg-gray-50 border-gray-300"}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{stateConfig[popup]?.emoji}</span>
                <h4 className={`font-bold ${stateConfig[popup]?.color}`}>{stateConfig[popup]?.title}</h4>
              </div>
              <button onClick={closePopup}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <p className={`text-sm mb-4 whitespace-pre-line ${stateConfig[popup]?.color}`}>{stateConfig[popup]?.message}</p>
            <button onClick={closePopup} className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
              {stateConfig[popup]?.action}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
