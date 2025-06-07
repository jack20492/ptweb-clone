import React, { useState } from 'react';
import { Users, Dumbbell, Settings as SettingsIcon, MessageSquare, Video, FileText } from 'lucide-react';
import UserManagement from '../components/admin/UserManagement';
import WorkoutManagement from '../components/admin/WorkoutManagement';
import ContentManagement from '../components/admin/ContentManagement';
import TestimonialManagement from '../components/admin/TestimonialManagement';
import VideoManagement from '../components/admin/VideoManagement';
import Settings from '../components/admin/Settings';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Quản lý học viên', icon: Users },
    { id: 'workouts', label: 'Quản lý bài tập', icon: Dumbbell },
    { id: 'content', label: 'Nội dung trang chủ', icon: FileText },
    { id: 'testimonials', label: 'Phản hồi học viên', icon: MessageSquare },
    { id: 'videos', label: 'Video hướng dẫn', icon: Video },
    { id: 'settings', label: 'Cài đặt', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'workouts':
        return <WorkoutManagement />;
      case 'content':
        return <ContentManagement />;
      case 'testimonials':
        return <TestimonialManagement />;
      case 'videos':
        return <VideoManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fitness-black">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Quản lý hệ thống PT của bạn</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-fitness-red text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;