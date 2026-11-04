import { useState } from "react";
import axios from "axios";
import "./StudyPlanner.css";

function StudyPlanner() {
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hours, setHours] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/study-plan",
        {
          subject: subject,
          exam_date: examDate,
          hours: Number(hours),
          difficulty: difficulty,
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error("Study plan error:", error);
      alert("Failed to create study plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-page">
      {/* Top Bar */}
      <header className="planner-header">
        <div
          className="planner-logo"
          onClick={() => (window.location.href = "/dashboard")}
        >
          🎓 <span>StudyGenie</span>
        </div>

        <button
          className="back-btn"
          onClick={() => (window.location.href = "/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="planner-container">
        {/* Heading */}
        <section className="planner-intro">
          <div className="planner-icon">📚</div>

          <div>
            <p className="planner-label">AI LEARNING ASSISTANT</p>

            <h1>AI Study Planner</h1>

            <p>
              Create a personalized study plan based on your
              subject, exam date, available study time, and
              difficulty level.
            </p>
          </div>
        </section>

        <div className="planner-layout">
          {/* Form Card */}
          <section className="planner-form-card">
            <h2>✨ Create Your Plan</h2>

            <p className="form-description">
              Tell us about your study requirements.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Subject</label>

                <input
                  type="text"
                  placeholder="Example: Python"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Exam Date</label>

                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Daily Study Hours</label>

                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Example: 3"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Difficulty Level</label>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <button
                className="generate-btn"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "🤖 Creating Plan..."
                  : "✨ Generate Study Plan"}
              </button>
            </form>
          </section>

          {/* Information Card */}
          <section className="planner-info-card">
            <h2>💡 How it works</h2>

            <div className="info-item">
              <span>01</span>

              <div>
                <h3>Enter your details</h3>
                <p>
                  Tell StudyGenie what subject you're preparing
                  for and when your exam is.
                </p>
              </div>
            </div>

            <div className="info-item">
              <span>02</span>

              <div>
                <h3>AI creates your plan</h3>
                <p>
                  Gemini analyzes your information and creates a
                  personalized roadmap.
                </p>
              </div>
            </div>

            <div className="info-item">
              <span>03</span>

              <div>
                <h3>Study smarter</h3>
                <p>
                  Follow the generated schedule and stay
                  consistent with your preparation.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Result */}
        {result && (
          <section className="plan-result">
            <div className="result-header">
              <div>
                <p className="planner-label">GENERATED FOR YOU</p>

                <h2>🤖 Your AI Study Plan</h2>
              </div>

              <span className="success-badge">✓ Generated</span>
            </div>

            <p className="success-message">
              {result.message}
            </p>

            <div className="study-plan-content">
              <pre>{result.study_plan}</pre>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default StudyPlanner;