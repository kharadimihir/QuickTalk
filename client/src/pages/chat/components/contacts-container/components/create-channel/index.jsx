/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
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
import { apiClient } from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS } from "@/utils/constants";
import { useStore } from "@/store";
import { Users, Hash, Sparkles, Contact } from "lucide-react";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/MultipleSelect";
import { Card, CardContent } from "@/components/ui/card";

const CreateChannel = () => {
  const { addChannel } = useStore();
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedConacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS, {
        withCredentials: true,
      });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedConacts.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedConacts.map((Contact) => Contact.value),
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModel(true);
          addChannel(response.data.channel);
          setNewChannelModel(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setNewChannelModel(false);
    setChannelName("");
    setSelectedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              onClick={() => setNewChannelModel(true)}
              className="p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-all duration-200 group"
            >
              <FaPlus className="text-slate-400 text-sm group-hover:text-purple-400 transition-colors duration-200" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200">
            Select New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModel} onOpenChange={handleClose}>
        <DialogContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 text-slate-100 w-[85vw] sm:w-[75vw] md:w-[60vw] lg:w-[45vw] xl:w-[35vw] max-w-sm mx-auto shadow-2xl backdrop-blur-sm p-3 sm:p-4">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-lg"></div>

          <DialogHeader className="space-y-1 mt-5 sm:space-y-2 relative z-10">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            <DialogTitle className="text-base sm:text-lg font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Create New Channel
            </DialogTitle>

            <DialogDescription className="text-slate-400 text-center text-xs sm:text-sm leading-relaxed px-2">
              Set up a new channel to bring your team together
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 relative z-10 mt-3 sm:mt-4">
            {/* Channel Name Input */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-2 sm:p-3">
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Channel Name
                </label>
                <div className="relative group">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
                  <Input
                    type="text"
                    placeholder="Enter channel name..."
                    className="pl-10 bg-slate-700/50 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 h-9 sm:h-10 text-sm"
                    onChange={(e) => setChannelName(e.target.value)}
                    value={channelName}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Selection */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-2 sm:p-3">
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Add Members
                </label>
                <MultipleSelector
                  className="rounded-lg bg-slate-700/50 border-slate-600 text-white focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-200 text-sm"
                  defaultOptions={allContacts}
                  placeholder="Search contacts..."
                  value={selectedConacts}
                  onChange={setSelectedContacts}
                  onBlur={() => {
                    // Force close the dropdown when clicking outside
                    setTimeout(() => {
                      const input = document.querySelector(
                        '[data-slot="command-input"]'
                      );
                      if (input) input.blur();
                    }, 100);
                  }}
                  emptyIndicator={
                    <div className="text-center py-3 sm:py-4">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-500 text-xs sm:text-sm">
                        No contacts found
                      </p>
                    </div>
                  }
                  badgeClassName="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 hover:from-purple-500 hover:to-purple-600 text-xs"
                  commandProps={{
                    shouldFilter: true,
                  }}
                />

                {selectedConacts.length > 0 && (
                  <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <p className="text-xs text-slate-400 mb-1">
                      Selected Members:
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {selectedConacts.length} member
                      {selectedConacts.length !== 1 ? "s" : ""} selected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:flex-1 cursor-pointer bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all duration-200 h-9 sm:h-10 text-sm"
                disabled={isCreating}
              >
                Cancel
              </Button>

              <Button
                onClick={createChannel}
                disabled={
                  !channelName.trim() ||
                  selectedConacts.length === 0 ||
                  isCreating
                }
                className="w-full sm:flex-1 bg-gradient-to-r cursor-pointer from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-9 sm:h-10 text-sm"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Creating...</span>
                    <span className="sm:hidden">Creating</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    Create Channel
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
