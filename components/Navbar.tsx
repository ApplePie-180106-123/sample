'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { MessageSquare, LogOut, User, Plus, Menu } from 'lucide-react';
import { useState } from 'react';

export function Navbar({ onNewChat }: { onNewChat?: () => void }) {
  const { user, isLoading } = useUser();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="navbar navbar-expand bg-primary shadow-sm px-2 px-sm-3" style={{ minHeight: 56 }}>
      <div className="container-fluid flex-nowrap">
        {/* Brand and menu icon */}
        <div className="d-flex align-items-center flex-grow-1">
          <MessageSquare className="me-2 text-white d-none d-sm-inline" size={24} />
          <span className="fw-bold text-white fs-5">ChatGPT Clone</span>
        </div>
        {/* Mobile menu button */}
        <button
          className="btn btn-primary d-sm-none ms-auto"
          type="button"
          aria-label="Menu"
          onClick={() => setShowMenu((v) => !v)}
          style={{ boxShadow: 'none' }}
        >
          <Menu size={24} />
        </button>
        {/* Desktop actions */}
        <div className="d-none d-sm-flex align-items-center gap-2 ms-auto">
          {onNewChat && (
            <button className="btn btn-outline-light" onClick={onNewChat} title="New Chat">
              <Plus size={16} className="me-1" /> New Chat
            </button>
          )}
          {isLoading ? (
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : user ? (
            <div className="nav-item dropdown">
              <button
                className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || 'User'}
                    width={24}
                    height={24}
                    className="rounded-circle me-2"
                  />
                ) : (
                  <User size={16} className="me-2" />
                )}
                <span className="d-none d-md-inline">{user.name || user.email}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="/api/auth/logout">
                    <LogOut size={16} className="me-2" />
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <a className="btn btn-outline-light" href="/api/auth/login">
              Login
            </a>
          )}
        </div>
        {/* Mobile menu dropdown */}
        {showMenu && (
          <div className="position-absolute top-100 end-0 mt-2 bg-white rounded shadow p-3 d-sm-none" style={{ minWidth: 200, zIndex: 2000 }}>
            {onNewChat && (
              <button className="btn btn-outline-primary w-100 mb-2" onClick={() => { setShowMenu(false); onNewChat && onNewChat(); }}>
                <Plus size={16} className="me-1" /> New Chat
              </button>
            )}
            {isLoading ? (
              <div className="spinner-border spinner-border-sm text-primary d-block mx-auto my-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : user ? (
              <>
                <div className="d-flex align-items-center mb-2">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-circle me-2"
                    />
                  ) : (
                    <User size={18} className="me-2" />
                  )}
                  <span className="fw-semibold small">{user.name || user.email}</span>
                </div>
                <a className="btn btn-outline-danger w-100" href="/api/auth/logout">
                  <LogOut size={16} className="me-1" /> Logout
                </a>
              </>
            ) : (
              <a className="btn btn-outline-primary w-100" href="/api/auth/login">
                Login
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}