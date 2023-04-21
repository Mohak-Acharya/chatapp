const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({

    chatRoom : {
        type: mongoose.Schema.Types.ObjectId,
        required : 'ChatRoom ID is required',
        ref : 'ChatRoom'
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required : 'User is required',
        ref : 'User'
    },

    message : {
        type: String,
        required : "Message should be not null"
    }

})

module.exports = mongoose.model("Message", messageSchema)