import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios-instance";
import ListingCard from "../Components/cards/listing-card";
import { ScaleLoader } from "react-spinners";
import InfiniteScroll from "react-infinite-scroll-component";

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState("event");
  const [listingType, setListingType] = useState("event");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isLoading = useRef(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/profile/${id}`,
          {
            params: { type: "host" },
            withCredentials: true,
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [id]);

  const fetchListings = async () => {
    if (isLoading.current) return;
    isLoading.current = true;

    try {
      const { data } = await axiosInstance.get(
        `/admin/profile/${id}/listings`,
        {
          withCredentials: true,
          params: { type: listingType, page, limit: 10 },
        }
      );

      setListings((prev) => [...prev, ...data.listings]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      isLoading.current = false;
    }
  };

  useEffect(() => {
    setListings([]); 
    setPage(1);
    setHasMore(true); 
    fetchListings();
  }, [id, listingType]);

  if (!user)
    return (
      <div className="flex justify-center">
        <ScaleLoader color="#C0C2C9" />
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row p-4  mx-auto">
      <div className="w-full md:w-2/3 p-4 h-screen overflow-y-scroll scrollbar-hide">
        <h2 className="text-2xl font-bold mb-5">
          {user.firstName} {user.lastName}
        </h2>

        <div className="flex gap-4 border-b mt-2 mb-5">
          {["property", "event", "about"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 ${activeTab === tab ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                if (tab !== "about") {
                  setListingType(tab);
                  setListings([]);
                  setPage(1);
                  setHasMore(true);
                }
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab !== "about" && (
          <InfiniteScroll
            dataLength={listings.length}
            next={fetchListings}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center">
                <ScaleLoader color="#C0C2C9" />
              </div>
            }
            endMessage={
              <div className="text-center text-gray-500 py-4">
                No more listings
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 p-4">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    type={listingType}
                  />
                ))
              ) : (
                <p className="text-gray-500 mt-4">
                  No {listingType}s available.
                </p>
              )}
            </div>
          </InfiniteScroll>
        )}

        {activeTab === "about" && (
          <div className="text-center p-4 border rounded-lg mt-4">
            <img
              src={user.image}
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto"
            />
            <h3 className="text-lg font-semibold mt-2">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-500 text-sm">{user.country}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-gray-500 text-sm">{user.gender}</p>
            <p className="text-black text-lg">{user.followerCount} followers</p>
          </div>
        )}
      </div>
      <div className="hidden md:block w-1/3 p-4 border-l sticky top-0 h-screen">
        <div className="text-center">
          <img
            src={user.image}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto"
          />
          <h3 className="text-lg font-semibold mt-2">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-gray-500 text-sm">{user.country}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <p className="text-gray-500 text-sm">{user.gender}</p>
          <p className="text-black text-lg">{user.followerCount} followers</p>
          <div className="flex justify-center gap-2 mt-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
              Edit
            </button>
            <button className="border py-2 px-4 rounded-lg">Message</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
