import React from 'react';
import './App.css';
import GrammarAnalysis from './components/GrammarAnalysis.js';

function App() {
  const analyzeText = async (text) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          prompt: "다음 영어 문장을 분석해주세요. 응답은 반드시 다음 JSON 형식으로 해주세요: [{\"Sentence\": \"분석할 문장\", \"translation\": \"한글 번역\", \"explanation\": [\"설명1\", \"설명2\"]}]"
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return [{
        "Sentence": "",
        "translation": "오류가 발생했습니다",
        "explanation": ["서버 연결에 문제가 있습니다. 다시 시도해주세요."]
      }];
    }
  };

  return (
    <div className="App">
      <GrammarAnalysis />
    </div>
  );
}

export default App;
