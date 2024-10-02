import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

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
  timeSpent: Number, // in seconds
  completed: Boolean,
  quizResults: Array,
});

const Quiz = mongoose.model("quiz", quizSchema);
const Progress = mongoose.model("Progress", progressSchema);

// Fetch quiz data API
// New API to fetch quiz data
app.get("/api/quiz", async (req: Request, res: Response) => {
  try {
    console.log("triggered quiz");
    const quizzes = await mongoose.connection
      .collection("quiz")
      .find()
      .toArray(); // Notice the collection name 'quiz'
    console.log("quizzes", quizzes);
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).send("Error fetching quizzes.");
  }
});

// Save progress API
app.post("/api/saveProgress", async (req: Request, res: Response) => {
  const { userId, moduleId, videoId, timeSpent, completed, quizResults } =
    req.body;
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

app.get("/api/progress/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // Find all progress records for the given userId
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
