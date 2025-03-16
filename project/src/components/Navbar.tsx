import React from 'react';
import { NavLink } from 'react-router-dom';
import { Coffee, Users, Calendar, MessageSquare, UserCircle } from 'lucide-react';

function Navbar() {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between py-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`
            }
          >
            <Coffee size={24} />
            <span className="text-xs mt-1">홈</span>
          </NavLink>
          <NavLink
            to="/discover"
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`
            }
          >
            <Users size={24} />
            <span className="text-xs mt-1">찾기</span>
          </NavLink>
          <NavLink
            to="/schedule"
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`
            }
          >
            <Calendar size={24} />
            <span className="text-xs mt-1">시간표</span>
          </NavLink>
          <NavLink
            to="/chats"
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`
            }
          >
            <MessageSquare size={24} />
            <span className="text-xs mt-1">채팅</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`
            }
          >
            <UserCircle size={24} />
            <span className="text-xs mt-1">프로필</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;