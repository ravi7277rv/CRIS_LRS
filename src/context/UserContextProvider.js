import React, {useContext} from 'react'
import UserContext from './UserContext'

const UserContextProvider = ({children}) => {
    const [months, setMonths] = React.useState([])
    const [employeeNames, setEmployeeNames] = React.useState([])
    const [screenQueries, setScreenQueries] = React.useState([
      { id: 1, title: "PSR", query: "" },
      { id: 2, title: "Rail Section Analysis", query: "" }
  ]);
   
  return (
    <UserContext.Provider value={{months, setMonths, employeeNames, setEmployeeNames, screenQueries, setScreenQueries}}>
        {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider