const GetAccessToken = () => {
  const user = sessionStorage.getItem("esriJSAPIOAuth")
    ? JSON.parse(sessionStorage.getItem("esriJSAPIOAuth"))
    : null;
  //console.log(user);
  if (user) return user.token;

  return null;
};

const GetUserId = () => {
  const user = sessionStorage.getItem("esriJSAPIOAuth")
    ? JSON.parse(sessionStorage.getItem("esriJSAPIOAuth"))
    : null;

  if (user) return user.userId;

  return null;
};

const Config = {
  AxiosConfig: {
    headers: {
      authorization: `${GetAccessToken()}`,
      id: GetUserId(),
    },
  },
  sessionExpiredTime: 60, // in minutes
  idleTime: 60, // in mins
};

export default Config;
