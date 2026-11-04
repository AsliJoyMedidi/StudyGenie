import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        const response = await axios.post(
          "http://127.0.0.1:8000/register",
          {
            name: name,
            email: email,
            password: password,
          }
        );

        alert(response.data.message);

        if (response.data.message === "User registered successfully!") {
          setIsRegister(false);
          setName("");
          setEmail("");
          setPassword("");
        }
      } else {
        const response = await axios.post(
          "http://127.0.0.1:8000/login",
          {
            email: email,
            password: password,
          }
        );

        localStorage.setItem("token", response.data.token);

        console.log("Token saved:", response.data.token);

        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Authentication error:", error);

      if (error.response) {
        alert(
          error.response.data.detail ||
          error.response.data.message ||
          "Something went wrong."
        );
      } else {
        alert("Cannot connect to StudyGenie backend.");
      }
    }
  };

  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-left">

        <div className="login-brand">
          🎓 <span>StudyGenie</span>
        </div>

        <div className="login-content">

          <p className="login-small-title">
            AI-POWERED LEARNING
          </p>

          <h1>
            Study smarter.
            <br />
            Learn better.
          </h1>

          <p className="login-description">
            Your personal AI-powered learning assistant
            for planning, practicing, summarizing and
            tracking your progress.
          </p>

          <div className="login-features">

            <div className="login-feature">
              <span>📚</span>
              <div>
                <strong>Smart Study Plans</strong>
                <p>
                  Create personalized study schedules.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <span>🧠</span>
              <div>
                <strong>AI-Powered Quizzes</strong>
                <p>
                  Practice with personalized questions.
                </p>
              </div>
            </div>

            <div className="login-feature">
              <span>📊</span>
              <div>
                <strong>Track Progress</strong>
                <p>
                  Monitor your learning performance.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Right Side */}
      <div className="login-right">

        <div className="login-card">

          <div className="login-card-header">

            <div className="login-icon">
              {isRegister ? "📝" : "🔐"}
            </div>

            <h2>
              {isRegister
                ? "Create your account"
                : "Welcome back!"}
            </h2>

            <p>
              {isRegister
                ? "Create an account to start learning with StudyGenie."
                : "Login to continue your learning journey."}
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            {isRegister && (
              <div className="input-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                  required
                />

              </div>
            )}

            <div className="input-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />

            </div>

            <div className="input-group">

              <label>
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
              />

            </div>

            <button
              type="submit"
              className="login-button"
            >
              {isRegister
                ? "Create Account →"
                : "Login to StudyGenie →"}
            </button>

          </form>

          <div className="auth-switch">

            <p>
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setName("");
                setEmail("");
                setPassword("");
              }}
              className="switch-button"
            >
              {isRegister
                ? "Login here"
                : "Create an account"}
            </button>

          </div>

          <p className="login-footer">
            🎓 Learn • Practice • Improve
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;