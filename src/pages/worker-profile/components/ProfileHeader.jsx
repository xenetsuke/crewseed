import React from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import { useTranslation } from "react-i18next";

const ProfileHeader = ({ profile, onSave }) => {
  const { t } = useTranslation();

  /* =========================================================
     Helper: Convert file → Base64 (for backend image upload)
  ========================================================= */
  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
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

      await onSave(updatedProfile);
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      alert(t("common.uploadFailed"));
    }
  };

  /* =========================================================
     Worker Availability Toggle
  ========================================================= */
  const handleAvailabilityToggle = async () => {
    try {
      const updatedProfile = {
        ...profile,
        Workeravailability: !(profile?.Workeravailability ?? true),
      };

      await onSave(updatedProfile);
    } catch (err) {
      console.error("❌ Failed to update Workeravailability", err);
      alert(t("common.updateFailed"));
    }
  };

  /* =========================================================
     Availability Badge
  ========================================================= */
  const getAvailabilityBadge = () => {
    const isAvailable = profile?.Workeravailability ?? true;

    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-sm font-medium
          ${isAvailable ? "bg-green-500" : "bg-red-500"}
        `}
      >
        <Icon name={isAvailable ? "CheckCircle" : "XCircle"} size={14} />
        <span>
          {isAvailable
            ? t("profile.status.available")
            : t("profile.status.notAvailable")}
        </span>
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
                  : "/no_image.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

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
            {profile?.fullName || t("profile.placeholder.name")}
          </h1>

          <div className="mt-1 mb-2 flex items-center gap-3">
            {getAvailabilityBadge()}

 <button
  type="button"
  onClick={handleAvailabilityToggle}
  className="
    group flex items-center gap-1 text-sm font-medium text-primary
    px-2 py-1 rounded-md
    hover:bg-primary/10 hover:underline hover:opacity-90
    transition-all duration-200
  "
>
  <span className="transition-transform duration-200 group-hover:rotate-12">
    ✏️
  </span>

  <span className="relative font-medium text-black text-primary">
  {t("common.change")}
  <span className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-primary/40 rounded"></span>
</span>

</button>


          </div>

          <p className="text-muted-foreground flex items-center gap-2 text-sm md:text-base">
            <Icon name="MapPin" size={16} />
            {profile?.currentCity || t("profile.placeholder.city")},
            {" "}
            {profile?.currentState || t("profile.placeholder.state")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
