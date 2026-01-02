import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Input from './Input';
import Button from './Button';

const AuthenticationCard = ({ type = 'login', userRole = 'worker' }) => {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    otp: ['', '', '', '', '', ''],
  });
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOtpChange = (index, value) => {
    if (value?.length <= 1 && /^\d*$/?.test(value)) {
      const newOtp = [...formData?.otp];
      newOtp[index] = value;
      setFormData((prev) => ({ ...prev, otp: newOtp }));

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (type === 'login') {
        if (userRole === 'worker') {
          navigate('/worker-dashboard');
        } else {
          navigate('/employer-dashboard');
        }
      } else {
        setShowOtp(true);
      }
    }, 1500);
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (userRole === 'worker') {
        navigate('/worker-dashboard');
      } else {
        navigate('/employer-dashboard');
      }
    }, 1500);
  };

  const toggleAuthMethod = () => {
    setAuthMethod((prev) => (prev === 'email' ? 'phone' : 'email'));
    setShowOtp(false);
  };

  const handleRoleSwitch = () => {
    if (type === 'login') {
      navigate('/login');
    } else {
      navigate(userRole === 'worker' ? '/employer-signup' : '/worker-signup');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon
                name={userRole === 'worker' ? 'Hammer' : 'Building2'}
                size={32}
                color="var(--color-primary)"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            {type === 'login'
              ? `Sign in to your ${userRole} account`
              : `Sign up as a ${userRole}`}
          </p>

          {!showOtp ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={authMethod === 'email' ? 'default' : 'outline'}
                  onClick={() => setAuthMethod('email')}
                  fullWidth
                  iconName="Mail"
                  iconPosition="left"
                >
                  Email
                </Button>
                <Button
                  type="button"
                  variant={authMethod === 'phone' ? 'default' : 'outline'}
                  onClick={() => setAuthMethod('phone')}
                  fullWidth
                  iconName="Phone"
                  iconPosition="left"
                >
                  Phone
                </Button>
              </div>

              {authMethod === 'email' ? (
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  required
                />
              ) : (
                <Input
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                  required
                />
              )}

              {type === 'login' && (
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={formData?.password}
                  onChange={(e) =>
                    handleInputChange('password', e?.target?.value)
                  }
                  required
                />
              )}

              <Button
                type="submit"
                variant="default"
                fullWidth
                loading={loading}
              >
                {type === 'login' ? 'Sign In' : 'Continue'}
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleRoleSwitch}
                  className="text-sm text-primary hover:underline"
                >
                  {type === 'login'
                    ? userRole === 'worker' ? "I'm an employer" :"I'm a worker"
                    : userRole === 'worker' ?'Sign up as employer' :'Sign up as worker'}
                </button>
              </div>

              {type === 'login' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/worker-signup')}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Don't have an account?{' '}
                    <span className="text-primary">Sign up</span>
                  </button>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Enter the 6-digit code sent to{' '}
                {authMethod === 'email' ? formData?.email : formData?.phone}
              </p>

              <div className="flex gap-2 justify-center mb-6">
                {formData?.otp?.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e?.target?.value)}
                    className="w-12 h-12 text-center text-lg font-semibold border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="default"
                fullWidth
                loading={loading}
              >
                Verify & Continue
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Change {authMethod === 'email' ? 'email' : 'phone number'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationCard;