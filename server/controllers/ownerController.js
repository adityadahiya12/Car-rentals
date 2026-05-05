import User from "../models/User.js";
import Booking from "../models/Booking.js";
import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";
import winston from "winston";

// Logger configuration
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

// ✅ Add Car API
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;

    let car;
    try {
      car = JSON.parse(req.body.carData);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON in carData"
      });
    }

    if (!car || typeof car !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid car data"
      });
    }

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    const response = await imagekit.upload({
      file: imageFile.buffer,
      fileName: imageFile.originalname,
      folder: "/cars"
    });

    const optimizeImage =
      req.body.optimizeImage === "true" ||
      req.body.optimizeImage === true;

    const image = optimizeImage
      ? imagekit.url({
          path: response.filePath,
          transformation: [
            { width: 1280 },
            { quality: "auto" },
            { format: "webp" }
          ]
        })
      : response.url;

    const newCar = await Car.create({
      ...car,
      price_per_day: Number(car.price_per_day),
      year: Number(car.year),
      seating_capacity: Number(car.seating_capacity),
      image,
      owner: _id
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car: newCar
    });

  } catch (error) {
    console.log(error);
    logger.error({ message: error.message, stack: error.stack });

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Change Role
export const ChangeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });

    res.json({
      success: true,
      message: "Now you have access to list cars"
    });

  } catch (error) {
    logger.error({ message: error.message, stack: error.stack });

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ Owner Cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });

    res.json({ success: true, cars });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Toggle Availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car || car.owner.toString() !== _id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized"
      });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({
      success: true,
      message: `Car is now ${car.isAvailable ? "available" : "unavailable"}`
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Delete Car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ HARD DELETE (REAL FIX)
    await Car.findByIdAndDelete(carId);

    res.json({
      success: true,
      message: "Car deleted successfully",
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Dashboard
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({
        success: false,
        message: "Unauthorized"
      });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id }).populate("car");

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === "pending").length,
      completedBookings: bookings.filter(b => b.status === "confirmed").length,
      recentBookings: bookings.slice(-3).reverse(),
      monthlyRevenue: bookings
        .filter(b => b.status === "confirmed")
        .reduce((acc, b) => acc + b.price, 0)
    };

    res.json({ success: true, dashboardData });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ FIXED Image Upload API
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({
        success: false,
        message: "No image uploaded"
      });
    }

    // ✅ FIX: use buffer (NOT fs, NOT path)
    const response = await imagekit.upload({
      file: imageFile.buffer,
      fileName: imageFile.originalname,
      folder: "/users"
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" }
      ]
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });

    res.json({
      success: true,
      message: "Profile image updated successfully",
      image: optimizedImageUrl
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};