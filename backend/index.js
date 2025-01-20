import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

try {
  dotenv.config();
} catch (error) {
  console.log('No .env file found');
}

const app = express();

// CORS 설정
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    environment: process.env.NODE_ENV,
    apiKeyExists: !!process.env.OPENAI_API_KEY
  });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, prompt } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful English grammar teacher who provides detailed analysis of English sentences in Korean."
        },
        {
          role: "user",
          content: prompt + '\n\n[입력값]\n' + text
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    try {
      const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      return res.json(Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse]);
    } catch (parseError) {
      throw new Error('응답 파싱 실패: ' + parseError.message);
    }
  } catch (error) {
    console.error('분석 에러:', error);
    return res.status(500).json({
      error: '분석 중 오류가 발생했습니다.',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
});
