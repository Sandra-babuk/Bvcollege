import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtpApi, resendOtpApi } from '../services/allApi';
import { toast, ToastContainer } from 'react-toastify';

function Otp() {
  const location = useLocation();
  const email = location.state?.email || ''; 
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [isResendLoading, setIsResendLoading] = useState(false);

  const navigate=useNavigate()

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async () => {
    if (!otp) {
      toast.warning('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtpApi({ otp, email }); 
      if (response.status === 200) {
        toast.success('OTP verified successfully!');
        navigate('/');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResendLoading(true);
    try {
      const response = await resendOtpApi({ email }); 
      if (response.status === 200) {
        toast.success('OTP resent successfully!');
      
        console.log('OTP resent successfully!');
        
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred while resending OTP');
    } finally {
      setIsResendLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <h1 className="text-success mt-5 fw-bold mb-5">ENTER THE OTP</h1>
      </div>
      <div className="container d-flex justify-content-center align-items-center">
        <div className="shadow rounded p-4 d-flex flex-column align-items-center w-50">
          <p >Email: <span className='text-success'>{email}</span> </p> {/* Display the email */}
          <input
            type="text"
            className="form-control mt-3 w-75"
            placeholder="Enter the OTP"
            value={otp}
            onChange={handleOtpChange}
          />
          <button
            className="btn btn-primary mt-3 w-25"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
          <button
            className="btn btn-secondary mt-3 w-25"
            onClick={handleResend}
            disabled={isResendLoading}
          >
            {isResendLoading ? 'Resending...' : 'Resend'}
          </button>
        </div>
        <ToastContainer/>
      </div>
    </>
  );
}

export default Otp;
