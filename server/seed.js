import "dotenv/config";
import connectDB from "./configs/db.js";
import User from "./models/User.js";
import Car from "./models/Car.js";
import bcrypt from "bcrypt";

const seedData = async () => {
    try {
        await connectDB();

        // 1. Check or create demo owner
        let owner = await User.findOne({ email: "admin@example.com" });
        if (!owner) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            owner = await User.create({
                name: "GreatStack Admin",
                email: "admin@example.com",
                password: hashedPassword,
                role: "owner"
            });
            console.log("Demo owner created: admin@example.com / admin123");
        } else {
            console.log("Demo owner exists:", owner.email);
        }

        // 2. Check if cars exist
        const carCount = await Car.countDocuments();
        if (carCount === 0) {
            const sampleCars = [
                {
                    owner: owner._id,
                    brand: "BMW",
                    model: "X5 Luxury",
                    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1280&q=80",
                    year: 2023,
                    category: "SUV",
                    seating_capacity: "5",
                    fuel_type: "Hybrid",
                    transmission: "Automatic",
                    price_per_day: 300,
                    availability_status: true,
                    location: "New York",
                    description: "The BMW X5 is a mid-size luxury SUV delivering power, comfort and supreme handling."
                },
                {
                    owner: owner._id,
                    brand: "Toyota",
                    model: "Corolla Touring",
                    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1280&q=80",
                    year: 2022,
                    category: "Sedan",
                    seating_capacity: "5",
                    fuel_type: "Diesel",
                    transmission: "Manual",
                    price_per_day: 130,
                    availability_status: true,
                    location: "Chicago",
                    description: "Renowned reliability and excellent fuel efficiency for daily drives and weekend getaways."
                },
                {
                    owner: owner._id,
                    brand: "Jeep",
                    model: "Wrangler Rubicon",
                    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1280&q=80",
                    year: 2024,
                    category: "SUV",
                    seating_capacity: "4",
                    fuel_type: "Hybrid",
                    transmission: "Automatic",
                    price_per_day: 200,
                    availability_status: true,
                    location: "Los Angeles",
                    description: "Iconic off-road capability matched with high-tech conveniences and open-air thrill."
                },
                {
                    owner: owner._id,
                    brand: "Mercedes-Benz",
                    model: "C-Class AMG",
                    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1280&q=80",
                    year: 2023,
                    category: "Sedan",
                    seating_capacity: "4",
                    fuel_type: "Petrol",
                    transmission: "Automatic",
                    price_per_day: 250,
                    availability_status: true,
                    location: "Houston",
                    description: "Cutting-edge design, refined driving dynamics, and executive luxury inside out."
                }
            ];

            await Car.insertMany(sampleCars);
            console.log("Successfully seeded 4 cars into database!");
        } else {
            console.log(`Database already has ${carCount} cars.`);
        }

        process.exit(0);
    } catch (err) {
        console.error("Seed error:", err);
        process.exit(1);
    }
};

seedData();
