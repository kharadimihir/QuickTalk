/* eslint-disable no-unused-vars */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/auth/register";
import Chat from "./pages/chat/chat";
import Profile from "./pages/profile/profile";
import { useStore } from "@/store";
import { useState } from "react";
import { useEffect } from "react";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
import Login from "./pages/auth/login";

const PrivateRoute = ({ children }) => {
  const { userInfo, setUserInfo } = useStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/sign-up" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });
        if (response.status == 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.log(error);
        setUserInfo(undefined);
      } finally {
        setIsLoading(false);
      }
    };
    if (!userInfo) {
      getUserData();
    } else {
      setIsLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/sign-in"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <AuthRoute>
              <SignUp />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/sign-up" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
