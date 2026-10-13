import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/car-rental";
    let connectionString = uri;

    if (!uri.includes('car-rental')) {
        if (uri.includes('?')) {
            const [base, query] = uri.split('?');
            const cleanBase = base.endsWith('/') ? base : base + '/';
            connectionString = `${cleanBase}car-rental?${query}`;
        } else {
            const cleanBase = uri.endsWith('/') ? uri : uri + '/';
            connectionString = `${cleanBase}car-rental`;
        }
    }

    try {
        await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 3000 });
        console.log("Database Connected to MongoDB Atlas!!");
    } catch (clusterErr) {
        console.log("Primary MongoDB connection unavailable, connected to local MongoDB instance.");
        try {
            await mongoose.connect("mongodb://127.0.0.1:27017/car-rental");
            console.log("Database Connected to local MongoDB!!");
        } catch (localErr) {
            console.error("Local MongoDB connection also failed:", localErr.message);
        }
    }

    mongoose.connection.on('error', (err) => {
        console.log("Database Connection Error:", err.message);
    });
};

export default connectDB;