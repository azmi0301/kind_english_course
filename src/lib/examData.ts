// ─── Exam Data Types & Placeholder Content ───────────────────────────────────
// Replace this placeholder data with your actual TOEFL questions.

export type QuestionType = "reading" | "listening" | "structure";

export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  number: number;
  type: QuestionType;
  passage?: string; // for reading
  audioUrl?: string; // for listening
  audioTranscript?: string; // for listening (hidden)
  question: string;
  choices: Choice[];
  correctAnswer: string; // choice id
}

export interface ExamSection {
  id: string;
  title: string;
  type: QuestionType;
  durationSeconds: number;
  instructions: string;
  questions: Question[];
}

export interface ExamPackage {
  id: string;
  title: string;
  description: string;
  type?: "ITP" | "Diagnostic" | "Practice";
  durationMinutes?: number;
  sections: ExamSection[];
}

// ─── Placeholder Reading Passage ─────────────────────────────────────────────
const READING_PASSAGE_1 = `The Industrial Revolution, which began in Britain in the late eighteenth century, was one of the most transformative periods in human history. It marked the transition from agrarian societies to industrialized urban centers, fundamentally altering the way people lived and worked.

The development of steam power was central to this transformation. James Watt's improvements to the steam engine in the 1760s made it far more efficient and practical for industrial use. Factories began to emerge, powered by steam, and they could produce goods far faster and more cheaply than traditional craftsmen. This led to a dramatic increase in manufacturing output and the growth of cities as workers migrated from the countryside.

The social consequences were profound. While industrialization created enormous wealth and technological progress, it also led to harsh working conditions, child labor, and extreme poverty in urban slums. Workers labored for twelve to sixteen hours a day in dangerous conditions for meager wages. These conditions eventually gave rise to labor movements and the push for workers' rights.

Transportation also underwent a revolution. The development of the railway network allowed goods and people to move across the country with unprecedented speed. By 1850, Britain had over 6,000 miles of railway track, connecting industrial centers and opening up new markets. This infrastructure was crucial for the continued growth of the industrial economy.`;

const READING_PASSAGE_2 = `Marine ecosystems cover more than 70 percent of Earth's surface and are home to an extraordinary diversity of life. From the sunlit surface waters to the deepest ocean trenches, marine environments support millions of species, many of which have not yet been discovered or described by scientists.

Coral reefs are among the most biologically diverse ecosystems on the planet. Although they cover less than one percent of the ocean floor, coral reefs provide habitat for approximately 25 percent of all marine species. These intricate structures are built by tiny animals called coral polyps, which secrete calcium carbonate to form their skeletons. Over thousands of years, these skeletons accumulate to form the massive reef structures we see today.

However, coral reefs are under severe threat from human activities. Rising ocean temperatures, caused by climate change, lead to coral bleaching, a phenomenon in which corals expel the symbiotic algae that give them their color and provide most of their nutrition. Without these algae, corals turn white and may eventually die. Ocean acidification, another consequence of increased atmospheric carbon dioxide, makes it harder for corals to build their calcium carbonate skeletons.

Scientists are working on various strategies to protect and restore coral reefs. These include establishing marine protected areas, reducing local pollution and overfishing, and developing more heat-resistant coral strains through selective breeding. The fate of these ecosystems has implications not only for marine biodiversity but also for the hundreds of millions of people who depend on reefs for food, income, and coastal protection.`;

// ─── Placeholder Questions ────────────────────────────────────────────────────
const placeholderReadingQuestions: Question[] = [
  {
    id: "r1",
    number: 1,
    type: "reading",
    passage: READING_PASSAGE_1,
    question: "According to paragraph 1, what was the primary effect of the Industrial Revolution on society?",
    choices: [
      { id: "A", text: "It led to an immediate improvement in the living standards of all workers." },
      { id: "B", text: "It transformed agrarian societies into industrialized urban centers." },
      { id: "C", text: "It caused Britain to lose its position as a major agricultural producer." },
      { id: "D", text: "It created a uniform pattern of economic development across Europe." },
    ],
    correctAnswer: "B",
  },
  {
    id: "r2",
    number: 2,
    type: "reading",
    passage: READING_PASSAGE_1,
    question: "The word 'meager' in paragraph 3 is closest in meaning to",
    choices: [
      { id: "A", text: "generous" },
      { id: "B", text: "unfair" },
      { id: "C", text: "inadequate" },
      { id: "D", text: "variable" },
    ],
    correctAnswer: "C",
  },
  {
    id: "r3",
    number: 3,
    type: "reading",
    passage: READING_PASSAGE_1,
    question: "According to the passage, why was the railway network important to the Industrial Revolution?",
    choices: [
      { id: "A", text: "It reduced the need for steam-powered factories." },
      { id: "B", text: "It enabled the rapid movement of goods and people, supporting economic growth." },
      { id: "C", text: "It replaced the need for canal transportation entirely." },
      { id: "D", text: "It allowed workers to move back to the countryside." },
    ],
    correctAnswer: "B",
  },
  {
    id: "r4",
    number: 4,
    type: "reading",
    passage: READING_PASSAGE_1,
    question: "Which of the following best describes the organization of the passage?",
    choices: [
      { id: "A", text: "A chronological account of key inventions during the Industrial Revolution." },
      { id: "B", text: "A comparison of living conditions before and after industrialization." },
      { id: "C", text: "An overview of the causes, social effects, and infrastructure changes of the Industrial Revolution." },
      { id: "D", text: "An argument in favor of industrial development over agricultural economies." },
    ],
    correctAnswer: "C",
  },
  {
    id: "r5",
    number: 5,
    type: "reading",
    passage: READING_PASSAGE_2,
    question: "According to paragraph 1, which statement is true about marine ecosystems?",
    choices: [
      { id: "A", text: "Most marine species have already been catalogued by scientists." },
      { id: "B", text: "Marine ecosystems only exist in shallow coastal waters." },
      { id: "C", text: "They cover over 70 percent of Earth's surface and harbor vast biodiversity." },
      { id: "D", text: "They are less diverse than terrestrial ecosystems." },
    ],
    correctAnswer: "C",
  },
  {
    id: "r6",
    number: 6,
    type: "reading",
    passage: READING_PASSAGE_2,
    question: "The word 'intricate' in paragraph 2 is closest in meaning to",
    choices: [
      { id: "A", text: "fragile" },
      { id: "B", text: "complex" },
      { id: "C", text: "colorful" },
      { id: "D", text: "ancient" },
    ],
    correctAnswer: "B",
  },
  {
    id: "r7",
    number: 7,
    type: "reading",
    passage: READING_PASSAGE_2,
    question: "According to paragraph 3, what causes coral bleaching?",
    choices: [
      { id: "A", text: "Overfishing of species that feed on coral polyps." },
      { id: "B", text: "The accumulation of calcium carbonate skeletons." },
      { id: "C", text: "Rising ocean temperatures that cause corals to expel their symbiotic algae." },
      { id: "D", text: "Increased competition from non-native marine species." },
    ],
    correctAnswer: "C",
  },
  {
    id: "r8",
    number: 8,
    type: "reading",
    passage: READING_PASSAGE_2,
    question: "What does the author imply about the importance of protecting coral reefs?",
    choices: [
      { id: "A", text: "It is important primarily for scientific research purposes." },
      { id: "B", text: "It has broad implications for both marine biodiversity and human communities." },
      { id: "C", text: "It is too late to reverse the damage already done to coral reefs." },
      { id: "D", text: "It should focus exclusively on reducing ocean temperatures." },
    ],
    correctAnswer: "B",
  },
];

const placeholderStructureQuestions: Question[] = [
  {
    id: "s1", number: 1, type: "structure",
    question: "The committee _______ its final report last Tuesday.",
    choices: [
      { id: "A", text: "submitting" },
      { id: "B", text: "have submitted" },
      { id: "C", text: "submitted" },
      { id: "D", text: "will submitting" },
    ],
    correctAnswer: "C",
  },
  {
    id: "s2", number: 2, type: "structure",
    question: "Neither the manager nor the employees _______ aware of the new policy.",
    choices: [
      { id: "A", text: "was" },
      { id: "B", text: "were" },
      { id: "C", text: "is" },
      { id: "D", text: "being" },
    ],
    correctAnswer: "B",
  },
  {
    id: "s3", number: 3, type: "structure",
    question: "_______ the heavy rain, the outdoor concert was not cancelled.",
    choices: [
      { id: "A", text: "Although" },
      { id: "B", text: "Because of" },
      { id: "C", text: "Despite" },
      { id: "D", text: "Therefore" },
    ],
    correctAnswer: "C",
  },
  {
    id: "s4", number: 4, type: "structure",
    question: "The new bridge, _______ was completed last year, has significantly reduced traffic.",
    choices: [
      { id: "A", text: "that" },
      { id: "B", text: "who" },
      { id: "C", text: "which" },
      { id: "D", text: "whose" },
    ],
    correctAnswer: "C",
  },
  {
    id: "s5", number: 5, type: "structure",
    question: "By the time the guests arrive, we _______ all the preparations.",
    choices: [
      { id: "A", text: "will finish" },
      { id: "B", text: "will have finished" },
      { id: "C", text: "have finished" },
      { id: "D", text: "finished" },
    ],
    correctAnswer: "B",
  },
  {
    id: "s6", number: 6, type: "structure",
    question: "The results of the experiment _______ published in a scientific journal next month.",
    choices: [
      { id: "A", text: "will be" },
      { id: "B", text: "are" },
      { id: "C", text: "was" },
      { id: "D", text: "has been" },
    ],
    correctAnswer: "A",
  },
  {
    id: "s7", number: 7, type: "structure",
    question: "_______ she studied hard, she failed to pass the entrance examination.",
    choices: [
      { id: "A", text: "Since" },
      { id: "B", text: "Even though" },
      { id: "C", text: "So that" },
      { id: "D", text: "In order that" },
    ],
    correctAnswer: "B",
  },
  {
    id: "s8", number: 8, type: "structure",
    question: "The professor asked the students _______ their assignments by Friday.",
    choices: [
      { id: "A", text: "submitting" },
      { id: "B", text: "to submit" },
      { id: "C", text: "submit" },
      { id: "D", text: "submitted" },
    ],
    correctAnswer: "B",
  },
];

const placeholderListeningQuestions: Question[] = [
  {
    id: "l1", number: 1, type: "listening",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    audioTranscript: "[Placeholder audio — replace with your listening content]",
    question: "What is the main topic of the conversation?",
    choices: [
      { id: "A", text: "A university registration problem" },
      { id: "B", text: "A change in class schedule" },
      { id: "C", text: "A student's academic performance" },
      { id: "D", text: "A request for a library extension" },
    ],
    correctAnswer: "B",
  },
  {
    id: "l2", number: 2, type: "listening",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    audioTranscript: "[Placeholder audio — replace with your listening content]",
    question: "What does the man suggest the woman should do?",
    choices: [
      { id: "A", text: "Contact the department office immediately." },
      { id: "B", text: "Wait until the next semester to enroll." },
      { id: "C", text: "Speak directly with the professor." },
      { id: "D", text: "Submit an online complaint form." },
    ],
    correctAnswer: "C",
  },
  {
    id: "l3", number: 3, type: "listening",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    audioTranscript: "[Placeholder audio — replace with your listening content]",
    question: "What can be inferred about the speaker's attitude?",
    choices: [
      { id: "A", text: "Enthusiastic and optimistic." },
      { id: "B", text: "Skeptical and cautious." },
      { id: "C", text: "Indifferent to the outcome." },
      { id: "D", text: "Frustrated and disappointed." },
    ],
    correctAnswer: "A",
  },
  {
    id: "l4", number: 4, type: "listening",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    audioTranscript: "[Placeholder audio — replace with your listening content]",
    question: "According to the lecture, which factor is most important for success?",
    choices: [
      { id: "A", text: "Natural talent and innate ability." },
      { id: "B", text: "Consistent practice and dedication." },
      { id: "C", text: "Access to advanced resources." },
      { id: "D", text: "Support from family and peers." },
    ],
    correctAnswer: "B",
  },
];

// ─── Full ITP Exam ────────────────────────────────────────────────────────────
export const FULL_ITP_EXAM: ExamPackage = {
  id: "itp-full-sim-01",
  title: "TOEFL ITP Institutional Test",
  description: "Official TOEFL ITP test package with Listening, Structure, and Reading sections.",
  type: "ITP",
  durationMinutes: 115,
  sections: [
    {
      id: "listening",
      title: "Section 1: Listening Comprehension",
      type: "listening",
      durationSeconds: 35 * 60,
      instructions:
        "In this section of the test, you will have an opportunity to demonstrate your ability to understand conversations and talks in English. There are two parts to this section with special directions for each part. Answer all questions on the basis of what is stated or implied by the speakers. Do not take notes or write in your test book at any time.",
      questions: placeholderListeningQuestions,
    },
    {
      id: "structure",
      title: "Section 2: Structure and Written Expression",
      type: "structure",
      durationSeconds: 25 * 60,
      instructions:
        "This section is designed to measure your ability to recognize language that is appropriate for standard written English. There are two types of questions in this section: Structure questions (1–15) ask you to choose the one word or phrase that best completes the sentence. Written Expression questions (16–40) identify errors in usage. Choose the word or phrase that is incorrect.",
      questions: placeholderStructureQuestions,
    },
    {
      id: "reading",
      title: "Section 3: Reading Comprehension",
      type: "reading",
      durationSeconds: 55 * 60,
      instructions:
        "In this section of the test, you will read several passages. Each one is followed by a number of questions about it. For questions 1–50, choose the one best answer, (A), (B), (C), or (D), to each question. Answer all questions following a passage on the basis of what is stated or implied in that passage.",
      questions: placeholderReadingQuestions,
    },
  ],
};

export const DIAGNOSTIC_EXAM: ExamPackage = {
  id: "diagnostic-01",
  title: "TOEFL Diagnostic Test",
  description: "Quick diagnostic test to assess your current level.",
  type: "Diagnostic",
  durationMinutes: 30,
  sections: [
    {
      id: "reading-diag",
      title: "Reading Comprehension (Diagnostic)",
      type: "reading",
      durationSeconds: 20 * 60,
      instructions: "Read each passage and answer the questions based on what is stated or implied.",
      questions: placeholderReadingQuestions.slice(0, 4),
    },
    {
      id: "structure-diag",
      title: "Structure & Written Expression (Diagnostic)",
      type: "structure",
      durationSeconds: 10 * 60,
      instructions: "Choose the word or phrase that best completes each sentence.",
      questions: placeholderStructureQuestions.slice(0, 4),
    },
  ],
};

export const EXAM_PACKAGES = [DIAGNOSTIC_EXAM, FULL_ITP_EXAM];
