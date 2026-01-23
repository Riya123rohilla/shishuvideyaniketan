import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock } from 'lucide-react';
import { eventAPI } from '../services/api';
import schoolCampus from '../assets/school.png';

const EventsPage = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') {
      return events.filter(event => new Date(event.startDate) >= today);
    } else if (filter === 'past') {
      return events.filter(event => new Date(event.endDate) < today);
    }
    return events;
  };

  const filteredEvents = getFilteredEvents();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isEventActive = (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return today >= start && today <= end;
  };

  const isEventUpcoming = (startDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(startDate) > today;
  };

  return (
    <div className="font-sans overflow-x-hidden">
      {/* Hero Banner */}
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0 z-[1]">
          <img
            src={schoolCampus}
            alt="School Events"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60 z-[2]"></div>
        </div>

        <div className="relative z-[3] h-full flex flex-col items-center justify-center text-center px-6">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 text-sm font-bold uppercase tracking-[2px] mb-5 border border-white/30">
            {t('events.subtitle') || 'School Events'}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 drop-shadow-lg">
            {t('events.title') || 'Our Events'}
          </h1>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed">
            {t('events.description') || 'Stay updated with all the exciting events and activities happening at our school'}
          </p>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-[-1px] left-0 right-0 z-[4]">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-20">
            <path
              d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,85.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </div>

      {/* Events Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-lg font-bold transition ${
                filter === 'all'
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2.5 rounded-lg font-bold transition ${
                filter === 'upcoming'
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-2.5 rounded-lg font-bold transition ${
                filter === 'past'
                  ? 'bg-blue-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Past Events
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            /* No Events */
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No events found</p>
            </div>
          ) : (
            /* Events Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Event Image */}
                  {event.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Status Badge */}
                      {isEventActive(event.startDate, event.endDate) && (
                        <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Ongoing
                        </span>
                      )}
                      {isEventUpcoming(event.startDate) && (
                        <span className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Upcoming
                        </span>
                      )}
                    </div>
                  )}

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>

                    {/* Date Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-blue-900" />
                        <span>Start: {formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-blue-900" />
                        <span>End: {formatDate(event.endDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
