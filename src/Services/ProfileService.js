import axiosInstance from "../Interceptor/AxiosInterceptor";

/* =========================
   Get Profile by ID
========================= */
const getProfile = async (id) => {
  return axiosInstance
    .get(`/profiles/get/${id}`)
    .then((result) => result.data)
    .catch((error) => {
      if (!id) return null;
      throw error;
    });
  // return axiosInstance.get(`/profiles/get/${id}`).then(r => r.data);
};


/* =========================
   Update Profile
========================= */
const updateProfile = async (profile) => {
  return axiosInstance
    .put(`/profiles/update`, profile)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

/* =========================
   Get All Profiles
========================= */
const getAllProfiles = async () => {
  return axiosInstance
    .get(`/profiles/getAll`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

export { getProfile, updateProfile, getAllProfiles };
