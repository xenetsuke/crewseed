import React from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";

const ProfileHeader = ({ profile, onSave }) => {

  /* =========================================================
     Helper: Convert file → Base64 (for backend image upload)
  ========================================================= */
  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // remove mime header
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /* =========================================================
     Profile Picture Upload
  ========================================================= */
  const handleFileSelect = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    try {
      const base64Image = await convertFileToBase64(file);

      const updatedProfile = {
        ...profile,
        picture: base64Image,
      };

      console.log("🖼 Updating profile picture");
      await onSave(updatedProfile);
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      alert("Failed to upload image");
    }
  };

  /* =========================================================
     Worker Availability Toggle
     backend field → Workeravailability (boolean)
     true  = Available
     false = Not Available
  ========================================================= */
  const handleAvailabilityToggle = async () => {
    try {
      const updatedProfile = {
        ...profile,

        // 🔥 Toggle boolean (default true if undefined)
        Workeravailability: !(
          profile?.Workeravailability ?? true
        ),
      };

      console.log(
        "🔄 Workeravailability changed to:",
        updatedProfile.Workeravailability ? "AVAILABLE" : "NOT AVAILABLE"
      );

      await onSave(updatedProfile);
    } catch (err) {
      console.error("❌ Failed to update Workeravailability", err);
      alert("Failed to update availability");
    }
  };

  /* =========================================================
     Availability Badge (BOOLEAN BASED)
     Default → true (Available)
  ========================================================= */
  const getAvailabilityBadge = () => {
    // ✅ Default TRUE if backend hasn’t sent value yet
    const isAvailable = profile?.Workeravailability ?? true;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-sm font-medium
          ${isAvailable ? "bg-green-500" : "bg-red-500"}
        `}
      >
        <Icon
          name={isAvailable ? "CheckCircle" : "XCircle"}
          size={14}
        />
        <span>{isAvailable ? "Available" : "Not Available"}</span>
      </div>
    );
  };

  return (
    <div className="card p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">

        {/* ================= WORKER PHOTO ================= */}
        <div className="relative flex-shrink-0">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
            <Image
              src={
                profile?.picture
                  ? `data:image/jpeg;base64,${profile.picture}`
                  : "/avatar.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Camera Button */}
          <label className="absolute bottom-0 right-0 w-9 h-9 md:w-10 md:h-10 bg-primary rounded-full cursor-pointer flex items-center justify-center shadow-lg">
            <Icon name="Camera" size={18} color="white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {/* ================= WORKER INFO ================= */}
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold">
            {profile?.fullName || "Worker Name"}
          </h1>

          {/* Availability */}
          <div className="mt-1 mb-2 flex items-center gap-3">
            {getAvailabilityBadge()}

            {/* Toggle Button */}
            <button
              type="button"
              onClick={handleAvailabilityToggle}
              className="text-sm text-primary underline hover:opacity-80"
            >
              Change
            </button>
          </div>

          <p className="text-muted-foreground flex items-center gap-2 text-sm md:text-base">
            <Icon name="MapPin" size={16} />
            {profile?.currentCity || "City"}, {profile?.currentState || "State"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
