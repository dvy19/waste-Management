const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();

app.use(express.json());

const connectDB = require('./src/config/db');
const http = require("http");

const {initializeSocket}=require('./socket')

const cookieParser = require("cookie-parser");

app.use(cookieParser)

const authRoutes=require('./src/routes/authRoutes')
const adminRoutes=require('./src/routes/adminRoutes')
const itemRoutes=require('./src/routes/itemRoutes')




const server=http.createServer(app)

initializeSocket(server)


app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.use("/api/user", authRoutes);
app.use('/api/admin' , adminRoutes);
app.use('/api/item' , itemRoutes)

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