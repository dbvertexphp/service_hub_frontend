import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import VideoCard from "Website/components/video_card";
import { WebsiteApi } from "Api/WebsiteApi";
import VideoSkeleton from "../Skeleton/video_skeleton"; // Import your VideoSkeleton component
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import SweetAlertComponent from "../Utils/authfile";

const VideoList = () => {
  const [videoList, setVideoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const reduxsearch_data = useSelector((state) => state.searchReducer.search_data);
  const [authChack, setAuthChack] = useState(false);

  useEffect(() => {
    functioncall();
  }, [currentPage, reduxsearch_data, reduxcategory_id]);

  const functioncall = async () => {
    if (reduxcategory_id == "" || currentPage != 1) {
      fetchData(currentPage);
    } else {
      setVideoList([]);
      fetchData(1);
    }
  };

  const fetchData = async (page) => {
    try {
      setApiLoading(true);
      const category_id = reduxcategory_id;
      const search = reduxsearch_data;
      const response = await WebsiteApi.getPaginatedVideos(page, category_id, search);

      if (response && response.status && Array.isArray(response.data)) {
        setVideoList((prevVideos) => [...prevVideos, ...response.data]);
        setHasMore(response.data.length > 0);
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

  const handleVideoChange = (index) => {
    setCurrentVideoIndex(index);
  };

  const handleScroll = () => {
    if (hasMore && !apiLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={videoList.length}
        next={handleScroll}
        hasMore={hasMore}
        loader={
          apiLoading && (
            <div className="loadervideolist">
              <CircularProgress disableShrink />
            </div>
          )
        }
      >
        {loading ? (
          <div>
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
          </div>
        ) : (
          <VideoCard
            videos={videoList}
            currentVideoIndex={currentVideoIndex}
            onVideoChange={handleVideoChange}
          />
        )}
      </InfiniteScroll>
      {authChack && <SweetAlertComponent />}
    </div>
  );
};

export default VideoList;
