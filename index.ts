import env from "./src/utils/env";
import app from "./src/app";

const PORT = env.PORT || 5001;

app.listen(PORT, () => {
    console.log("server is running on port " + PORT)
})