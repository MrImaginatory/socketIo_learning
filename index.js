import express from "express";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
});


//socketIo server
const io = new Server(expressServer);

io.on("connection", (socket) => {
    console.log("A user connected",socket.id);


    socket.emit("serverMessage", {
        message:`test message from backend`,
        time: new Date().toLocaleTimeString()
    });

    socket.on("clientMessage", (msg) => {
        console.log(msg.message,' received at ',msg.time);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
