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
구문 풀이 시, 주요 문법 포인트(접속사, 시제, 수식어, 구문 구조 등)와 함께, 잘못 이해할 가능성이 있는 표현이나 구조에 대한 설명을 추가하세요.

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