import { useState } from "react";
import axios from "axios";
import "./NotesSummarizer.css";

function NotesSummarizer() {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async (e) => {
    e.preventDefault();

    if (!notes.trim()) {
      alert("Please enter your notes.");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/summarize",
        {
          notes: notes,
        }
      );

      console.log("SUMMARY RESPONSE:", response.data);

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Summary error:", error);
      alert("Failed to summarize notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notes-page">

      {/* Header */}
      <header className="notes-header">
        <div
          className="notes-logo"
          onClick={() => (window.location.href = "/dashboard")}
        >
          🎓 <span>StudyGenie</span>
        </div>

        <button
          className="notes-back-btn"
          onClick={() => (window.location.href = "/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="notes-container">

        {/* Introduction */}
        <section className="notes-intro">

          <div className="notes-intro-icon">
            📄
          </div>

          <div>
            <p className="notes-label">
              AI LEARNING ASSISTANT
            </p>

            <h1>AI Notes Summarizer</h1>

            <p>
              Turn your long study notes into a clear,
              simple and easy-to-understand summary.
            </p>
          </div>

        </section>

        {/* Notes Input */}
        <section className="notes-card">

          <div className="notes-card-header">
            <div>
              <h2>📝 Your Study Notes</h2>

              <p>
                Paste your notes below and let AI summarize
                the important information for you.
              </p>
            </div>

            <span className="notes-ai-badge">
              ✨ AI Powered
            </span>
          </div>

          <form onSubmit={handleSummarize}>

            <textarea
              className="notes-textarea"
              placeholder="Paste your study notes here...

Example:
Python is a high-level programming language.
It is easy to learn and widely used in web development,
data science, artificial intelligence and automation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="notes-bottom">

              <span className="character-count">
                {notes.length} characters
              </span>

              <button
                type="submit"
                className="summarize-btn"
                disabled={loading}
              >
                {loading
                  ? "🤖 Summarizing..."
                  : "✨ Summarize Notes"}
              </button>

            </div>

          </form>

        </section>

        {/* Loading */}
        {loading && (
          <div className="loading-card">
            <div className="loading-icon">
              🤖
            </div>

            <h3>AI is analyzing your notes...</h3>

            <p>
              Please wait while StudyGenie creates your summary.
            </p>
          </div>
        )}

        {/* Summary */}
        {summary && !loading && (
          <section className="summary-card">

            <div className="summary-header">

              <div>
                <p className="notes-label">
                  GENERATED SUMMARY
                </p>

                <h2>🤖 AI Summary</h2>
              </div>

              <span className="summary-badge">
                ✓ Completed
              </span>

            </div>

            <div className="summary-content">
              {summary}
            </div>

            <div className="summary-footer">
              💡 Use this summary for quick revision before
              your exam.
            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default NotesSummarizer;