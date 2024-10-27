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

// Create models
const Quiz = mongoose.model("Quiz", quizSchema);
const Progress = mongoose.model("Progress", progressSchema);
const Message = mongoose.model("Message", messageSchema);
const Video = mongoose.model("Video", videoSchema);

// Fetch quiz data API
app.get("/api/quiz", async (req: Request, res: Response) => {
  try {
    console.log("Fetching quiz data");
    const quizzes = await mongoose.connection
      .collection("quiz")
      .find()
      .toArray();
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
