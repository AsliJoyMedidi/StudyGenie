import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const savedResults =
      JSON.parse(localStorage.getItem("quizResults")) || [];

    setResults(savedResults);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          🎓 <span>StudyGenie</span>
        </div>

        <nav>

          <button
            className="nav-item active"
            onClick={() =>
              (window.location.href = "/dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() =>
              (window.location.href = "/study-planner")
            }
          >
            📚 Study Planner
          </button>

          <button
            className="nav-item"
            onClick={() =>
              (window.location.href = "/quiz")
            }
          >
            📝 Quiz Generator
          </button>

          <button
            className="nav-item"
            onClick={() =>
              (window.location.href = "/notes")
            }
          >
            📄 Notes Summarizer
          </button>

          <button
            className="nav-item"
            onClick={() =>
              (window.location.href = "/progress")
            }
          >
            📊 Progress
          </button>

          {/* NEW - Performance Prediction */}
          <button
            className="nav-item"
            onClick={() =>
              (window.location.href = "/performance")
            }
          >
            📈 Performance Prediction
          </button>

        </nav>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* Main Content */}
      <main className="dashboard-content">

        {/* Welcome */}
        <section className="welcome-section">

          <div>

            <p className="small-title">
              WELCOME BACK 👋
            </p>

            <h1>
              Ready to learn today?
            </h1>

            <p>
              Your AI-powered learning assistant is here
              to help you study smarter and achieve your
              goals.
            </p>

          </div>

        </section>


        {/* Quick Statistics */}
        <h2>Your Learning Overview</h2>

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>
              <h3>{totalQuizzes}</h3>
              <p>Quizzes Completed</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📈
            </div>

            <div>
              <h3>{averageScore}%</h3>
              <p>Average Score</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🏆
            </div>

            <div>
              <h3>{bestScore}%</h3>
              <p>Best Score</p>
            </div>

          </div>

        </div>


        {/* Features */}
        <h2 className="features-title">
          StudyGenie Features
        </h2>

        <div className="feature-grid">

          {/* Study Planner */}
          <div
            className="feature-card"
            onClick={() =>
              (window.location.href =
                "/study-planner")
            }
          >

            <div className="feature-icon">
              📚
            </div>

            <h3>
              Study Planner
            </h3>

            <p>
              Create a personalized AI study plan based
              on your exam date, subject and study time.
            </p>

            <span>
              Open Planner →
            </span>

          </div>


          {/* Quiz */}
          <div
            className="feature-card"
            onClick={() =>
              (window.location.href = "/quiz")
            }
          >

            <div className="feature-icon">
              📝
            </div>

            <h3>
              Quiz Generator
            </h3>

            <p>
              Generate AI-powered quizzes with different
              difficulty levels and test your knowledge.
            </p>

            <span>
              Take a Quiz →
            </span>

          </div>


          {/* Notes */}
          <div
            className="feature-card"
            onClick={() =>
              (window.location.href = "/notes")
            }
          >

            <div className="feature-icon">
              📄
            </div>

            <h3>
              Notes Summarizer
            </h3>

            <p>
              Turn long study notes into clear and
              easy-to-review summaries using AI.
            </p>

            <span>
              Summarize Notes →
            </span>

          </div>


          {/* Progress */}
          <div
            className="feature-card"
            onClick={() =>
              (window.location.href = "/progress")
            }
          >

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Progress Tracking
            </h3>

            <p>
              Track your quiz scores, average performance
              and learning progress.
            </p>

            <span>
              View Progress →
            </span>

          </div>


          {/* NEW - Performance Prediction */}
          <div
            className="feature-card"
            onClick={() =>
              (window.location.href = "/performance")
            }
          >

            <div className="feature-icon">
              📈
            </div>

            <h3>
              Performance Prediction
            </h3>

            <p>
              Predict your expected final grade using
              your study habits and previous academic
              performance.
            </p>

            <span>
              Predict Performance →
            </span>

          </div>

        </div>


        {/* Learning Journey */}
        <h2 className="stats-title">
          Your Learning Journey
        </h2>

        <div className="journey-grid">

          <div className="journey-card">

            <div className="journey-icon">
              🎯
            </div>

            <div>
              <h3>
                Learn
              </h3>

              <p>
                Understand new concepts with AI-powered
                study plans.
              </p>
            </div>

          </div>


          <div className="journey-card">

            <div className="journey-icon">
              🧠
            </div>

            <div>
              <h3>
                Practice
              </h3>

              <p>
                Test your knowledge using personalized
                AI-generated quizzes.
              </p>
            </div>

          </div>


          <div className="journey-card">

            <div className="journey-icon">
              🚀
            </div>

            <div>
              <h3>
                Improve
              </h3>

              <p>
                Track your performance and identify
                areas for improvement.
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;