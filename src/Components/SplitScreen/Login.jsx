import React, { useState } from 'react';
import { loadModules } from 'esri-loader';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import {
  Save_User,
} from "../../actions";
// 
const portalUrl = 'https://mlinfomap.org/portal' // Replace with your portal URL
const APP_ID = 'sIHzj0uOHUBmzQta' //live MLInfoMap
// const portalUrl = 'https://irgeoportal.gov.in/arcgisportal' // Replace with your portal URL
// const APP_ID = '9KV5zxFrXcTqBxod'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const username = email.trim();
    const pwd = password.trim();
    
    if (!username || !pwd) {
      toast.error("Please enter both username and password.");
      return;
    }
    sessionStorage.setItem("esUser",username);

    try {
      const [IdentityManager, OAuthInfo, Portal] = await loadModules(["esri/identity/IdentityManager", "esri/identity/OAuthInfo", "esri/portal/Portal"], { css: true });

      const fetchUser = async () => {
        const portal = new Portal();
        portal.url = portalUrl;
        await portal.load();
        return portal.user;
      };

      const initialize = (appId) => {
        const oauthInfo = new OAuthInfo({ appId });
        // oauthInfo.portalUrl = "https://irgeoportal.gov.in/arcgisportal"
        oauthInfo.portalUrl = "https://mlinfomap.org/portal"
        IdentityManager.registerOAuthInfos([oauthInfo]);
        return oauthInfo;
      };

      let info = new OAuthInfo({
        appId: APP_ID,
        popup: false,
        portalUrl: portalUrl,
        preserveUrlHash: false
      })
      IdentityManager.registerOAuthInfos([info]);

      const displayItems = () => {
        var portal = new Portal();
        // Setting authMode to immediate signs the user in once loaded
        portal.authMode = "immediate";
        // Once loaded, user is signed in
        navigate("/");
      }



      if (!IdentityManager) {
        throw new Error('Failed to load IdentityManager');
      }

      const server = portalUrl + '/sharing/rest';
      const tokenServiceUrl = server + '/generateToken';

      const serverInfo = {
        tokenServiceUrl
      };

      const userInfo = {
        username,
        password
      };

      /* GENERATES AND REGISTERS THE TOKEN */
      const tokenResponse = await IdentityManager.generateToken(serverInfo, userInfo).then((tokenInfo) => {
        const tokenKey = tokenInfo; // Extract the token key
        IdentityManager.registerToken({
          ...tokenKey,
          // server: 'https://irgeoportal.gov.in/arcgisportal/sharing/rest'
          server: 'https://mlinfomap.org/portal/sharing/rest'
        });

        return tokenKey;
      });

      const checkCurrentStatus = async (oauthInfo) => {
        try {
          const credential = await IdentityManager.checkSignInStatus(
            `${oauthInfo.portalUrl}/sharing`
          );
          return credential;
        } catch (error) {
          toast.error('Invalid user credentials' + error);
        }
      };

      const signIn = async (oauthInfo) => {
        try {
          const credential = await checkCurrentStatus(oauthInfo) || await fetchCredentials(oauthInfo);
          return credential;
        } catch (error) {
          const credential = await fetchCredentials(oauthInfo);
          return credential;
        }
      };

      const fetchCredentials = async (oauthInfo) => {
        try {
          const credential = await IdentityManager.getCredential(
            `${oauthInfo.portalUrl}/sharing`
          );
          return credential;
        } catch (error) {
          toast.error('Invalid user credentials' + error);
          console.warn(error);
        }
      };


      if (tokenResponse && tokenResponse.token) {
        const realData = { ...tokenResponse, ...tokenResponse.expires };
        dispatch(Save_User(realData));

        const oauthInfo = initialize(APP_ID);
        let credential = await checkCurrentStatus(oauthInfo);

        if (!credential) {
          credential = await signIn(oauthInfo);
        }


        if (credential) {
          const user = await fetchUser();

          displayItems();
        }

      } else {
        toast.error('User is not signed in. Please check your username and password.');
      }
      
    } catch (error) {
      toast.error('Invalid user credentials' + error);

    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
        <img className="imgTagName" src="/cris_lrs/images/crisTag.png" alt="CrisTag.png" />
          <h3 className="Auth-form-title">Login</h3>
          <div className="form-group mt-3">
            <label>User Name</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="User Name"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
