import axiosClient from "../Interceptor/AxiosInterceptor";

/**
 * Fetch all notifications for a user
 * @param {string|number} userId
 */
export const getNotifications = async (userId) => {
  try {
    return await axiosClient.get(`/notification/get/${userId}`);
  } catch (error) {
    console.error("❌ Failed to fetch notifications:", error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string|number} notificationId
 */
export const readNotification = async (notificationId) => {
  try {
    return await axiosClient.put(`/notification/read/${notificationId}`);
  } catch (error) {
    console.error("❌ Failed to read notification:", error);
    throw error;
  }
};
