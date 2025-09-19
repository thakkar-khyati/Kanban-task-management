import React, { useState, useEffect } from 'react';
import { X, Plus, User, Crown, Shield, Eye, Trash2, MoreVertical, Search } from 'lucide-react';
import { boardService } from '../../services/boardService';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const BoardMembersModal = ({ board, onClose, onUpdate }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addRole, setAddRole] = useState('member');
  const [isAdding, setIsAdding] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (board?._id) {
      fetchMembers();
      fetchAllUsers();
    }
  }, [board]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await boardService.getBoardMembers(board._id);
      setMembers(response.data.members || []);
      setUserRole(response.data.userRole || '');
    } catch (error) {
      toast.error('Failed to fetch board members');
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await authService.getUsers();
      setAllUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Don't show error toast for this as it's not critical
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    setIsAdding(true);
    try {
      const selectedUser = allUsers.find(user => user._id === selectedUserId);
      await boardService.addMember(board._id, selectedUser.email, addRole);
      setSelectedUserId('');
      setSearchTerm('');
      toast.success('User added to board successfully');
      setAddRole('member');
      fetchMembers(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to add member');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove ${userName} from this board?`)) {
      return;
    }

    try {
      await boardService.removeMember(board._id, userId);
      toast.success('Member removed successfully');
      fetchMembers(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const handleUpdateRole = async (userId, newRole, userName) => {
    try {
      await boardService.updateMemberRole(board._id, userId, newRole);
      toast.success(`${userName}'s role updated to ${newRole}`);
      fetchMembers(); // Refresh the list
    } catch (error) {
      toast.error(error.message || 'Failed to update role');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'member':
        return <User className="h-4 w-4 text-green-500" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'member':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const canManageMembers = ['owner', 'admin'].includes(userRole);
  const canInvite = ['owner', 'admin'].includes(userRole);

  // Filter users based on search term and exclude existing members
  const filteredUsers = allUsers.filter(user => {
    const isNotMember = !members.some(member => member.user._id === user._id);
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return isNotMember && matchesSearch;
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="spinner w-6 h-6"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading members...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Board Members
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Add Member Form */}
          {true && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Member
              </h3>
              
              <form onSubmit={handleAddMember} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Search Users
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                        placeholder="Search by name or email..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select User
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      required
                    >
                      <option value="">Choose a user...</option>
                      {filteredUsers.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                    {filteredUsers.length === 0 && searchTerm && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        No users found matching "{searchTerm}"
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <select
                      value={addRole}
                      onChange={(e) => setAddRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  {isAdding ? (
                    <div className="spinner w-4 h-4 mr-2"></div>
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isAdding ? 'Adding...' : 'Add Member'}
                </button>
              </form>
            </div>
          )}

          {/* Members List */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Members ({members.length})
            </h3>
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.user._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {member.user.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                      {getRoleIcon(member.role)}
                      <span className="ml-1 capitalize">{member.role}</span>
                    </span>
                    
                    {canManageMembers && member.role !== 'owner' && (
                      <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {/* Role change dropdown would go here */}
                      </div>
                    )}
                    
                    {true && (
                      <button
                        onClick={() => handleRemoveMember(member.user._id, member.user.name)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors duration-200"
                        title="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardMembersModal;
