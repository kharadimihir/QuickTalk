export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "/api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_INFO = `${AUTH_ROUTES}/update-profile`;
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES = "/api/contacts";
export const SEARCH_CONTACTS_ROUTES = `${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACT_ROUTES = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTES}/get-all-contacts`;

export const MESSAGES_ROUTES = "/api/messages";
export const GET_ALL_MESSAGES = `${MESSAGES_ROUTES}/get-messages`;
export const UPLOAD_FILE_ROUTES = `${MESSAGES_ROUTES}/upload-file`;

export const CHANNEL_ROUTES = `/api/channel`;
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`;
export const GET_USER_CHANNEL_ROUTES = `${CHANNEL_ROUTES}/get-user-channels`;
export const GET_CHANNEL_MESSAGES_ROUTES = `${CHANNEL_ROUTES}/get-channel-messages`;
