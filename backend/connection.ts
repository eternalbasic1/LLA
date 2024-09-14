import express, { Request, Response } from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/userProgress");

// Define a schema for storing progress
const progressSchema = new mongoose.Schema({
  userId: String,
  moduleId: String,
  videoId: String,
  timeSpent: Number, // in seconds
  completed: Boolean,
  quizResults: Array,
});

const Progress = mongoose.model("Progress", progressSchema);

// Save progress API
app.post("/api/saveProgress", async (req: Request, res: Response) => {
  const { userId, moduleId, videoId, timeSpent, completed, quizResults } =
    req.body;

  try {
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
  } catch (error) {
    res.status(500).send("Error saving progress.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
