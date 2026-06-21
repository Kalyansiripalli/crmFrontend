import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        CRM Opportunity Tracker
      </div>
      {user && (
        <div className="navbar-actions">
          <span className="navbar-user">
            Hello, <strong>{user.name}</strong>
          </span>
          <button onClick={logout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
