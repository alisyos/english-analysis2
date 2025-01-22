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
  margin-top: 20px;
`;

const AnalysisCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SentenceText = styled.p`
  font-size: 1.1em;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const TranslationText = styled.p`
  font-size: 1em;
  margin-bottom: 15px;
  color: #34495e;
  border-left: 3px solid #3498db;
  padding-left: 10px;
`;

const ExplanationList = styled.div`
  margin-left: 20px;
  padding-left: 0;
`;

const ExplanationItem = styled.div`
  margin-bottom: 8px;
  line-height: 1.5;
  color: #555;
  position: relative;
  padding-left: 25px;
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

const defaultPrompt = `###
다음은 사용자가 입력한 영어 문단입니다. 문단을 분석하고, 학습자를 위한 구문 풀이와 번역을 포함한 결과물을 아래의 형식에 맞게 작성하세요.**문장별 주요 문법 포인트를 항목화하여 설명합니다.**

// ... [여기에 제공하신 모든 문법 설명 내용이 들어갑니다] ...

[입력값]
{입력값}

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
      "문법 포인트 3",
      "문법 포인트 4",
      "문법 포인트 5",
      "... 필요한 만큼 추가 포인트"
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
    setAnalysis(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          prompt 
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAnalysis(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        alert('분석 시간이 너무 오래 걸립니다. 다시 시도해주세요.');
      } else {
        alert('분석 중 오류가 발생했습니다: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetPrompt = () => {
    if (window.confirm('프롬프트를 기본값으로 되돌리시겠습니까?')) {
      setPrompt(defaultPrompt);
    }
  };

  // 원형 숫자 변환 함수 추가
  const getCircledNumber = (num) => {
    const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
    return circledNumbers[num] || (num + 1).toString();
  };

  return (
    <Container>
      <Title>영어문장 구문풀이</Title>
      
      <PromptSection>
        <PromptToggleButton onClick={() => setShowPrompt(!showPrompt)}>
          {showPrompt ? '프롬프트 숨기기' : '프롬프트 보기'}
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
        
        {analysis && analysis.length > 0 && (
          <>
            {analysis.map((item, index) => (
              <AnalysisCard key={index}>
                <SentenceText>
                  {item.Sentence || '문장 없음'}
                </SentenceText>
                <TranslationText>
                  {item.translation || '번역 없음'}
                </TranslationText>
                {Array.isArray(item.explanation) && (
                  <ExplanationList>
                    {item.explanation.map((exp, expIndex) => (
                      <ExplanationItem key={expIndex}>
                        {getCircledNumber(expIndex)} {exp.replace(/^[①-⑩\d\.\s]+/, '')}
                      </ExplanationItem>
                    ))}
                  </ExplanationList>
                )}
              </AnalysisCard>
            ))}
          </>
        )}
      </ResultsSection>
    </Container>
  );
}

export default GrammarAnalysis; 