import React from 'react';
import './LogoutModal.css';

const LogoutModal = ({handleLogout,setIsOpenLogModal}) => {
  return (
    <div className="logoutContainer">
        <div className="logoutRow-One">
            <h2>Logout </h2>
            <span onClick={() => setIsOpenLogModal(false) }>X</span>
        </div>
        <div className="logoutRow-Two">
            <p>Are you sure you want to Logout?</p>
        </div>
        <div className="logoutRow-Three">
        <button className='m-right' onClick={() => setIsOpenLogModal(false)}>Cancel</button>
            <button className='m-left' onClick={() => handleLogout()}>Logout</button>
        </div>
    </div>
  )
}

export default LogoutModal