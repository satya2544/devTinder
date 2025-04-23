const express = require("express");
const { userAuth } = require("../middleware/auth");
const { Chat } = require("../models/chat");


const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    const { targetUserId } = req.params;

    const userId = req.user._id;
    try {

       let chat = await Chat.findOne({
          participants:{ $all: [userId, targetUserId]}
       }).populate({
        path: "messages.SenderId",
        model: "User", 
        select: "firstName lastName"
      });
       if(!chat) {
        chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
        });
        await chat.save(); 
       } 
       console.log("Populated messages:", chat.messages.map(m => m.SenderId));
       res.json(chat);

    }
    catch (err){
        console.error("Error fetching chat:", err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
})

module.exports = chatRouter;