import axios from "axios";
import Cookies from "js-cookie";
import { setCookie, getCookie } from "../cookies";

const base_url = process.env.REACT_APP_BASE_URL;
const token = getCookie("Websitetoken");

const WebsiteApi = {
  // Auth Apis
  login: async (mobile, password) => {
    try {
      const response = await axios.post(`${base_url}/api/user/login`, {
        mobile,
        password,
      });

      const { user } = response.data;
      const { token } = response.data;
      if (token) {
        setCookie("Websitetoken", token);
      }
      if (user) {
        setCookie("Userdata", JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  Signup: async (first_name, last_name, username, email, mobile, password, dob) => {
    try {
      const response = await axios.post(`${base_url}/api/user/register`, {
        first_name,
        last_name,
        username,
        email,
        mobile,
        password,
        dob,
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  verifyOtp: async (mobile, otp) => {
    try {
      const response = await axios.post(`${base_url}/api/user/verifyOtp`, {
        mobile,
        otp,
      });
      const { user } = response.data;
      const { token } = response.data;
      if (token) {
        setCookie("Websitetoken", token);
      }
      if (user) {
        setCookie("Userdata", JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  resendOTP: async (mobile) => {
    try {
      const response = await axios.post(`${base_url}/api/user/resendOTP`, {
        mobile,
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  ForgetresendOTP: async (mobile) => {
    try {
      const response = await axios.post(`${base_url}/api/user/ForgetresendOTP`, {
        mobile,
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  forgetPassword: async (newPassword, mobile, otp) => {
    try {
      const response = await axios.put(`${base_url}/api/user/forgetPassword`, {
        newPassword,
        mobile,
        otp,
      });

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  searchUsers: async (name) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/searchUsers`,
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`,
            "Content-Type": "application/json", // Set content type to multipart/form-data
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // User Apis getUserView
  profilePicKey: async (profilePicKey) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/profilePicKey`,
        {
          profilePicKey,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`,
            "Content-Type": "application/json", // Set content type to multipart/form-data
          },
        }
      );
      if (response && response.data && response.data.pic) {
        // प्रतिक्रिया में छवि को निकालें
        const picUrl = response.data.pic;
        // प्रोफ़ाइल डेटा को प्राप्त करें
        let userData = JSON.parse(getCookie("Userdata"));
        // प्रोफ़ाइल छवि को अपडेट करें
        userData.pic = picUrl;
        // कुकी में अपडेट करें
        setCookie("Userdata", JSON.stringify(userData));
      }
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getProfilePicUploadUrlS3: async () => {
    try {
      const response = await axios.get(`${base_url}/api/user/getProfilePicUploadUrlS3`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  updateProfileData: async (interest, about_me, last_name, first_name, address, dob) => {
    try {
      const response = await axios.put(
        `${base_url}/api/user/updateUserProfile`,
        {
          interest,
          about_me,
          last_name,
          first_name,
          address,
          dob,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getUsers: async () => {
    try {
      const response = await axios.get(`${base_url}/api/user`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getUserView: async (user_id) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(`${base_url}/api/user/getUserView/${user_id}`, config);
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  logoutUser: async () => {
    try {
      const response = await axios.get(`${base_url}/api/user/logoutUser`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  ChangePassword: async (newPassword, oldPassword) => {
    try {
      const response = await axios.put(
        `${base_url}/api/user/ChangePassword`,
        {
          newPassword,
          oldPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getAllUsersWebsite: async (page, search) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${base_url}/api/user/getAllUsersWebsite`,
        {
          page,
          search,
        },
        config
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  updateUserWatchTime: async (time) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/updateUserWatchTime`,
        {
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  // Video Apis
  getVideosThumbnails: async (category_id) => {
    try {
      // Attach the token to the request headers
      const response = await axios.post(`${base_url}/api/video/getVideosThumbnails/5`, {
        category_id,
      });

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  streamVideo: async (videoId) => {
    try {
      // Attach the token to the request headers
      const response = await axios.get(`${base_url}/api/video/streamVideo/${videoId}`, {});

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getPaginatedVideos: async (number, category_id, search) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };

      // Attach the token to the request headers
      const response = await axios.post(
        `${base_url}/api/video/getPaginatedVideos/${number}`,
        {
          category_id,
          search,
        },
        config
      );

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getAllVideos: async (number, category_id) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };

      // Attach the token to the request headers
      const response = await axios.post(
        `${base_url}/api/video/getAllVideo/${number}`,
        {
          category_id,
        },
        config
      );

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getMyVideos: async (pageNumber) => {
    try {
      const response = await axios.get(`${base_url}/api/video/getMyVideos/${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getUserVideos: async (user_id, pageNumber) => {
    try {
      const response = await axios.get(
        `${base_url}/api/video/getUserVideos/${user_id}/${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getVideoComments: async (videoId) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(`${base_url}/api/video/getVideoComments/${videoId}`, config);

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  addVideoComment: async (video_id, comment) => {
    try {
      const response = await axios.post(
        `${base_url}/api/video/addVideoComment`,
        {
          video_id,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  updateVideoLike: async (video_id, count) => {
    try {
      const response = await axios.post(
        `${base_url}/api/video/updateVideoLike`,
        {
          video_id,
          count,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  searchVideos: async (title) => {
    try {
      const response = await axios.post(`${base_url}/api/video/searchVideos`, {
        title,
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  ViewCountAdd: async (videoId) => {
    try {
      const response = await axios.post(
        `${base_url}/api/video/ViewCountAdd`,
        {
          videoId,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getVideoUploadUrlS3: async () => {
    try {
      const response = await axios.get(`${base_url}/api/video/getVideoUploadUrlS3`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  uploadVideos: async (category_id, description, title, video_key, thumbnail_key) => {
    try {
      const response = await axios.post(
        `${base_url}/api/video/uploadVideos`,
        {
          category_id,
          description,
          title,
          video_key,
          thumbnail_key,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  // Reels Apis
  getReelThumbnails: async (category_id) => {
    try {
      // Attach the token to the request headers
      const response = await axios.post(`${base_url}/api/reel/getReelThumbnails/10`, {
        category_id,
      });

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  streamReel: async (videoId) => {
    try {
      // Attach the token to the request headers
      const response = await axios.get(`${base_url}/api/reel/streamReel/${videoId}`, {});

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  updateReelLike: async (reel_id, count) => {
    try {
      const response = await axios.post(
        `${base_url}/api/reel/updateReelLike`,
        {
          reel_id,
          count,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getPaginatedReel: async (category_id, number, share_Id, search) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };
      // Attach the token to the request headers
      const response = await axios.post(
        `${base_url}/api/reel/getPaginatedReelWebsite/${number}/${share_Id}`,
        { category_id, search },
        config
      );

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getPaginatedReelWebsiteFillter: async (category_id, number, share_Id, search) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };
      // Attach the token to the request headers
      const response = await axios.post(
        `${base_url}/api/reel/getPaginatedReelWebsiteFillter/${number}/${share_Id}`,
        { category_id, search },
        config
      );

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getMyReels: async (number) => {
    try {
      const response = await axios.post(
        `${base_url}/api/reel/getMyReelsWebsite/${number}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getMyReel_ByCategory: async (category_id, page_number) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };
      // Attach the token to the request headers
      const response = await axios.post(
        `${base_url}/api/reel/getMyReel_ByCategory/`,
        {
          category_id,
          page_number,
        },
        config
      );

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getUserReels: async (user_id, page) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        `${base_url}/api/reel/getUserReelsWebsite`,
        { user_id, page },
        {
          config,
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  addReelComment: async (reel_id, comment) => {
    try {
      const response = await axios.post(
        `${base_url}/api/reel/addReelComment`,
        {
          reel_id,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getReelComments: async (reelId) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(`${base_url}/api/reel/getReelComments/${reelId}`, config);

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getReel_ByCategory: async (category_id, page_number) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };
      // Attach the token to the request headers
      const response = await axios.post(
        `${base_url}/api/reel/getReel_ByCategory/`,
        {
          category_id,
          page_number,
        },
        config
      );

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  searchReels: async (title) => {
    try {
      const response = await axios.post(`${base_url}/api/reel/searchReels`, {
        title,
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getReelsUploadUrlS3: async () => {
    try {
      const response = await axios.get(`${base_url}/api/reel/getReelsUploadUrlS3`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  uploadReel: async (category_id, description, title, reels_key, thumbnail_key) => {
    try {
      const response = await axios.post(
        `${base_url}/api/reel/uploadReel`,
        {
          category_id,
          description,
          title,
          reels_key,
          thumbnail_key,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  ViewCountAddReels: async (Reels_Id) => {
    try {
      const response = await axios.post(
        `${base_url}/api/reel/ViewCountAdd`,
        {
          Reels_Id,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Timeline Apis
  getPaginatedTimeline: async (number, category_id, search) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${base_url}/api/timeline/getPaginatedTimeline/${number}`,
        {
          category_id,
          search,
        },
        config
      );

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  updatePostTimelineLike: async (post_timeline_id, count) => {
    try {
      const response = await axios.post(
        `${base_url}/api/timeline/updatePostTimelineLike`,
        {
          post_timeline_id,
          count,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getTimelineComments: async (timelineId) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.get(
        `${base_url}/api/timeline/getTimelineComments/${timelineId}`,
        config
      );

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  addTimelineComment: async (timeline_id, comment) => {
    try {
      const response = await axios.post(
        `${base_url}/api/timeline/addTimelineComment`,
        {
          timeline_id,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getMyTimeline: async (pageNumber) => {
    try {
      const response = await axios.get(`${base_url}/api/timeline/getMyTimeline/${pageNumber}`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getUserTimeline: async (user_id, pageNumber) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.get(
        `${base_url}/api/timeline/getUserTimeline/${user_id}/${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  searchPostsOnTimeline: async (title) => {
    try {
      const response = await axios.post(`${base_url}/api/timeline/searchPostsOnTimeline`, {
        title,
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  uploadPostTimeline: async (category_id, description, title) => {
    try {
      const response = await axios.post(
        `${base_url}/api/timeline/uploadPostTimeline`,
        {
          category_id,
          description,
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Jobs Apis
  getPaginatedJob: async (number, category_id, search) => {
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : null,
          "Content-Type": "application/json",
        },
      };
      // Attach the token to the request headers
      const response = await axios.post(
        `${base_url}/api/job/getPaginatedJob/${number}`,
        { category_id, search },
        config
      );

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  appliedPostJob: async (job_id) => {
    try {
      const response = await axios.post(
        `${base_url}/api/job/appliedPostJob`,
        {
          job_id,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getMyAppliedJobs: async (category_id) => {
    try {
      const response = await axios.post(
        `${base_url}/api/job/getAppliedJobs`,
        { category_id },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getMyJobs: async (number, category_id) => {
    try {
      // Attach the token to the request headers
      const response = await axios.post(
        `${base_url}/api/job/getMyJobs/${number}`,
        { category_id },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  updateJobStatus: async (job_id, job_status) => {
    try {
      const response = await axios.post(
        `${base_url}/api/job/updateJobStatus`,
        {
          job_id,
          job_status,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getAppliedUsers: async (job_id) => {
    try {
      const response = await axios.get(`${base_url}/api/job/getAppliedUsers/${job_id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  searchJobPosts: async (title) => {
    try {
      const response = await axios.post(`${base_url}/api/job/searchJobPosts`, {
        title,
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  uploadPostJob: async (category_id, description, title) => {
    try {
      const response = await axios.post(
        `${base_url}/api/job/uploadPostJob`,
        {
          category_id,
          description,
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  // Subscrib Apis
  SubscribeRequest: async (subscriber_id) => {
    try {
      const response = await axios.post(
        `${base_url}/api/subscribe/SubscribeRequest`,
        {
          subscriber_id,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  GetMySubscribe: async () => {
    try {
      const response = await axios.get(`${base_url}/api/subscribe`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getSubscriptionRequest: async () => {
    try {
      const response = await axios.get(`${base_url}/api/subscribe/getSubscriptionRequest`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  UnSubscribeRequest: async (subscriber_id) => {
    try {
      const response = await axios.post(
        `${base_url}/api/subscribe/UnSubscribeRequest`,
        {
          subscriber_id,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Frinds Apis getBankDetails
  Sendfriendrequest: async (friend_id) => {
    try {
      const response = await axios.post(
        `${base_url}/api/myfriend/Sendfriendrequest`,
        {
          friend_id,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  AcceptClubRequest: async (friend_id, status, notificetion_id) => {
    try {
      const response = await axios.post(
        `${base_url}/api/myfriend/AcceptFriendRequest`,
        {
          friend_id,
          status,
          notificetion_id,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getMyClub: async (search) => {
    try {
      const response = await axios.post(
        `${base_url}/api/myfriend`,
        {
          search,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getMyFriendsAdd: async (search) => {
    try {
      const response = await axios.post(
        `${base_url}/api/myfriend/getMyFriendsAdd`,
        {
          search,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getClubRequests: async (search) => {
    try {
      const response = await axios.post(
        `${base_url}/api/myfriend/getMyFriendsrequests`,
        {
          search,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Bank Details Apis
  getBankDetails: async () => {
    try {
      const response = await axios.get(`${base_url}/api/user/getBankDetails`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  bankdetailsUpload: async (name, bankName, accountNumber, ifscCode, branchName) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/bankdetailsUpload`,
        {
          name,
          bankName,
          accountNumber,
          ifscCode,
          branchName,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Calendar Apis
  Createcalendar: async (time, price, type, date) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/Createcalendar`,
        {
          time,
          price,
          type,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  GetNormalEntries: async () => {
    try {
      const response = await axios.get(`${base_url}/api/user/GetNormalEntries`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  GetSpecialEntries: async () => {
    try {
      const response = await axios.get(`${base_url}/api/user/GetSpecialEntries`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  FindPriceByDateTime: async (date, time, user_id) => {
    try {
      const response = await axios.post(`${base_url}/api/user/FindPriceByDateTime`, {
        time,
        user_id,
        date,
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Hire Apis
  getHireList: async () => {
    try {
      const response = await axios.get(`${base_url}/api/user/getHireList`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getHireByMe: async () => {
    try {
      const response = await axios.get(`${base_url}/api/user/getHireByMe`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  updateHireStatus: async (_id, status) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/updateHireStatus`,
        {
          _id,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  createHire: async (hire_id, amount, calendar_id) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/createHire`,
        {
          hire_id,
          amount,
          calendar_id,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Review Apis
  addReview: async (review_id, review_number, description, hire_list_id) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/addReview`,
        {
          review_id,
          review_number,
          description,
          hire_list_id,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getReview: async (review_id, number) => {
    try {
      const response = await axios.get(`${base_url}/api/user/getReview/${review_id}/${number}`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Chat Apis {{baseURL}}api/message/
  ChatCreate: async (userId) => {
    try {
      const response = await axios.post(
        `${base_url}/api/chat`,
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  fetchChats: async (number) => {
    try {
      const response = await axios.get(`${base_url}/api/chat/${number}`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  blockUser: async (chatId, userId, status) => {
    try {
      const response = await axios.post(
        `${base_url}/api/chat/blockUser`,
        {
          chatId,
          userId,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  blockUserList: async () => {
    try {
      const response = await axios.get(`${base_url}/api/chat/blockUserList`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Message Apis
  allMessages: async (chatId) => {
    try {
      const response = await axios.get(`${base_url}/api/message/${chatId}`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  sendMessageAPI: async (content, chatId) => {
    try {
      const response = await axios.post(
        `${base_url}/api/message`,
        {
          chatId,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  UpdateMessagesRead: async (messagesId) => {
    try {
      const response = await axios.post(
        `${base_url}/api/message/UpdateMessagesRead`,
        {
          messagesId,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Notification Apis
  websiteNotificationToken: async (token) => {
    let authorizationToken;
    const getLocalToken = localStorage.getItem("token");
    const getCookieToken = getCookie("Websitetoken");

    if (getLocalToken !== null) {
      authorizationToken = `Bearer ${getLocalToken}`;
    } else if (getCookieToken !== null) {
      authorizationToken = `Bearer ${getCookieToken}`;
    }

    try {
      const response = await axios.post(
        `${base_url}/api/user/websiteNotificationToken`,
        {
          token,
        },
        {
          headers: {
            Authorization: authorizationToken,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  NotificationList: async (number) => {
    try {
      const response = await axios.get(`${base_url}/api/user/NotificationList/${number}`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getUnreadCount: async () => {
    try {
      const response = await axios.get(`${base_url}/api/user/getUnreadCount`, {
        headers: {
          Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getNotificationId: async (sender_id, type) => {
    try {
      const response = await axios.post(
        `${base_url}/api/user/getNotificationId`,
        {
          sender_id,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // comman Apis
  contactUs: async (name, email_id, mobile_number, message) => {
    try {
      const response = await axios.post(
        `${base_url}/api/comman/contactUs`,
        {
          name,
          email_id,
          mobile_number,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  report: async (report_type, type_id, title, description) => {
    try {
      const response = await axios.post(
        `${base_url}/api/comman/report`,
        {
          report_type,
          type_id,
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  HomePage: async (category_id) => {
    try {
      const response = await axios.post(
        `${base_url}/api/comman/HomePage`,
        {
          category_id,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  //  Company Details Apis
  getAboutUs: async () => {
    try {
      const response = await axios.get(`${base_url}/api/CompanyDetails/getAboutUs`);
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getTermsConditions: async () => {
    try {
      const response = await axios.get(`${base_url}/api/CompanyDetails/getTermsConditions`);
      return response.data;
    } catch (error) {
      //throw error;
    }
  },
  getPrivacyPolicy: async () => {
    try {
      const response = await axios.get(`${base_url}/api/CompanyDetails/getPrivacyPolicy`);
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // Payment Apis

  checkout: async (amount) => {
    try {
      const response = await axios.post(
        `${base_url}/api/transaction/checkout`,
        {
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("Websitetoken")}`, // Assuming getWebsiteToken() retrieves the token
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      //throw error;
    }
  },

  // ------------- Un Authrezotion Api  -----------------//
  GetAllCategories: async () => {
    try {
      // Attach the token to the request headers
      const response = await axios.get(`${base_url}/api/category`);

      return response.data;
    } catch (error) {
      //throw error;
    }
  },
};

export { WebsiteApi }; // Export WebsiteApi as a named export
