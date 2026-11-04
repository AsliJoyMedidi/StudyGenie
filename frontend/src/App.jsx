import Login from "./Login";
import Dashboard from "./Dashboard";
import StudyPlanner from "./StudyPlanner";
import QuizGenerator from "./QuizGenerator";
import NotesSummarizer from "./NotesSummarizer";
import Progress from "./Progress";
import Performance from "./Performance";

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  if (path === "/study-planner") {
    return <StudyPlanner />;
  }

  if (path === "/quiz") {
    return <QuizGenerator />;
  }
  
  if(path == "/notes") {
    return <NotesSummarizer />;
  }

  if (path === "/progress") {
  return <Progress />;
  }

  if (path === "/performance") {
    return <Performance />;
  }
  
  return <Login />;
}

export default App;