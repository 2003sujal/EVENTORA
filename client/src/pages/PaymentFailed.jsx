import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentFailed = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md p-10 text-center transition-all transform bg-white border-t-8 border-red-500 shadow-2xl rounded-3xl hover:-translate-y-1">
                <FaTimesCircle className="mx-auto mb-6 text-red-500 text-7xl drop-shadow-sm" />
                <h1 className="mb-4 text-4xl font-black text-gray-900">Booking Failed</h1>
                <p className="mb-8 text-lg text-gray-500">We couldn't process your payment. Please ensure your payment details are correct and try again.</p>
                <div className="space-y-4">
                    <Link to="/" className="block w-full px-6 py-4 font-bold text-white transition bg-red-500 shadow-lg hover:bg-red-600 rounded-xl hover:shadow-xl">
                        Return to Events
                    </Link>
                    <Link to="/dashboard" className="block w-full px-6 py-4 font-bold text-gray-700 transition bg-gray-100 hover:bg-gray-200 rounded-xl">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;