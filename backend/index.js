import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

// .env 파일 로딩 시도 (실패해도 계속 진행)
try {
  dotenv.config();
} catch (error) {
  console.log('No .env file found');
}

const app = express();

// CORS 설정 상세화
const corsOptions = {
  origin: ['https://english-analysis-web.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// CORS 미들웨어 적용
app.use(cors(corsOptions));

// preflight 요청을 위한 OPTIONS 처리
app.options('*', cors(corsOptions));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 서버 상태 확인용 엔드포인트
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    environment: process.env.NODE_ENV,
    apiKeyExists: !!process.env.OPENAI_API_KEY
  });
});

app.post('/api/analyze', async (req, res) => {
  // CORS 헤더 명시적 설정
  res.header('Access-Control-Allow-Origin', 'https://english-analysis-web.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  try {
    const { text } = req.body;
    console.log('\n=== 새로운 분석 요청 ===');
    console.log('입력된 텍스트:', text);

    if (!text) {
      console.log('텍스트가 없음');
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `다음은 사용자가 입력한 영어 문단입니다. 문단을 분석하고, 학습자를 위한 구문 풀이와 번역을 포함한 결과물을 아래의 형식에 맞게 작성하세요.
    구문 풀이 시, 주요 문법 포인트(접속사, 시제, 수식어, 구문 구조 등)와 함께, 잘못 이해할 가능성이 있는 표현이나 구조에 대한 설명을 추가하세요.
    
    [입력값]
    ${text}
    
    응답은 반드시 아래 JSON 형식을 따라주세요:
    [
      {
        "Sentence": "영문 문장",
        "translation": "한글 번역",
        "explanation": [
          "문법 포인트 1",
          "문법 포인트 2",
          "문법 포인트 3"
        ]
      }
    ]`;

    console.log('GPT에 요청 중...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful English grammar teacher who provides detailed analysis of English sentences in Korean."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    console.log('\nGPT 원본 응답:\n', response);

    try {
      let cleanResponse = response.replace(/```json\n|\n```/g, '');
      const startIndex = cleanResponse.indexOf('[');
      if (startIndex !== -1) {
        cleanResponse = cleanResponse.substring(startIndex);
      }
      console.log('\n정제된 응답:\n', cleanResponse);

      const parsedResponse = JSON.parse(cleanResponse);
      return res.json(Array.isArray(parsedResponse) ? parsedResponse : [parsedResponse]);
    } catch (parseError) {
      console.error('응답 파싱 에러:', parseError);
      console.error('정제된 응답:', cleanResponse);
      throw new Error('응답 파싱 실패: ' + parseError.message);
    }

  } catch (error) {
    console.error('\n=== 에러 발생 ===');
    console.error('에러 내용:', error);
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
