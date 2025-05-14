const socket = io()

socket.on("connect", () => {

    console.log("A Client connected at frontend with id:",socket.id);

    socket.on("serverMessage", (msg) => {
        console.log(msg.message,' received at ',msg.time);
        
    });

    socket.emit("clientMessage", {
        message:`test message from frontend`,
        time: new Date().toLocaleTimeString()
    });

});

