import User from "../models/User.js";
import fs from 'fs';
import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

// Change Role to Owner
export const ChangeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" });
        res.json({ success: true, message: "Now you have access to list your Car" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Api to list a car
export const addCar = async (req, res) => {
    let tempFilePath = null;
    try {
        const { _id } = req.user;
        let car = typeof req.body.carData === 'string' ? JSON.parse(req.body.carData) : req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: "Please upload an image" });
        }

        tempFilePath = imageFile.path;
        const fileBuffer = fs.readFileSync(imageFile.path);

        // Upload image to ImageKit (v7 expects base64 string, stream, or File; base64 avoids buffer-type mismatch)
        const uploadFn = (imagekit.files && typeof imagekit.files.upload === 'function') 
            ? imagekit.files.upload.bind(imagekit.files) 
            : (typeof imagekit.upload === 'function' ? imagekit.upload.bind(imagekit) : null);

        if (!uploadFn) {
            throw new Error("ImageKit upload service not initialized");
        }

        const response = await uploadFn({
            file: fileBuffer.toString('base64'),
            fileName: imageFile.originalname,
            folder: "/cars"
        });

        // Delete temporary upload file immediately after successful upload
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
                tempFilePath = null;
            } catch (cleanupErr) {
                console.log("Could not delete temp file:", cleanupErr.message);
            }
        }

        let optimizationImageUrl = "";
        try {
            if (imagekit.helper && typeof imagekit.helper.buildSrc === 'function') {
                optimizationImageUrl = imagekit.helper.buildSrc({
                    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/878xsv9mz4',
                    src: response.filePath || response.name,
                    transformation: [
                        { width: 1280 },
                        { quality: 'auto' },
                        { format: 'webp' },
                    ],
                });
            }
        } catch (helperErr) {
            console.log("Could not build optimized URL:", helperErr.message);
        }

        const image = optimizationImageUrl || response.url;

        // Normalize fields if needed
        const price_per_day = car.price_per_day || car.pricePerDay;

        const newCar = await Car.create({
            ...car,
            price_per_day,
            image,
            owner: _id
        });

        res.json({ success: true, message: "Car added successfully", car: newCar });
    } catch (error) {
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
            } catch (cleanupErr) {
                console.log("Could not delete temp file on error:", cleanupErr.message);
            }
        }
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get cars listed by current owner
export const getOwnerCars = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id }).sort({ createdAt: -1 });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Toggle car availability
export const toggleCarAvailability = async (req, res) => {
    try {
        const { carId } = req.body;
        const { _id } = req.user;
        const car = await Car.findOne({ _id: carId, owner: _id });
        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        car.availability_status = !car.availability_status;
        await car.save();
        res.json({ success: true, message: "Availability updated", availability_status: car.availability_status });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete car
export const deleteCar = async (req, res) => {
    try {
        const { carId } = req.body;
        const { _id } = req.user;
        const car = await Car.findOneAndDelete({ _id: carId, owner: _id });
        if (!car) {
            return res.json({ success: false, message: "Car not found or unauthorized" });
        }
        res.json({ success: true, message: "Car deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get owner bookings
export const getOwnerBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ owner: _id })
            .populate('car')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Update booking status (confirmed/cancelled)
export const changeBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        const { _id } = req.user;
        const booking = await Booking.findOne({ _id: bookingId, owner: _id });
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }
        booking.status = status;
        await booking.save();
        res.json({ success: true, message: `Booking status updated to ${status}` });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get owner dashboard stats
export const getDashboardData = async (req, res) => {
    try {
        const { _id } = req.user;
        const totalCars = await Car.countDocuments({ owner: _id });
        const allBookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });
        const totalBookings = allBookings.length;
        const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
        const completedBookings = allBookings.filter(b => b.status === 'confirmed').length;
        const recentBookings = allBookings.slice(0, 5);
        const monthlyRevenue = allBookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + (b.price || 0), 0);

        res.json({
            success: true,
            dashboardData: {
                totalCars,
                totalBookings,
                pendingBookings,
                completedBookings,
                recentBookings,
                monthlyRevenue
            }
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
