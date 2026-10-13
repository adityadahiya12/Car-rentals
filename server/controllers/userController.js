import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

// Generate JWT Token 
const generateToken = (userId) => {
    if (!userId) throw new Error('Missing userId when generating token');
    const payload = { userId };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Fill all the fields" });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = generateToken(user._id.toString());
        res.json({ 
            success: true, 
            token, 
            user: { _id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Login User 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
        const token = generateToken(user._id.toString());
        res.json({ 
            success: true, 
            token, 
            user: { _id: user._id, name: user.name, email: user.email, role: user.role } 
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get user data using token (JWT)
export const getUserData = async (req, res) => {
    try {
        const { user } = req;
        res.json({ success: true, user });        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get all cars (public)
export const getAllCars = async (req, res) => {
    try {
        const cars = await Car.find({ availability_status: true }).sort({ createdAt: -1 });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get single car details (public)
export const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findById(id).populate('owner', 'name email');
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        res.json({ success: true, car });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Create a booking (protected)
export const bookCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId, pickupDate, returnDate } = req.body;

        if (!carId || !pickupDate || !returnDate) {
            return res.json({ success: false, message: "All booking details are required" });
        }

        const car = await Car.findById(carId);
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }

        const start = new Date(pickupDate);
        const end = new Date(returnDate);
        const timeDiff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        const price = (car.price_per_day || car.pricePerDay || 100) * timeDiff;

        const booking = await Booking.create({
            car: car._id,
            user: _id,
            owner: car.owner,
            pickupDate: start,
            returnDate: end,
            price,
            status: 'confirmed'
        });

        res.json({ success: true, message: "Car booked successfully", booking });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get current user's bookings (protected)
export const getMyBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id }).populate('car').sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};