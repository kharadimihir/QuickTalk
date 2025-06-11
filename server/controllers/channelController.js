import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    const admin = await User.findById(userId);
    if (!admin) return res.status(400).send("Admin user not found.");

    const uniqueMembers = [...new Set([...members, userId])];
    const validMembers = await User.find({ _id: { $in: uniqueMembers } });

    if (validMembers.length !== uniqueMembers.length) {
      const validIds = validMembers.map((u) => u._id.toString());
      const invalidIds = uniqueMembers.filter((id) => !validIds.includes(id));
      return res
        .status(400)
        .json({ error: "Some members are invalid.", invalidIds });
    }

    const newChannel = new Channel({
      name,
      members: uniqueMembers,
      admin: userId,
    });

    await newChannel.save();
    await newChannel.populate("admin members", "name email");

    return res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error.");
  }
};

export const getUserChannel = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate("admin", "name email")
      .populate("members", "name email");

    return res.status(200).json({ channels });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error.");
  }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });

    if (!channel) {
      return res.status(402).send("Channel not found.");
    }

    const messages = channel.messages;

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error.");
  }
};
