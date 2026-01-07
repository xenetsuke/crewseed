import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Mail,
  User,
  FileText,
  // MapPin,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';

import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { cn } from '../../utils/cn';

/* ===== SAME LOGIC IMPORTS AS WORKER PROFILE ===== */
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../../Services/ProfileService';
import { setProfile } from '../../features/ProfileSlice';

const CompanyOnboarding = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user || {});
  const profile = useSelector((state) => state.profile || {});

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    gstNumber: '',
    industryType: '',
    contactPersonName: '',
    officialEmail: '',
    locationName: '',
    address: '',
    city: '',
    pincode: '',
    latitude: null,
    longitude: null
  });

  /* ===== FETCH PROFILE FROM BACKEND ===== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.id) return;

        const backendProfile = await getProfile(user.id);
        dispatch(setProfile(backendProfile));

        setFormData(prev => ({
          ...prev,
          companyName: backendProfile.companyName || '',
          gstNumber: backendProfile.gstNumber || '',
          industryType: backendProfile.industryType || '',
          contactPersonName: backendProfile.contactPersonName || '',
          officialEmail: backendProfile.officialEmail || '',
          locationName: backendProfile.locationName || '',
          address: backendProfile.address || '',
          city: backendProfile.city || '',
          pincode: backendProfile.pincode || '',
          latitude: backendProfile.latitude || null,
          longitude: backendProfile.longitude || null
        }));
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [user, dispatch]);

  /* ===== ORIGINAL LOGIC (UNCHANGED) ===== */

  const industryOptions = [
    { value: 'logistics', label: 'Logistics & Warehousing' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'construction', label: 'Construction' },
    { value: 'textiles', label: 'Textiles & Garments' },
    { value: 'agriculture', label: 'Agriculture & Farming' },
    { value: 'hotel', label: 'Hotel & Hospitality' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'food', label: 'Food Processing' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.industryType) newErrors.industryType = 'Please select an industry type';
    if (!formData.contactPersonName.trim()) newErrors.contactPersonName = 'Contact person name is required';
    if (!formData.officialEmail.trim()) newErrors.officialEmail = 'Official email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.locationName.trim()) newErrors.locationName = 'Location name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => validateStep1() && setCurrentStep(2);
  const handleBack = () => setCurrentStep(1);

  const handleLocationShare = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      setFormData(prev => ({
        ...prev,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }));
    });
  };

  /* ===== SAVE TO BACKEND ===== */
  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      const updatedProfile = {
        id: user.id,

        companyName: formData.companyName,
        gstNumber: formData.gstNumber,
        industryType: formData.industryType,
        contactPersonName: formData.contactPersonName,
        officialEmail: formData.officialEmail,
        locationName: formData.locationName,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        latitude: formData.latitude,
        longitude: formData.longitude,

        // preserve worker data
        fullName: profile.fullName || null,
        age: profile.age || null,
        gender: profile.gender || null,
        skills: profile.skills || []
      };

      const savedProfile = await updateProfile(updatedProfile);
      dispatch(setProfile(savedProfile));

      navigate('/employer-dashboard');
    } catch (err) {
      console.error('❌ Save failed:', err);
      alert('Failed to save company information');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== SIGN UP LATER ===== */
  const handleSignUpLater = () => {
    navigate('/employer-profile');
  };

  /* ===== UI FUNCTIONS (UNCHANGED) ===== */

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          currentStep >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
        )}>
          {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
        </div>
        <div className={cn(
          "h-1 w-16",
          currentStep > 1 ? "bg-primary" : "bg-gray-200"
        )} />
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
          currentStep >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
        )}>
          2
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <Input
        label="Company Name"
        placeholder="Enter company name"
        value={formData.companyName}
        onChange={(e) => handleInputChange('companyName', e.target.value)}
        error={errors.companyName}
        required
        icon={<Building2 className="w-5 h-5 text-gray-400" />}
      />

      <Input
        label="GST Number"
        placeholder="22AAAAA0000A1Z5 (Optional)"
        value={formData.gstNumber}
        onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
        error={errors.gstNumber}
        icon={<FileText className="w-5 h-5 text-gray-400" />}
      />

      <Select
        label="Industry Type"
        placeholder="Select industry"
        options={industryOptions}
        value={formData.industryType}
        onChange={(value) => handleInputChange('industryType', value)}
        error={errors.industryType}
        required
      />

      <Input
        label="Contact Person Name"
        placeholder="Enter contact person name"
        value={formData.contactPersonName}
        onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
        error={errors.contactPersonName}
        required
        icon={<User className="w-5 h-5 text-gray-400" />}
      />

      <Input
        label="Official Email"
        type="email"
        placeholder="company@example.com"
        value={formData.officialEmail}
        onChange={(e) => handleInputChange('officialEmail', e.target.value)}
        error={errors.officialEmail}
        required
        icon={<Mail className="w-5 h-5 text-gray-400" />}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <Input
        label="Location Name"
        placeholder='e.g., "Main Warehouse", "Head Office"'
        value={formData.locationName}
        onChange={(e) => handleInputChange('locationName', e.target.value)}
        error={errors.locationName}
        required
        icon={<Building2 className="w-5 h-5 text-gray-400" />}
      />

      <div>
        <label className="text-sm font-medium mb-2 block">
          Address <span className="text-destructive">*</span>
        </label>
        <textarea
          className={cn(
            "w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm",
            errors.address && "border-destructive"
          )}
          placeholder="Enter complete address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
        {errors.address && (
          <p className="text-sm text-destructive mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="Enter city"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
          error={errors.city}
          required
          icon={<MapPin className="w-5 h-5 text-gray-400" />}
        />

        <Input
          label="Pincode"
          placeholder="000000"
          value={formData.pincode}
          onChange={(e) => handleInputChange('pincode', e.target.value)}
          error={errors.pincode}
          maxLength={6}
          icon={<MapPin className="w-5 h-5 text-gray-400" />}
        />
      </div>

      <div className="border-t pt-4">
        <Button variant="outline" onClick={handleLocationShare} className="w-full">
          Share Location (GPS)
        </Button>

        {formData.latitude && formData.longitude && (
          <p className="text-sm text-success mt-2 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Location captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentStep === 1 ? 'Set up your company' : 'Primary Work Location'}
            </h1>
            <p className="text-gray-600">Step {currentStep} of 2</p>
          </div>

          {renderStepIndicator()}

          <div className="mt-8">
            {currentStep === 1 ? renderStep1() : renderStep2()}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {currentStep === 2 ? (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={handleSignUpLater}>
                Sign up later
              </Button>
            )}

            {currentStep === 1 ? (
              <Button onClick={handleNext} className="ml-auto">
                Next: Work Location
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={isSubmitting} className="ml-auto">
                Save & Continue
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CompanyOnboarding;
