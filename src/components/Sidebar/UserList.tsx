import React from 'react';
import { User } from '../../types/types';
import { getUserColorClass } from '../../utils/colors';
import { Users as UsersIcon } from 'lucide-react';

interface UserListProps {
  users: User[];
  currentUserId: string;
}

export const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center space-x-2 mb-3">
        <UsersIcon className="w-4 h-4 text-gray-600" />
        <h3 className="text-sm font-medium text-gray-900">
          Active Users ({users.length})
        </h3>
      </div>
      
      <div className="space-y-2">
        {users.map(user => (
          <div
            key={user.id}
            className="flex items-center space-x-3"
          >
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${getUserColorClass(user.color)}`}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
                {user.id === currentUserId && (
                  <span className="text-xs text-gray-500 ml-1">(You)</span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {Date.now() - user.lastActive < 30000 ? 'Active now' : 'Recently active'}
              </p>
            </div>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};