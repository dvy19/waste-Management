const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();



app.use(cors({
  origin: ["http://localhost:5173" , "http://localhost:5174" , "http://localhost:4173" ,"https://waste-manage-website.vercel.app/"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");


app.use(express.json());

const connectDB = require('./src/config/db');
const http = require("http");

const {initializeSocket}=require('./socket')

const cookieParser = require("cookie-parser");

app.use(cookieParser())

const { connectRedis } = require('./src/config/redis');

const authRoutes=require('./src/routes/authRoutes')
const adminRoutes=require('./src/routes/adminRoutes')
const itemRoutes=require('./src/routes/itemRoutes')
const rewardRoutes=require('./src/routes/rewardRoutes')

const centreRoutes=require("./src/routes/centreRoutes")



const server=http.createServer(app)

initializeSocket(server)


app.get("/", (req, res) => {
    res.send("Server is running");
});

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.use("/api/user", authRoutes);
app.use('/api/admin' , adminRoutes);
app.use('/api/item' , itemRoutes)
app.use('/api/centres' , centreRoutes)
app.use('/api/reward' , rewardRoutes)

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    await connectRedis();

    function startIt(){
        console.log(`Server running on port ${PORT}`);
    }

    // after success, the 2nd argument function will run
    server.listen(PORT, startIt);
};

startServer();