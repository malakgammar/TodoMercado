import message from "../model/messageModel.js";

export const create = async (req, res) => {
    console.log("Received data:", req.body); 
    try {
        const messageData = new message(req.body);
        const savedmessage = await messageData.save();
        res.status(200).json(savedmessage);
    } catch (error) {
        console.error("Error saving message:", error); 
        res.status(500).json({ error: "Internal Server Error." });
    }
};

export const fetch = async (req, res) => {
    try {
        const messages = await message.find();
        
        if (messages.length === 0) {
            return res.status(404).json({ message: "Messages not found." });
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);

        res.status(500).json({ error: "Internal Server Error." });
    }
};