let io;

const initializeSocket = (server) => {

    const { Server } = require("socket.io");

    io = new Server(server, {
        cors: {
             origin: [
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:4173"
                ],
            methods: ["GET", "POST"],
            credentials: true,
            autoConnect:true
        }
    });

    io.on("connection", (socket) => {

        console.log("Socket connected:", socket.id);
        console.log("✅ Socket connected:", socket.id);

        socket.on("joinAdminRoom", (adminId) => {

            const roomName = `admin_${adminId}`;

            socket.join(roomName);

            console.log(`Admin joined room: ${roomName}`);
        });

        socket.on("disconnect", () => {

            console.log(
                "Socket disconnected:",
                socket.id
            );
        });

    });

};

const getIO = () => {

    if (!io) {
        throw new Error("Socket.IO not initialized");
    }

    return io;
};

module.exports = {
    initializeSocket,
    getIO
};