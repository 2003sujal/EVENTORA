import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md p-8 mx-auto mt-20 bg-white border border-gray-100 shadow-lg rounded-xl">
            <div className="mb-8 text-center">
                <h2 className="mb-2 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
                <p className="text-gray-500">Sign in to your Eventora account</p>
            </div>

            {error && <div className="p-3 mb-6 text-center text-red-600 border border-red-100 rounded-lg shadow-inner bg-red-50">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {!showOTP ? (
                    <>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 transition border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-700 focus:border-gray-700"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 transition border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-700 focus:border-gray-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </>
                ) : (
                    <div>
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
                    className="w-full py-3 font-bold text-white transition bg-gray-900 rounded-lg shadow-md hover:bg-black focus:ring-4 focus:ring-gray-200"
                >
                    {loading ? 'Processing...' : (showOTP ? 'Verify OTP & Log In' : 'Sign In')}
                </button>
            </form>

            <p className="mt-8 text-center text-gray-600">
                Don't have an account? <Link to="/register" className="font-bold text-gray-900 hover:underline">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;