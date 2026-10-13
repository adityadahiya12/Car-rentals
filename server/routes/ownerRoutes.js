import express from 'express';
import { 
    addCar, 
    ChangeRoleToOwner, 
    getOwnerCars, 
    toggleCarAvailability, 
    deleteCar, 
    getOwnerBookings, 
    changeBookingStatus, 
    getDashboardData 
} from '../controllers/ownerController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/multer.js';
 
const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, ChangeRoleToOwner);
ownerRouter.post("/add-car", protect, upload.single('image'), addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);
ownerRouter.post("/delete-car", protect, deleteCar);
ownerRouter.get("/bookings", protect, getOwnerBookings);
ownerRouter.post("/change-status", protect, changeBookingStatus);
ownerRouter.get("/dashboard", protect, getDashboardData);

export default ownerRouter;

