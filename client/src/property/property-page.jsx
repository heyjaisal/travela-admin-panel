import ImageGallery from "@/Components/image";
import MapWithDirectionButton from "@/Components/map";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@heroui/react";
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import axiosInstance from "@/utils/axios-instance";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

function PropertyPage() {
  const { locale } = useLocale();
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [showCalendar, setShowCalendar] = useState(null);
  const [disabledRanges, setDisabledRanges] = useState([]);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [guests, setGuests] = useState("");
  const [loading, setLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/details/${id}`, {
          params: { type: "property" },
          withCredentials: true,
        });
        const item = data.item || {};
        item.features = Array.isArray(item.features) ? item.features : [];
        item.images = Array.isArray(item.images) ? item.images : [];
        setProperty(item);
        if (item.bookedDates?.length > 0) {
          const ranges = item.bookedDates.map((booking) => {
            const startDate = parseDate(booking.checkIn);
            const endDate = parseDate(booking.checkOut);
            return [startDate, endDate];
          });
          setDisabledRanges(ranges);
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/listing/reviews/Property/${id}`);
        setReviews(data.reviews || []);
        console.log(data, "Reviews fetched successfully");
        
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (id) {
      fetchProperty();
      fetchReviews();
    }
  }, [id]);

  const isDateUnavailable = (date) => {
    const todayDate = today(getLocalTimeZone());
    const isPast = date.compare(todayDate) < 0;
    return (
      isPast ||
      disabledRanges.some(
        (interval) =>
          date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
      )
    );
  };

  const getNumberOfNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = checkOut.getTime() - checkIn.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days === 0 ? 1 : days;
  };

  const isReserveDisabled =
    !checkIn ||
    !checkOut ||
    !guests ||
    guests <= 0 ||
    guests > property?.maxGuests;

  const handleDateSelect = (date) => {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    if (showCalendar === "checkin") {
      setCheckIn(jsDate);
    } else {
      setCheckOut(jsDate);
    }
    setShowCalendar(null);
  };

  const handleReserve = async () => {
    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }
    if (guests > property.maxGuests) {
      toast.error(
        `Only ${property.maxGuests} guests allowed for this property.`
      );
      return;
    }
    setLoading(true);
    try {
      if (!property.host || !property.host._id) {
        throw new Error("Host information is missing");
      }
      const response = await axiosInstance.post("/checkout/property", {
        propertyId: id,
        title: property.title,
        location: `${property.city}, ${property.state}, ${property.country}`,
        image: property.images?.[0] || "",
        hostId: property.host?._id,
        date: property.eventDateTime,
        checkIn,
        checkOut,
        price: property.price,
        hostName: `${property.host?.firstName} ${property.host?.lastName}`,
        hostStripeAccount: property.host?.stripeAccountId,
        guests,
      });
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error("Invalid response from server");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error(error.message || "Failed to create checkout session");
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!userInfo) return setShowLoginModal(true);
    if (!newRating || !newComment.trim())
      return toast.error("Please provide rating and comment.");

    try {
      await axiosInstance.post(`/listing/reviews/Property/${id}`, {
        rating: newRating,
        comment: newComment,
      });
      setNewComment("");
      setNewRating(0);
      const { data } = await axiosInstance.get(`/listing/reviews/Property/${id}`);
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Review submit error:", err);
      toast.error("Could not submit review.");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  if (!property) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <ToastContainer />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">
          {property.title || "Property Details"}
        </h2>
        <ImageGallery images={property.images} />
      </div>
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg border order-1 md:order-2 md:sticky md:top-20 self-start">
          <h2 className="text-xl font-bold">
            ₹{property.price} <span className="text-sm font-normal">/night</span>
          </h2>
          <p className="text-sm text-gray-600">Availability: Available</p>
          <div className="border p-3 rounded-lg my-4">
            <div className="flex justify-between">
              <div onClick={() => setShowCalendar("checkin")} className="cursor-pointer">
                <p className="text-sm text-gray-600">CHECK-IN</p>
                <p className="font-normal">{checkIn ? checkIn.toDateString() : "Select Date"}</p>
              </div>
              <div onClick={() => setShowCalendar("checkout")} className="cursor-pointer">
                <p className="text-sm text-gray-600">CHECKOUT</p>
                <p className="font-normal">{checkOut ? checkOut.toDateString() : "Select Date"}</p>
              </div>
            </div>
          </div>
          {showCalendar && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowCalendar(null);
              }}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg relative" onClick={(e) => e.stopPropagation()}>
                <Calendar
                  aria-label="Date Selection"
                  isDateUnavailable={isDateUnavailable}
                  onChange={handleDateSelect}
                />
              </div>
            </div>
          )}
          {checkIn && checkOut && (
            <div className="my-4">
              <h3 className="text-xl font-semibold">
                Total Price: ₹{property.price * getNumberOfNights()}
              </h3>
              <p className="text-sm text-gray-600">
                Total: ₹{property.price * getNumberOfNights()} for{" "}
                {getNumberOfNights()} night{getNumberOfNights() > 1 ? "s" : ""}
              </p>
            </div>
          )}
          <div className="mb-3">
            <h1>Max Guests: {property.maxGuests}</h1>
            <Input
              placeholder="Add Guests"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>
          <button
            onClick={handleReserve}
            disabled={isReserveDisabled || loading}
            className="w-full bg-button text-white py-2 rounded-lg font-semibold disabled:opacity-50 mt-4"
          >
            {loading ? "Processing..." : "Reserve"}
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">You won't be charged yet</p>
        </div>

        <div className="md:col-span-2 space-y-4 order-2 md:order-1">
          <h1 className="text-2xl font-bold">
            Barn in {property.state}, {property.country}
          </h1>
          <p className="text-gray-600">
            {property.maxGuests} guests · {property.bedrooms} bedrooms · {property.kitchen} Kitchen · {property.bathrooms} bathrooms
          </p>
          <p className="text-gray-700">
            Location: {property.city}, {property.state}, {property.country}
          </p>
          <Link to={`/host/${property?.host?._id}`} className="border-t pt-4 flex items-center gap-3">
            <Avatar>
              <AvatarImage src={property.host?.image} alt="Host Avatar" />
              <AvatarFallback>
                {property.host?.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                Hosted by {property?.host?.firstName || "Unknown"} {property?.host?.lastName || ""}
              </h3>
              <p className="text-sm text-gray-500">3 years hosting · Verified Host</p>
            </div>
          </Link>
          <p className="py-5">{property.description}</p>
          <h3 className="text-lg font-semibold mb-2">About this place</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            {property.features.length > 0 ? (
              property.features.map((feature, idx) => (
                <li key={feature._id || idx}>{feature.text}</li>
              ))
            ) : (
              <li>No features listed</li>
            )}
          </ul>
          <h3 className="text-xl font-bold">Where you'll be</h3>
          <p>{property.street}, {property.city}, {property.state}, {property.country}</p>
          <MapWithDirectionButton lat={property.location?.lat} lng={property.location?.lng} />

          <div className="max-w-6xl mx-auto px-4 mt-12 space-y-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <div className="mt-8 p-6 bg-white border rounded-lg shadow space-y-4">
              <h3 className="text-xl font-semibold">Leave a Review</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.span
                    key={star}
                    onClick={() => setNewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    whileHover={{ scale: 1.2 }}
                    className={`cursor-pointer text-2xl ${(hoverRating || newRating) >= star ? "text-yellow-500" : "text-gray-400"}`}
                  >
                    ★
                  </motion.span>
                ))}
              </div>
              <Textarea
                placeholder="Write your review..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button onClick={handleSubmitReview} className="bg-button text-white">
                Submit Review
              </Button>
            </div>
            {reviews.length === 0 && <p className="text-gray-600">No reviews yet.</p>}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="p-4 bg-white rounded-lg shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.user?.image || ""} />
                      <AvatarFallback>
                        {review.user?.username?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{review.user?.username || "User"}</p>
                      <div className="flex gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal} className="z-50">
        <DialogContent className="p-6 text-center space-y-4">
          <h2 className="text-xl font-semibold">Login Required</h2>
          <p className="text-gray-600">Please log in with Google to reserve this property.</p>
          <Button onClick={handleGoogleSignup} className="w-full bg-button text-white">
            Continue with Google
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PropertyPage;
