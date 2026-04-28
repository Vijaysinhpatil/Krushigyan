import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const transcribeAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file provided' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Updated to stable 2026 version to fix 404 issue
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const audioBuffer = fs.readFileSync(req.file.path);
    const base64Audio = audioBuffer.toString('base64');

    // Strict prompt to ensure only the text is returned
    const prompt = "Transcribe the following audio precisely. Return ONLY the transcribed text and nothing else.";

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Audio,
          mimeType: req.file.mimetype // Automatically detects if it's wav, mp3, etc.
        }
      },
      { text: prompt },
    ]);

    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      transcription: text.trim()
    });

  } catch (error) {
    console.error('STT Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Speech to text failed',
      error: error.message 
    });
  } finally {
    // ALWAYS delete the file, even if the AI fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};