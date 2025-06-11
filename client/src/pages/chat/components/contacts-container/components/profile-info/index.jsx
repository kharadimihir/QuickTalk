import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { getColor } from "@/lib/utils";
import { useStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useStore();
  const navigate = useNavigate();

  const logOut = async () => {
    try {
      const response = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TooltipProvider>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-3 md:p-4 mx-1 md:mx-2">
          <div className="flex gap-2 md:gap-3 items-center min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <Avatar className="w-10 h-10 md:w-11 md:h-11 ring-2 ring-slate-600 hover:ring-purple-500/50 transition-all duration-200">
                {userInfo.image && (
                  <AvatarImage
                    src={`${HOST}/${userInfo.image}`}
                    alt="profile"
                    className="object-cover"
                  />
                )}
                <AvatarFallback
                  className={`text-sm font-medium ${getColor(userInfo.color)}`}
                >
                  {userInfo.firstName
                    ? userInfo.firstName.charAt(0)
                    : userInfo.email.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-slate-100 text-sm truncate">
                {userInfo.firstName && userInfo.lastName
                  ? `${userInfo.firstName} ${userInfo.lastName}`
                  : userInfo.email}
              </div>
              <div className="text-xs text-green-400 font-medium hidden sm:block">
                Online
              </div>
            </div>
          </div>

          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="h-8 w-8 p-0 hover:bg-slate-700/50 cursor-pointer hover:text-purple-400 text-slate-400"
                >
                  <FiEdit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200">
                Edit Profile
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logOut}
                  className="h-8 w-8 p-0 hover:bg-red-500/10 cursor-pointer hover:text-red-400 text-slate-400"
                >
                  <IoPowerSharp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200">
                Logout
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProfileInfo;
