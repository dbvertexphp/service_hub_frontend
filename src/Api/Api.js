// <<<<<<< HEAD
// Api.js
import axios from "axios";

const base_url = process.env.REACT_APP_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;
const token = localStorage.getItem("token");
console.log(token);

const getRequest = (url, token) => {
  return new Promise((resolve) => {
    axios({
      method: "get",
      url,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        resolve(error.response.data);
      });
  });
};
export const Api = {
  // -------------- login apis ------------------//
  login: async (mobile, password) => {
    try {
      const response = await axios.post(`${base_url}/api/user/login`, {
        mobile,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Users apis ------------------//
  // Api.js or wherever the API functions are defined
  getAllUsers: async (page, search = "") => {
    try {
      const response = await axios.get(
        `${base_url}/api/user/getAllUsers?page=${page}&limit=10&search=${encodeURIComponent(
          search
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUser: async (token) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(`${base_url}/api/user/`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  UserAdminStatus: async (userId) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/user/UserAdminStatus`,
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  UpdateMobileAdmin: async (UserId, mobile) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/user/UpdateMobileAdmin`,
        {
          UserId,
          mobile,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Teacher Payments apis ------------------//
  getMasterAndAdvancePayments: async () => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(`${base_url}/api/user/getMasterAndAdvancePayments`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAdvancePayment: async (data) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/updateAdvancePayment`, // API endpoint URL
        data, // Data to send in the request body
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      throw error; // Throw the error to be handled by the caller
    }
  },

  updateMasterPayment: async (data) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/updateMasterPayment`, // API endpoint URL
        data, // Data to send in the request body
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      throw error; // Throw the error to be handled by the caller
    }
  },

  updateUserPayment: async (data) => {
    try {
      const response = await axios.put(
        `${base_url}/api/user/updateUserPayment`, // API endpoint URL
        data, // Data to send in the request body
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      throw error; // Throw the error to be handled by the caller
    }
  },

  updateTeacherPaymentStatus: async (data) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/addTeacherPaymentStatus`, // API endpoint URL
        data, // Data to send in the request body
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      throw error; // Throw the error to be handled by the caller
    }
  },

  getTeacherPaymentStatuses: async (page, limit, searchText) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(
        `${base_url}/api/user/getTeacherPaymentStatuses?page=${page}&limit=${limit}&search=${searchText}`, // API endpoint URL

        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTeacherPaymentStatusById: async (teacher_id) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(
        `${base_url}/api/user/getTeacherPaymentStatusById/${teacher_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Users apis ------------------//
  getAllTeachers: async (page, searchText) => {
    try {
      const response = await axios.get(`${base_url}/api/user/getAllTeachers`, {
        params: {
          page,
          limit: rowsPerPage, // Assuming rowsPerPage corresponds to limit
        },
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllSuppliersInAdmin: async (page, searchText) => {
    try {
      const response = await axios.get(`${base_url}/api/user/getAllSuppliersInAdmin`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          search: searchText, // Pass the search text as a query parameter
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Bank Details Users apis ------------------//
  getBankDetailsAdmin: async (teacher_id) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(`${base_url}/api/user/getBankDetailsAdmin/${teacher_id}`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Dashboard apis ------------------//
  getAllDashboardCount: async () => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(`${base_url}/api/user/getAllDashboardCount`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Category apis ------------------//
  addCategory: async (formData, token) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(`${base_url}/api/category/createCategory`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllCategoryAdmin: async (page) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/category/GetAllCategoriesAdminpage`,
        { page },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllCategory: async () => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(
        `${base_url}/api/category/GetAllCategoriesAdmin`,

        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  UpdateCategory: async (formData) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(`${base_url}/api/category/UpdateCategory`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --------------Sub Categories apis ------------------//
  addSubCategory: async (formData, token) => {
    try {
      const response = await axios.post(`${base_url}/api/subCategory/createSubCategory`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  UpdateSubCategory: async (formData) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(`${base_url}/api/subCategory/UpdateSubCategory`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSubCategoryByCategoryIdInAdmin: async (category_id) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(
        `${base_url}/api/subCategory/getSubCategoryByCategoryIdInAdmin/${category_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --------------Video apis ------------------//
  getAllVideo: async (page, search, Short) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/video/getPaginatedVideosAdmin`,
        {
          page,
          search,
          Short,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  VideoAdminStatus: async (videoId) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/video/VideoAdminStatus`,
        {
          videoId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  VideoViewUserList: async (VideoId, page) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/video/VideoViewUserList`,
        {
          VideoId,
          page,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --------------Reels apis ------------------//
  getAllReels: async (page, search, Short) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/reel/getPaginatedReelsAdmin`,
        {
          page,
          search,
          Short,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ReelsAdminStatus: async (reelsId) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/reel/ReelsAdminStatus`,
        {
          reelsId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  ReelViewUserList: async (ReelId, page) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/reel/ReelViewUserList`,
        {
          ReelId,
          page,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --------------Timeline apis ------------------//
  getAllTimeline: async (page, search, Short) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/timeline/getPaginatedPostTimelinesAdmin`,
        {
          page,
          search,
          Short,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  TimelineAdminStatus: async (timelineId) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/timeline/TimelineAdminStatus`,
        {
          timelineId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // --------------Jobs apis ------------------//
  getAllJob: async (page, search) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/job/getPaginatedPostJobsAdmin`,
        {
          page,
          search,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  JobAdminStatus: async (jobId) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/job/JobAdminStatus`,
        {
          jobId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Contact apis ------------------//
  getAllContact: async (page, search) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/comman/getAllContact`,
        {
          page,
          search,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Product apis ------------------//
  getAllProductsInAdmin: async (page) => {
    try {
      // Perform an API request to get all courses with pagination
      const response = await axios.get(
        `${base_url}/api/supplier/getAllProductsInAdmin?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllTools: async (page) => {
    try {
      // Perform an API request to get all courses with pagination
      const response = await axios.get(`${base_url}/api/tools/getAllTools?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllFertilizer: async (page) => {
    try {
      // Perform an API request to get all courses with pagination
      const response = await axios.get(`${base_url}/api/fertilizer/getAllFertilizer?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteFertilizer: async (data) => {
    try {
      // Perform an API request to get all courses with pagination
      const response = await axios.post(`${base_url}/api/fertilizer/deleteFertilizer`, data, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTools: async (data) => {
    try {
      // Perform an API request to get all courses with pagination
      const response = await axios.post(`${base_url}/api/tools/deleteTools`, data, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addFertilizer: async (formData, token) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(`${base_url}/api/fertilizer/addFertilizer`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addTools: async (formData, token) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(`${base_url}/api/tools/addTools`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllOrders: async (page) => {
    try {
      // Perform an API request to get all courses with pagination
      const response = await axios.get(`${base_url}/api/user/getAllOrders?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getProductsByOrderAndSupplier: async (order_id) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(
        `${base_url}/api/user/getProductsByOrderAndSupplier/${order_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllSupplier: async () => {
    try {
      // Perform an API request to get all courses with pagination
      const response = await axios.get(`${base_url}/api/user/getAllSupplier`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCoursesByTeacherId: async (teacher_id) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(`${base_url}/api/user/getCoursesByTeacherId/${teacher_id}`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCourseDates: async (data) => {
    try {
      const response = await axios.post(
        `${base_url}/api/teacher/updateCourseDates`, // API endpoint URL
        data, // Data to send in the request body
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      throw error; // Throw the error to be handled by the caller
    }
  },

  updateProductStatus: async (productId, active) => {
    try {
      const response = await axios.post(
        `${base_url}/api/supplier/updateProductStatus`,
        { productId, active },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      throw error; // Throw the error to be handled by the caller
    }
  },

  updateProductDefaultStatus: async (productId, default_product) => {
    try {
      const response = await axios.post(
        `${base_url}/api/supplier/updateProductDefaultStatus`,
        { productId, default_product },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      throw error; // Throw the error to be handled by the caller
    }
  },

  // -------------- Report apis ------------------//
  getAllReports: async (page, search) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/comman/getAllReports`,
        {
          page,
          search,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Hire apis ------------------//
  getAllHire: async (page, search) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/user/getAllHireList`,
        {
          page,
          search,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  HirePaymentUpdateStatus: async (hireId) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/user/HirePaymentUpdateStatus`,
        {
          hireId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Transaction apis ------------------//
  getAlltransactionList: async (page, search) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/transaction/getAllTransactions`,
        {
          page,
          search,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllUserTransactions: async (page, search, user_id) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/transaction/getAllUserTransactions`,
        {
          page,
          search,
          user_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Comapny Details apis ------------------//
  addPrivacyPolicy: async (content, token) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/CompanyDetails/addPrivacyPolicy`,
        {
          content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPrivacyPolicy: async (token) => {
    try {
      // Perform an API request to get the privacy policy content
      const response = await axios.get(`${base_url}/api/CompanyDetails/getPrivacyPolicy`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addAboutUs: async (content, token) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/CompanyDetails/addAboutUs`,
        {
          content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAboutUs: async (token) => {
    try {
      // Perform an API request to get the privacy policy content
      const response = await axios.get(`${base_url}/api/CompanyDetails/getAboutUs`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  addTermsConditions: async (content, token) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.post(
        `${base_url}/api/CompanyDetails/addTermsConditions`,
        {
          content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getTermsConditions: async (token) => {
    try {
      // Perform an API request to get the privacy policy content
      const response = await axios.get(`${base_url}/api/CompanyDetails/getTermsConditions`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // -------------- Notification List apis ------------------//
  NotificationListAdmin: async (page) => {
    try {
      // Perform an API request to create a user here
      const response = await axios.get(
        `${base_url}/api/admin/NotificationListAdmin/${page}`,

        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
