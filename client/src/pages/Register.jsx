import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md p-8 mx-auto mt-16 bg-white border border-gray-100 shadow-lg rounded-xl">
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-3xl font-extrabold text-gray-900">Create an Account</h2>
                <p className="text-gray-500">Join Eventora today</p>
            </div>

            {error && <div className="p-3 mb-6 text-center text-red-600 border border-red-100 rounded-lg shadow-inner bg-red-50">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 transition border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-700"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 transition border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-700"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 transition border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div>
                        <p className="p-3 mb-4 text-sm text-green-700 border border-green-200 rounded bg-green-50">
                            An OTP has been sent to your email. Please verify your account.
                        </p>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Verification Code (OTP)</label>
                        <input
                            type="text"
                            required
                            placeholder="6-digit code"
                            className="w-full px-4 py-3 text-lg font-bold tracking-widest text-center transition border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-700"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="6"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 mt-4 font-bold text-white transition bg-gray-900 rounded-lg shadow-md hover:bg-black focus:ring-4 focus:ring-gray-200"
                >
                    {loading ? 'Processing...' : (showOTP ? 'Verify & Complete' : 'Sign Up')}
                </button>
            </form>

            {!showOTP && (
                <p className="mt-6 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="font-bold text-gray-900 hover:underline">Sign in</Link>
                </p>
            )}
        </div>
    );
};

export default Register;