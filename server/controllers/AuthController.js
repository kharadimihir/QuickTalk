import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const { sign } = jwt;
const createToken = (email, userId) => {
  const token = sign(
    {
      email,
      userId,
    },
    process.env.JWT_KEY,
    {
      expiresIn: maxAge / 1000,
    }
  );
  return token;
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    if (!password || !email) {
      return res.status(400).send("Email and password is required");
    }

    const user = await User.create({ email, password, fullName });
    const token = createToken(email, user.id);

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("token", token, {
      maxAge,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).send("Email and password is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not find with given email");
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).send("Incorrect Password");
    }

    res.cookie("token", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const id = req.userId;
    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).send("User not found");
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName || !color) {
      return res.status(400).send("All fields are required");
    }

    let imagePath;
    if (req.file) {
      const date = Date.now();
      imagePath = `uploads/profiles/${date}-${req.file.originalname}`;
      renameSync(req.file.path, imagePath);
    }

    const updateData = {
      firstName,
      lastName,
      color,
      profileSetup: true,
    };

    if (imagePath) {
      updateData.image = imagePath;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    return res.status(200).json({
      id: updatedUser.id,
      email: updatedUser.email,
      profileSetup: updatedUser.profileSetup,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      image: updatedUser.image,
      color: updatedUser.color,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return res.status(200).send("Profile image removed successfully.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const logOut = async (req, res, next) => {
  try {
    res.cookie("token", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).send("Logout successfull.");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
