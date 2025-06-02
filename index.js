import express from 'express';
import { Server } from 'socket.io';
import {createServer} from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());

const server =  createServer(app);

app.use(express.static(path.join(__dirname,'public')));
app.get('/',(req,res)=>{
    res.send('Server is running');
})

const port = process.env.PORT || 3001;                                                                                                                                                                                                                                                                                                                                                                                                                                                   
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

const io = new Server(server);

io.on("connection",(socket)=>{
    // socket.broadcast.emit('newClient',socket.id); //sending new client to all clients except the one that connected
    console.log(`User connected: ${socket.id}`);
    
    //sending message
    socket.emit('welcomeMessage',`Welcome ${socket.id}`);

    //receiving message
    socket.on("message",(message)=>{
        console.log(`Message from ${socket.id}: ${message}`);
        // socket.emit('message',message);
    })

    //broadcasting message
    socket.broadcast.emit('broadcast_message',` ${socket.id} has joined the server `);

    socket.on("broadcastMessage",(message)=>{
        console.log(`Message from ${socket.id}: ${message}`);
        socket.broadcast.emit('broadcast_message',message);
    })

    socket.on("privateMessage",({to,message})=>{
        console.log(`Message from ${socket.id}: ${message}`);
        io.to(to).emit('private_message',{
            from:socket.id,
            message
        });
    })

    //disconnecting client
    socket.on("disconnect",()=>{
        console.log(`User disconnected: ${socket.id}`);
    })
})