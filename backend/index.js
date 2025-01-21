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
  // CORS 헤더 직접 설정
  res.setHeader('Access-Control-Allow-Origin', 'https://english-analysis-web.onrender.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

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
          content: "You are a helpful English grammar teacher who provides detailed analysis of English sentences in Korean. Always respond in valid JSON format."
        },
        {
          role: "user",
          content: prompt + '\n\n[입력값]\n' + text
        }
      ],
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      max_tokens: 2000,
      timeout: 60000
    });

    const response = completion.choices[0].message.content;
    
    try {
      // JSON 파싱 전에 응답 검증
      if (!response || typeof response !== 'string') {
        throw new Error('Invalid response from OpenAI');
      }

      // 응답에서 JSON 부분만 추출
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(parsedResponse)) {
        throw new Error('Response is not an array');
      }

      return res.json(parsedResponse);
    } catch (parseError) {
      console.error('파싱 에러:', parseError);
      console.error('원본 응답:', response);
      
      // 응답 형식이 잘못된 경우 기본 형식으로 변환
      const fallbackResponse = [{
        "Sentence": text,
        "translation": "번역 실패",
        "explanation": ["구문 분석 중 오류가 발생했습니다. 다시 시도해주세요."]
      }];
      
      return res.json(fallbackResponse);
    }
  } catch (error) {
    console.error('=== 에러 발생 ===');
    console.error('에러 메시지:', error.message);
    
    res.status(200).json([{
      "Sentence": req.body.text || "",
      "translation": "분석 실패",
      "explanation": ["서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."]
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
