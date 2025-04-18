const mongoose = require('mongoose');

const ticketBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketsBooked: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true },
  bookingStatus: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['on-hold', 'released', 'refunded'], default: 'on-hold' },
  refundStatus: { type: String, enum: ['requested', 'processed', 'none'], default: 'none' }, 
  qrCode: { type: String },
  adminFeePercentage: { type: Number, default: 4 },
  hostPayoutStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  isCheckedIn: { type: Boolean, default: false },
  transactionId: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Host', required: true },
  platformFee: { type: Number, default: 4 }, 
  bookedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const TicketBooking = mongoose.model('TicketBooking', ticketBookingSchema);
module.exports = TicketBooking;
