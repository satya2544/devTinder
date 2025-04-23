const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");


const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("Sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}



const initializeSocket = (server) =>{
    const io = socket(server, {
        cors: {
          origin: "http://localhost:5173"
        },
      });
      io.on("connection", (socket)=> {
        socket.on("joinChat", ({userId, targetUserId, firstName}) => {
            const roomId = getSecretRoomId(userId, targetUserId);

            console.log(firstName + " joinedroom :" + roomId)
            socket.join(roomId);
        });


        socket.on("sendMessage", async ({firstName, lastName, userId, targetUserId,text}) => {
         
            
            // save messages

            try {
                const roomId = getSecretRoomId(userId, targetUserId);
                console.log(firstName + " " + text);
                let chat = await Chat.findOne({ 
                 participants: { $all: [userId, targetUserId] },
               });

            if(!chat) {
                chat = new Chat({
                    participants: [userId, targetUserId],
                    messages: [],
                })
            }   

            chat.messages.push({
                SenderId: userId,
                text,
            });

            await chat.save();
            io.to(roomId).emit("messageReceived", {firstName,lastName, text});
            } catch (err){
              console.log(err)
            }





            // const sockets = io.sockets.adapter.rooms.get(roomId);
            // console.log(`📡 Sockets in room ${roomId}:`, sockets ? sockets.size : 0)
            // io.to(roomId).emit("messageReceived", {firstName, text});
            // console.log(firstName)
        });
        socket.on("disconnect", () => {});
      });
      
}

module.exports = initializeSocket;