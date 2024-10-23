import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import SplitScreen from "./Components/SplitScreen/SplitScreen";
import UserContextProvider from './context/UserContextProvider';
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useIdleTimer } from "react-idle-timer";
import moment from "moment";
import Config from "./Config";
import { Remove_User } from "./actions";
import './index.css';
import Login from "./Components/SplitScreen/Login";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function App() {

  const user = useSelector((state) => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  const dispatch = useDispatch();

  const isSessionExpired = () => {
    if (user) {
      const expireAt = user?.expireAt;
      const currentTime = moment().valueOf();
      const isExpired = moment(currentTime).isAfter(expireAt);
      if (isExpired) {
        window.location.href = "/AttendanceLeave/";
        dispatch(Remove_User());
      }
    }
  };

  const { getRemainingTime } = useIdleTimer({
    onIdle: () => isSessionExpired(),
    timeout: 1000 * 60 * Config.idleTime,
  });

  useEffect(() => isSessionExpired(), []);

  // Accessing remaining idle time
  const remainingIdleTime = getRemainingTime();

  useEffect(() => {
    if (remainingIdleTime !== null) {
      // Do something with the remaining idle time
      // console.log("Remaining idle time:", remainingIdleTime);
      // Example: Display a countdown or perform an action when idle time is low
      if (remainingIdleTime <= 10000) {
        // Example action when idle time is less than or equal to 10 seconds (10,000 milliseconds)
        console.log("Idle time is low, take action...");
      }
    }
  }, [remainingIdleTime]);


  if (!user) {
    return (
        <UserContextProvider>
          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
          />
          <Routes>
            <Route exact path="/" name="Login Page" element={<Login />} />
          </Routes>
        </UserContextProvider>
    );
  } else {
    return (
        <UserContextProvider>
          <ToastContainer
            position="bottom-center"
            autoClose={800}
            hideProgressBar={true}
            newestOnTop={true}
            closeOnClick
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
          />
          <Routes>
            <Route path="/" name="Home" element={<SplitScreen />} />
          </Routes>
        </UserContextProvider>
    );
  }
}

export default App;
