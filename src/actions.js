//Users
export const Save_User = (data) => ({
  type: "Save_User",
  payload: data,
});

export const Update_User = (data) => ({
  type: "Update_User",
  payload: data,
});

export const Remove_User = () => ({
  type: "Remove_User",
});

//Games
export const Save_Games_Data = (data) => ({
  type: "Save_Games_Data",
  payload: data,
});

//Councils
export const Save_Councils_Data = (data) => ({
  type: "Save_Councils_Data",
  payload: data,
});

//Districts
export const Save_Districts_Data = (data) => ({
  type: "Save_Districts_Data",
  payload: data,
});

//regions
export const Save_Regions_Data = (data) => ({
  type: "Save_Regions_Data",
  payload: data,
});
