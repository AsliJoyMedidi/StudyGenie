import { useState } from "react";
import axios from "axios";
import "./QuizGenerator.css";

function QuizGenerator() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate Quiz
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setQuiz(null);
    setScore(null);

    try {
      const response = await axios.post(
        `${API_URL}/quiz`,
        {
          subject: subject,
          topic: topic,
          questions: Number(questions),
          difficulty: difficulty,
        }
      );

      console.log("QUIZ RESPONSE:", response.data);

      setQuiz(response.data.quiz);
      setAnswers({});
      setScore(null);
    } catch (error) {
      console.error("Quiz error:", error);
      alert("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  // Store selected answer
  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex,
    });
  };

  // Submit Quiz
  const submitQuiz = () => {
    let calculatedScore = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);

    const percentage = Math.round(
      (calculatedScore / quiz.questions.length) * 100
    );

    const quizResult = {
      subject: subject,
      topic: topic,
      score: calculatedScore,
      total: quiz.questions.length,
      difficulty: difficulty,
      percentage: percentage,
      date: new Date().toLocaleDateString(),
    };

    const existingResults =
      JSON.parse(localStorage.getItem("quizResults")) || [];

    existingResults.push(quizResult);

    localStorage.setItem(
      "quizResults",
      JSON.stringify(existingResults)
    );

    console.log("QUIZ RESULT SAVED:", quizResult);
  };

  return (
    <div className="quiz-page">

      {/* Header */}
      <header className="quiz-header">
        <div
          className="quiz-logo"
          onClick={() => (window.location.href = "/dashboard")}
        >
          🎓 <span>StudyGenie</span>
        </div>

        <button
          className="quiz-back-btn"
          onClick={() => (window.location.href = "/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="quiz-container">

        {/* Introduction */}
        <section className="quiz-intro">
          <div className="quiz-intro-icon">
            📝
          </div>

          <div>
            <p className="quiz-label">
              AI LEARNING ASSISTANT
            </p>

            <h1>AI Quiz Generator</h1>

            <p>
              Test your knowledge with personalized
              AI-generated questions based on your subject,
              topic, and difficulty level.
            </p>
          </div>
        </section>

        {/* Generator Form */}
        <section className="quiz-form-card">

          <div className="quiz-form-title">
            <div>
              <h2>✨ Create Your Quiz</h2>

              <p>
                Choose your subject, topic, number of questions,
                and difficulty.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="quiz-form-grid">

              <div className="quiz-form-group">
                <label>Subject</label>

                <input
                  type="text"
                  placeholder="Example: Python"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="quiz-form-group">
                <label>Topic</label>

                <input
                  type="text"
                  placeholder="Example: Functions"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div className="quiz-form-group">
                <label>Number of Questions</label>

                <select
                  value={questions}
                  onChange={(e) =>
                    setQuestions(e.target.value)
                  }
                >
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                  <option value="15">15 Questions</option>
                  <option value="20">20 Questions</option>
                </select>
              </div>

              <div className="quiz-form-group">
                <label>Difficulty Level</label>

                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value)
                  }
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

            </div>

            <button
              className="generate-quiz-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "🤖 Generating Quiz..."
                : "✨ Generate Quiz"}
            </button>

          </form>
        </section>

        {/* Quiz */}
        {quiz && (
          <section className="quiz-section">

            <div className="quiz-section-header">
              <div>
                <p className="quiz-label">
                  GENERATED QUIZ
                </p>

                <h2>🤖 Your Quiz</h2>
              </div>

              <div className="quiz-info-badges">
                <span>
                  {quiz.questions.length} Questions
                </span>

                <span>
                  {difficulty}
                </span>
              </div>
            </div>

            {/* Questions */}
            {quiz.questions?.map(
              (question, questionIndex) => (
                <div
                  className="question-card"
                  key={questionIndex}
                >

                  <h3>
                    <span className="question-number">
                      {questionIndex + 1}
                    </span>

                    {question.question}
                  </h3>

                  <div className="options-container">

                    {question.options.map(
                      (option, optionIndex) => (
                        <label
                          className={
                            answers[questionIndex] ===
                            optionIndex
                              ? "option selected"
                              : "option"
                          }
                          key={optionIndex}
                        >

                          <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            checked={
                              answers[questionIndex] ===
                              optionIndex
                            }
                            onChange={() =>
                              handleAnswer(
                                questionIndex,
                                optionIndex
                              )
                            }
                          />

                          <span className="option-letter">
                            {String.fromCharCode(
                              65 + optionIndex
                            )}
                          </span>

                          <span>{option}</span>

                        </label>
                      )
                    )}

                  </div>
                </div>
              )
            )}

            {/* Submit */}
            <button
              className="submit-quiz-btn"
              onClick={submitQuiz}
            >
              ✅ Submit Quiz
            </button>

            {/* Result */}
            {score !== null && (
              <section className="quiz-result">

                <div className="result-icon">
                  🎉
                </div>

                <p className="quiz-label">
                  QUIZ COMPLETED
                </p>

                <h2>Your Quiz Result</h2>

                <div className="score-number">
                  {score} / {quiz.questions.length}
                </div>

                <div className="percentage">
                  {Math.round(
                    (score / quiz.questions.length) * 100
                  )}
                  %
                </div>

                <h3>
                  {score / quiz.questions.length >= 0.8
                    ? "🌟 Excellent work!"
                    : score / quiz.questions.length >= 0.6
                    ? "👍 Good job! Keep practicing."
                    : "📚 Keep practicing this topic."}
                </h3>

                {/* Answer Review */}
                <div className="answer-review">

                  <h3>📋 Answer Review</h3>

                  {quiz.questions.map(
                    (question, index) => (
                      <div
                        className={
                          answers[index] ===
                          question.answer
                            ? "review-item correct"
                            : "review-item incorrect"
                        }
                        key={index}
                      >

                        <p>
                          <strong>
                            Question {index + 1}
                          </strong>
                        </p>

                        <p>
                          {answers[index] ===
                          question.answer
                            ? "✅ Correct"
                            : "❌ Incorrect"}
                        </p>

                        {answers[index] !==
                          question.answer && (
                          <p>
                            Correct Answer:{" "}
                            <strong>
                              {
                                question.options[
                                  question.answer
                                ]
                              }
                            </strong>
                          </p>
                        )}

                      </div>
                    )
                  )}

                </div>

              </section>
            )}

          </section>
        )}

      </main>
    </div>
  );
}

export default QuizGenerator;