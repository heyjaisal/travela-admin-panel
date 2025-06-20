import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const isLoading = useRef(false);
  const navigate = useNavigate();

  const fetchReports = async (reset = false) => {
    if (isLoading.current) return;
    isLoading.current = true;

    try {
      const { data } = await axios.get("/api/reports", {
        params: { page, limit: 6, search },
      });

      if (!Array.isArray(data.reports)) throw new Error("Invalid data");

      setReports((prev) => (reset ? data.reports : [...prev, ...data.reports]));
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading reports:", error.message);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    setPage(1);
    setReports([]);
    setHasMore(true);
    fetchReports(true);
  }, [search]);

  return (
    <div>
      <div className="flex justify-center pt-2">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search reports by title or reason..."
          className="w-1/2 p-3 pl-4 border rounded-full shadow-md focus:outline-none"
        />
      </div>

      <InfiniteScroll
        dataLength={reports.length}
        next={fetchReports}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center my-4">
            <ScaleLoader color="#4A90E2" />
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {reports.map((report) => (
            <div
              key={report._id}
              onClick={() =>
                navigate(
                  `/${report.contentType.toLowerCase()}/${report.contentId}`
                )
              }
              className="border rounded-xl p-4 shadow hover:shadow-lg cursor-pointer"
            >
              <img
                src={report.content?.images?.[0] || "/placeholder.jpg"}
                className="w-full h-40 object-cover rounded-md mb-3"
                alt={report.content?.title}
              />
              <h2 className="font-semibold">{report.content?.title}</h2>
              <p className="text-sm text-gray-600">
                Reason: {report.reasons[0]}
              </p>
              <p className="text-xs text-gray-500 mt-1">Status: {report.status}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ReportList;
