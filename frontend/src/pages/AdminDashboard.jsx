import React, { useState, useEffect, useCallback } from 'react';
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
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Image,
  Users,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { eventAPI, enquiryAPI, galleryAPI, staffAPI, courseAPI } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [staff, setStaff] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState('all');

  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  // Selected items
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [selectedStaffMember, setSelectedStaffMember] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Forms
  const [eventForm, setEventForm] = useState({ title: '', description: '', startDate: '', endDate: '', image: '', priority: 0 });
  const [galleryForm, setGalleryForm] = useState({ title: '', category: '', description: '', src: '' });
  const [staffForm, setStaffForm] = useState({ name: '', position: '', image: '', bio: '', qualifications: '', experience: '', email: '', phone: '', achievements: '' });
  const [courseForm, setCourseForm] = useState({ id: '', code: '', title: '', titleHi: '', summary: '', summaryHi: '', grade: '', gradeHi: '', fee: '', feeHi: '', image: '', category: '', categoryHi: '', duration: '', durationHi: '', schedule: '', mode: 'In-person', modeHi: '', ageRange: '', ageRangeHi: '', popular: false, stream: '', prerequisites: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();

    // Re-fetch when tab becomes visible (real-time sync)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchData(true);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => fetchData(true), 60000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchData = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      // Fetch all data independently so one failure doesn't block others
      const results = await Promise.allSettled([
        eventAPI.getAllAdmin(),
        enquiryAPI.getAll(),
        galleryAPI.getAll(),
        staffAPI.getAll(),
        courseAPI.getAll()
      ]);

      const [eventsRes, enquiriesRes, galleryRes, staffRes, coursesRes] = results;

      if (eventsRes.status === 'fulfilled' && eventsRes.value.data.success) setEvents(eventsRes.value.data.data || []);
      if (enquiriesRes.status === 'fulfilled' && enquiriesRes.value.data.success) setEnquiries(enquiriesRes.value.data.data || []);
      if (galleryRes.status === 'fulfilled' && galleryRes.value.data.success) setGallery(galleryRes.value.data.data || []);
      if (staffRes.status === 'fulfilled' && staffRes.value.data.success) setStaff(staffRes.value.data.data || []);
      if (coursesRes.status === 'fulfilled' && coursesRes.value.data.success) setCourses(coursesRes.value.data.data || []);

      // Check if auth failed
      const authFailed = results.some(r => r.status === 'rejected' && r.reason?.response?.status === 401);
      if (authFailed) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // ========== EVENT HANDLERS ==========
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
      try { await eventAPI.delete(id); fetchData(); } catch (error) { alert('Failed to delete event'); }
    }
  };

  const handleToggleEventStatus = async (event) => {
    try { await eventAPI.update(event._id, { isActive: !event.isActive }); fetchData(); } catch (error) { alert('Failed to update event status'); }
  };

  const resetEventForm = () => {
    setEventForm({ title: '', description: '', startDate: '', endDate: '', image: '', priority: 0 });
    setSelectedEvent(null);
  };

  const openEventModal = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setEventForm({ title: event.title, description: event.description, startDate: event.startDate, endDate: event.endDate, image: event.image, priority: event.priority || 0 });
    } else { resetEventForm(); }
    setShowEventModal(true);
  };

  // ========== ENQUIRY HANDLERS ==========
  const handleUpdateEnquiryStatus = async (enquiryId, newStatus) => {
    try { await enquiryAPI.update(enquiryId, { status: newStatus }); fetchData(); } catch (error) { alert('Failed to update status'); }
  };

  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try { await enquiryAPI.delete(id); fetchData(); } catch (error) { alert('Failed to delete enquiry'); }
    }
  };

  const openEnquiryModal = (enquiry) => { setSelectedEnquiry(enquiry); setShowEnquiryModal(true); };

  // ========== GALLERY HANDLERS ==========
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedGalleryItem) {
        await galleryAPI.update(selectedGalleryItem._id, galleryForm);
      } else {
        await galleryAPI.create(galleryForm);
      }
      fetchData();
      setShowGalleryModal(false);
      resetGalleryForm();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item');
    }
  };

  const handleDeleteGallery = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try { await galleryAPI.delete(id); fetchData(); } catch (error) { alert('Failed to delete image'); }
    }
  };

  const resetGalleryForm = () => {
    setGalleryForm({ title: '', category: '', description: '', src: '' });
    setSelectedGalleryItem(null);
  };

  const openGalleryModal = (item = null) => {
    if (item) {
      setSelectedGalleryItem(item);
      setGalleryForm({ title: item.title || '', category: item.category || '', description: item.description || '', src: item.src || '' });
    } else { resetGalleryForm(); }
    setShowGalleryModal(true);
  };

  // ========== STAFF HANDLERS ==========
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...staffForm,
        achievements: typeof staffForm.achievements === 'string'
          ? staffForm.achievements.split('\n').filter(a => a.trim())
          : staffForm.achievements
      };
      if (selectedStaffMember) {
        await staffAPI.update(selectedStaffMember._id, data);
      } else {
        await staffAPI.create(data);
      }
      fetchData();
      setShowStaffModal(false);
      resetStaffForm();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff member');
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try { await staffAPI.delete(id); fetchData(); } catch (error) { alert('Failed to delete staff member'); }
    }
  };

  const resetStaffForm = () => {
    setStaffForm({ name: '', position: '', image: '', bio: '', qualifications: '', experience: '', email: '', phone: '', achievements: '' });
    setSelectedStaffMember(null);
  };

  const openStaffModal = (member = null) => {
    if (member) {
      setSelectedStaffMember(member);
      setStaffForm({
        name: member.name || '', position: member.position || '', image: member.image || '',
        bio: member.bio || '', qualifications: member.qualifications || '', experience: member.experience || '',
        email: member.email || '', phone: member.phone || '',
        achievements: Array.isArray(member.achievements) ? member.achievements.join('\n') : member.achievements || ''
      });
    } else { resetStaffForm(); }
    setShowStaffModal(true);
  };

  // ========== COURSE HANDLERS ==========
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...courseForm };
      if (selectedCourse) {
        await courseAPI.update(selectedCourse._id, data);
      } else {
        await courseAPI.create(data);
      }
      fetchData();
      setShowCourseModal(false);
      resetCourseForm();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try { await courseAPI.delete(id); fetchData(); } catch (error) { alert('Failed to delete course'); }
    }
  };

  const resetCourseForm = () => {
    setCourseForm({ id: '', code: '', title: '', titleHi: '', summary: '', summaryHi: '', grade: '', gradeHi: '', fee: '', feeHi: '', image: '', category: '', categoryHi: '', duration: '', durationHi: '', schedule: '', mode: 'In-person', modeHi: '', ageRange: '', ageRangeHi: '', popular: false, stream: '', prerequisites: '' });
    setSelectedCourse(null);
  };

  const openCourseModal = (course = null) => {
    if (course) {
      setSelectedCourse(course);
      setCourseForm({
        id: course.id || '', code: course.code || '', title: course.title || '', titleHi: course.titleHi || '',
        summary: course.summary || '', summaryHi: course.summaryHi || '', grade: course.grade || '', gradeHi: course.gradeHi || '',
        fee: course.fee || '', feeHi: course.feeHi || '', image: course.image || '', category: course.category || '',
        categoryHi: course.categoryHi || '', duration: course.duration || '', durationHi: course.durationHi || '',
        schedule: course.schedule || '', mode: course.mode || 'In-person', modeHi: course.modeHi || '',
        ageRange: course.ageRange || '', ageRangeHi: course.ageRangeHi || '', popular: course.popular === 'true' || course.popular === true,
        stream: course.stream || '', prerequisites: course.prerequisites || ''
      });
    } else { resetCourseForm(); }
    setShowCourseModal(true);
  };

  // ========== UTILS ==========
  const getStatusColor = (status) => {
    const colors = { new: 'bg-blue-100 text-blue-800 border border-blue-300', contacted: 'bg-yellow-100 text-yellow-800 border border-yellow-300', resolved: 'bg-green-100 text-green-800 border border-green-300' };
    return colors[status] || colors.new;
  };

  const getTabTitle = () => {
    const titles = {
      events: { icon: '📅', title: 'Events Management', desc: 'Create, manage, and track all school events' },
      enquiries: { icon: '💬', title: 'Enquiries Management', desc: 'Review and manage contact enquiries from visitors' },
      gallery: { icon: '🖼️', title: 'Gallery Management', desc: 'Add, edit, and remove gallery images' },
      staff: { icon: '👥', title: 'Staff Management', desc: 'Manage staff and managing body members' },
      courses: { icon: '📚', title: 'Courses Management', desc: 'Add, edit, and manage school courses' }
    };
    return titles[activeTab] || titles.events;
  };

  const tabInfo = getTabTitle();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-all duration-300 flex flex-col shadow-lg`}>
        <div className="h-20 flex items-center justify-between px-4 border-b border-blue-700">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold">Shishu Admin</h1>
              <p className="text-xs text-blue-200">Dashboard</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded-lg transition" title={sidebarOpen ? 'Collapse' : 'Expand'}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<Calendar size={20} />} label="Events" badge={events.length} isActive={activeTab === 'events'} onClick={() => setActiveTab('events')} sidebarOpen={sidebarOpen} />
          <NavItem icon={<MessageSquare size={20} />} label="Enquiries" badge={enquiries.filter(e => e.status === 'new').length} isActive={activeTab === 'enquiries'} onClick={() => setActiveTab('enquiries')} sidebarOpen={sidebarOpen} />
          <NavItem icon={<Image size={20} />} label="Gallery" badge={gallery.length} isActive={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} sidebarOpen={sidebarOpen} />
          <NavItem icon={<Users size={20} />} label="Staff" badge={staff.length} isActive={activeTab === 'staff'} onClick={() => setActiveTab('staff')} sidebarOpen={sidebarOpen} />
          <NavItem icon={<BookOpen size={20} />} label="Courses" badge={courses.length} isActive={activeTab === 'courses'} onClick={() => setActiveTab('courses')} sidebarOpen={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-blue-700">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition font-medium" title={sidebarOpen ? '' : 'Logout'}>
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="h-20 px-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{tabInfo.icon} {tabInfo.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{tabInfo.desc}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => fetchData(true)} className={`p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition ${refreshing ? 'animate-spin' : ''}`} title="Refresh Data" disabled={refreshing}>
                <RefreshCw size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition relative" title="Notifications">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {activeTab === 'events' && (
                <button onClick={() => openEventModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  <Plus size={20} /> Add Event
                </button>
              )}
              {activeTab === 'gallery' && (
                <button onClick={() => openGalleryModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  <Plus size={20} /> Add Image
                </button>
              )}
              {activeTab === 'staff' && (
                <button onClick={() => openStaffModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  <Plus size={20} /> Add Staff
                </button>
              )}
              {activeTab === 'courses' && (
                <button onClick={() => openCourseModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                  <Plus size={20} /> Add Course
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {activeTab === 'events' && (
            <EventsTab events={events} loading={loading} onEdit={openEventModal} onDelete={handleDeleteEvent} onToggleStatus={handleToggleEventStatus} />
          )}
          {activeTab === 'enquiries' && (
            <EnquiriesTab enquiries={enquiries.filter(eq => {
              const matchesFilter = enquiryFilter === 'all' || eq.status === enquiryFilter;
              return matchesFilter;
            })} allEnquiries={enquiries} loading={loading} onEdit={openEnquiryModal} onDelete={handleDeleteEnquiry} onStatusChange={handleUpdateEnquiryStatus} getStatusColor={getStatusColor} enquiryFilter={enquiryFilter} setEnquiryFilter={setEnquiryFilter} />
          )}
          {activeTab === 'gallery' && (
            <GalleryTab gallery={gallery} loading={loading} onEdit={openGalleryModal} onDelete={handleDeleteGallery} />
          )}
          {activeTab === 'staff' && (
            <StaffTab staff={staff} loading={loading} onEdit={openStaffModal} onDelete={handleDeleteStaff} />
          )}
          {activeTab === 'courses' && (
            <CoursesTab courses={courses} loading={loading} onEdit={openCourseModal} onDelete={handleDeleteCourse} />
          )}
        </div>
      </main>

      {/* Modals */}
      {showEventModal && <EventModal event={selectedEvent} form={eventForm} onFormChange={setEventForm} onSubmit={handleEventSubmit} onClose={() => { setShowEventModal(false); resetEventForm(); }} />}
      {showEnquiryModal && selectedEnquiry && <EnquiryModal enquiry={selectedEnquiry} onClose={() => { setShowEnquiryModal(false); setSelectedEnquiry(null); }} getStatusColor={getStatusColor} />}
      {showGalleryModal && <GalleryModal item={selectedGalleryItem} form={galleryForm} onFormChange={setGalleryForm} onSubmit={handleGallerySubmit} onClose={() => { setShowGalleryModal(false); resetGalleryForm(); }} />}
      {showStaffModal && <StaffModal member={selectedStaffMember} form={staffForm} onFormChange={setStaffForm} onSubmit={handleStaffSubmit} onClose={() => { setShowStaffModal(false); resetStaffForm(); }} />}
      {showCourseModal && <CourseModal course={selectedCourse} form={courseForm} onFormChange={setCourseForm} onSubmit={handleCourseSubmit} onClose={() => { setShowCourseModal(false); resetCourseForm(); }} />}
    </div>
  );
};

// ==================== NAVIGATION ====================
const NavItem = ({ icon, label, badge, isActive, onClick, sidebarOpen }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition relative ${isActive ? 'bg-blue-700 text-white shadow-lg' : 'text-blue-100 hover:bg-blue-700 hover:text-white'}`} title={sidebarOpen ? '' : label}>
    {icon}
    {sidebarOpen && (
      <>
        <span className="flex-1 text-left">{label}</span>
        {badge > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{badge}</span>}
      </>
    )}
  </button>
);

// ==================== EVENTS TAB ====================
const EventsTab = ({ events, loading, onEdit, onDelete, onToggleStatus }) => (
  <div className="p-8 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard icon={<Calendar className="w-8 h-8 text-blue-600" />} label="Total Events" value={events.length} bgColor="bg-blue-50" />
      <StatCard icon={<CheckCircle className="w-8 h-8 text-green-600" />} label="Active Events" value={events.filter(e => e.isActive).length} bgColor="bg-green-50" />
      <StatCard icon={<AlertCircle className="w-8 h-8 text-red-600" />} label="Inactive Events" value={events.filter(e => !e.isActive).length} bgColor="bg-red-50" />
    </div>
    {loading ? <LoadingSpinner /> : events.length === 0 ? <EmptyState icon={<Calendar size={48} />} message="No events found. Create one to get started!" /> : (
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
                  <p className="font-semibold text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600 truncate">{event.description?.substring(0, 50)}...</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <p>{new Date(event.startDate).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">to {new Date(event.endDate).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4"><span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">P{event.priority}</span></td>
                <td className="px-6 py-4">
                  <button onClick={() => onToggleStatus(event)} className={`px-3 py-1 rounded-full text-sm font-medium transition ${event.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                    {event.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(event)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit2 size={18} /></button>
                    <button onClick={() => onDelete(event._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
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

// ==================== ENQUIRIES TAB ====================
const EnquiriesTab = ({ enquiries, allEnquiries, loading, onEdit, onDelete, onStatusChange, getStatusColor, enquiryFilter, setEnquiryFilter }) => (
  <div className="p-8 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard icon={<MessageSquare className="w-8 h-8 text-blue-600" />} label="Total Enquiries" value={allEnquiries.length} bgColor="bg-blue-50" onClick={() => setEnquiryFilter('all')} active={enquiryFilter === 'all'} />
      <StatCard icon={<Clock className="w-8 h-8 text-yellow-600" />} label="New" value={allEnquiries.filter(e => e.status === 'new').length} bgColor="bg-yellow-50" onClick={() => setEnquiryFilter(enquiryFilter === 'new' ? 'all' : 'new')} active={enquiryFilter === 'new'} />
      <StatCard icon={<AlertCircle className="w-8 h-8 text-orange-600" />} label="Contacted" value={allEnquiries.filter(e => e.status === 'contacted').length} bgColor="bg-orange-50" onClick={() => setEnquiryFilter(enquiryFilter === 'contacted' ? 'all' : 'contacted')} active={enquiryFilter === 'contacted'} />
      <StatCard icon={<CheckCircle className="w-8 h-8 text-green-600" />} label="Resolved" value={allEnquiries.filter(e => e.status === 'resolved').length} bgColor="bg-green-50" onClick={() => setEnquiryFilter(enquiryFilter === 'resolved' ? 'all' : 'resolved')} active={enquiryFilter === 'resolved'} />
    </div>
    {loading ? <LoadingSpinner /> : enquiries.length === 0 ? <EmptyState icon={<MessageSquare size={48} />} message="No enquiries yet." /> : (
      <div className="grid grid-cols-1 gap-4">
        {enquiries.map((enquiry) => (
          <div key={enquiry._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{enquiry.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(enquiry.status)}`}>{enquiry.status?.toUpperCase()}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{enquiry.email}</p>
                {enquiry.phone && <p className="text-sm text-gray-600">{enquiry.phone}</p>}
              </div>
              <button onClick={() => onDelete(enquiry._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
            </div>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">Subject: {enquiry.subject}</h4>
              <p className="text-gray-700 text-sm line-clamp-2">{enquiry.message}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">{new Date(enquiry.createdAt).toLocaleString()}</p>
              <div className="flex gap-2">
                <select value={enquiry.status} onChange={(e) => onStatusChange(enquiry._id, e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button onClick={() => onEdit(enquiry)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition font-medium">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ==================== GALLERY TAB ====================
const GalleryTab = ({ gallery, loading, onEdit, onDelete }) => (
  <div className="p-8 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard icon={<Image className="w-8 h-8 text-blue-600" />} label="Total Images" value={gallery.length} bgColor="bg-blue-50" />
      <StatCard icon={<CheckCircle className="w-8 h-8 text-green-600" />} label="Categories" value={[...new Set(gallery.map(g => g.category).filter(Boolean))].length} bgColor="bg-green-50" />
    </div>
    {loading ? <LoadingSpinner /> : gallery.length === 0 ? <EmptyState icon={<Image size={48} />} message="No gallery images. Add one to get started!" /> : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 relative">
              <img src={item.src} alt={item.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }} />
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{item.category}</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => onEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit2 size={18} /></button>
                <button onClick={() => onDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ==================== STAFF TAB ====================
const StaffTab = ({ staff, loading, onEdit, onDelete }) => (
  <div className="p-8 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard icon={<Users className="w-8 h-8 text-blue-600" />} label="Total Staff Members" value={staff.length} bgColor="bg-blue-50" />
    </div>
    {loading ? <LoadingSpinner /> : staff.length === 0 ? <EmptyState icon={<Users size={48} />} message="No staff members. Add one to get started!" /> : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-gray-200 relative">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Photo'; }} />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
              <p className="text-blue-600 text-sm font-medium mb-2">{member.position}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{member.bio}</p>
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                {member.qualifications && <p>Qualifications: {member.qualifications}</p>}
                {member.experience && <p>Experience: {member.experience}</p>}
              </div>
              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => onEdit(member)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit2 size={18} /></button>
                <button onClick={() => onDelete(member._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ==================== COURSES TAB ====================
const CoursesTab = ({ courses, loading, onEdit, onDelete }) => (
  <div className="p-8 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard icon={<BookOpen className="w-8 h-8 text-blue-600" />} label="Total Courses" value={courses.length} bgColor="bg-blue-50" />
      <StatCard icon={<CheckCircle className="w-8 h-8 text-green-600" />} label="Popular" value={courses.filter(c => c.popular === true || c.popular === 'true').length} bgColor="bg-green-50" />
      <StatCard icon={<AlertCircle className="w-8 h-8 text-purple-600" />} label="Categories" value={[...new Set(courses.map(c => c.category).filter(Boolean))].length} bgColor="bg-purple-50" />
    </div>
    {loading ? <LoadingSpinner /> : courses.length === 0 ? <EmptyState icon={<BookOpen size={48} />} message="No courses found. Add one to get started!" /> : (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Grade</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fee</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Popular</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {course.image && <img src={course.image} alt="" className="w-10 h-10 rounded object-cover" />}
                    <div>
                      <p className="font-semibold text-gray-900">{course.title}</p>
                      <p className="text-xs text-gray-500">{course.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{course.grade}</td>
                <td className="px-6 py-4"><span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{course.category}</span></td>
                <td className="px-6 py-4 text-sm text-gray-600">{course.fee}</td>
                <td className="px-6 py-4">
                  {(course.popular === true || course.popular === 'true') ? (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Popular</span>
                  ) : (
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEdit(course)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit2 size={18} /></button>
                    <button onClick={() => onDelete(course._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 size={18} /></button>
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

// ==================== MODALS ====================

// Event Modal
const EventModal = ({ event, form, onFormChange, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">{event ? 'Edit Event' : 'Create New Event'}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={24} /></button>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <FormInput label="Event Title *" value={form.title} onChange={(v) => onFormChange({ ...form, title: v })} required placeholder="Enter event title" />
        <FormTextarea label="Description *" value={form.description} onChange={(v) => onFormChange({ ...form, description: v })} required placeholder="Enter event description" />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Start Date *" type="datetime-local" value={form.startDate} onChange={(v) => onFormChange({ ...form, startDate: v })} required />
          <FormInput label="End Date *" type="datetime-local" value={form.endDate} onChange={(v) => onFormChange({ ...form, endDate: v })} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Priority (0-10)" type="number" value={form.priority} onChange={(v) => onFormChange({ ...form, priority: parseInt(v) })} />
          <FormInput label="Image URL" value={form.image} onChange={(v) => onFormChange({ ...form, image: v })} placeholder="https://example.com/image.jpg" />
        </div>
        <ModalButtons label={event ? 'Update Event' : 'Create Event'} onClose={onClose} />
      </form>
    </div>
  </div>
);

// Enquiry Modal
const EnquiryModal = ({ enquiry, onClose, getStatusColor }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Enquiry Details</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={24} /></button>
      </div>
      <div className="p-6 space-y-4">
        <DetailRow label="Name" value={enquiry.name} />
        <DetailRow label="Email" value={enquiry.email} />
        {enquiry.phone && <DetailRow label="Phone" value={enquiry.phone} />}
        <DetailRow label="Subject" value={enquiry.subject} />
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-2">Message</p>
          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">{enquiry.message}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-semibold mb-2">Status</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(enquiry.status)}`}>{enquiry.status?.toUpperCase()}</span>
        </div>
        <DetailRow label="Received" value={new Date(enquiry.createdAt).toLocaleString()} />
        <button onClick={onClose} className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold mt-4">Close</button>
      </div>
    </div>
  </div>
);

// Gallery Modal
const GalleryModal = ({ item, form, onFormChange, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">{item ? 'Edit Image' : 'Add New Image'}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={24} /></button>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <FormInput label="Image URL *" value={form.src} onChange={(v) => onFormChange({ ...form, src: v })} required placeholder="https://example.com/image.jpg" />
        {form.src && (
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <img src={form.src} alt="Preview" className="w-full h-48 object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}
        <FormInput label="Title *" value={form.title} onChange={(v) => onFormChange({ ...form, title: v })} required placeholder="Image title" />
        <FormInput label="Category *" value={form.category} onChange={(v) => onFormChange({ ...form, category: v })} required placeholder="e.g. Campus Life, Academics, Sports" />
        <FormTextarea label="Description" value={form.description} onChange={(v) => onFormChange({ ...form, description: v })} placeholder="Image description" />
        <ModalButtons label={item ? 'Update Image' : 'Add Image'} onClose={onClose} />
      </form>
    </div>
  </div>
);

// Staff Modal
const StaffModal = ({ member, form, onFormChange, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">{member ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={24} /></button>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Name *" value={form.name} onChange={(v) => onFormChange({ ...form, name: v })} required placeholder="Full name" />
          <FormInput label="Position *" value={form.position} onChange={(v) => onFormChange({ ...form, position: v })} required placeholder="e.g. Principal, Director" />
        </div>
        <FormInput label="Photo URL" value={form.image} onChange={(v) => onFormChange({ ...form, image: v })} placeholder="https://example.com/photo.jpg" />
        <FormTextarea label="Bio" value={form.bio} onChange={(v) => onFormChange({ ...form, bio: v })} placeholder="Brief biography" />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Qualifications" value={form.qualifications} onChange={(v) => onFormChange({ ...form, qualifications: v })} placeholder="e.g. MBA, B.Ed" />
          <FormInput label="Experience" value={form.experience} onChange={(v) => onFormChange({ ...form, experience: v })} placeholder="e.g. 20+ years" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Email" value={form.email} onChange={(v) => onFormChange({ ...form, email: v })} placeholder="email@example.com" />
          <FormInput label="Phone" value={form.phone} onChange={(v) => onFormChange({ ...form, phone: v })} placeholder="+91 98765 43210" />
        </div>
        <FormTextarea label="Achievements (one per line)" value={form.achievements} onChange={(v) => onFormChange({ ...form, achievements: v })} placeholder="Founded the school in 2005&#10;Implemented digital learning" rows={4} />
        <ModalButtons label={member ? 'Update Staff' : 'Add Staff'} onClose={onClose} />
      </form>
    </div>
  </div>
);

// Course Modal
const CourseModal = ({ course, form, onFormChange, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">{course ? 'Edit Course' : 'Add New Course'}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={24} /></button>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Course ID" value={form.id} onChange={(v) => onFormChange({ ...form, id: v })} placeholder="e.g. class-1-foundation" />
          <FormInput label="Code" value={form.code} onChange={(v) => onFormChange({ ...form, code: v })} placeholder="e.g. CLS-01" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Title (English) *" value={form.title} onChange={(v) => onFormChange({ ...form, title: v })} required placeholder="Course title in English" />
          <FormInput label="Title (Hindi)" value={form.titleHi} onChange={(v) => onFormChange({ ...form, titleHi: v })} placeholder="Course title in Hindi" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormTextarea label="Summary (English)" value={form.summary} onChange={(v) => onFormChange({ ...form, summary: v })} placeholder="Course summary" rows={2} />
          <FormTextarea label="Summary (Hindi)" value={form.summaryHi} onChange={(v) => onFormChange({ ...form, summaryHi: v })} placeholder="Hindi summary" rows={2} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput label="Grade" value={form.grade} onChange={(v) => onFormChange({ ...form, grade: v })} placeholder="e.g. Class 1" />
          <FormInput label="Grade (Hindi)" value={form.gradeHi} onChange={(v) => onFormChange({ ...form, gradeHi: v })} placeholder="e.g. Grade Hindi" />
          <FormInput label="Category" value={form.category} onChange={(v) => onFormChange({ ...form, category: v })} placeholder="e.g. Primary" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput label="Category (Hindi)" value={form.categoryHi} onChange={(v) => onFormChange({ ...form, categoryHi: v })} placeholder="Category Hindi" />
          <FormInput label="Fee" value={form.fee} onChange={(v) => onFormChange({ ...form, fee: v })} placeholder="e.g. 35,000/year" />
          <FormInput label="Fee (Hindi)" value={form.feeHi} onChange={(v) => onFormChange({ ...form, feeHi: v })} placeholder="Fee Hindi" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput label="Duration" value={form.duration} onChange={(v) => onFormChange({ ...form, duration: v })} placeholder="e.g. 10 months" />
          <FormInput label="Duration (Hindi)" value={form.durationHi} onChange={(v) => onFormChange({ ...form, durationHi: v })} placeholder="Duration Hindi" />
          <FormInput label="Schedule" value={form.schedule} onChange={(v) => onFormChange({ ...form, schedule: v })} placeholder="e.g. Mon-Sat, 8-1:30" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput label="Age Range" value={form.ageRange} onChange={(v) => onFormChange({ ...form, ageRange: v })} placeholder="e.g. 6-7 years" />
          <FormInput label="Age Range (Hindi)" value={form.ageRangeHi} onChange={(v) => onFormChange({ ...form, ageRangeHi: v })} placeholder="Age Hindi" />
          <FormInput label="Stream" value={form.stream} onChange={(v) => onFormChange({ ...form, stream: v })} placeholder="e.g. Science (PCM)" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Image URL" value={form.image} onChange={(v) => onFormChange({ ...form, image: v })} placeholder="https://example.com/image.jpg" />
          <FormInput label="Prerequisites" value={form.prerequisites} onChange={(v) => onFormChange({ ...form, prerequisites: v })} placeholder="e.g. Completed Class 1" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormInput label="Mode" value={form.mode} onChange={(v) => onFormChange({ ...form, mode: v })} placeholder="In-person" />
          <FormInput label="Mode (Hindi)" value={form.modeHi} onChange={(v) => onFormChange({ ...form, modeHi: v })} placeholder="Mode Hindi" />
          <div className="flex items-end">
            <label className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg cursor-pointer border-2 border-gray-300 w-full">
              <input type="checkbox" checked={form.popular} onChange={(e) => onFormChange({ ...form, popular: e.target.checked })} className="w-4 h-4" />
              <span className="text-sm font-semibold text-gray-700">Popular Course</span>
            </label>
          </div>
        </div>
        <ModalButtons label={course ? 'Update Course' : 'Add Course'} onClose={onClose} />
      </form>
    </div>
  </div>
);

// ==================== REUSABLE COMPONENTS ====================

const FormInput = ({ label, value, onChange, type = 'text', required = false, placeholder = '' }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" placeholder={placeholder} required={required} />
  </div>
);

const FormTextarea = ({ label, value, onChange, required = false, placeholder = '', rows = 3 }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" placeholder={placeholder} required={required}></textarea>
  </div>
);

const ModalButtons = ({ label, onClose }) => (
  <div className="flex gap-3 pt-4 border-t border-gray-200">
    <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">{label}</button>
    <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition font-semibold">Cancel</button>
  </div>
);

const StatCard = ({ icon, label, value, bgColor, onClick, active }) => (
  <button onClick={onClick} className={`rounded-xl shadow-sm p-6 flex items-center justify-between text-left w-full transition transform ${bgColor} ${onClick ? 'hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400' : ''} ${active ? 'ring-2 ring-blue-500 border border-blue-500/50' : ''}`} aria-pressed={active}>
    <div>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
    <div className="text-gray-400">{icon}</div>
  </button>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="inline-block"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div></div>
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
