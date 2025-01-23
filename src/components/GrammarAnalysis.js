<<<<<<< HEAD
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
 
 
1. 접속사, 관계사, 동격
접속사 that: 명사절을 이끌며 생략 가능.
관계대명사 that: 사람/사물을 제한적으로 수식하며 주격, 목적격으로 사용.
동격의 that: 앞 명사를 부연 설명.
접속사 what: 접속사 what은 명사절을 이끌며 "~하는 것"의 의미로 사용되고, 문장에서 주어, 목적어, 보어 역할을 한다. 의문사 what은 의문문이나 간접의문문에서 "무엇"을 묻는 데 사용되며, 문장을 불완전하게 만든다. 접속사는 명사절을 완전한 절로 유지하고, 의문사는 문장의 질문 기능을 담당한다.
주격 관계대명사: 생략 불가 (be동사 앞은 생략 가능).
목적격 관계대명사: 항상 생략 가능.
등위 접속사: and, but, or, so는 단어나 구, 절을 병렬 연결함.
종속 접속사: 시간(when, while), 이유(because, since), 조건(if, unless) 등의 부사절을 이끎.
접속사는 분사구문으로 변환 시 생략 가능 (After he finished → Having finished).
 
2. 관계사와 복합 관계사
관계대명사(접속사+대명사역할): who, which, that은 주격/목적격으로 사용, whose는 소유를 나타냄.
관계부사(접속사+부사역할):when, where, how, why, how는 선행사와 함께 쓸 수 없음
복합 관계대명사: whoever, whichever, whatever는 명사절/부사절을 이끎.
복합 관계부사: wherever, whenever, however는 부사절을 이끎.
관계대명사절: 불완전한 절을 이끌며 문맥에 따라 사용.
복합 관계사는 명사절과 부사절에서 모두 사용 가능.
 
3. 동사 구문 패턴
목적어 + to부정사: allow, expect, want, require.
목적어 + 동사원형: let, make, have, see, hear.
목적어 + 분사: keep, catch, find.
목적어 + 형용사/명사: make, find, call, consider.
동사 패턴은 문맥에 맞게 정확히 활용.
 
-사역동사
목적어 + 동사원형: (let, make, have)
목적어 + 과거분사: (make, have, get)
 
-준사역동사
목적어 + 동사원형 또는 to부정사: (help)
 
-지각동사
목적어 + 동사원형: (see, watch, hear, feel, notice)
목적어 + 현재분사: (see, watch, hear, feel, notice)
목적어 + 과거분사: (see, hear, feel, notice)
 
-to부정사를 목적어로 취하는 동사: (decide, hope, plan, promise, refuse, want, agree)
의미: 미래지향적 행위를 나타냄.
 
-동명사를 목적어로 취하는 동사: (enjoy, avoid, admit, deny, consider, finish, mind)
의미: 과거나 현재의 행위에 초점.
to부정사와 동명사 모두를 목적어로 취하는 동사:
try: ~하려고 노력하다(to부정사) / 시험 삼아 해보다(동명사).
remember, forget: 미래 행동을 기억/잊다(to부정사) / 과거 행위를 기억/잊다(동명사).
stop: ~하기 위해 멈추다(to부정사) / ~하는 것을 멈추다(동명사).
 
 
4. to부정사 용법
명사적 용법: 주어, 목적어, 보어 역할.
형용사적 용법: 명사 수식, 보어, 동격으로 사용.
부사적 용법: 목적, 결과, 원인, 판단 근거를 나타냄.
to부정사는 다양한 문법적 역할을 수행함.
명사적/형용사적/부사적 용법 구분 필수.
 
5. 시제와 태
현재완료: 완료, 경험, 계속, 결과를 나타냄.
수동태: 일반 수동(be + p.p.), 진행 수동(be being + p.p.), 완료 수동(have been + p.p.).
현재분사: 능동/진행 의미, 과거분사: 수동/완료 의미.
분사는 형용사처럼 사용되며 문맥에 따라 적절히 활용.
시제와 태는 문법적 정확성을 유지하기 위해 중요.
 
6. 가정법
가정법 과거: If + 과거, would + 동사원형.
가정법 과거완료: If + had + p.p., would have + p.p..
혼합 가정법: If + had + p.p., would + 동사원형.
가정법은 가정 상황과 시제 표현에 따라 구분됨.
과거와 현재를 혼합 표현할 때 혼합 가정법 사용.
 
7. 특수 구문
강조 구문: It is ~ that.
도치 구문: 부정어구 + 조동사/be + 주어.
생략 구문: 문맥상 생략 가능한 표현 사용 (Though possible).
동격 구문: 앞 명사를 부연 설명 (This book, that is, his diary).
특수 구문은 문장의 강조나 변화를 위해 사용됨.
 
8. 수 일치
The number of + 복수명사 → 단수동사.
A number of + 복수명사 → 복수동사.
Either A or B → B에 동사 일치.
수일치는 주어와 동사의 관계를 정확히 맞추는 데 중요.
복수와 단수 표현을 구분해야 함.
 
9. 조동사의 의미
must have + p.p.: 강한 과거 추측.
may/might have + p.p.: 불확실한 과거 추측.
should have + p.p.: 과거에 대한 후회/비난.
조동사는 시제와 의미를 명확히 전달하는 데 필수.
추측과 후회 표현에서 자주 사용됨.
 
10. 주요 동사 구분
지각동사: 원형(I saw him leave.), 현재분사(I saw him leaving.).
사역동사: 원형(I made him clean.), 과거분사(I made it cleaned.).
used to: 과거의 습관, be used to: ~에 익숙함.
지각/사역 동사는 보어의 형태에 따라 의미가 달라짐.
used to와 be used to는 문맥에 맞게 사용.
 
11. 분사 구문
일반 분사구문: 동시 동작(Watching TV, I ate snacks.), 부대 상황(He came home, bringing a gift.).
분사 구문 시제: 현재분사(능동/동시), 완료분사(이전 동작), 수동분사(수동 의미).
독립 분사구문: 주어가 독립된 분사 표현 (Weather permitting, we will go).
분사 형태는 문맥과 시제에 맞게 선택해야 함.
문장의 의미와 흐름에 따라 분사구문 활용.
 
12. 전치사
주요 전치사: 이유/원인(because of, due to), 수단/도구(by, with, through).
방향/위치(to, into, onto), 대조(despite, instead of), 목적/조건(for the sake of, in order to).
관계 전치사: about, of, for.
자주 쓰이는 전치사: as (~로서), like (~처럼), except (~을 제외하고).
전치사와 접속사 구별: 전치사(뒤에 명사/동명사), 접속사(뒤에 주어+동사).
 
13. 대명사
인칭 대명사: 주격(I), 목적격(me), 소유격(my), 소유대명사(mine).
지시 대명사: this, that, these, those.
재귀 대명사: 주어와 목적어 동일(He hurt himself), 강조(I myself did it).
부정 대명사: some, any, none, one, all, both, each.
의문 대명사: who, whom, whose, what, which.
 
 
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

=======
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
 
 
1. 접속사, 관계사, 동격
접속사 that: 명사절을 이끌며 생략 가능.
관계대명사 that: 사람/사물을 제한적으로 수식하며 주격, 목적격으로 사용.
동격의 that: 앞 명사를 부연 설명.
접속사 what: 접속사 what은 명사절을 이끌며 "~하는 것"의 의미로 사용되고, 문장에서 주어, 목적어, 보어 역할을 한다. 의문사 what은 의문문이나 간접의문문에서 "무엇"을 묻는 데 사용되며, 문장을 불완전하게 만든다. 접속사는 명사절을 완전한 절로 유지하고, 의문사는 문장의 질문 기능을 담당한다.
주격 관계대명사: 생략 불가 (be동사 앞은 생략 가능).
목적격 관계대명사: 항상 생략 가능.
등위 접속사: and, but, or, so는 단어나 구, 절을 병렬 연결함.
종속 접속사: 시간(when, while), 이유(because, since), 조건(if, unless) 등의 부사절을 이끎.
접속사는 분사구문으로 변환 시 생략 가능 (After he finished → Having finished).
 
2. 관계사와 복합 관계사
관계대명사(접속사+대명사역할): who, which, that은 주격/목적격으로 사용, whose는 소유를 나타냄.
관계부사(접속사+부사역할):when, where, how, why, how는 선행사와 함께 쓸 수 없음
복합 관계대명사: whoever, whichever, whatever는 명사절/부사절을 이끎.
복합 관계부사: wherever, whenever, however는 부사절을 이끎.
관계대명사절: 불완전한 절을 이끌며 문맥에 따라 사용.
복합 관계사는 명사절과 부사절에서 모두 사용 가능.
 
3. 동사 구문 패턴
목적어 + to부정사: allow, expect, want, require.
목적어 + 동사원형: let, make, have, see, hear.
목적어 + 분사: keep, catch, find.
목적어 + 형용사/명사: make, find, call, consider.
동사 패턴은 문맥에 맞게 정확히 활용.
 
-사역동사
목적어 + 동사원형: (let, make, have)
목적어 + 과거분사: (make, have, get)
 
-준사역동사
목적어 + 동사원형 또는 to부정사: (help)
 
-지각동사
목적어 + 동사원형: (see, watch, hear, feel, notice)
목적어 + 현재분사: (see, watch, hear, feel, notice)
목적어 + 과거분사: (see, hear, feel, notice)
 
-to부정사를 목적어로 취하는 동사: (decide, hope, plan, promise, refuse, want, agree)
의미: 미래지향적 행위를 나타냄.
 
-동명사를 목적어로 취하는 동사: (enjoy, avoid, admit, deny, consider, finish, mind)
의미: 과거나 현재의 행위에 초점.
to부정사와 동명사 모두를 목적어로 취하는 동사:
try: ~하려고 노력하다(to부정사) / 시험 삼아 해보다(동명사).
remember, forget: 미래 행동을 기억/잊다(to부정사) / 과거 행위를 기억/잊다(동명사).
stop: ~하기 위해 멈추다(to부정사) / ~하는 것을 멈추다(동명사).
 
 
4. to부정사 용법
명사적 용법: 주어, 목적어, 보어 역할.
형용사적 용법: 명사 수식, 보어, 동격으로 사용.
부사적 용법: 목적, 결과, 원인, 판단 근거를 나타냄.
to부정사는 다양한 문법적 역할을 수행함.
명사적/형용사적/부사적 용법 구분 필수.
 
5. 시제와 태
현재완료: 완료, 경험, 계속, 결과를 나타냄.
수동태: 일반 수동(be + p.p.), 진행 수동(be being + p.p.), 완료 수동(have been + p.p.).
현재분사: 능동/진행 의미, 과거분사: 수동/완료 의미.
분사는 형용사처럼 사용되며 문맥에 따라 적절히 활용.
시제와 태는 문법적 정확성을 유지하기 위해 중요.
 
6. 가정법
가정법 과거: If + 과거, would + 동사원형.
가정법 과거완료: If + had + p.p., would have + p.p..
혼합 가정법: If + had + p.p., would + 동사원형.
가정법은 가정 상황과 시제 표현에 따라 구분됨.
과거와 현재를 혼합 표현할 때 혼합 가정법 사용.
 
7. 특수 구문
강조 구문: It is ~ that.
도치 구문: 부정어구 + 조동사/be + 주어.
생략 구문: 문맥상 생략 가능한 표현 사용 (Though possible).
동격 구문: 앞 명사를 부연 설명 (This book, that is, his diary).
특수 구문은 문장의 강조나 변화를 위해 사용됨.
 
8. 수 일치
The number of + 복수명사 → 단수동사.
A number of + 복수명사 → 복수동사.
Either A or B → B에 동사 일치.
수일치는 주어와 동사의 관계를 정확히 맞추는 데 중요.
복수와 단수 표현을 구분해야 함.
 
9. 조동사의 의미
must have + p.p.: 강한 과거 추측.
may/might have + p.p.: 불확실한 과거 추측.
should have + p.p.: 과거에 대한 후회/비난.
조동사는 시제와 의미를 명확히 전달하는 데 필수.
추측과 후회 표현에서 자주 사용됨.
 
10. 주요 동사 구분
지각동사: 원형(I saw him leave.), 현재분사(I saw him leaving.).
사역동사: 원형(I made him clean.), 과거분사(I made it cleaned.).
used to: 과거의 습관, be used to: ~에 익숙함.
지각/사역 동사는 보어의 형태에 따라 의미가 달라짐.
used to와 be used to는 문맥에 맞게 사용.
 
11. 분사 구문
일반 분사구문: 동시 동작(Watching TV, I ate snacks.), 부대 상황(He came home, bringing a gift.).
분사 구문 시제: 현재분사(능동/동시), 완료분사(이전 동작), 수동분사(수동 의미).
독립 분사구문: 주어가 독립된 분사 표현 (Weather permitting, we will go).
분사 형태는 문맥과 시제에 맞게 선택해야 함.
문장의 의미와 흐름에 따라 분사구문 활용.
 
12. 전치사
주요 전치사: 이유/원인(because of, due to), 수단/도구(by, with, through).
방향/위치(to, into, onto), 대조(despite, instead of), 목적/조건(for the sake of, in order to).
관계 전치사: about, of, for.
자주 쓰이는 전치사: as (~로서), like (~처럼), except (~을 제외하고).
전치사와 접속사 구별: 전치사(뒤에 명사/동명사), 접속사(뒤에 주어+동사).
 
13. 대명사
인칭 대명사: 주격(I), 목적격(me), 소유격(my), 소유대명사(mine).
지시 대명사: this, that, these, those.
재귀 대명사: 주어와 목적어 동일(He hurt himself), 강조(I myself did it).
부정 대명사: some, any, none, one, all, both, each.
의문 대명사: who, whom, whose, what, which.
 
 
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

>>>>>>> 3412a34201a415fa7c8e6f6cb24ae284d7e26ec6
export default GrammarAnalysis; 