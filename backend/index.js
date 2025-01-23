import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://english-analysis-web.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text, prompt } = req.body;
    
    if (!text) {
      return res.status(400).json([{
        "Sentence": "",
        "translation": "텍스트가 없습니다",
        "explanation": ["분석할 영어 문장을 입력해주세요."]
      }]);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful English grammar teacher who provides detailed analysis of English sentences in Korean. Always respond in valid JSON format."
        },
        {
          role: "user",
          content: prompt + '\n\n[입력값]\n' + text
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    let response = completion.choices[0].message.content;
    
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        response = jsonMatch[0];
      }
      
      const parsedResponse = JSON.parse(response);
      return res.json(Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse]);
    } catch (parseError) {
      console.error('JSON 파싱 에러:', parseError);
      return res.json([{
        "Sentence": text,
        "translation": "구문 분석 중입니다",
        "explanation": [
          "① 구문 분석이 진행 중입니다",
          "② 잠시만 기다려주세요",
          "③ 시스템이 분석을 완료하면 결과가 표시됩니다"
        ]
      }]);
    }
  } catch (error) {
    console.error('API 에러:', error);
    return res.status(500).json([{
      "Sentence": text || "",
      "translation": "서버 오류",
      "explanation": [
        "① 서버 처리 중 오류가 발생했습니다",
        "② 잠시 후 다시 시도해주세요",
        "③ 문제가 지속되면 관리자에게 문의해주세요"
      ]
    }]);
  }
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
