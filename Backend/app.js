import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import geminiRoutes from "./routes/gemini.route.js";
import sttRoutes from './routes/sttRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", geminiRoutes);
app.use('/api/stt', sttRoutes);


app.listen(5000, () => {
  console.log("Server running on port 5000");
});