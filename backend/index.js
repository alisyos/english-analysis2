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

// Assistant ID를 환경 변수에서 가져옴
const ASSISTANT_ID = process.env.ASSISTANT_ID || "asst_uYM0ik8xa8QiiJscSod3c42j";

app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json([{
        "Sentence": "",
        "translation": "텍스트가 없습니다",
        "explanation": ["분석할 영어 문장을 입력해주세요."]
      }]);
    }

    // Thread 생성
    const thread = await openai.beta.threads.create();

    // 메시지 추가
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: text
    });

    // Assistant로 실행
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // 실행 완료 대기
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
    }

    // 응답 메시지 가져오기
    const messages = await openai.beta.threads.messages.list(thread.id);
    const response = messages.data[0].content[0].text.value;

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return res.json(Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse]);
      }
      
      return res.json([{
        "Sentence": text,
        "translation": "구문 분석 중입니다",
        "explanation": [
          "① 구문 분석이 진행 중입니다",
          "② 잠시만 기다려주세요",
          "③ 시스템이 분석을 완료하면 결과가 표시됩니다"
        ]
      }]);
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
      "Sentence": "",
      "translation": "서버 오류",
      "explanation": [`오류가 발생했습니다: ${error.message}`]
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
