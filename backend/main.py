from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from dotenv import load_dotenv
import os
from pathlib import Path
from google import genai
from datetime import date
from database import users_collection
from ml_model import predict_performance
from fastapi import HTTPException
from google.genai import errors

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path, override=True)

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("Gemini API key loaded:", bool(GEMINI_API_KEY))
client = genai.Client(api_key=GEMINI_API_KEY)

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class StudyPlanRequest(BaseModel):
    subject: str
    exam_date: str
    hours: int
    difficulty: str

class QuizRequest(BaseModel):
    subject: str
    topic: str
    questions: int
    difficulty: str

class PerformanceRequest(BaseModel):
    studytime: int
    failures: int
    absences: int
    G1: int
    G2: int
    
@app.get("/")
def home():
    return {"message": "StudyGenie Backend is Running!"}


@app.post("/register")
def register(user: UserRegister):

    # Check whether email already exists
    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        return {"message": "Email already registered"}

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Save user
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }

    users_collection.insert_one(new_user)

    return {"message": "User registered successfully!"}

@app.post("/login")
def login(user: UserLogin):

    # Find user by email
    existing_user = users_collection.find_one({"email": user.email})

    if not existing_user:
        return {"message": "Invalid email or password"}

    # Check password
    if not pwd_context.verify(user.password, existing_user["password"]):
        return {"message": "Invalid email or password"}

    # Create JWT token
    token_data = {
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"]
    }

    token = jwt.encode(token_data, JWT_SECRET, algorithm=ALGORITHM)

    return {
        "message": "Login successful!",
        "token": token
    }

@app.post("/study-plan")
def create_study_plan(data: StudyPlanRequest):

        today = date.today().isoformat()

        prompt = f"""
        You are an AI study planner.

        Today's date is: {today}

        Create a personalized study plan for a student.

        Subject: {data.subject}
        Exam date: {data.exam_date}
        Daily study hours: {data.hours}
        Difficulty level: {data.difficulty}

        IMPORTANT:
        - Calculate the number of days available from today's date to the exam date.
        - Do NOT create milestones or dates that are already in the past.
        - Create the plan only for the period between today and the exam date.
        - If the exam is very close, prioritize important topics, revision, practice questions, and mock tests.
        - Make the schedule realistic based on the available daily study hours.
        - Use actual calendar dates in the plan.

        Include:
        1. Topics to study
        2. Daily study activities
        3. Revision time
        4. Practice or quiz time
        5. Exam preparation tips

        Keep the plan clear and easy to follow.
        """
        response = client.models.generate_content(
                    model="gemini-3.1-flash-lite",
                    contents=prompt
                )
        
        return {
                "message": "AI study plan generated successfully!",
                "study_plan": response.text
            }

@app.post("/quiz")
def generate_quiz(data: QuizRequest):

    prompt = f"""
You are an AI quiz generator.

Create a quiz for a student.

Subject: {data.subject}
Topic: {data.topic}
Number of questions: {data.questions}
Difficulty level: {data.difficulty}

Generate exactly {data.questions} multiple-choice questions.

For every question provide:
- The question
- Exactly 4 options
- One correct answer

Return ONLY valid JSON.
Do not include markdown.
Do not include ```json.
Do not include any explanation.

Use exactly this format:

{{
  "questions": [
    {{
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": 0
    }}
  ]
}}

The answer value must be the index of the correct option:
0 = first option
1 = second option
2 = third option
3 = fourth option
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )

    import json

    quiz_data = json.loads(response.text)

    print("=== NEW QUIZ CODE IS RUNNING ===")
    print("QUIZ DATA TYPE:", type(quiz_data))
    print("QUIZ DATA:", quiz_data)

    return {
        "message": "AI quiz generated successfully!",
        "quiz": quiz_data
    }        

class SummaryRequest(BaseModel):
    notes: str


@app.post("/summarize")
def summarize_notes(data: SummaryRequest):

    prompt = f"""
You are an AI study assistant.

Summarize the following study notes for a student.

Make the summary:
- Clear
- Concise
- Easy to understand
- Organized with headings and bullet points
- Focused on important concepts
- Useful for exam preparation

Study Notes:

{data.notes}
"""

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=prompt
    )

    return {
        "message": "Notes summarized successfully!",
        "summary": response.text
    }

@app.post("/predict-performance")
def predict_student_performance(data: PerformanceRequest):

    predicted_grade = predict_performance(
        studytime=data.studytime,
        failures=data.failures,
        absences=data.absences,
        G1=data.G1,
        G2=data.G2
    )

    # Determine performance level
    if predicted_grade >= 16:
        performance = "Excellent"
        recommendation = (
            "Excellent performance! Keep maintaining your current "
            "study routine and continue practicing."
        )

    elif predicted_grade >= 12:
        performance = "Good"
        recommendation = (
            "Good performance! Continue your current study routine "
            "and focus on improving weak topics."
        )

    elif predicted_grade >= 10:
        performance = "Average"
        recommendation = (
            "Your performance is average. Increase your study time "
            "and practice more questions."
        )

    else:
        performance = "Needs Improvement"
        recommendation = (
            "Your performance needs improvement. Increase your study "
            "time, revise important topics, and practice regularly."
        )

    return {
        "predicted_grade": predicted_grade,
        "performance": performance,
        "recommendation": recommendation
    }