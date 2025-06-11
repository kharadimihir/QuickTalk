import { useStore } from "@/store/index.js";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn, colors, getColor } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  HOST,
  REMOVE_PROFILE_IMAGE,
  UPDATE_PROFILE_INFO,
} from "@/utils/constants";
import { useEffect } from "react";
import { useRef } from "react";

const Profile = () => {
  const { userInfo, setUserInfo } = useStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }

    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required", {
        position: "top-center",
        duration: 2000,
      });
      return false;
    }

    if (!lastName) {
      toast.error("Last Name is required", {
        position: "top-center",
        duration: 2000,
      });
      return false;
    }
    return true;
  };

  const createProfile = async () => {
    if (validateProfile()) {
      try {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("color", selectedColor);
        if (imageFile) formData.append("profile-image", imageFile);

        const response = await apiClient.post(UPDATE_PROFILE_INFO, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile updated successfull", {
            position: "top-center",
            duration: 2000,
          });
          navigate("/chat");
        }
      } catch (error) {
        toast.error("Failed to save profile", { position: "top-center" });
        console.error(error);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully.", {
          position: "top-center",
        });
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (!userInfo) {
    return <div>Loading Data...</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">
            {userInfo.profileSetup
              ? "Edit Your Profile"
              : "Create Your Profile"}
          </h2>
          <p className="text-center text-sm text-gray-400">
            Personalize your chat experience
          </p>

          {/* Profile Image */}
          <div className="flex justify-center">
            <div
              onClick={() => {
                if (image) {
                  handleDeleteImage();
                }
              }}
              className="relative w-24 h-24 rounded-full border-2 border-gray-600 flex items-center justify-center cursor-pointer hover:border-white transition duration-300"
            >
              <Avatar className="w-24 h-24">
                {image && (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                )}
                <AvatarFallback
                  className={`uppercase text-4xl flex items-center justify-center w-full h-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName ? firstName.charAt(0) : userInfo.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    setImage(URL.createObjectURL(file));
                  }
                  e.target.value = null;
                }}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="mt-1 bg-gray-700 border-none"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="mt-1 bg-gray-700 border-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder={userInfo.email}
              type="email"
              readOnly
              className="mt-1 bg-gray-700 border-none text-gray-400"
            />
          </div>

          {/* Color Theme */}
          <div>
            <Label>Color Theme</Label>
            <p className="text-xs text-gray-400 mb-2">
              Choose a color theme for your chat experience
            </p>
            <div className="flex space-x-3">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={cn(
                    `${color} w-8 h-8 rounded-full cursor-pointer transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white`,
                    selectedColor === index && "outline outline-white/50"
                  )}
                ></button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={createProfile}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 cursor-pointer text-white font-semibold py-2 rounded-xl shadow-md"
          >
            {userInfo.profileSetup ? "Save Changes" : "Create Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
