const mongoose = require("mongoose");
const ChatRoom = mongoose.model("ChatRoom");

exports.create = async (req, res) => {
  const { name } = req.body;

  const nameRegex = /^[A-Za-z0-9\s]+$/;

  if (!nameRegex.test(name))
    throw "Chat room can only have alphabets and spaces";

  const chatExists = await ChatRoom.findOne({ name });
  if (chatExists)
    throw "ChatRoom with this name already exists. Try a different name";

  const chat = new ChatRoom({ name });

  await chat.save();

  res.status(200).json({
    message: `Chatroom ${name} created!`,
  });
};
