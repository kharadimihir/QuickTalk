import { useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import {
  GET_DM_CONTACT_ROUTES,
  GET_USER_CHANNEL_ROUTES,
} from "@/utils/constants";
import { useStore } from "@/store";
import Logo from "../../../../components/Logo";
import Title from "../../../../components/Title";
import ContactList from "@/components/ContactList";
import ProfileInfo from "./components/profile-info";
import NewDM from "./components/new-dm";
import CreateChannel from "./components/create-channel";

const ContactContainer = () => {
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
  } = useStore();

  const getContacts = useCallback(async () => {
    try {
      const response = await apiClient.get(GET_DM_CONTACT_ROUTES, {
        withCredentials: true,
      });
      if (response.data.contacts) {
        setDirectMessagesContacts(response.data.contacts);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    }
  }, [setDirectMessagesContacts]);

  const getChannels = useCallback(async () => {
    try {
      const response = await apiClient.get(GET_USER_CHANNEL_ROUTES, {
        withCredentials: true,
      });
      if (response.data.channels) {
        setChannels(response.data.channels);
      }
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    }
  }, [setChannels]);

  useEffect(() => {
    getContacts();
    getChannels();
  }, [getContacts, getChannels]);

  return (
    <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 shadow-xl flex flex-col h-full">
      {/* Header Section */}
      <header className="flex-shrink-0 pt-3 md:pt-4 px-3 md:px-4">
        <Logo />
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 flex flex-col overflow-hidden px-3 md:px-4">
        {/* Direct Messages Section */}
        <section className="flex-shrink-0 my-4 md:my-6">
          <div className="flex items-center justify-between mb-3">
            <Title text="Direct Messages" />
            <NewDM />
          </div>
        </section>

        {/* Direct Messages List */}
        <section className="flex-1 min-h-0 mb-4">
          <div className="h-full overflow-y-auto scrollbar-hidden">
            <ContactList contacts={directMessagesContacts} />
          </div>
        </section>

        {/* Groups Section */}
        <section className="flex-shrink-0 mb-3">
          <div className="flex items-center justify-between">
            <Title text="Groups" />
            <CreateChannel />
          </div>
        </section>

        {/* Groups List */}
        <section className="flex-1 min-h-0 mb-4">
          <div className="h-full overflow-y-auto scrollbar-hidden">
            <ContactList contacts={channels} isChannel={true} />
          </div>
        </section>
      </main>

      {/* Profile Info - Fixed at bottom */}
      <footer className="flex-shrink-0">
        <ProfileInfo />
      </footer>
    </div>
  );
};

export default ContactContainer;
