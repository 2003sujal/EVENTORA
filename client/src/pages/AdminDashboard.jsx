import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my') // Admin gets all bookings
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="py-20 text-xl font-semibold text-center">Loading admin panel...</div>;

    return (
        <div className="mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-between gap-6 p-6 mb-8 text-center text-white bg-black shadow-lg rounded-2xl sm:p-8 md:flex-row md:text-left">
                <div>
                    <h1 className="mb-2 text-2xl font-extrabold sm:text-3xl">Admin Dashboard</h1>
                    <p className="text-gray-300">Manage events and manually confirm bookings.</p>
                </div>
                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="w-full px-6 py-3 font-bold text-black transition bg-white rounded-lg shadow-md md:w-auto hover:bg-gray-100"
                >
                    {showEventForm ? 'Cancel Creation' : '+ Create New Event'}
                </button>
            </div>

            {/* Admin Stats Row */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                <div className="flex items-center justify-between p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <div>
                        <p className="mb-1 text-sm font-bold tracking-wider text-gray-500 uppercase">Total Revenue</p>
                        <h3 className="text-3xl font-black text-green-600">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}</h3>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-green-500 bg-green-100 rounded-full">₹</div>
                </div>
                <div className="flex items-center justify-between p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <div>
                        <p className="mb-1 text-sm font-bold tracking-wider text-gray-500 uppercase">Paid Clients</p>
                        <h3 className="text-3xl font-black text-blue-600">{new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}</h3>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-blue-500 bg-blue-100 rounded-full">👤</div>
                </div>
                <div className="flex items-center justify-between p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
                    <div>
                        <p className="mb-1 text-sm font-bold tracking-wider text-gray-500 uppercase">Pending Requests</p>
                        <h3 className="text-3xl font-black text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</h3>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-yellow-600 bg-yellow-100 rounded-full">⏳</div>
                </div>
            </div>

            {showEventForm && (
                <div className="p-8 mb-8 bg-white border border-gray-100 shadow-sm rounded-2xl animation-slideDown">
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <input required type="text" placeholder="Event Title" className="px-4 py-3 transition border rounded-lg outline-none focus:ring-2 focus:ring-gray-700" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input required type="text" placeholder="Category (e.g., Tech, Music)" className="px-4 py-3 transition border rounded-lg outline-none focus:ring-2 focus:ring-gray-700" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input required type="date" className="px-4 py-3 transition border rounded-lg outline-none focus:ring-2 focus:ring-gray-700" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input required type="text" placeholder="Location" className="px-4 py-3 transition border rounded-lg outline-none focus:ring-2 focus:ring-gray-700" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input required type="number" placeholder="Total Seats" className="px-4 py-3 transition border rounded-lg outline-none focus:ring-2 focus:ring-gray-700" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        <input required type="number" placeholder="Ticket Price (0 for free)" className="px-4 py-3 transition border rounded-lg outline-none focus:ring-2 focus:ring-gray-700" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />

                        <div className="md:col-span-2">
                            <input type="text" placeholder="Image URL (Provide any direct link to an image)" className="w-full px-4 py-3 transition border rounded-lg outline-none focus:ring-2 focus:ring-gray-700" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>

                        <textarea required placeholder="Event Description" className="h-32 px-4 py-3 transition border rounded-lg outline-none md:col-span-2 focus:ring-2 focus:ring-gray-700" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button type="submit" className="py-3 mt-2 font-bold text-white transition bg-gray-900 rounded-lg shadow-md md:col-span-2 hover:bg-black">Publish Event</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Events Section */}
                <div className="flex flex-col">
                    <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-gray-800">
                        <span className="flex items-center justify-center w-8 h-8 text-sm text-gray-600 bg-gray-100 rounded-full">{events.length}</span>
                        All Events
                    </h2>
                    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
                        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {events.length === 0 ? <li className="p-6 text-center text-gray-500">No events created yet.</li> :
                                events.map(event => (
                                    <li key={event._id} className="flex flex-col items-start justify-between gap-4 p-5 transition border-b border-gray-100 sm:flex-row sm:items-center hover:bg-gray-50 last:border-0">
                                        <div>
                                            <h4 className="mb-1 font-bold leading-tight text-gray-900">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                <span className="flex items-center gap-1 font-medium"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> {new Date(event.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1 font-medium"><div className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div> {event.availableSeats}/{event.totalSeats} seats</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteEvent(event._id)} className="w-full px-4 py-2 text-sm font-bold text-red-500 transition border border-red-200 rounded-lg shadow-sm sm:w-auto hover:text-white hover:bg-red-500 shrink-0">
                                            Delete
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="flex flex-col">
                    <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-gray-800">
                        <span className="flex items-center justify-center w-8 h-8 text-sm font-bold text-yellow-700 bg-yellow-100 rounded-full">{bookings.length}</span>
                        Booking Requests
                    </h2>
                    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
                        <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                            {bookings.length === 0 ? <li className="p-6 text-center text-gray-500">No bookings yet.</li> :
                                bookings.map(booking => (
                                    <li key={booking._id} className={`p-6 hover:bg-gray-50 transition border-l-4 ${booking.status === 'pending' ? 'border-l-yellow-400' : booking.status === 'confirmed' ? 'border-l-green-400' : 'border-l-red-400'}`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className="text-lg font-bold leading-tight text-gray-900">{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                                                <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status}</span>
                                                {booking.status !== 'cancelled' && <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-800'}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
                                            </div>
                                        </div>
                                        <div className="p-3 mb-3 text-sm border border-gray-100 rounded-lg bg-gray-50">
                                            <p className="flex items-center gap-2 mb-1 text-gray-700">
                                                <span className="w-16 text-xs font-bold text-gray-500 uppercase">User:</span>
                                                <span className="font-semibold">{booking.userId?.name}</span>
                                                <span className="text-gray-400">({booking.userId?.email})</span>
                                            </p>
                                            <p className="flex items-center gap-2 mb-1 text-gray-700">
                                                <span className="w-16 text-xs font-bold text-gray-500 uppercase">Amount:</span>
                                                <span className={`font-semibold ${booking.amount === 0 ? 'text-green-600' : ''}`}>{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
                                            </p>
                                            <p className="flex items-center gap-2 mb-1 text-gray-700">
                                                <span className="w-16 text-xs font-bold text-gray-500 uppercase">Date:</span>
                                                <span>{new Date(booking.bookedAt).toLocaleString()}</span>
                                            </p>
                                            {booking.eventId && (
                                                <p className="flex items-center gap-2 pt-2 mt-2 text-gray-700 border-t border-gray-200">
                                                    <span className="w-16 text-xs font-bold text-gray-500 uppercase">Seats:</span>
                                                    <span className={`font-bold ${booking.eventId.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`}>{booking.eventId.availableSeats}</span> remaining of {booking.eventId.totalSeats}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action buttons for admin */}
                                        {booking.status === 'pending' && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 min-w-[120px] bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition">
                                                    ✓ Approve as Paid
                                                </button>
                                                <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="flex-1 min-w-[120px] bg-gray-50 text-gray-700 hover:bg-gray-800 hover:text-white border border-gray-200 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition">
                                                    ✓ Approve Undecided
                                                </button>
                                                <button onClick={() => handleCancelBooking(booking._id)} className="w-[80px] bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 text-xs font-bold py-2.5 px-3 rounded-lg transition">
                                                    ✕ Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;