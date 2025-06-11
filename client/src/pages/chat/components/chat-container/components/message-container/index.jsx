import { apiClient } from "@/lib/api-client";
import { useStore } from "@/store";
import {
  GET_ALL_MESSAGES,
  GET_CHANNEL_MESSAGES_ROUTES,
  HOST,
} from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoArrowDownCircleOutline, IoClose } from "react-icons/io5";
import { getColor } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    userInfo,
  } = useStore();

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES_ROUTES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (
      selectedChatType === "contact" &&
      selectedChatData &&
      selectedChatData._id
    ) {
      getMessages();
    } else if (selectedChatType === "channel") {
      getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|tiff|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const checkVideo = (filePath) => {
    if (!filePath) return false;
    const videoRegex = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv|3gp|m4v)$/i;
    return videoRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
  };

  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center my-4 md:my-6">
              <div className="inline-block bg-slate-700/50 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full border border-slate-600/30">
                <span className="text-slate-300 text-xs md:text-sm font-medium">
                  {moment(message.timestamp).format("LL")}
                </span>
              </div>
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    const isOwnMessage = message.sender !== selectedChatData._id;

    return (
      <div
        className={`flex mb-3 md:mb-4 ${
          isOwnMessage ? "justify-end" : "justify-start"
        } px-2 md:px-4`}
      >
        <div
          className={`flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[60%] ${
            isOwnMessage ? "items-end" : "items-start"
          }`}
        >
          {message.messageType === "text" && (
            <div
              className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl shadow-md transition-all duration-200 break-words ${
                isOwnMessage
                  ? "bg-[#8417ff] text-white rounded-br-md"
                  : "bg-[#2a2b33] text-white/90 border border-[#ffffff]/10 rounded-bl-md"
              }`}
            >
              <div className="text-sm md:text-base leading-relaxed">
                {message.content}
              </div>
            </div>
          )}

          {message.messageType === "file" && (
            <div
              className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl shadow-md transition-all duration-200 break-words ${
                isOwnMessage
                  ? "bg-[#8417ff] text-white rounded-br-md"
                  : "bg-[#2a2b33] text-white/90 border border-[#ffffff]/10 rounded-bl-md"
              }`}
            >
              {checkImage(message.fileUrl) ? (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowImage(true);
                    setImageUrl(message.fileUrl);
                  }}
                >
                  <img
                    src={`${HOST}/${message.fileUrl}`}
                    loading="lazy"
                    alt="sent-img"
                    height={200}
                    width={200}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <span className="text-white/80 text-3xl bg-black/70 rounded-full p-3">
                    <MdFolderZip />
                  </span>
                  <span>{message.fileUrl.split("/").pop()}</span>
                  <span
                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer duration-300"
                    onClick={() => downloadFile(message.fileUrl)}
                  >
                    <IoArrowDownCircleOutline />
                  </span>
                </div>
              )}
            </div>
          )}

          {message.messageType === "audio" && (
            <div
              className={`p-3 md:p-4 rounded-2xl shadow-md transition-all duration-200 min-w-[200px] sm:min-w-[250px] ${
                isOwnMessage
                  ? "bg-[#8417ff] text-white rounded-br-md"
                  : "bg-[#2a2b33] text-white/90 border border-[#ffffff]/10 rounded-bl-md"
              }`}
            >
              <audio
                controls
                className="w-full h-8 md:h-10 rounded-lg"
                style={{
                  filter: isOwnMessage ? "invert(1) brightness(0.8)" : "none",
                }}
              >
                <source
                  src={
                    message.fileUrl.startsWith("data:audio") // <-- this checks base64 directly
                      ? message.fileUrl
                      : `${HOST}/${message.fileUrl}`
                  }
                  type="audio/webm"
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div
            className={`text-xs text-gray-400 mt-1 px-2 ${
              isOwnMessage ? "text-right" : "text-left"
            }`}
          >
            {moment(message.timestamp).format("LT")}
          </div>
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    const isOwnMessage = message.sender._id === userInfo.id;

    return (
      <div
        className={`flex mb-3 md:mb-4 ${
          isOwnMessage ? "justify-end" : "justify-start"
        } px-2 md:px-4`}
      >
        <div
          className={`flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[60%] ${
            isOwnMessage ? "items-end" : "items-start"
          }`}
        >
          {/* Avatar and Sender Name (for other users) */}
          {!isOwnMessage && (
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="w-8 h-8">
                {message.sender?.image ? (
                  <AvatarImage
                    src={`${HOST}/${message.sender.image}`}
                    alt="user-img"
                  />
                ) : (
                  <AvatarFallback
                    className={getColor(message.sender?.color || "purple")}
                  >
                    {message.sender?.firstName?.[0] || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-xs text-slate-400 font-medium">
                {message.sender?.firstName ||
                  message.sender?.email ||
                  "Unknown"}
              </span>
            </div>
          )}

          {/* Text Message */}
          {message.messageType === "text" && (
            <div
              className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl shadow-md transition-all duration-200 break-words ${
                isOwnMessage
                  ? "bg-[#8417ff] text-white rounded-br-md"
                  : "bg-[#2a2b33] text-white/90 border border-[#ffffff]/10 rounded-bl-md"
              }`}
            >
              <div className="text-sm md:text-base leading-relaxed">
                {message.content}
              </div>
            </div>
          )}

          {/* File Message */}
          {message.messageType === "file" && (
            <div
              className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl shadow-md transition-all duration-200 break-words ${
                isOwnMessage
                  ? "bg-[#8417ff] text-white rounded-br-md"
                  : "bg-[#2a2b33] text-white/90 border border-[#ffffff]/10 rounded-bl-md"
              }`}
            >
              {checkImage(message.fileUrl) ? (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowImage(true);
                    setImageUrl(message.fileUrl);
                  }}
                >
                  <img
                    src={`${HOST}/${message.fileUrl}`}
                    height={200}
                    width={200}
                    loading="lazy"
                    alt="sent-img"
                    className="rounded-lg max-w-full h-auto max-h-[200px]"
                  />
                </div>
              ) : checkVideo(message.fileUrl) ? (
                <div className="max-w-full">
                  <video
                    controls
                    className="rounded-lg max-w-full h-auto max-h-[200px]"
                  >
                    <source
                      src={`${HOST}/${message.fileUrl}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video element.
                  </video>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <span className="text-white/80 text-3xl bg-black/70 rounded-full p-3">
                    <MdFolderZip />
                  </span>
                  <span className="truncate">
                    {message.fileUrl.split("/").pop()}
                  </span>
                  <span
                    className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer duration-300"
                    onClick={() => downloadFile(message.fileUrl)}
                  >
                    <IoArrowDownCircleOutline />
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Audio Message */}
          {message.messageType === "audio" && (
            <div
              className={`p-3 md:p-4 rounded-2xl shadow-md transition-all duration-200 min-w-[200px] sm:min-w-[250px] ${
                isOwnMessage
                  ? "bg-[#8417ff] text-white rounded-br-md"
                  : "bg-[#2a2b33] text-white/90 border border-[#ffffff]/10 rounded-bl-md"
              }`}
            >
              <audio
                controls
                className="w-full h-8 md:h-10 rounded-lg"
                style={{
                  filter: isOwnMessage ? "invert(1) brightness(0.8)" : "none",
                }}
              >
                <source
                  src={
                    message.fileUrl.startsWith("data:audio") // <-- this checks base64 directly
                      ? message.fileUrl
                      : `${HOST}/${message.fileUrl}`
                  }
                  type="audio/webm"
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-xs text-gray-400 mt-1 px-2 ${
              isOwnMessage ? "text-right" : "text-left"
            }`}
          >
            {moment(message.timestamp).format("LT")}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
      </div>

      <div className="relative h-full">
        {selectedChatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center space-y-3 md:space-y-4">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-slate-700/30 rounded-full flex items-center justify-center border border-slate-600/30">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-slate-300 text-base md:text-lg font-semibold mb-2">
                  Start the conversation
                </h3>
                <p className="text-slate-400 text-sm max-w-xs md:max-w-sm mx-auto">
                  Send a message to begin chatting. You can send text messages
                  and voice notes.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 md:py-6">
            {renderMessage()}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      {showImage && (
        <div className="fixed z-[1000] inset-0 flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              alt="preview-img"
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
          <div className="flex gap-5 mt-5">
            <button
              onClick={() => downloadFile(imageUrl)}
              className="bg-black/50 p-3 text-2xl rounded-full hover:bg-black/70"
            >
              <IoArrowDownCircleOutline />
            </button>
            <button
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
              className="bg-black/50 p-3 text-2xl rounded-full hover:bg-black/70"
            >
              <IoClose />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
