import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/store";
import { Search } from "lucide-react";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useStore();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        console.log(SEARCH_CONTACTS_ROUTES);
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              onClick={() => setOpenNewContactModel(true)}
              className="p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-all duration-200 group"
            >
              <FaPlus className="text-slate-400 text-sm group-hover:text-purple-400 transition-colors duration-200" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 w-[95vw] max-w-md mx-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-lg md:text-xl font-semibold text-center">
              Select a Contact
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center text-sm">
              Search and select someone to start a conversation
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search contacts..."
              className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>

          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px] md:h-[280px] pr-2 md:pr-4">
              <div className="space-y-2">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors duration-200 group"
                    onClick={() => selectNewContact(contact)}
                  >
                    <Avatar className="w-10 h-10 ring-2 ring-slate-700 group-hover:ring-purple-500/50 transition-all duration-200 flex-shrink-0">
                      {contact.image && (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback
                        className={`text-sm font-medium ${getColor(
                          contact.color
                        )}`}
                      >
                        {contact.firstName
                          ? contact.firstName.charAt(0)
                          : contact.email.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-100 truncate text-sm md:text-base">
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {contact.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {searchedContacts.length <= 0 && (
            <div className="flex flex-col items-center justify-center py-6 md:py-8 space-y-4">
              <Lottie
                isClickToPauseDisabled={true}
                height={80}
                width={80}
                options={animationDefaultOptions}
              />
              <div className="text-center space-y-2">
                <h3 className="text-base md:text-lg font-medium text-slate-200">
                  Hi<span className="text-purple-400">!</span> Search new
                  <span className="text-purple-400"> Contact</span>
                </h3>
                <p className="text-xs md:text-sm text-slate-400">
                  Start typing to find people to chat with
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
