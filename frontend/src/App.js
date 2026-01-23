import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EventBanner from './components/EventBanner';
import HomePage from './pages/HomePage';
// import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import CoursesPage from './pages/CoursesPage';
import FacilitiesPage from './pages/FacilitiesPage';
import ContactPage from './pages/ContactPage';
import CourseDetailPage from './pages/CourseDetailPage';
import EventsPage from './pages/EventsPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Allabout from './components/about/Allabout';

// Layout wrapper to conditionally show navbar/footer
function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <EventBanner />}
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          {/* 📄 Page Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Allabout" element={<Allabout />} />
            {/* <Route path="/about" element={<AboutPage/>}/> */}
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/events" element={<EventsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
