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
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
