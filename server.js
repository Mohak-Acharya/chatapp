require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connection ERROR : ${err.message}`);
});

mongoose.connection.once("open", () => {
  console.log("Mongoose connected !");
});

// Importing all the models
require("./models/Users");
require("./models/Message");
require("./models/ChatRoom");

const app = require("./app");
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const io = require("socket.io")(server);
const jwt = require("jwt-then");
const Message = mongoose.model("Message");
const User = mongoose.model("User");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;

    const payload = await jwt.verify(token, process.env.SECRET);

    socket.userId = payload.id;

    next();
  } catch (err) {}
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.userId}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.userId}`);
  });

  socket.on("joinroom", ({ chatRoomId }) => {
    socket.join(chatRoomId);
    console.log("A user joined the chatroom");
  });

  socket.on("leaveroom", ({ chatRoomId }) => {
    socket.leave(chatRoomId);
    console.log("A user left the chatroom");
  });

  socket.on("sendmessage", async ({ chatRoomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        message,
      });

      io.to(chatRoomId).emit("newMessage", {
        message,
        name: user.name,
        userId: socket.userId,
      });

      await newMessage.save();
    }
  });
});
