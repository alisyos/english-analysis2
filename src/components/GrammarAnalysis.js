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

const API_URL = 'https://english-analysis2.onrender.com';

function GrammarAnalysis() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setAnalysis(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          model: 'assistant'
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
      
      if (Array.isArray(data)) {
        setAnalysis(data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        alert('분석 시간이 초과되었습니다. 다시 시도해주세요.');
      } else {
        alert('분석 중 오류가 발생했습니다: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getCircledNumber = (num) => {
    const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
    return circledNumbers[num] || (num + 1).toString();
  };

  return (
    <Container>
      <Title>영어문장 구문풀이</Title>

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
