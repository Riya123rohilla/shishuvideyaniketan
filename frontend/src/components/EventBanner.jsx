import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { eventAPI } from '../services/api';

const EventBanner = () => {
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll();
      if (response.data.success && response.data.data.length > 0) {
        // Filter active events that haven't ended
        const activeEvents = response.data.data.filter(event => {
          const endDate = new Date(event.endDate);
          const today = new Date();
          return endDate >= today;
        });

        if (activeEvents.length > 0) {
          setEvents(activeEvents);
          
          // Check if user has closed the banner today
          const lastClosed = localStorage.getItem('eventBannerClosed');
          const today = new Date().toDateString();
          
          if (lastClosed !== today) {
            setIsVisible(true);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('eventBannerClosed', new Date().toDateString());
    }, 300);
  };

  const handleNextEvent = () => {
    if (currentEventIndex < events.length - 1) {
      setCurrentEventIndex(currentEventIndex + 1);
    } else {
      setCurrentEventIndex(0);
    }
  };

  const handlePrevEvent = () => {
    if (currentEventIndex > 0) {
      setCurrentEventIndex(currentEventIndex - 1);
    } else {
      setCurrentEventIndex(events.length - 1);
    }
  };

  if (!isVisible || events.length === 0) {
    return null;
  }

  const currentEvent = events[currentEventIndex];
  const startDate = new Date(currentEvent.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const endDate = new Date(currentEvent.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Default fallback image if no image is provided
  const eventImage = currentEvent.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80';

  return (
    <>
      {/* Event Banner - Compact with Image on Left */}
      <div 
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[75vw] lg:w-[70vw] aspect-[5/3] z-[100] transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="relative h-full bg-white">
          {/* Split Layout: Image Left, Content Right */}
          <div className="grid md:grid-cols-2 h-full">
            
            {/* Left Side - Event Image */}
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img 
                src={eventImage}
                alt={currentEvent.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80';
                }}
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
              
              {/* Event Badge on Image */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6">
                <span className="bg-yellow-400 text-blue-900 text-xs md:text-sm font-bold px-4 py-2 rounded-full uppercase shadow-lg">
                  🎉 Event
                </span>
              </div>
            </div>

            {/* Right Side - Event Details */}
            <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white p-6 md:p-8 lg:p-12 flex flex-col justify-center">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 group bg-white/10 backdrop-blur-sm hover:bg-white/20 p-2 md:p-3 rounded-full transition-all duration-300"
                aria-label="Close event banner"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Event Counter */}
              {events.length > 1 && (
                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm px-3 py-1.5 rounded-full border border-white/30">
                    {currentEventIndex + 1} / {events.length}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="space-y-4 md:space-y-6 mt-8 md:mt-12">
                {/* Event Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {currentEvent.title}
                </h2>

                {/* Event Description */}
                <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed line-clamp-4">
                  {currentEvent.description}
                </p>

                {/* Date Badge */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-white/30">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-sm md:text-base font-medium">
                        {startDate} - {endDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="pt-4">
                  <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-blue-900 font-bold px-6 md:px-8 py-3 md:py-3.5 rounded-full text-base md:text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows - Only show if multiple events */}
          {events.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={handlePrevEvent}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full transition-all duration-300 shadow-lg group z-10"
                aria-label="Previous event"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-blue-900 group-hover:-translate-x-0.5 transition-transform duration-300" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={handleNextEvent}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full transition-all duration-300 shadow-lg group z-10"
                aria-label="Next event"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-blue-900 group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {events.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentEventIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentEventIndex
                        ? 'w-8 h-2.5 bg-white'
                        : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to event ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

    </>
  );
};

export default EventBanner;
