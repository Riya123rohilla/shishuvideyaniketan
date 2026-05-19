import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-2xl w-full">
        {/* 404 Number with Animation */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-10xl font-black text-blue-900 opacity-20 mb-4">
            404
          </h1>
          <div className="relative -mt-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        {/* Decorative Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
            <Search className="w-12 h-12 text-blue-900" />
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-12 text-base md:text-lg">
          We couldn't find the page you were looking for. It might have been removed, 
          renamed, or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition font-semibold shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              to="/"
              className="text-blue-900 hover:text-blue-700 font-medium transition hover:underline"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-blue-900 hover:text-blue-700 font-medium transition hover:underline"
            >
              About Us
            </Link>
            <Link
              to="/courses"
              className="text-blue-900 hover:text-blue-700 font-medium transition hover:underline"
            >
              Courses
            </Link>
            <Link
              to="/gallery"
              className="text-blue-900 hover:text-blue-700 font-medium transition hover:underline"
            >
              Gallery
            </Link>
            <Link
              to="/events"
              className="text-blue-900 hover:text-blue-700 font-medium transition hover:underline"
            >
              Events
            </Link>
            <Link
              to="/contact"
              className="text-blue-900 hover:text-blue-700 font-medium transition hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-gray-600 mb-4">
            Still having trouble? <span className="font-semibold">Contact us for help</span>
          </p>
          <Link
            to="/contact"
            className="inline-block text-blue-900 hover:text-blue-700 font-medium transition hover:underline"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
