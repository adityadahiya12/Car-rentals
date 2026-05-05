import Booking from "../models/Booking.js";
import Car from "../models/Car.js";


// ✅ Check if car is available between dates
const checkAvailability = async (carId, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate },
    status: { $ne: "cancelled" } // ignore cancelled bookings
  });

  return bookings.length === 0;
};


// ✅ Get available cars
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    if (!location || !pickupDate || !returnDate) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    const cars = await Car.find({ location, isAvailable: true });

    const availableCars = [];

    for (const car of cars) {
      const isAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );

      if (isAvailable) {
        availableCars.push(car);
      }
    }

    res.json({ success: true, cars: availableCars });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// ✅ Create booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    if (!car || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    // ❗ Validation
    if (picked >= returned) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pickup date"
      });
    }

    if (picked < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Pickup date cannot be in past"
      });
    }

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Car not available for selected dates"
      });
    }

    const carDetails = await Car.findById(car);

    if (!carDetails) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    // ✅ Calculate total days
    const noOfDays = Math.ceil(
      (returned - picked) / (1000 * 60 * 60 * 24)
    );

    const price = carDetails.price_per_day * noOfDays;

    await Booking.create({
      car,
      owner: carDetails.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
      status: "pending"
    });

    res.json({
      success: true,
      message: "Booking created successfully"
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// ✅ User bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ✅ Owner bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car")
      .populate({
        path: "user",
        select: "-password"
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// ✅ Change booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.json({
        success: false,
        message: "Missing bookingId or status"
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      message: "Booking status updated successfully"
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};