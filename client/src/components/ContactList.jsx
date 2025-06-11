import { useStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useStore();

  const handleClick = (contact) => {
    setSelectedChatType(isChannel ? "channel" : "contact");
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          onClick={() => handleClick(contact)}
          key={contact._id}
          className={`
            mx-2 mb-2 pl-4 pr-2 py-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out
            ${
              selectedChatData && selectedChatData._id === contact._id
                ? "bg-[#8417ff] hover:bg-[#8417ff] shadow-lg shadow-purple-500/20"
                : "hover:bg-[#f1f1f111] hover:shadow-md"
            }
          `}
        >
          <div className="flex gap-3 items-center justify-start text-neutral-300">
            {!isChannel && (
              <Avatar className="w-10 h-10 md:w-12 md:h-12 ring-2 ring-slate-600 hover:ring-purple-500/50 transition-all duration-200 flex-shrink-0">
                {contact.image ? (
                  <AvatarImage
                    src={`${HOST}/${contact.image}`}
                    alt="profile"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`uppercase h-full w-full text-sm md:text-base font-semibold flex items-center justify-center rounded-full ${getColor(
                      contact.color
                    )}`}
                  >
                    {contact.firstName
                      ? contact.firstName.split("").shift()
                      : contact.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            )}

            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full flex-shrink-0">
                <span className="text-sm md:text-base font-medium">#</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="text-sm md:text-base font-medium truncate">
                {isChannel
                  ? contact.name
                  : `${contact.firstName || ""} ${
                      contact.lastName || ""
                    }`.trim() || contact.email}
              </div>
              <div className="text-xs text-slate-400 truncate mt-0.5">
                {isChannel ? "Channel" : "Tap to chat"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
