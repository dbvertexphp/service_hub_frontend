import React, { useState, useEffect } from "react";
import JobsCard from "Website/components/job_card";
import { WebsiteApi } from "Api/WebsiteApi";
import { useSelector, useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import SweetAlertComponent from "../Utils/authfile";
import Jobcard_skeleton from "../Skeleton/jobcard_skeleton";

export default function VideoList() {
  const [joblist, setJobsList] = useState([]);
  const [page, setPage] = useState(1); // Initialize page number
  const [hasMore, setHasMore] = useState(true); // To track if there are more pages to load
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const reduxsearch_data = useSelector((state) => state.searchReducer.search_data);
  const [authChack, setAuthChack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    fetchData(1, reduxcategory_id, reduxsearch_data); // Fetch data for the initial page
    setJobsList([]);
  }, [reduxcategory_id, reduxsearch_data]);

  // Function to fetch data based on page number and category ID
  const fetchData = async (pageNumber, category_id, search) => {
    try {
      const response = await WebsiteApi.getPaginatedJob(pageNumber, category_id, search);

      if (response && response.status && Array.isArray(response.data)) {
        // If no data is returned for the current page, set hasMore to false
        if (response.data.length === 0) {
          setHasMore(false);
        }
        // Append new data to the existing job list
        setJobsList((prevJobs) => [...prevJobs, ...response.data]);
      } else {
        if (response && response.expired === true) {
          setAuthChack(true);
        }
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setApiLoading(false);
    }
  };

  // Function to load more data when user scrolls to the bottom
  const fetchMoreData = () => {
    // Increment page number
    setPage(page + 1);
    // Fetch data for the next page
    fetchData(page + 1, reduxcategory_id);
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={joblist.length} // Length of the joblist
        next={fetchMoreData} // Function to call when reaching the bottom of the page
        hasMore={hasMore} // Boolean value indicating if there is more data to load
        loader={<h4></h4>} // Loader component while loading more data
        endMessage={<p>No more jobs to load</p>} // Message displayed when all data is loaded
      >
        {loading ? (
          <div>
            <Jobcard_skeleton />
            <Jobcard_skeleton />
            <Jobcard_skeleton />
            <Jobcard_skeleton />
          </div>
        ) : (
          <JobsCard jobs={joblist} />
        )}
      </InfiniteScroll>
      {authChack && <SweetAlertComponent />}
    </div>
  );
}
