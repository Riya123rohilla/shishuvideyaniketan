import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CoursesIndex from './pages/CoursesIndex';
import CourseDetail from './pages/CourseDetail';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            {/* Redirect root to courses */}
            <Route path="/" element={<Navigate to="/courses" replace />} />
            <Route path="/courses" element={<CoursesIndex />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
