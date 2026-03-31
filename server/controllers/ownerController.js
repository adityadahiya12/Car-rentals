import User from "../models/User.js";
import fs from 'fs';
import imagekit from "../configs/imageKit.js";
import Car from "../models/Car.js";


// Change Role to Owner


export const ChangeRoleToOwner = async (req, res) => {

    try {
        const { _id}= req.user;
        await User.findByIdAndUpdate(_id , {role: "owner"})
        res.json({success:true , message: "Now you have access to list your Car"})
    }catch (error)
    {
        console.log(error.message);
        res.json({success: false, message:error.message})

    }


}

// Api to list a car
export const addCar = async(req,res)=>
{
    try {
        const {_id}= req.user;
        let car = JSON.parse(req.body.carData)
        const imageFile = req.file;

        const fileBuffer = fs.read(imageFile.path);

        // Upload image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/cars"

        });
        // optimization URL using transformation parameters in imagekit
const optimizationImageUrl = imagekit.helper.buildSrc({
  urlEndpoint: 'https://ik.imagekit.io/your_imagekit_id',
  path: response.filePath,
  transformation: [
    
      
      {width: 1280},
      {crop: 'maintain_ratio'},
      {quality: 'auto'}, // Automatic quality adjustment
      {format: 'webp'},
    
  ],
});
const image = optimizationImageUrl;
await Car.create({...car, image, owner: _id})
res.json({success:true , message: "Car added successfully"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message:error.message})
        
    }
}
