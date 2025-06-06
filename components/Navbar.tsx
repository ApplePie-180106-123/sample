'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { MessageSquare, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, isLoading } = useUser();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <div className="navbar-brand d-flex align-items-center">
          <MessageSquare className="me-2" size={24} />
          <span className="fw-bold">ChatGPT Clone</span>
        </div>

        <div className="navbar-nav ms-auto">
          {isLoading ? (
            <div className="spinner-border spinner-border-sm text-light\" role="status">
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
                {user.name || user.email}
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
      </div>
    </nav>
  );
}