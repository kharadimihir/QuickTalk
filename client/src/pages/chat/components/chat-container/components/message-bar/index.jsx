import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { FiMic } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { useStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTES } from "@/utils/constants";

const MessageBar = ({ disabled = false }) => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useStore();

  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  // Close emoji picker if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    };

    if (emojiPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerOpen]);

  // Initialize MediaRecorder on start recording
  const startRecording = async () => {
    console.log("Starting recording...");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Audio recording not supported in your browser");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setAudioChunks([]);

      recorder.ondataavailable = (e) => {
        setAudioChunks((prev) => [...prev, e.data]);
      };

      recorder.onstop = async () => {
        console.log("Recording stopped. Preparing to send audio message...");
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;

          if (!socket) return;

          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              recipient: selectedChatData._id,
              messageType: "audio",
              fileUrl: base64Audio,
              content: "",
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              channelId: selectedChatData._id,
              messageType: "audio",
              fileUrl: base64Audio,
              content: "",
            });
          }
        };
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert("Could not access microphone");
    }
  };

  // Stop recording and trigger sending
  const stopRecording = () => {
    console.log("Stopping recording...");
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!socket) {
      console.warn("Socket is not connected yet.");
      return;
    }
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
      setMessage("");
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const onEmojiClick = () => {
    setEmojiPickerOpen((prev) => !prev);
  };

  const handleEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const onAttachment = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTES, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1c1d25] border-t border-gray-700 p-[9.2px]">
      <form
        onSubmit={handleSubmit}
        className="flex items-end space-x-3 max-w-4xl mx-auto"
      >
        {/* Attachment Button */}
        <button
          type="button"
          onClick={onAttachment}
          className="flex-shrink-0 p-3 text-gray-400 cursor-pointer hover:text-white hover:bg-gray-700 rounded-full transition-all duration-200 disabled:opacity-50"
          disabled={disabled}
        >
          <GrAttachment className="w-5 h-5" />
        </button>

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />

        {/* Message Input Container */}
        <div className="flex-1 relative">
          <div className="flex items-end bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-purple-300 transition-colors duration-200">
            <textarea
              className="flex-1 p-4 bg-transparent text-white placeholder-gray-400 border-none outline-none resize-none max-h-32 min-h-[52px] rounded-2xl"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              rows="1"
              style={{
                height: "auto",
                minHeight: "52px",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />

            {/* Emoji Button */}
            <button
              type="button"
              onClick={onEmojiClick}
              className="flex-shrink-0 p-3 text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors duration-200 disabled:opacity-50"
              disabled={disabled}
            >
              <RiEmojiStickerLine className="w-5 h-5" />
            </button>
            <div ref={emojiRef} className="absolute bottom-16 right-0">
              <EmojiPicker
                theme="dark"
                open={emojiPickerOpen}
                onEmojiClick={handleEmoji}
                autoFocusSearch={false}
              />
            </div>
          </div>
        </div>

        {/* Send/Voice Button */}
        {message.trim() ? (
          <button
            type="submit"
            className="flex-shrink-0 p-3 bg-purple-600 cursor-pointer hover:bg-purple-700 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
            disabled={disabled}
          >
            <IoSend className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleVoiceRecord}
            disabled={disabled}
            className={`flex-shrink-0 p-3 cursor-pointer rounded-full transition-all duration-200 shadow-lg ${
              isRecording
                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse hover:shadow-red-500/25"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white hover:shadow-gray-500/25"
            }`}
          >
            <FiMic className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageBar;
