import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md p-10 text-center transition-all transform bg-white border-t-8 border-green-500 shadow-2xl rounded-3xl hover:-translate-y-1">
                <FaCheckCircle className="mx-auto mb-6 text-green-500 text-7xl drop-shadow-sm" />
                <h1 className="mb-4 text-4xl font-black text-gray-900">Booking Confirmed!</h1>
                <p className="mb-8 text-lg text-gray-500">Your ticket has been booked successfully. A confirmation email has been sent to your registered email address.</p>
                <div className="space-y-4">
                    <Link to="/dashboard" className="block w-full px-6 py-4 font-bold text-white transition bg-green-500 shadow-lg hover:bg-green-600 rounded-xl hover:shadow-xl">
                        View My Tickets
                    </Link>
                    <Link to="/" className="block w-full px-6 py-4 font-bold text-gray-700 transition bg-gray-100 hover:bg-gray-200 rounded-xl">
                        Discover More Events
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;