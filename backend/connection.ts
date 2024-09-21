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
    // Find existing progress for the user, module, and video
    const existingProgress = await Progress.findOne({
      userId,
      moduleId,
      videoId,
    });

    if (existingProgress) {
      // Check if timeSpent is not null or undefined, and update if greater
      if (
        !existingProgress.timeSpent ||
        timeSpent > existingProgress.timeSpent
      ) {
        existingProgress.timeSpent = timeSpent;
      }
      // Optionally update other fields like completed and quizResults
      existingProgress.completed = completed;
      existingProgress.quizResults = quizResults;

      await existingProgress.save();
      res.status(200).send(existingProgress);
    } else {
      // Create new progress if no existing record found
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
