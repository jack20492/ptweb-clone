import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Mail, Phone } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'admin' | 'client';
  avatar?: string;
  startDate?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = JSON.parse(localStorage.getItem('pt_users') || '[]');
    return savedUsers.map((u: any) => ({ ...u, password: undefined }));
  });
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    role: 'client' as 'admin' | 'client',
    password: '',
    avatar: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allUsers = JSON.parse(localStorage.getItem('pt_users') || '[]');
    
    if (editingUser) {
      // Update user
      const updatedUsers = allUsers.map((u: any) => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              ...formData,
              password: formData.password || u.password 
            }
          : u
      );
      localStorage.setItem('pt_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers.map((u: any) => ({ ...u, password: undefined })));
    } else {
      // Add new user
      const newUser = {
        id: `user-${Date.now()}`,
        ...formData,
        startDate: new Date().toISOString().split('T')[0]
      };
      const updatedUsers = [...allUsers, newUser];
      localStorage.setItem('pt_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers.map((u: any) => ({ ...u, password: undefined })));
    }

    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || '',
      role: user.role,
      password: '',
      avatar: user.avatar || ''
    });
    setShowForm(true);
  };

  const handleDelete = (userId: string) => {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
      const allUsers = JSON.parse(localStorage.getItem('pt_users') || '[]');
      const updatedUsers = allUsers.filter((u: any) => u.id !== userId);
      localStorage.setItem('pt_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers.map((u: any) => ({ ...u, password: undefined })));
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      fullName: '',
      phone: '',
      role: 'client',
      password: '',
      avatar: ''
    });
    setEditingUser(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-fitness-black">Quản lý học viên</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-fitness-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* User List */}
      <div className="grid gap-4 mb-6">
        {users.map((user) => (
          <div key={user.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-fitness-red rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-fitness-black">{user.fullName}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{user.email}</span>
                  </span>
                  {user.phone && (
                    <span className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{user.phone}</span>
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'Học viên'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              {user.role !== 'admin' && (
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-fitness-black mb-4">
                {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'client' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                  >
                    <option value="client">Học viên</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu {editingUser && '(để trống nếu không đổi)'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    required={!editingUser}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Avatar
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-fitness-red text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    {editingUser ? 'Cập nhật' : 'Thêm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;