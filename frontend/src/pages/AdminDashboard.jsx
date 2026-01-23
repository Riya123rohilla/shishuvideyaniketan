import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MessageSquare,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  X,
  Menu,
  Search,
  Bell,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { eventAPI, enquiryAPI } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    image: '',
    priority: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, enquiriesRes] = await Promise.all([
        eventAPI.getAllAdmin(),
        enquiryAPI.getAll()
      ]);

      if (eventsRes.data.success) {
        setEvents(eventsRes.data.data || []);
      }
      if (enquiriesRes.data.success) {
        setEnquiries(enquiriesRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEvent) {
        await eventAPI.update(selectedEvent._id, eventForm);
      } else {
        await eventAPI.create(eventForm);
      }
      fetchData();
      setShowEventModal(false);
      resetEventForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const handleToggleEventStatus = async (event) => {
    try {
      await eventAPI.update(event._id, { isActive: !event.isActive });
      fetchData();
    } catch (error) {
      console.error('Error toggling event status:', error);
      alert('Failed to update event status');
    }
  };

  const handleUpdateEnquiryStatus = async (enquiryId, newStatus) => {
    try {
      await enquiryAPI.update(enquiryId, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      alert('Failed to update status');
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        await enquiryAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        alert('Failed to delete enquiry');
      }
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      image: '',
      priority: 0
    });
    setSelectedEvent(null);
  };

  const openEventModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setEventForm({
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        image: event.image,
        priority: event.priority || 0
      });
    } else {
      resetEventForm();
    }
    setShowEventModal(true);
  };

  const openEnquiryModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowEnquiryModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 border border-blue-300',
      contacted: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      resolved: 'bg-green-100 text-green-800 border border-green-300'
    };
    return colors[status] || colors.new;
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = enquiryFilter === 'all' || enquiry.status === enquiryFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-blue-700">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold">Shishu Admin</h1>
              <p className="text-xs text-blue-200">Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-700 rounded-lg transition"
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem
            icon={<Calendar size={20} />}
            label="Events"
            badge={events.length}
            isActive={activeTab === 'events'}
            onClick={() => setActiveTab('events')}
            sidebarOpen={sidebarOpen}
          />
          <NavItem
            icon={<MessageSquare size={20} />}
            label="Enquiries"
            badge={enquiries.filter(e => e.status === 'new').length}
            isActive={activeTab === 'enquiries'}
            onClick={() => setActiveTab('enquiries')}
            sidebarOpen={sidebarOpen}
          />
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition font-medium"
            title={sidebarOpen ? '' : 'Logout'}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="h-20 px-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {activeTab === 'events' ? '📅 Events Management' : '💬 Enquiries Management'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {activeTab === 'events'
                  ? 'Create, manage, and track all school events'
                  : 'Review and manage contact enquiries from visitors'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition relative" title="Notifications">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {activeTab === 'events' && (
                <button
                  onClick={() => openEventModal()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <Plus size={20} />
                  Add Event
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'events' ? (
            <EventsTab
              events={filteredEvents}
              loading={loading}
              onEdit={openEventModal}
              onDelete={handleDeleteEvent}
              onToggleStatus={handleToggleEventStatus}
            />
          ) : (
            <EnquiriesTab
              enquiries={filteredEnquiries}
              allEnquiries={enquiries}
              loading={loading}
              onEdit={openEnquiryModal}
              onDelete={handleDeleteEnquiry}
              onStatusChange={handleUpdateEnquiryStatus}
              getStatusColor={getStatusColor}
              enquiryFilter={enquiryFilter}
              setEnquiryFilter={setEnquiryFilter}
            />
          )}
        </div>
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={selectedEvent}
          form={eventForm}
          onFormChange={setEventForm}
          onSubmit={handleEventSubmit}
          onClose={() => {
            setShowEventModal(false);
            resetEventForm();
          }}
        />
      )}

      {/* Enquiry Details Modal */}
      {showEnquiryModal && selectedEnquiry && (
        <EnquiryModal
          enquiry={selectedEnquiry}
          onClose={() => {
            setShowEnquiryModal(false);
            setSelectedEnquiry(null);
          }}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon, label, badge, isActive, onClick, sidebarOpen }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition relative ${
      isActive
        ? 'bg-blue-700 text-white shadow-lg'
        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
    }`}
    title={sidebarOpen ? '' : label}
  >
    {icon}
    {sidebarOpen && (
      <>
        <span className="flex-1 text-left">{label}</span>
        {badge > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </>
    )}
  </button>
);

// Events Tab Component
const EventsTab = ({ events, loading, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="p-8 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<Calendar className="w-8 h-8 text-blue-600" />}
          label="Total Events"
          value={events.length}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<CheckCircle className="w-8 h-8 text-green-600" />}
          label="Active Events"
          value={events.filter(e => e.isActive).length}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<AlertCircle className="w-8 h-8 text-red-600" />}
          label="Inactive Events"
          value={events.filter(e => !e.isActive).length}
          bgColor="bg-red-50"
        />
      </div>

      {/* Events Table */}
      {loading ? (
        <LoadingSpinner />
      ) : events.length === 0 ? (
        <EmptyState icon={<Calendar size={48} />} message="No events found. Create one to get started!" />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dates</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-600 truncate">{event.description.substring(0, 50)}...</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <p>{new Date(event.startDate).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">to {new Date(event.endDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      P{event.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleStatus(event)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        event.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {event.isActive ? '✓ Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(event._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Enquiries Tab Component
const EnquiriesTab = ({ enquiries, allEnquiries, loading, onEdit, onDelete, onStatusChange, getStatusColor, enquiryFilter, setEnquiryFilter }) => {
  return (
    <div className="p-8 space-y-6">
      {/* Stats Grid (clickable filters) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={<MessageSquare className="w-8 h-8 text-blue-600" />}
          label="Total Enquiries"
          value={allEnquiries.length}
          bgColor="bg-blue-50"
          onClick={() => setEnquiryFilter('all')}
          active={enquiryFilter === 'all'}
        />
        <StatCard
          icon={<Clock className="w-8 h-8 text-yellow-600" />}
          label="New"
          value={allEnquiries.filter(e => e.status === 'new').length}
          bgColor="bg-yellow-50"
          onClick={() => setEnquiryFilter(enquiryFilter === 'new' ? 'all' : 'new')}
          active={enquiryFilter === 'new'}
        />
        <StatCard
          icon={<AlertCircle className="w-8 h-8 text-orange-600" />}
          label="Contacted"
          value={allEnquiries.filter(e => e.status === 'contacted').length}
          bgColor="bg-orange-50"
          onClick={() => setEnquiryFilter(enquiryFilter === 'contacted' ? 'all' : 'contacted')}
          active={enquiryFilter === 'contacted'}
        />
        <StatCard
          icon={<CheckCircle className="w-8 h-8 text-green-600" />}
          label="Resolved"
          value={allEnquiries.filter(e => e.status === 'resolved').length}
          bgColor="bg-green-50"
          onClick={() => setEnquiryFilter(enquiryFilter === 'resolved' ? 'all' : 'resolved')}
          active={enquiryFilter === 'resolved'}
        />
      </div>

      {/* Enquiries Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : enquiries.length === 0 ? (
        <EmptyState icon={<MessageSquare size={48} />} message="No enquiries yet. They'll appear here!" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{enquiry.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(enquiry.status)}`}>
                      {enquiry.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">📧 {enquiry.email}</p>
                  {enquiry.phone && <p className="text-sm text-gray-600">📱 {enquiry.phone}</p>}
                </div>
                <button
                  onClick={() => onDelete(enquiry._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">Subject: {enquiry.subject}</h4>
                <p className="text-gray-700 text-sm line-clamp-2">{enquiry.message}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  📅 {new Date(enquiry.createdAt).toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <select
                    value={enquiry.status}
                    onChange={(e) => onStatusChange(enquiry._id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    onClick={() => onEdit(enquiry)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Event Modal Component
const EventModal = ({ event, form, onFormChange, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">
          {event ? '✏️ Edit Event' : '➕ Create New Event'}
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onFormChange({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => onFormChange({ ...form, description: e.target.value })}
            rows="4"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            placeholder="Enter event description"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => onFormChange({ ...form, startDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => onFormChange({ ...form, endDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority (0-10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={form.priority}
              onChange={(e) =>
                onFormChange({
                  ...form,
                  priority: parseInt(e.target.value)
                })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">Higher = appears first</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={form.image}
              onChange={(e) =>
                onFormChange({ ...form, image: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {event ? 'Update Event' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Enquiry Modal Component
const EnquiryModal = ({ enquiry, onClose, getStatusColor }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Enquiry Details</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X size={24} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <DetailRow label="Name" value={enquiry.name} />
        <DetailRow label="Email" value={enquiry.email} />
        {enquiry.phone && <DetailRow label="Phone" value={enquiry.phone} />}
        <DetailRow label="Subject" value={enquiry.subject} />

        <div>
          <p className="text-sm text-gray-600 font-semibold mb-2">Message</p>
          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
            {enquiry.message}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 font-semibold mb-2">Status</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(enquiry.status)}`}>
            {enquiry.status.toUpperCase()}
          </span>
        </div>

        <DetailRow
          label="Received"
          value={new Date(enquiry.createdAt).toLocaleString()}
        />

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold mt-4"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// Utility Components
const StatCard = ({ icon, label, value, bgColor, onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl shadow-sm p-6 flex items-center justify-between text-left w-full transition transform ${bgColor} ${
        onClick ? 'hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400' : ''
      } ${active ? 'ring-2 ring-blue-500 border border-blue-500/50' : ''}`}
      aria-pressed={active}
    >
      <div>
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className="text-gray-400">{icon}</div>
    </button>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="inline-block">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading data...</p>
    </div>
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md">
    <div className="text-center">
      <div className="text-gray-300 mb-4">{icon}</div>
      <p className="text-gray-600 font-medium text-lg">{message}</p>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-600 font-semibold mb-1">{label}</p>
    <p className="text-gray-900">{value}</p>
  </div>
);

export default AdminDashboard;
