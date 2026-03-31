import express from 'express';
import { addCar,ChangeRoleToOwner } from '../controllers/ownerController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/multer.js';
 
const ownerRouter = express.Router();


ownerRouter.post("/change-role", protect , ChangeRoleToOwner);
ownerRouter.post("/add-car", protect , upload.single('image') , protect,addCar );

export default ownerRouter;
