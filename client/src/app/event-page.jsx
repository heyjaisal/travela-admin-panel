import ImageGallery from "@/Components/image";
import MapWithDirectionButton from "@/Components/map";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { NumberInput } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axios-instance";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import { Textarea } from "@/Components/ui/textarea";

function Eventpage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableTickets, setAvailableTickets] = useState(0);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/details/${id}`, {
          params: { type: "event" },
          withCredentials: true,
        });
        const eventData = data.item || {};
        setEvent(eventData);
        setAvailableTickets(eventData.maxGuests || 0);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      }
    };
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/listing/reviews/Event/${id}`,{
          withCredentials: true,
        });
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (id) {
      fetchEvent();
      fetchReviews();
    }
  }, [id]);

  const handleReserve = async () => {
    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }

    if (!event || ticketCount < 1 || ticketCount > availableTickets) {
      toast.error("Invalid ticket count");
      return;
    }

    setLoading(true);

    try {
      if (!event.host || !event.host._id) {
        throw new Error("Host information is missing");
      }

      const response = await axiosInstance.post("/checkout/event", {
        eventId: id,
        title: event.title || "",
        location: `${event.city || ""}, ${event.state || ""}, ${event.country || ""}`,
        image: event.images?.[0] || "",
        hostId: event.host._id,
        date: event.eventDateTime || "",
        ticketCount,
        ticketPrice: event.ticketPrice || 0,
        hostName: `${event.host.firstName || ""} ${event.host.lastName || ""}`,
        hostStripeAccount: event.host.stripeAccountId || "",
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
      await axiosInstance.post(`/listing/reviews/Event/${id}`, {
        rating: newRating,
        comment: newComment,
      },{
        withCredentials: true,
      });
      setNewComment("");
      setNewRating(0);
      const { data } = await axiosInstance.get(`/listing/reviews/Event/${id}`);
      setReviews(data.reviews);
    } catch (err) {
      console.error("Review submit error:", err);
      toast.error("Could not submit review.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">
          {event?.title || "Event Details"}
        </h2>
        <ImageGallery images={event?.images || []} />
      </div>
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg p-6 rounded-lg border order-1 md:order-2 md:sticky md:top-20 self-start">
          <h2 className="text-xl font-bold">
            ₹{event?.ticketPrice || 0}
            <span className="text-sm font-normal">/Ticket</span>
          </h2>
          <p className="text-gray-600">Available Tickets: {availableTickets}</p>
          <NumberInput
            isRequired
            className="py-4"
            value={ticketCount}
            onChange={(e) => setTicketCount(e.target.value)}
            min={1}
            max={availableTickets}
            label="Tickets"
            placeholder="Enter the amount"
          />
          <p className="text-lg font-semibold mt-2">
            Total: ₹{event?.ticketPrice ? event.ticketPrice * ticketCount : 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Platform fee: ₹
            {event?.ticketPrice
              ? Math.round(event.ticketPrice * ticketCount * 0.04 * 100) / 100
              : 0}
          </p>
          <p className="text-lg font-semibold mt-2">
            Grand Total: ₹
            {event?.ticketPrice
              ? Math.round(event.ticketPrice * ticketCount * 1.04 * 100) / 100
              : 0}
          </p>

          <button
            onClick={handleReserve}
            disabled={
              loading || ticketCount < 1 || ticketCount > availableTickets
            }
            className="w-full bg-button text-white py-2 rounded-lg font-semibold disabled:opacity-50 mt-4"
          >
            {loading ? "Processing..." : "Reserve"}
          </button>
          <p className="text-center text-sm text-gray-500 mt-2">
            You won't be charged yet
          </p>
        </div>

        <div className="md:col-span-2 space-y-4 order-2 md:order-1">
          <h1 className="text-2xl font-bold">
            Event in {event?.state || "Unknown"}, {event?.country || "Unknown"}
          </h1>
          <p className="text-gray-600">
            Event Type: {event?.eventType || "N/A"}
          </p>
          <p className="text-gray-600">
            Event Venue: {event?.eventVenue || "N/A"}
          </p>
          <p className="text-gray-700">
            Location: {event?.city || "N/A"}, {event?.state || "N/A"},{" "}
            {event?.country || "N/A"}
          </p>
          <div className="border-t pt-4 flex items-center gap-3">
            <Link
              to={`/host/${event?.host?._id || ""}`}
              className="flex items-center gap-3 mb-4 cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={event?.host?.image || ""} alt="Host Avatar" />
                <AvatarFallback>
                  {event?.host?.firstName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  Hosted by {event?.host?.firstName || "Unknown"}{" "}
                  {event?.host?.lastName || ""}
                </h3>
                <p className="text-sm text-gray-500">
                  3 years hosting{" "}
                  {event?.host?.profileSetup ? "· Verified Host" : ""}
                </p>
              </div>
            </Link>
          </div>

          <p className="py-5">
            {event?.description || "No description available."}
          </p>
          <h3 className="text-lg font-semibold mb-2">About this place</h3>
          <ul className="space-y-1 text-gray-700 text-sm">
            {event?.features && event?.features.length > 0 ? (
              event.features.map((feature) => (
                <li key={feature._id || feature.text}>{feature.text}</li>
              ))
            ) : (
              <li>No features listed</li>
            )}
          </ul>
          <h3 className="text-xl font-bold">Where you'll be</h3>
          <p>
            {event?.street || "N/A"}, {event?.city || "N/A"},{" "}
            {event?.state || "N/A"}, {event?.country || "N/A"}
          </p>
          <MapWithDirectionButton
            lat={event?.location?.lat || 0}
            lng={event?.location?.lng || 0}
          />
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
              <Button
                onClick={handleSubmitReview}
                className="bg-button text-white"
              >
                Submit Review
              </Button>
            </div>
            {reviews.length === 0 && (
              <p className="text-gray-600">No reviews yet.</p>
            )}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 bg-white rounded-lg shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.user?.image || ""} />
                      <AvatarFallback>
                        {review.user?.username?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {review.user?.username || "User"}
                      </p>
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

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="p-6">
          <h1 className="text-center">Create a new account to book tickets</h1>
          <Button variant="outline" className="w-full mt-5" onClick={() => {}}>
            <img
              src="https://img.icons8.com/color/24/000000/google-logo.png"
              alt="Google Logo"
              className="mr-2"
            />
            Login with Google
          </Button>
          <Button variant="outline" className="w-full mt-3" onClick={() => {}}>
            <img
              src="https://img.icons8.com/color/24/000000/email.png"
              alt="Email Logo"
              className="mr-2"
            />
            Signup with Email
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Eventpage;
