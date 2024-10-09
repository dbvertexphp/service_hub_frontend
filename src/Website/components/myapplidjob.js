import React, { useState, useEffect } from "react";
import JobsCard from "Website/components/job_card";
import { WebsiteApi } from "Api/WebsiteApi";
import { useSelector, useDispatch } from "react-redux";
import Jobcard_skeleton from "../Skeleton/jobcard_skeleton";
import InfiniteScroll from "react-infinite-scroll-component";

export default function MyAppliedJobList() {
  const [joblist, setJobsList] = useState([]);
  const reduxcategory_id = useSelector((state) => state.categoryReducer.category_id);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    if (reduxcategory_id || reduxcategory_id == null) {
      fetchData();
    }
  }, [reduxcategory_id]);

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  const fetchData = async () => {
    try {
      if (reduxcategory_id !== "") {
        setJobsList([]);
      }
      const category_id = reduxcategory_id;
      const response = await WebsiteApi.getMyAppliedJobs(category_id);

      if (response && response.status && Array.isArray(response.data)) {
        setJobsList(response.data);
      } else {
        console.error("Invalid API response format:", response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setApiLoading(false);
    }
  };

  return loading ? (
    <div>
      <Jobcard_skeleton />
      <Jobcard_skeleton />
      <Jobcard_skeleton />
      <Jobcard_skeleton />
    </div>
  ) : (
    <JobsCard jobs={joblist} />
  );
}
