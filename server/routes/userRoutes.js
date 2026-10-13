import express from "express";
import { 
    loginUser, 
    registerUser, 
    getUserData,
    getAllCars,
    getCarById,
    bookCar,
    getMyBookings
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserData);
userRouter.get('/cars', getAllCars);
userRouter.get('/cars/:id', getCarById);
userRouter.post('/book', protect, bookCar);
userRouter.get('/my-bookings', protect, getMyBookings);

export default userRouter;

