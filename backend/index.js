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
    
    console.log('=== 분석 요청 시작 ===');
    console.log('입력 텍스트:', text);
    console.log('프롬프트:', prompt);
    
    if (!text) {
      console.log('텍스트 없음');
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('OpenAI API 호출 시작');
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

    console.log('OpenAI 응답 받음');
    const response = completion.choices[0].message.content;
    console.log('GPT 응답:', response);
    
    try {
      console.log('응답 파싱 시도');
      const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
      console.log('파싱된 응답:', parsedResponse);
      return res.json(Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse]);
    } catch (parseError) {
      console.error('파싱 에러:', parseError);
      console.error('원본 응답:', response);
      throw new Error('응답 파싱 실패: ' + parseError.message);
    }
  } catch (error) {
    console.error('=== 에러 발생 ===');
    console.error('에러 타입:', error.constructor.name);
    console.error('에러 메시지:', error.message);
    console.error('에러 스택:', error.stack);
    return res.status(500).json({
      error: '분석 중 오류가 발생했습니다.',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
});
