import mongoose ,  { ConnectOptions } from "mongoose";
import env from "../utils/env";

const connectToDb = async () => {
    try {
        const options: ConnectOptions = {
            //useNewUrlParser: true,
        };

        const connection = await mongoose.connect(env.MONGO_URI, options);

        console.log(`Connected to database ${connection.connections[0].name}`);
    } catch (err) {
        console.error(err);
    }
};

export default connectToDb;

