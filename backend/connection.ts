import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/userProgress");

// Define schema for quiz
const quizSchema = new mongoose.Schema({
  quizTitle: String,
  questions: [
    {
      questionText: String,
      answers: [
        {
          answerId: Number,
          text: String,
        },
      ],
      correctAnswerId: Number,
    },
  ],
});

// Define schema for progress
const progressSchema = new mongoose.Schema({
  userId: String,
  moduleId: String,
  videoId: String,
  videoName: String,
  timeSpent: Number, // in seconds
  completed: Boolean,
  quizResults: Array,
});

// Define schema for chat messages
const messageSchema = new mongoose.Schema({
  userId: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const videoSchema = new mongoose.Schema({
  title: String,
  videoId: String,
});

const quizProgressSchema = new mongoose.Schema({
  userId: String,
  questionId: String,
  result: Boolean,
});

// Create models
// const quiz = mongoose.model("quizzes", quizSchema);
const Progress = mongoose.model("Progress", progressSchema);
const Message = mongoose.model("Message", messageSchema);
const Video = mongoose.model("Video", videoSchema);
const QuizProgress = mongoose.model("QuizProgress", quizProgressSchema);

// Save or update quiz progress API
app.post("/api/saveQuizProgress", async (req, res) => {
  const { userId, questionId, result } = req.body;
  console.log("userId, questionId, result", userId, questionId, result);

  try {
    // Check if quiz progress for this question already exists for this user
    let quizProgress = await QuizProgress.findOne({ userId, questionId });

    if (quizProgress) {
      // Update existing progress
      quizProgress.result = result;
      await quizProgress.save();
      res.status(200).send({ message: "Quiz progress updated", quizProgress });
    } else {
      // Create new progress entry
      quizProgress = new QuizProgress({
        userId,
        questionId,
        result,
      });
      await quizProgress.save();
      res.status(201).send({ message: "Quiz progress saved", quizProgress });
    }
  } catch (error) {
    res.status(500).send("Error saving quiz progress.");
  }
});

// Fetch quiz progress by userId API
app.get("/api/getQuizProgress/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("/api/getQuizProgress/:userId", userId);
  try {
    const quizProgressData = await QuizProgress.find({ userId });
    res.status(200).json(quizProgressData);
  } catch (error) {
    res.status(500).send("Error fetching quiz progress.");
  }
});

// Fetch quiz data API
app.get("/api/quiz", async (req: Request, res: Response) => {
  try {
    console.log("Fetching quiz data");
    const quizzes = await mongoose.connection
      .collection("quizzes")
      .find()
      .toArray();
    console.log(quizzes);
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).send("Error fetching quizzes.");
  }
});

// Save progress API
app.post("/api/saveProgress", async (req: Request, res: Response) => {
  const {
    userId,
    moduleId,
    videoId,
    timeSpent,
    videoName,
    completed,
    quizResults,
  } = req.body;
  try {
    const existingProgress = await Progress.findOne({
      userId,
      moduleId,
      videoId,
    });

    if (existingProgress) {
      if (
        !existingProgress.timeSpent ||
        timeSpent > existingProgress.timeSpent
      ) {
        existingProgress.timeSpent = timeSpent;
      }
      existingProgress.completed = completed;
      existingProgress.quizResults = quizResults;

      await existingProgress.save();
      res.status(200).send(existingProgress);
    } else {
      const newProgress = new Progress({
        userId,
        moduleId,
        videoId,
        videoName,
        timeSpent,
        completed,
        quizResults,
      });
      await newProgress.save();
      res.status(201).send(newProgress);
    }
  } catch (error) {
    res.status(500).send("Error saving progress.");
  }
});

// Get progress for a specific user
app.get("/api/progress/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const progressRecords = await Progress.find({ userId });
    if (progressRecords.length === 0) {
      return res.status(404).send("No progress records found for this user.");
    }
    res.status(200).json(progressRecords);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).send("Error fetching progress.");
  }
});

// Fetch all chat messages (for initial load)
app.get("/api/messages", async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).send("Error fetching messages.");
  }
});

// Fetch all videos API
app.get("/api/videos", async (req: Request, res: Response) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).send("Error fetching videos.");
  }
});

// Seeding

// app.get("/api/seed-videos", async (req: Request, res: Response) => {
//   try {
//     const videos = [
//       { id: "1", title: "English Beginner", videoId: "0MyUBkgrvqU" },
//       { id: "2", title: "English Advance", videoId: "uLN6IdRtDhg" },
//       { id: "3", title: "Spanish Beginner", videoId: "DAp_v7EH9AA" },
//       { id: "4", title: "Spanish Advance", videoId: "C7B0WeZNu4I" },
//       { id: "5", title: "French Beginner", videoId: "ujDtm0hZyII" },
//       { id: "6", title: "French Advance", videoId: "eUBuIJuKptw" },
//     ];
//     await Video.insertMany(videos);
//     res.status(201).send("Videos seeded successfully.");
//   } catch (error) {
//     console.error("Error seeding videos:", error);
//     res.status(500).send("Error seeding videos.");
//   }
// });

// app.get("/api/seed-quiz", async (req: Request, res: Response) => {
//   try {
//     const quizQandA = [
//       {
//         quizTitle: "English - Beginner",
//         questions: [
//           {
//             questionText: "What is the main purpose of the video?",
//             answers: [
//               { answerId: 1, text: "Improve writing skills" },
//               { answerId: 2, text: "Practice pronunciation" },
//               { answerId: 3, text: "Develop basic listening skills" },
//               { answerId: 4, text: "Learn advanced idioms" },
//             ],
//             correctAnswerId: 3,
//           },
//           {
//             questionText:
//               "Which scenario is often used to help beginners in the video?",
//             answers: [
//               { answerId: 1, text: "Business meetings" },
//               {
//                 answerId: 2,
//                 text: "Daily conversations like ordering food",
//               },
//               { answerId: 3, text: "Academic lectures" },
//               { answerId: 4, text: "Job interviews" },
//             ],
//             correctAnswerId: 2,
//           },
//           {
//             questionText: "What type of exercises does the video offer?",
//             answers: [
//               { answerId: 1, text: "Role-playing interviews" },
//               {
//                 answerId: 2,
//                 text: "Listening comprehension with short dialogues",
//               },
//               { answerId: 3, text: "Crossword puzzles" },
//               { answerId: 4, text: "Essay writing practice" },
//             ],
//             correctAnswerId: 2,
//           },
//           {
//             questionText: "Which skill is NOT emphasized in this video?",
//             answers: [
//               { answerId: 1, text: "Listening" },
//               { answerId: 2, text: "Speaking" },
//               { answerId: 3, text: "Advanced grammar rules" },
//               { answerId: 4, text: "Vocabulary building" },
//             ],
//             correctAnswerId: 3,
//           },
//           {
//             questionText: "How does the video recommend tracking progress?",
//             answers: [
//               {
//                 answerId: 1,
//                 text: "Using a checklist of completed dialogues",
//               },
//               { answerId: 2, text: "Re-watching the video multiple times" },
//               { answerId: 3, text: "Taking online quizzes" },
//               {
//                 answerId: 4,
//                 text: "Practicing with native speakers directly",
//               },
//             ],
//             correctAnswerId: 1,
//           },
//         ],
//       },
//       {
//         quizTitle: "Spanish - Beginner",
//         questions: [
//           {
//             questionText:
//               "What type of conversations are covered in this beginner-level Spanish video?",
//             answers: [
//               { answerId: 1, text: "Business transactions" },
//               {
//                 answerId: 2,
//                 text: "Daily scenarios like greetings and shopping",
//               },
//               { answerId: 3, text: "Medical consultations" },
//               { answerId: 4, text: "Legal procedures" },
//             ],
//             correctAnswerId: 2,
//           },
//           {
//             questionText:
//               "How does the video assist learners with understanding new vocabulary?",
//             answers: [
//               {
//                 answerId: 1,
//                 text: "Vocabulary is explained only at the end of the video",
//               },
//               {
//                 answerId: 2,
//                 text: "Subtitles in both Spanish and English",
//               },
//               { answerId: 3, text: "No subtitles are provided" },
//               {
//                 answerId: 4,
//                 text: "Vocabulary lists are given in a downloadable PDF",
//               },
//             ],
//             correctAnswerId: 2,
//           },
//           {
//             questionText:
//               "Which of these phrases is likely taught in the video?",
//             answers: [
//               { answerId: 1, text: "¿Cómo estás? (How are you?)" },
//               {
//                 answerId: 2,
//                 text: "¿Dónde está la oficina del director? (Where is the principal’s office?)",
//               },
//               {
//                 answerId: 3,
//                 text: "¿Cuál es tu estado civil? (What is your marital status?)",
//               },
//               {
//                 answerId: 4,
//                 text: "Me gustaría cancelar mi suscripción. (I would like to cancel my subscription.)",
//               },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "What is the main teaching approach used in the video?",
//             answers: [
//               { answerId: 1, text: "Immersion without translation" },
//               {
//                 answerId: 2,
//                 text: "Slow and clear pronunciation with translations",
//               },
//               { answerId: 3, text: "Fast-paced native conversations" },
//               { answerId: 4, text: "Written exercises only" },
//             ],
//             correctAnswerId: 2,
//           },
//           {
//             questionText:
//               "Which aspect of language learning is emphasized most?",
//             answers: [
//               { answerId: 1, text: "Advanced grammar" },
//               { answerId: 2, text: "Listening comprehension" },
//               { answerId: 3, text: "Complex writing" },
//               { answerId: 4, text: "Pronunciation correction" },
//             ],
//             correctAnswerId: 2,
//           },
//         ],
//       },
//       {
//         quizTitle: "French - Beginner",
//         questions: [
//           {
//             questionText:
//               "What is the focus of the beginner-level French video?",
//             answers: [
//               { answerId: 1, text: "Phonetics and pronunciation drills" },
//               { answerId: 2, text: "Basic conversations and greetings" },
//               { answerId: 3, text: "Technical vocabulary" },
//               { answerId: 4, text: "Formal writing techniques" },
//             ],
//             correctAnswerId: 2,
//           },
//           {
//             questionText: "Which of these French phrases is likely introduced?",
//             answers: [
//               {
//                 answerId: 1,
//                 text: "Bonjour, comment ça va? (Hello, how are you?)",
//               },
//               {
//                 answerId: 2,
//                 text: "Quelle est votre profession? (What is your profession?)",
//               },
//               {
//                 answerId: 3,
//                 text: "Avez-vous un passeport? (Do you have a passport?)",
//               },
//               {
//                 answerId: 4,
//                 text: "Quelle est la politique de retour? (What is the return policy?)",
//               },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "How are learners supported during the listening activities?",
//             answers: [
//               { answerId: 1, text: "Bilingual subtitles" },
//               { answerId: 2, text: "No translations provided" },
//               { answerId: 3, text: "Interactive quizzes" },
//               { answerId: 4, text: "Real-time teacher feedback" },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "What is the recommended way to practice listening, according to the video?",
//             answers: [
//               { answerId: 1, text: "Watch without pausing the video" },
//               { answerId: 2, text: "Watch repeatedly with subtitles" },
//               { answerId: 3, text: "Write down every word" },
//               { answerId: 4, text: "Practice with a native speaker only" },
//             ],
//             correctAnswerId: 2,
//           },
//           {
//             questionText:
//               "Which type of learning content is NOT part of the video?",
//             answers: [
//               { answerId: 1, text: "Greetings and introductions" },
//               { answerId: 2, text: "Writing essays" },
//               { answerId: 3, text: "Vocabulary for daily life" },
//               { answerId: 4, text: "Basic sentence structures" },
//             ],
//             correctAnswerId: 2,
//           },

//           {
//             quizTitle: "English - Advanced",
//             questions: [
//               {
//                 questionText:
//                   "What is the primary focus of advanced-level listening exercises?",
//                 answers: [
//                   { answerId: 1, text: "Everyday conversations" },
//                   {
//                     answerId: 2,
//                     text: "Complex sentence structures and nuances",
//                   },
//                   { answerId: 3, text: "Basic vocabulary" },
//                   { answerId: 4, text: "Simple sentence construction" },
//                 ],
//                 correctAnswerId: 2,
//               },
//               {
//                 questionText:
//                   "Which idiomatic phrase is explained in the video?",
//                 answers: [
//                   { answerId: 1, text: "Break the ice" },
//                   { answerId: 2, text: "Hit the sack" },
//                   { answerId: 3, text: "Bite the bullet" },
//                   { answerId: 4, text: "All of the above" },
//                 ],
//                 correctAnswerId: 4,
//               },
//               {
//                 questionText:
//                   "How does the video recommend improving pronunciation at an advanced level?",
//                 answers: [
//                   {
//                     answerId: 1,
//                     text: "Listen to native speakers and mimic",
//                   },
//                   {
//                     answerId: 2,
//                     text: "Only read aloud without listening",
//                   },
//                   { answerId: 3, text: "Focus solely on grammar" },
//                   { answerId: 4, text: "Use basic phonetic exercises" },
//                 ],
//                 correctAnswerId: 1,
//               },
//               {
//                 questionText:
//                   "Which of these activities is suggested for advanced vocabulary enhancement?",
//                 answers: [
//                   {
//                     answerId: 1,
//                     text: "Reading complex articles and stories",
//                   },
//                   { answerId: 2, text: "Practicing simple greetings" },
//                   { answerId: 3, text: "Memorizing verb conjugations" },
//                   { answerId: 4, text: "Translating basic words only" },
//                 ],
//                 correctAnswerId: 1,
//               },
//               {
//                 questionText:
//                   "What type of listening material is recommended for advanced learners?",
//                 answers: [
//                   { answerId: 1, text: "News broadcasts and podcasts" },
//                   { answerId: 2, text: "Children's stories" },
//                   { answerId: 3, text: "Beginner conversations" },
//                   { answerId: 4, text: "Simple instructions" },
//                 ],
//                 correctAnswerId: 1,
//               },
//             ],
//           },
//           {
//             quizTitle: "Spanish - Advanced",
//             questions: [
//               {
//                 questionText:
//                   "What is the main focus of this advanced Spanish lesson?",
//                 answers: [
//                   {
//                     answerId: 1,
//                     text: "Understanding complex idiomatic expressions",
//                   },
//                   { answerId: 2, text: "Learning basic greetings" },
//                   { answerId: 3, text: "Reciting vocabulary lists" },
//                   { answerId: 4, text: "Introduction to alphabet sounds" },
//                 ],
//                 correctAnswerId: 1,
//               },
//               {
//                 questionText:
//                   "Which Spanish expression is covered to convey agreement?",
//                 answers: [
//                   { answerId: 1, text: "De acuerdo" },
//                   { answerId: 2, text: "No pasa nada" },
//                   { answerId: 3, text: "Me importa un bledo" },
//                   { answerId: 4, text: "Lo mismo da" },
//                 ],
//                 correctAnswerId: 1,
//               },
//               {
//                 questionText:
//                   "What is recommended for mastering Spanish accentuation?",
//                 answers: [
//                   { answerId: 1, text: "Practicing with native speakers" },
//                   { answerId: 2, text: "Avoiding spoken practice" },
//                   { answerId: 3, text: "Repeating basic words only" },
//                   {
//                     answerId: 4,
//                     text: "Reading without pronunciation correction",
//                   },
//                 ],
//                 correctAnswerId: 1,
//               },
//               {
//                 questionText:
//                   "Which activity is best suited for vocabulary building at an advanced level?",
//                 answers: [
//                   {
//                     answerId: 1,
//                     text: "Reading Spanish literature and articles",
//                   },
//                   { answerId: 2, text: "Memorizing the alphabet" },
//                   { answerId: 3, text: "Practicing beginner phrases" },
//                   { answerId: 4, text: "Simple verb conjugation" },
//                 ],
//                 correctAnswerId: 1,
//               },
//               {
//                 questionText:
//                   "Which type of resource is suggested for advanced listening practice?",
//                 answers: [
//                   { answerId: 1, text: "Documentaries and radio programs" },
//                   { answerId: 2, text: "Children's audio books" },
//                   { answerId: 3, text: "Basic conversation guides" },
//                   { answerId: 4, text: "Flashcard apps" },
//                 ],
//                 correctAnswerId: 1,
//               },
//             ],
//           },
//           {
//             quizTitle: "French - Advanced",
//             questions: [
//               {
//                 questionText:
//                   "What is the central topic of the advanced French video?",
//                 answers: [
//                   { answerId: 1, text: "Formal and idiomatic expressions" },
//                   {
//                     answerId: 2,
//                     text: "Basic greetings and introductions",
//                   },
//                   { answerId: 3, text: "Elementary sentence structures" },
//                   { answerId: 4, text: "Simple vocabulary" },
//                 ],
//                 correctAnswerId: 1,
//               },
//               {
//                 questionText:
//                   "Which idiomatic phrase is highlighted in the lesson?",
//                 answers: [
//                   { answerId: 1, text: "Mettre son grain de sel" },
//                   { answerId: 2, text: "Comment ça va" },
//                   { answerId: 3, text: "Quelle heure est-il" },
//                   { answerId: 4, text: "Merci beaucoup" },
//                 ],
//                 correctAnswerId: 1,
//               },
//               {
//                 questionText:
//                   "What does the video suggest for achieving fluency in pronunciation?",
//                 answers: [
//                   {
//                     answerId: 1,
//                     text: "Listening to native conversations and imitating them",
//                   },
//                   {
//                     answerId: 2,
//                     text: "Reading without practicing pronunciation",
//                   },
//                   {
//                     answerId: 3,
//                     text: "Focusing only on written exercises",
//                   },
//                   {
//                     answerId: 4,
//                     text: "Learning individual letters and sounds only",
//                   },
//                 ],
//                 correctAnswerId: 1,
//               },
//               {
//                 questionText:
//                   "Which of the following is recommended for building an advanced vocabulary?",
//                 answers: [
//                   {
//                     answerId: 1,
//                     text: "Reading French novels and articles",
//                   },
//                   { answerId: 2, text: "Learning only basic verbs" },
//                   { answerId: 3, text: "Memorizing common greetings" },
//                   { answerId: 4, text: "Watching cartoons" },
//                 ],
//                 correctAnswerId: 1,
//               },
//               {
//                 questionText:
//                   "What is suggested as an effective listening exercise for advanced learners?",
//                 answers: [
//                   {
//                     answerId: 1,
//                     text: "Listening to French news and interviews",
//                   },
//                   { answerId: 2, text: "Learning the French alphabet" },
//                   { answerId: 3, text: "Watching French children's shows" },
//                   { answerId: 4, text: "Reading beginner-level dialogues" },
//                 ],
//                 correctAnswerId: 1,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         quizTitle: "English - Advanced",
//         questions: [
//           {
//             questionText:
//               "What is the primary focus of advanced-level listening exercises?",
//             answers: [
//               { answerId: 1, text: "Everyday conversations" },
//               { answerId: 2, text: "Complex sentence structures and nuances" },
//               { answerId: 3, text: "Basic vocabulary" },
//               { answerId: 4, text: "Simple sentence construction" },
//             ],
//             correctAnswerId: 2,
//           },
//           {
//             questionText: "Which idiomatic phrase is explained in the video?",
//             answers: [
//               { answerId: 1, text: "Break the ice" },
//               { answerId: 2, text: "Hit the sack" },
//               { answerId: 3, text: "Bite the bullet" },
//               { answerId: 4, text: "All of the above" },
//             ],
//             correctAnswerId: 4,
//           },
//           {
//             questionText:
//               "How does the video recommend improving pronunciation at an advanced level?",
//             answers: [
//               { answerId: 1, text: "Listen to native speakers and mimic" },
//               { answerId: 2, text: "Only read aloud without listening" },
//               { answerId: 3, text: "Focus solely on grammar" },
//               { answerId: 4, text: "Use basic phonetic exercises" },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "Which of these activities is suggested for advanced vocabulary enhancement?",
//             answers: [
//               { answerId: 1, text: "Reading complex articles and stories" },
//               { answerId: 2, text: "Practicing simple greetings" },
//               { answerId: 3, text: "Memorizing verb conjugations" },
//               { answerId: 4, text: "Translating basic words only" },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "What type of listening material is recommended for advanced learners?",
//             answers: [
//               { answerId: 1, text: "News broadcasts and podcasts" },
//               { answerId: 2, text: "Children's stories" },
//               { answerId: 3, text: "Beginner conversations" },
//               { answerId: 4, text: "Simple instructions" },
//             ],
//             correctAnswerId: 1,
//           },
//         ],
//       },
//       {
//         quizTitle: "Spanish - Advanced",
//         questions: [
//           {
//             questionText:
//               "What is the main focus of this advanced Spanish lesson?",
//             answers: [
//               {
//                 answerId: 1,
//                 text: "Understanding complex idiomatic expressions",
//               },
//               { answerId: 2, text: "Learning basic greetings" },
//               { answerId: 3, text: "Reciting vocabulary lists" },
//               { answerId: 4, text: "Introduction to alphabet sounds" },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "Which Spanish expression is covered to convey agreement?",
//             answers: [
//               { answerId: 1, text: "De acuerdo" },
//               { answerId: 2, text: "No pasa nada" },
//               { answerId: 3, text: "Me importa un bledo" },
//               { answerId: 4, text: "Lo mismo da" },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "What is recommended for mastering Spanish accentuation?",
//             answers: [
//               { answerId: 1, text: "Practicing with native speakers" },
//               { answerId: 2, text: "Avoiding spoken practice" },
//               { answerId: 3, text: "Repeating basic words only" },
//               { answerId: 4, text: "Reading without pronunciation correction" },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "Which activity is best suited for vocabulary building at an advanced level?",
//             answers: [
//               { answerId: 1, text: "Reading Spanish literature and articles" },
//               { answerId: 2, text: "Memorizing the alphabet" },
//               { answerId: 3, text: "Practicing beginner phrases" },
//               { answerId: 4, text: "Simple verb conjugation" },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "Which type of resource is suggested for advanced listening practice?",
//             answers: [
//               { answerId: 1, text: "Documentaries and radio programs" },
//               { answerId: 2, text: "Children's audio books" },
//               { answerId: 3, text: "Basic conversation guides" },
//               { answerId: 4, text: "Flashcard apps" },
//             ],
//             correctAnswerId: 1,
//           },
//         ],
//       },
//       {
//         quizTitle: "French - Advanced",
//         questions: [
//           {
//             questionText:
//               "What is the central topic of the advanced French video?",
//             answers: [
//               { answerId: 1, text: "Formal and idiomatic expressions" },
//               { answerId: 2, text: "Basic greetings and introductions" },
//               { answerId: 3, text: "Elementary sentence structures" },
//               { answerId: 4, text: "Simple vocabulary" },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "Which idiomatic phrase is highlighted in the lesson?",
//             answers: [
//               { answerId: 1, text: "Mettre son grain de sel" },
//               { answerId: 2, text: "Comment ça va" },
//               { answerId: 3, text: "Quelle heure est-il" },
//               { answerId: 4, text: "Merci beaucoup" },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "What does the video suggest for achieving fluency in pronunciation?",
//             answers: [
//               {
//                 answerId: 1,
//                 text: "Listening to native conversations and imitating them",
//               },
//               { answerId: 2, text: "Reading without practicing pronunciation" },
//               { answerId: 3, text: "Focusing only on written exercises" },
//               {
//                 answerId: 4,
//                 text: "Learning individual letters and sounds only",
//               },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "Which of the following is recommended for building an advanced vocabulary?",
//             answers: [
//               { answerId: 1, text: "Reading French novels and articles" },
//               { answerId: 2, text: "Learning only basic verbs" },
//               { answerId: 3, text: "Memorizing common greetings" },
//               { answerId: 4, text: "Watching cartoons" },
//             ],
//             correctAnswerId: 1,
//           },
//           {
//             questionText:
//               "What is suggested as an effective listening exercise for advanced learners?",
//             answers: [
//               { answerId: 1, text: "Listening to French news and interviews" },
//               { answerId: 2, text: "Learning the French alphabet" },
//               { answerId: 3, text: "Watching French children's shows" },
//               { answerId: 4, text: "Reading beginner-level dialogues" },
//             ],
//             correctAnswerId: 1,
//           },
//         ],
//       },
//     ];
//     await quiz.insertMany(quizQandA);
//     res.status(201).send("Questions seeded successfully.");
//   } catch (error) {
//     console.error("Error Questions videos:", error);
//     res.status(500).send("Error Questions videos.");
//   }
// });

// Initialize HTTP server and WebSocket

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update in production with specific domain
  },
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for new messages from clients
  socket.on("newMessage", async (data) => {
    // Save the message to MongoDB
    const newMessage = new Message({
      userId: data.userId,
      text: data.text,
      timestamp: new Date(),
    });
    await newMessage.save();

    // Broadcast the message to all connected clients
    io.emit("message", newMessage);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
