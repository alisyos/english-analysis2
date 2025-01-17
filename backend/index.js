import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env file from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

const app = express();

// CORS 설정 수정
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-url.onrender.com' 
    : 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 서버 상태 확인용 엔드포인트
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/api/analyze', async (req, res) => {
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
