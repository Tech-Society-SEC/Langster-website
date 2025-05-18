import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import profileIcon from '../assets/profile-icon.png';
import '../styles/ModuleDetail.css';
import { Stepper, Step, StepLabel } from '@mui/material';

const ModuleDetail = () => {
  const { langKey, moduleId } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [moduleData, setModuleData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(120);
  const [finalQuizStarted, setFinalQuizStarted] = useState(false);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const timerRef = useRef(null);
  const [showScore, setShowScore] = useState(false);
  const [stepPage, setStepPage] = useState(0);
  const stepsPerPage = 10;

  // Use fetch to load from /public/data instead of import()
  useEffect(() => {
    const loadModule = async () => {
      try {
        const response = await fetch(`/data/${langKey}/${moduleId}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setModuleData(data);

        const storedAnswers = JSON.parse(
          localStorage.getItem(`progress-${langKey}-module${moduleId}`)
        ) || {};
        setSelectedAnswers(storedAnswers);
      } catch (err) {
        console.error('Failed to load module:', err);
      }
    };

    loadModule();
  }, [langKey, moduleId]);

  useEffect(() => {
    // Save progress in localStorage
    localStorage.setItem(
      `progress-${langKey}-module${moduleId}`,
      JSON.stringify(selectedAnswers)
    );
  }, [selectedAnswers, langKey, moduleId]);

  useEffect(() => {
    if (finalQuizStarted) startTimer();
    return () => clearInterval(timerRef.current);
  }, [finalQuizStarted]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(120);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswerClick = (lessonIndex, option, correctAnswer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [lessonIndex]: {
        selected: option,
        isCorrect: option === correctAnswer,
      },
    }));
  };

  const handleRetry = (lessonIndex) => {
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[lessonIndex];
      return newAnswers;
    });
  };

  const handleFinalAnswer = (questionIndex, selectedOption) => {
    if (quizAnswers[questionIndex]) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const restartFinalQuiz = () => {
    setQuizIndex(0);
    setQuizAnswers({});
    setFinalSubmitted(false);
    setFinalQuizStarted(true);
    setStepPage(0);
    startTimer();
  };

  const submitFinalQuiz = () => {
    clearInterval(timerRef.current);
    setFinalSubmitted(true);
    const totalCorrect = moduleData.finalQuiz.reduce((acc, q, i) => {
      return acc + (quizAnswers[i] === q.answer ? 1 : 0);
    }, 0);
    setScore(totalCorrect);
    setShowScore(true);
  };

  if (!moduleData) return <div className="module-detail">Loading...</div>;

  const currentFinalQuestion = moduleData.finalQuiz?.[quizIndex];
  const totalFinalSteps = moduleData.finalQuiz?.length || 0;

  return (
    <div className="module-detail">
      <div className="top-bar">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h2 className="module-title">{langKey.toUpperCase()} - {moduleData.title}</h2>
        <img src={profileIcon} alt="Profile" className="profile-icon" onClick={() => navigate('/profile')} />
      </div>

      {moduleData.lessons?.map((lesson, index) => {
        const userAnswer = selectedAnswers[index];
        return (
          <div key={index} className="lesson-block">
            {lesson.video && (
              <div className="section-card">
                <h3>Lesson {index + 1} Video</h3>
                <iframe
                  className="responsive-iframe"
                  src={lesson.video}
                  title={`Lesson ${index + 1}`}
                  allowFullScreen
                />
              </div>
            )}
            {lesson.pronunciationWords?.length > 0 && (
              <div className="section-card">
                <h3>Practice Pronunciation</h3>
                {lesson.pronunciationWords.map((word, idx) => (
                  <button key={idx} className="option-button" onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(word);
                    speechSynthesis.speak(utterance);
                  }}>🔊 {word}</button>
                ))}
              </div>
            )}
            {lesson.exercise && (
              <div className="section-card">
                <h3>Quiz</h3>
                <p><strong>{lesson.exercise.question}</strong></p>
                {lesson.exercise.options.map((opt, i) => {
                  const isSelected = userAnswer?.selected === opt;
                  const isCorrect = userAnswer?.isCorrect;
                  let btnClass = "option-button";
                  if (isSelected) {
                    btnClass += isCorrect ? " correct" : " wrong";
                  }
                  return (
                    <button
                      key={i}
                      className={btnClass}
                      onClick={() => handleAnswerClick(index, opt, lesson.exercise.answer)}
                      disabled={!!userAnswer}
                    >
                      {opt}
                      {isSelected && isCorrect && <span> ✅</span>}
                      {isSelected && !isCorrect && (
                        <span className="retry-icon" onClick={() => handleRetry(index)}> 🔁</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {moduleData.finalQuiz?.length > 0 && !finalQuizStarted && (
        <div className="section-card final-quiz-intro">
          <h3>🎓 Ready for the Final Quiz?</h3>
          <button onClick={() => setFinalQuizStarted(true)} className="start-final-btn">Start Final Quiz</button>
        </div>
      )}

      {finalQuizStarted && currentFinalQuestion && (
        <div className="final-quiz-section section-card">
          <h3>🎓 Final Quiz</h3>
          <div className="timer">Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>

          <Stepper activeStep={quizIndex % stepsPerPage} alternativeLabel>
            {moduleData.finalQuiz
              .slice(stepPage * stepsPerPage, (stepPage + 1) * stepsPerPage)
              .map((_, index) => (
                <Step key={index}><StepLabel /></Step>
              ))}
          </Stepper>

          <div className="step-nav-buttons">
            {stepPage > 0 && (
              <button onClick={() => setStepPage(stepPage - 1)}>←</button>
            )}
            {(stepPage + 1) * stepsPerPage < moduleData.finalQuiz.length && (
              <button onClick={() => setStepPage(stepPage + 1)}>→</button>
            )}
          </div>
          <div className="question-block">
            <p><strong>{quizIndex + 1}. {currentFinalQuestion.question}</strong></p>
            {currentFinalQuestion.options.map((opt, idx) => {
              const selected = quizAnswers[quizIndex];
              const isCorrect = selected === currentFinalQuestion.answer;

              let btnClass = "option-button";
              if (finalSubmitted || selected) {
                if (opt === currentFinalQuestion.answer) btnClass += " correct";
                else if (opt === selected) btnClass += " wrong";
              }

              return (
                <button
                  key={idx}
                  className={btnClass}
                  onClick={() => handleFinalAnswer(quizIndex, opt)}
                  disabled={!!selected}
                >
                  {opt}
                  {selected === opt && (isCorrect ? ' ✅' : ' ❌')}
                </button>
              );
            })}
          </div>

          <div className="quiz-navigation">
            <button onClick={() => setQuizIndex((prev) => Math.max(prev - 1, 0))} disabled={quizIndex === 0}>← Prev</button>
            <button onClick={() => setQuizIndex((prev) => Math.min(prev + 1, totalFinalSteps - 1))} disabled={quizIndex === totalFinalSteps - 1}>Next →</button>
            <button onClick={restartFinalQuiz}>🔁 Restart</button>
            <button onClick={submitFinalQuiz} disabled={finalSubmitted}>✔️ Submit</button>
          </div>
          {showScore && (
            <div className="score-display">
              <h2>🎉 Your Score: {score} / {moduleData.finalQuiz.length}</h2>
              <p>Great job! You can retry if you want to improve.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleDetail;
