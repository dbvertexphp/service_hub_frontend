import React, { useState, useEffect } from "react";
import JobsCard from "Website/components/job_card";
import { WebsiteApi } from "Api/WebsiteApi";
import { useSelector, useDispatch } from "react-redux";

export default function MyJobList() {
  const [joblist, setJobsList] = useState([]);
  const [page, setPage] = useState(1); // Initialize page number
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);

  //   useEffect(() => {
  //     if (reduxcategory_id || reduxcategory_id == null) {
  //       fetchData(1);
  //     }
  //   }, [reduxcategory_id]);

  useEffect(() => {
    fetchData(1);
  }, [page, reduxcategory_id]); // Fetch data whenever page changes

  const fetchData = async () => {
    try {
      if (page === 1 && reduxcategory_id !== "") {
        setJobsList([]);
      }
      const category_id = reduxcategory_id;
      const response = await WebsiteApi.getMyJobs(page, category_id);

      if (response && response.status && Array.isArray(response.data)) {
        // Append new data to the existing job list
        setJobsList((prevJobs) => [...prevJobs, ...response.data]);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to handle scrolling
  const handleScroll = () => {
    // Check if user has scrolled to the bottom of the page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      // Increment page number
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    // Add event listener for scrolling
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Remove event listener when component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array to run the effect only once on mount

  return <JobsCard jobs={joblist} My_Job_list={"My_Job_list"} />;
}
