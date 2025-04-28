import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import summaryApi from '../common';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(summaryApi.verifyOtp.url, {
        method: summaryApi.verifyOtp.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        navigate('/reset-password');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Verify OTP</h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter the 6-digit OTP sent to {email}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-gray-700 mb-2">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              maxLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-red-600 hover:underline"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </section>
  );
};

export default VerifyOtp;