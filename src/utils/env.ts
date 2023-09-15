import {cleanEnv, str} from "envalid";
import { port } from "envalid/dist/validators"
import "dotenv/config";
export default cleanEnv( process.env, {
    PORT: port(),
    MONGO_URI: str(),
    URI: str()
})