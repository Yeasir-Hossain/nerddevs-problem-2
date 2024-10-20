import { connect, set } from 'mongoose';

set("allowDiskUse", true);
set("strictPopulate", false);
set("strictQuery", true);

export default function connectToDB() {
    return new Promise((resolve, reject) => {
        connect(process.env.MONGODB_URI!)
            .then(() => resolve("=> Connected to MongoDB"))
            .catch((err) => reject(err));
    });
};