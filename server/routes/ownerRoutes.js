import express from 'express';
import { addCar,ChangeRoleToOwner,deleteCar,getOwnerCars,toggleCarAvailability ,getDashboardData , updateUserImage } from '../controllers/ownerController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/multer.js';
 
const ownerRouter = express.Router();


ownerRouter.post("/change-role", protect , ChangeRoleToOwner);
ownerRouter.post("/add-car", protect, upload.single('image'), addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.get("/dashboard", protect, getDashboardData);   
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);
ownerRouter.post("/delete-car", protect, deleteCar);
ownerRouter.post('/update-image', upload.single('image') , protect, updateUserImage )

export default ownerRouter;
