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
    
    console.log('=== 분석 요청 시작 ===');
    console.log('입력 텍스트:', text);
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // OpenAI API 호출을 재시도 로직으로 감싸기
    const completion = await retryOperation(async () => {
      const response = await openai.chat.completions.create({
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
        max_tokens: 2000,  // 토큰 제한 추가
        timeout: 30000     // 30초 타임아웃
      });
      return response;
    });

    const response = completion.choices[0].message.content;
    
    try {
      const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      return res.json(Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse]);
    } catch (parseError) {
      console.error('파싱 에러:', parseError);
      throw new Error('응답 파싱 실패: ' + parseError.message);
    }
  } catch (error) {
    console.error('=== 에러 발생 ===');
    console.error('에러 타입:', error.constructor.name);
    console.error('에러 메시지:', error.message);
    
    return res.status(500).json({
      error: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
});
