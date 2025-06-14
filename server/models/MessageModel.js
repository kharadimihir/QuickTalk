import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    messageType: {
        type: String,
        enum: ["text", "file", "audio"],
        required: true
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
        },
    },
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file" || this.messageType === "audio";
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model("Messages", messageSchema);
export default Message;