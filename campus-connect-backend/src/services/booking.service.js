import Booking from "../models/Booking.model.js";

export const createBooking = (data) => Booking.create(data);
export const getBookings = () => Booking.find().populate("resource user");
export const cancelBooking = (id) => Booking.findByIdAndDelete(id);
