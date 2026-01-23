import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Detect scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [location]);

  // Navigation links
  const navLinks = [
    { name: t('navbar.home'), path: '/' },
    { name: t('navbar.about'), path: '/allAbout' },
    { name: t('navbar.gallery'), path: '/gallery' },
    { name: t('navbar.courses'), path: '/courses' },
    { name: t('navbar.events') || 'Events', path: '/events' },
    { name: t('navbar.facilities'), path: '/facilities' },
    { name: t('navbar.contact'), path: '/contact' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900 cursor-pointer hover:text-blue-700 transition">
                {t('navbar.schoolName')}
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2 py-2 rounded-xl text-xs lg:text-sm font-bold transition duration-300 whitespace-nowrap ${
                  location.pathname === link.path
                    ? 'text-white bg-blue-900 border-b-4 border-blue-900'
                    : 'text-blue-900 hover:text-white hover:bg-blue-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button and Language Switcher */}
          <div className="md:hidden flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <button
              onClick={toggleMenu}
              className="text-blue-900 hover:text-blue-700 focus:outline-none"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-base font-bold transition duration-300 ${
                    location.pathname === link.path
                      ? 'text-white bg-blue-900 border-l-4 border-white'
                      : 'text-blue-900 hover:text-white hover:bg-blue-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 sm:hidden">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
