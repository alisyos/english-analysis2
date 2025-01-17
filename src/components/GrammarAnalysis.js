import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: left;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
`;

const Title = styled.h1`
  color: white;
  background-color: #2980b9;
  padding: 1.5rem;
  margin: -2rem -2rem 2rem -2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-bottom: 3px solid #2471a3;
`;

const InputSection = styled.div`
  margin-bottom: 2rem;
  text-align: left;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 1rem;
  resize: vertical;
  text-align: left;
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ResultsSection = styled.div`
  margin-top: 2rem;
  text-align: left;
`;

const AnalysisCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  text-align: left;
`;

const SentenceText = styled.p`
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.5;
  text-align: left;
`;

const TranslationText = styled.p`
  font-size: 16px;
  color: #34495e;
  margin-bottom: 1rem;
  padding-left: 1rem;
  border-left: 3px solid #3498db;
  text-align: left;
`;

const ExplanationList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ExplanationItem = styled.li`
  font-size: 15px;
  color: #555;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  position: relative;
  padding-left: 2rem;
  
  &:before {
    content: '${props => `${props.number}`}';
    position: absolute;
    left: 0.5rem;
    font-weight: bold;
    color: #3498db;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LoadingSpinner = styled.div`
  color: #3498db;
  margin: 2rem 0;
  text-align: left;
`;

const PromptSection = styled.div`
  margin: 1rem 0 2rem;
`;

const PromptToggleButton = styled(Button)`
  background-color: #2ecc71;
  margin-bottom: 1rem;
  
  &:hover {
    background-color: #27ae60;
  }
`;

const PromptEditor = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
  margin-bottom: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #2ecc71;
  }
`;

const defaultPrompt = `다음은 사용자가 입력한 영어 문단입니다. 문단을 분석하고, 학습자를 위한 구문 풀이와 번역을 포함한 결과물을 아래의 형식에 맞게 작성하세요.
구문 풀이 시, **주요 문법 포인트(접속사, 시제, 수식어, 구문 구조 등)**와 함께, 잘못 이해할 가능성이 있는 표현이나 구조에 대한 설명을 추가하세요.
결과물은 반드시 아래의 예시 형식을 따르며, 적절한 한글 번역을 포함하세요.

[입력값]
{사용자가 입력한 문단}
[결과물 형식]
영문 문장: 문단에서 문장을 한 줄씩 분리하여 번호를 매기고, 각 문장을 표시합니다.
한글 번역: 각 문장의 정확한 번역을 제공합니다.
구문 풀이:
문장별 주요 문법 포인트를 항목화하여 설명합니다.
복잡하거나 주의가 필요한 어휘, 구문, 문법 구조에 대한 추가 설명을 포함합니다.
학습에 도움이 되는 관련 문제 유형(예: 어법, 구문 이해, 빈칸 문제 등)을 제안합니다.

###
**구문풀이 예시**
[전체구문]
With only two minutes to play, both teams were fighting for the football. It was the last home game for the seniors of Winston High, and they were determined to win. Since it had been a close game the whole evening, the best players of each team hadn't left the field. Once Winston High's coach finally knew that victory was theirs, all the seniors on the sidelines were allowed to play for the last few seconds. One of the seniors, Ethan, was especially happy. He had never played in any of the games before. Now, Ethan was finally getting the chance to step onto the grass.

[구문풀이]
With only two minutes to play, both teams were fighting for the football. It was the last home game for the seniors of Winston High, and they were determined to win.
경기 시간 단 2분을 남기고, 양 팀은 공을 차지하기 위해 싸우고 있었다. 이 경기는 윈스턴 고등학교 4학년 학생들의 마지막 홈 경기였고, 그들은 이기려는 의지가 확고했다.

구문 풀이
① to부정사 용법: '경기할'의 뜻으로 명사 two minutes를 수식하는 형용사적 용법이다. 
② both+복수명사: '양 쪽의, 둘 다의'를 뜻하는 both는 복수명사 teams를 수식하며, 주어가 복수이므로 복수동사 were가 이어진다. 
   ✔each는 '각각의, 어느 한 쪽의'의 뜻으로 단수명사 team을 수식한다. 
③ 전치사 for: '~를 쫓아, ~를 얻기 위해'의 뜻으로 '미식축구 공'을 목적어로 취한다.
④ 최상급: 형용사 late의 최상급으로 정관사 the와 함께 쓰인다.✔the 없이 쓰이는 last는 '지난, 바로 전의'의 뜻으로 쓰인다. ↔ next(다음의)
⑤ 수동태: 'be determined to+R(~하겠다고 결심하다)'는 'determine+목적어+to+R(…에게 ~하도록 결심시키다)'의 수동태이다.

###
- 위 내용으로 아래와 같은 출력 양식으로 답변
- 출력양식:JSON.

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

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://english-analysis.onrender.com'
  : 'http://localhost:3001';

function GrammarAnalysis() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt);

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          prompt
        }),
      });
      
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error:', error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPrompt = () => {
    if (window.confirm('프롬프트를 기본값으로 되돌리시겠습니까?')) {
      setPrompt(defaultPrompt);
    }
  };

  return (
    <Container>
      <Title>영어문장 구문풀이</Title>
      
      <PromptSection>
        <PromptToggleButton onClick={() => setShowPrompt(!showPrompt)}>
          {showPrompt ? '프롬프트 숨기기' : '프롬프트 편집하기'}
        </PromptToggleButton>
        
        {showPrompt && (
          <>
            <PromptEditor
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="분석 프롬프트를 입력하세요..."
            />
            <Button onClick={resetPrompt}>
              기본값으로 되돌리기
            </Button>
          </>
        )}
      </PromptSection>

      <InputSection>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="분석할 영어 문장을 입력하세요..."
        />
        <Button 
          onClick={analyzeText} 
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? '분석 중...' : '분석하기'}
        </Button>
      </InputSection>

      <ResultsSection>
        {isLoading && (
          <LoadingSpinner>분석 중입니다...</LoadingSpinner>
        )}
        
        {analysis.map((item, index) => (
          <AnalysisCard key={index}>
            <SentenceText>
              <strong>영문:</strong> {item.Sentence}
            </SentenceText>
            <TranslationText>
              <strong>번역:</strong> {item.translation}
            </TranslationText>
            <ExplanationList>
              {item.explanation.map((exp, i) => (
                <ExplanationItem 
                  key={i} 
                  number={`${String.fromCharCode(9312 + i)}`}
                >
                  {exp}
                </ExplanationItem>
              ))}
            </ExplanationList>
          </AnalysisCard>
        ))}
      </ResultsSection>
    </Container>
  );
}

export default GrammarAnalysis; 