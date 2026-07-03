import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return <div className="py-20 text-xl font-semibold text-center">Loading dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center gap-4 p-6 mb-8 text-center bg-white border border-gray-100 shadow-sm rounded-2xl sm:p-8 sm:flex-row sm:items-start sm:text-left sm:gap-6">
                <div className="flex items-center justify-center w-20 h-20 text-3xl font-bold tracking-widest text-gray-900 uppercase bg-gray-200 rounded-full shrink-0">
                    {user?.name.charAt(0)}
                </div>
                <div className="flex flex-col items-center sm:items-start">
                    <h1 className="mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">Welcome, {user?.name}!</h1>
                    <p className="flex items-center justify-center gap-2 text-gray-500 sm:justify-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> User Dashboard
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 sm:text-2xl sm:gap-3">
                    <FaTicketAlt className="text-gray-700" /> My Bookings requests
                </h2>
            </div>

            {bookings.length === 0 ? (
                <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gray-50">
                        <FaTicketAlt className="text-3xl text-gray-300" />
                    </div>
                    <p className="mt-4 mb-6 text-xl font-medium text-gray-500">You haven't booked any events yet.</p>
                    <Link to="/" className="inline-block px-8 py-3 font-bold text-white transition bg-gray-900 rounded-lg shadow-md hover:bg-black">
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="flex flex-col overflow-hidden transition bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
                            <div className="flex-grow p-6 border-b border-gray-50">
                                {booking.eventId ? (
                                    <>
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-lg font-bold leading-tight text-gray-900">{booking.eventId.title}</h3>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-4 space-y-1 text-sm text-gray-500">
                                            <p><strong className="text-gray-700">Date:</strong> {new Date(booking.eventId.date).toLocaleDateString()}</p>
                                            <p><strong className="text-gray-700">Amount:</strong> {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</p>
                                            <p><strong className="text-gray-700">Requested:</strong> {new Date(booking.bookedAt).toLocaleDateString()}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="italic text-red-500">Event details unavailable (might have been deleted)</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 shrink-0">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        <Link to={`/events/${booking.eventId._id}`} className="text-sm font-semibold text-gray-900 hover:underline">View Event</Link>
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            className="flex items-center gap-1 text-sm font-semibold text-red-500 transition hover:text-red-700"
                                        >
                                            <FaTimesCircle /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-sm italic text-center text-gray-500">Booking Cancelled</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;