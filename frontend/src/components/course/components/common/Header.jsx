import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <Link to="/courses" className="header-logo">
                    <div className="logo-icon">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <circle cx="20" cy="20" r="18" fill="var(--c-primary)" />
                            <path d="M12 28V16L20 12L28 16V28L20 24L12 28Z" fill="var(--c-accent)" />
                            <circle cx="20" cy="18" r="4" fill="white" />
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span className="logo-name">Shishu Vidya Niketan</span>
                        <span className="logo-tagline">Nurturing Young Minds</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header-nav" role="navigation" aria-label="Main navigation">
                    <Link
                        to="/courses"
                        className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
                    >
                        All Courses
                    </Link>
                </nav>

                {/* CTA Buttons */}
                <div className="header-actions">
                    <Link to="/courses" className="btn btn-accent btn-sm">
                        Enquire Now
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={isMobileMenuOpen}
                >
                    <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <Link
                        to="/courses"
                        className={`mobile-nav-link ${isActive('/courses') ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        All Courses
                    </Link>
                </nav>
                <div className="mobile-actions">
                    <Link
                        to="/courses"
                        className="btn btn-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Enquire Now
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
