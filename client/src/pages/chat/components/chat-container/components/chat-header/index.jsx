import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getColor } from "@/lib/utils";
import { useStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";
import { Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useStore();

  // ✅ Prevent crash on first render or missing data
  if (!selectedChatData) return null;

  const isContact = selectedChatType === "contact";
  const isChannel = selectedChatType === "channel";
  const avatarLetter =
    selectedChatData.firstName?.[0] || selectedChatData.email?.[0] || "?";

  return (
    <div className="h-16 md:h-20 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-full">
        {/* User Info Section */}
        <div className="flex gap-3 items-center min-w-0 flex-1">
          <div className="relative">
            {isContact ? (
              <Avatar className="w-10 h-10 md:w-12 md:h-12 ring-2 ring-slate-600 hover:ring-purple-500/50 transition-all duration-200">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback
                  className={`text-sm md:text-lg font-medium ${getColor(
                    selectedChatData.color
                  )}`}
                >
                  {avatarLetter}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full flex-shrink-0">
                <span className="text-sm md:text-base font-medium">#</span>
              </div>
            )}

            {/* Online Status Indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="font-semibold text-slate-100 text-sm md:text-base truncate">
              {isChannel
                ? selectedChatData.name || "Unnamed Channel"
                : selectedChatData.firstName
                ? `${selectedChatData.firstName} ${
                    selectedChatData.lastName || ""
                  }`
                : selectedChatData.email || "Unknown Contact"}
            </div>
            <div className="text-xs text-green-400 font-medium hidden sm:block">
              Online • Last seen recently
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={closeChat}
            className="h-9 w-9 p-0 hover:bg-red-500/10 cursor-pointer hover:text-red-400 text-slate-400 transition-all duration-200"
          >
            <RiCloseFill className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
