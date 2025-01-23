import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS 설정 업데이트
app.use(cors({
  origin: ['https://english-analysis-web.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// preflight 요청을 위한 OPTIONS 핸들러
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 기본 상태 체크 엔드포인트
app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ status: 'Server is running' });
});

// 재시도 함수 추가
const retryOperation = async (operation, maxAttempts = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

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

    // 문장 시작 부분이 불완전한 경우 'In' 추가
    const processedText = text.trim().startsWith('order') ? 'In ' + text : text;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful English grammar teacher who provides detailed analysis of English sentences in Korean. Always respond in valid JSON format with proper sentence analysis."
        },
        {
          role: "user",
          content: prompt + '\n\n[입력값]\n' + processedText
        }
      ],
      temperature: 0.7,
      max_tokens: 5500,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const response = completion.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(response);
      return res.json(Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse]);
    } catch (parseError) {
      console.error('파싱 에러:', parseError);
      // 기본 응답 형식으로 변환
      return res.json([{
        "Sentence": processedText,
        "translation": "구문 분석을 진행합니다.",
        "explanation": [
          "① 전치사 In: 문장 시작 부분에 'In'이 생략되어 있습니다.",
          "② 구문 분석이 곧 제공됩니다.",
          "③ 잠시만 기다려주세요."
        ]
      }]);
    }
  } catch (error) {
    console.error('=== 에러 발생 ===');
    console.error('에러 메시지:', error.message);
    
    return res.json([{
      "Sentence": text || "",
      "translation": "분석 처리 중 오류",
      "explanation": [
        "① 일시적인 서버 부하가 발생했습니다.",
        "② 잠시 후 다시 시도해주세요.",
        "③ 문제가 지속되면 관리자에게 문의해주세요."
      ]
    }]);
  }
});

const PORT = process.env.PORT || 3001;

// 서버 시작 시 에러 처리
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});

// 예기치 않은 에러 처리
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
