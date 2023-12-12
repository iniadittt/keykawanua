import Express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import cors module
import db from "./config/Database.js";
import Uploadrouter from "./routes/uploadRoute.js";
import router from "./routes/userRoute.js";

import Photos_kawanua from './models/uploadModels.js'
import Species from './models/SpesiesModels.js'
import Users from './models/userModels.js'

Users.sync({ force: false })
Species.sync({ force: false })
Photos_kawanua.sync({ force: false })

const PORT = 5000;
const app = Express();
dotenv.config();

try {
    await db.authenticate();
    console.log("Database conected");
} catch (error) {
    console.error(error)
}

app.use(cors());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(router);
app.use(Uploadrouter)

app.use((req, res, next) => {
    req.refresh_token = req.body.refreshToken; // Adjust based on how you send the refresh token
    next();
});


app.listen(PORT, () => {
    console.log(`server berhasil diruning ${PORT}`);
});