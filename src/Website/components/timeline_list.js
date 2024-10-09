import React, { useState, useEffect } from "react";
import TimelineCard from "Website/components/timeline_card";
import { WebsiteApi } from "Api/WebsiteApi";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import SweetAlertComponent from "../Utils/authfile";
import Jobcard_skeleton from "../Skeleton/jobcard_skeleton";

export default function VideoList() {
  const [timelinelist, setVideoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To track if there are more pages to load

  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const reduxsearch_data = useSelector((state) => state.searchReducer.search_data);
  const [authChack, setAuthChack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(1); // Reset current page to 1 when category changes
    setVideoList([]); // Reset timeline list when category changes
  }, [reduxcategory_id, reduxsearch_data]);

  useEffect(() => {
    fetchData();
  }, [currentPage, reduxcategory_id, reduxsearch_data]);

  const fetchData = async () => {
    try {
      const category_id = reduxcategory_id;
      const search = reduxsearch_data;
      const response = await WebsiteApi.getPaginatedTimeline(currentPage, category_id, search);

      if (response && response.status && Array.isArray(response.data)) {
        // Update timeline list with new data
        setVideoList((prevList) => [...prevList, ...response.data]);
        // If no more data is returned, set hasMore to false
        if (response.data.length === 0) {
          setHasMore(false);
        }
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
    setCurrentPage(currentPage + 1); // Increment page number
  };

  return (
    <div>
      <InfiniteScroll dataLength={timelinelist.length} next={fetchMoreData} hasMore={hasMore}>
        {loading ? (
          <div>
            <Jobcard_skeleton />
            <Jobcard_skeleton />
            <Jobcard_skeleton />
            <Jobcard_skeleton />
          </div>
        ) : (
          <TimelineCard timelines={timelinelist} />
        )}
      </InfiniteScroll>
      {authChack && <SweetAlertComponent />}
    </div>
  );
}
