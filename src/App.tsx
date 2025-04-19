import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import RichTextEditor from "./pages/RichTextEditor";
import CodeEditor from "./pages/CodeEditor";
import "./styles/globals.css";

function App() {
  const [darkMode, _setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rich-text" element={<RichTextEditor />} />
          <Route path="/code" element={<CodeEditor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
