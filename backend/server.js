const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();

app.use(cors());
app.use(express.json());

const connectDB = require('./src/config/db');
const http = require("http");

const authRoutes=require('./src/routes/authRoutes')

const cookieParser = require("cookie-parser");

const server=http.createServer(app)


app.get("/", (req, res) => {
    res.send("Server is running");
});


app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    function startIt(){
        console.log(`Server running on port ${PORT}`);
    }

    // after success, the 2nd argument function will run
    server.listen(PORT, startIt);
};

startServer();