import React, { useState } from 'react';
import { Users, Dumbbell, Settings as SettingsIcon, MessageSquare, Video, FileText, Utensils } from 'lucide-react';
import UserManagement from '../components/admin/UserManagement';
import WorkoutManagement from '../components/admin/WorkoutManagement';
import MealPlanManagement from '../components/admin/MealPlanManagement';
import ContentManagement from '../components/admin/ContentManagement';
import TestimonialManagement from '../components/admin/TestimonialManagement';
import VideoManagement from '../components/admin/VideoManagement';
import Settings from '../components/admin/Settings';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Quản lý học viên', icon: Users },
    { id: 'workouts', label: 'Quản lý bài tập', icon: Dumbbell },
    { id: 'meals', label: 'Chế độ dinh dưỡng', icon: Utensils },
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
      case 'meals':
        return <MealPlanManagement />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-fitness-black to-fitness-red rounded-2xl p-8 text-white shadow-2xl">
            <h1 className="text-4xl font-bold mb-2">🎯 Admin Dashboard</h1>
            <p className="text-gray-200 text-lg">Quản lý hệ thống PT của bạn một cách chuyên nghiệp</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <nav className="space-y-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-fitness-red to-red-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="font-medium text-lg">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;