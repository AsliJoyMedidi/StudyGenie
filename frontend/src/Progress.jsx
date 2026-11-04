import { useEffect, useState } from "react";
import "./Progress.css";

function Progress() {
  const [results, setResults] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    // Load quiz history
    const savedResults =
      JSON.parse(localStorage.getItem("quizResults")) || [];

    setResults(savedResults);

    // Load latest ML performance prediction
    const savedPrediction =
      JSON.parse(
        localStorage.getItem("performancePrediction")
      ) || null;

    setPrediction(savedPrediction);
  }, []);

  const totalQuizzes = results.length;

  const averageScore =
    totalQuizzes > 0
      ? Math.round(
          results.reduce(
            (sum, result) => sum + result.percentage,
            0
          ) / totalQuizzes
        )
      : 0;

  const bestScore =
    totalQuizzes > 0
      ? Math.max(
          ...results.map((result) => result.percentage)
        )
      : 0;

  const clearHistory = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear your quiz history?"
    );

    if (confirmClear) {
      localStorage.removeItem("quizResults");
      setResults([]);
    }
  };

  return (
    <div className="progress-page">

      {/* Header */}
      <header className="progress-header">

        <div
          className="progress-logo"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          🎓 <span>StudyGenie</span>
        </div>

        <button
          className="progress-back-btn"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          ← Dashboard
        </button>

      </header>


      <main className="progress-container">

        {/* Introduction */}
        <section className="progress-intro">

          <div className="progress-intro-icon">
            📊
          </div>

          <div>

            <p className="progress-label">
              LEARNING ANALYTICS
            </p>

            <h1>
              Progress Tracking
            </h1>

            <p>
              Track your quiz performance and monitor
              your learning progress over time.
            </p>

          </div>

        </section>


        {/* Quiz Statistics */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>
              <p>Total Quizzes</p>
              <h2>{totalQuizzes}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📈
            </div>

            <div>
              <p>Average Score</p>
              <h2>{averageScore}%</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🏆
            </div>

            <div>
              <p>Best Score</p>
              <h2>{bestScore}%</h2>
            </div>

          </div>

        </section>


        {/* ML Performance Prediction */}
        <section className="ml-prediction-card">

          <div className="section-heading">

            <div>

              <p className="progress-label">
                MACHINE LEARNING
              </p>

              <h2>
                🤖 AI Performance Prediction
              </h2>

            </div>

            {prediction && (
              <span className="ml-badge">
                ML Prediction
              </span>
            )}

          </div>


          {!prediction ? (

            <div className="ml-empty">

              <div className="ml-empty-icon">
                🤖
              </div>

              <div>

                <h3>
                  No prediction available yet
                </h3>

                <p>
                  Complete the Performance Prediction
                  form to generate your expected final
                  grade using the machine learning model.
                </p>

                <button
                  className="prediction-btn"
                  onClick={() =>
                    (window.location.href =
                      "/performance")
                  }
                >
                  📈 Predict My Performance
                </button>

              </div>

            </div>

          ) : (

            <div className="ml-result">

              {/* Predicted Grade */}
              <div className="prediction-score">

                <p>
                  Predicted Final Grade
                </p>

                <h1>
                  {prediction.predicted_grade}
                  <span> / 20</span>
                </h1>

              </div>


              {/* Performance Level */}
              <div className="prediction-level">

                <p>
                  Performance Level
                </p>

                <h3>
                  {prediction.performance}
                </h3>

              </div>


              {/* Recommendation */}
              <div className="prediction-recommendation">

                <h3>
                  💡 Recommendation
                </h3>

                <p>
                  {prediction.recommendation}
                </p>

              </div>

            </div>

          )}

        </section>


        {/* Overall Progress */}
        <section className="performance-card">

          <div className="section-heading">

            <div>

              <p className="progress-label">
                QUIZ PERFORMANCE
              </p>

              <h2>
                📈 Overall Progress
              </h2>

            </div>

            {totalQuizzes > 0 && (
              <span className="performance-badge">

                {averageScore >= 80
                  ? "🌟 Excellent"
                  : averageScore >= 60
                  ? "👍 Good Progress"
                  : "📚 Keep Practicing"}

              </span>
            )}

          </div>


          <div className="progress-bar-container">

            <div
              className="progress-bar"
              style={{
                width: `${averageScore}%`,
              }}
            />

          </div>


          <p className="progress-description">

            Your average quiz performance is{" "}

            <strong>
              {averageScore}%
            </strong>.

          </p>

        </section>


        {/* Quiz History */}
        <section className="history-card">

          <div className="history-header">

            <div>

              <p className="progress-label">
                ACTIVITY
              </p>

              <h2>
                📝 Quiz History
              </h2>

            </div>

            {results.length > 0 && (

              <button
                className="clear-btn"
                onClick={clearHistory}
              >
                🗑️ Clear History
              </button>

            )}

          </div>


          {results.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📚
              </div>

              <h3>
                No quiz results yet
              </h3>

              <p>
                Complete an AI-generated quiz to start
                tracking your learning progress.
              </p>

              <button
                className="start-quiz-btn"
                onClick={() =>
                  (window.location.href =
                    "/quiz")
                }
              >
                📝 Take a Quiz
              </button>

            </div>

          ) : (

            <div className="history-list">

              {results
                .slice()
                .reverse()
                .map((result, index) => {

                  const scoreClass =
                    result.percentage >= 80
                      ? "excellent"
                      : result.percentage >= 60
                      ? "good"
                      : "needs-practice";

                  return (

                    <div
                      className="history-item"
                      key={index}
                    >

                      <div className="history-number">
                        {results.length - index}
                      </div>


                      <div className="history-details">

                        <h3>
                          {result.topic}
                        </h3>

                        <p>
                          {result.subject} •{" "}
                          {result.difficulty}
                        </p>

                        <span>
                          📅 {result.date}
                        </span>

                      </div>


                      <div className="history-score">

                        <strong
                          className={scoreClass}
                        >
                          {result.percentage}%
                        </strong>

                        <span>
                          {result.score} /{" "}
                          {result.total}
                        </span>

                      </div>

                    </div>

                  );
                })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Progress;