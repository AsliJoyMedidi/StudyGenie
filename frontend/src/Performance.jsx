import { useState } from "react";
import axios from "axios";
import "./Performance.css";

function Performance() {
  const [studytime, setStudytime] = useState("");
  const [failures, setFailures] = useState("");
  const [absences, setAbsences] = useState("");
  const [G1, setG1] = useState("");
  const [G2, setG2] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        `${API_URL}/predict-performance`,
        {
          studytime: Number(studytime),
          failures: Number(failures),
          absences: Number(absences),
          G1: Number(G1),
          G2: Number(G2),
        }
      );

      console.log("PERFORMANCE RESPONSE:", response.data);

      // Display result
      setResult(response.data);

      // Save prediction for Progress page
      localStorage.setItem(
        "performancePrediction",
        JSON.stringify(response.data)
      );

    } catch (error) {
      console.error(
        "Performance prediction error:",
        error
      );

      alert("Failed to predict performance");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="performance-page">

      {/* Header */}
      <div className="performance-header">

        <div
          className="performance-logo"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          🎓 StudyGenie
        </div>

        <button
          className="back-btn"
          onClick={() =>
            (window.location.href = "/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>


      <div className="performance-container">

        {/* Introduction */}
        <div className="performance-intro">

          <p className="small-title">
            AI POWERED ANALYTICS 🤖
          </p>

          <h1>
            📈 Performance Prediction
          </h1>

          <p>
            Use your study habits and previous academic
            performance to predict your expected final grade.
          </p>

        </div>


        {/* Main Layout */}
        <div className="performance-layout">

          {/* Form */}
          <div className="performance-form-card">

            <h2>
              🎓 Student Information
            </h2>

            <p className="card-description">
              Enter your academic details below.
            </p>


            <form onSubmit={handleSubmit}>

              {/* Study Time */}
              <div className="form-group">

                <label>
                  Study Time
                </label>

                <select
                  value={studytime}
                  onChange={(e) =>
                    setStudytime(e.target.value)
                  }
                  required
                >

                  <option value="">
                    Select study time
                  </option>

                  <option value="1">
                    1 - Less than 2 hours
                  </option>

                  <option value="2">
                    2 - 2 to 5 hours
                  </option>

                  <option value="3">
                    3 - 5 to 10 hours
                  </option>

                  <option value="4">
                    4 - More than 10 hours
                  </option>

                </select>

              </div>


              {/* Failures */}
              <div className="form-group">

                <label>
                  Number of Failures
                </label>

                <input
                  type="number"
                  min="0"
                  max="4"
                  value={failures}
                  onChange={(e) =>
                    setFailures(e.target.value)
                  }
                  placeholder="Example: 0"
                  required
                />

              </div>


              {/* Absences */}
              <div className="form-group">

                <label>
                  Number of Absences
                </label>

                <input
                  type="number"
                  min="0"
                  value={absences}
                  onChange={(e) =>
                    setAbsences(e.target.value)
                  }
                  placeholder="Example: 5"
                  required
                />

              </div>


              {/* G1 */}
              <div className="form-group">

                <label>
                  First Period Grade (G1)
                </label>

                <input
                  type="number"
                  min="0"
                  max="20"
                  value={G1}
                  onChange={(e) =>
                    setG1(e.target.value)
                  }
                  placeholder="Example: 12"
                  required
                />

              </div>


              {/* G2 */}
              <div className="form-group">

                <label>
                  Second Period Grade (G2)
                </label>

                <input
                  type="number"
                  min="0"
                  max="20"
                  value={G2}
                  onChange={(e) =>
                    setG2(e.target.value)
                  }
                  placeholder="Example: 14"
                  required
                />

              </div>


              {/* Button */}
              <button
                type="submit"
                className="predict-btn"
                disabled={loading}
              >
                {loading
                  ? "🤖 Predicting..."
                  : "🚀 Predict Performance"}
              </button>

            </form>

          </div>


          {/* Prediction Result */}
          <div className="prediction-card">

            {!result ? (

              <div className="empty-result">

                <div className="empty-icon">
                  🤖
                </div>

                <h2>
                  AI Prediction
                </h2>

                <p>
                  Enter your academic information and
                  click the prediction button to see
                  your expected final grade.
                </p>

              </div>

            ) : (

              <div className="result-content">

                <div className="result-title">
                  🎯 Prediction Result
                </div>

                <p className="result-label">
                  Predicted Final Grade
                </p>

                <div className="predicted-grade">
                  {result.predicted_grade}
                  <span>/ 20</span>
                </div>

                <div className="performance-level">

                  <span>
                    Performance Level
                  </span>

                  <strong>
                    {result.performance}
                  </strong>

                </div>


                <div className="recommendation">

                  <h3>
                    💡 Recommendation
                  </h3>

                  <p>
                    {result.recommendation}
                  </p>

                </div>


                <div className="model-info">

                  <span>
                    🤖
                  </span>

                  <p>
                    Prediction generated using a
                    Machine Learning model trained
                    on student performance data.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>


        {/* Information Cards */}
        <div className="prediction-info">

          <div className="info-card">

            <div>
              📊
            </div>

            <h3>
              Student Dataset
            </h3>

            <p>
              The model uses student academic
              performance data for prediction.
            </p>

          </div>


          <div className="info-card">

            <div>
              🧠
            </div>

            <h3>
              Machine Learning
            </h3>

            <p>
              A Random Forest regression model
              predicts the expected final grade.
            </p>

          </div>


          <div className="info-card">

            <div>
              💡
            </div>

            <h3>
              Smart Recommendation
            </h3>

            <p>
              StudyGenie provides personalized
              recommendations based on the prediction.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Performance;