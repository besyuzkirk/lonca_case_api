import express from "express";
import cors from "cors"
import env from "./utils/env";

import connectToDb from "./database/mongoDb"
import orderRoute from "./routes/order.route";
import vendorRoute from "./routes/vendor.route";

const app: express.Application = express();
connectToDb()

app.use(express.json())
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello World!')
})

const corsOptions = {
    optionsSuccessStatus: 200,
    origin: env.URI || "http://localhost:3000",
};

app.use("/api/v1/order", cors(corsOptions), orderRoute);
app.use("/api/v1/vendor", cors(corsOptions), vendorRoute);

export default app
