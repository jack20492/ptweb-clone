import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit, Trash2, Play } from 'lucide-react';

const VideoManagement: React.FC = () => {
  const { videos, addVideo, updateVideo, deleteVideo } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    youtubeId: '',
    description: '',
    category: 'Cardio'
  });

  const extractYouTubeId = (url: string): string => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : url;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const videoData = {
      id: editingVideo?.id || `video-${Date.now()}`,
      ...formData,
      youtubeId: extractYouTubeId(formData.youtubeId)
    };

    if (editingVideo) {
      updateVideo(editingVideo.id, videoData);
    } else {
      addVideo(videoData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      youtubeId: '',
      description: '',
      category: 'Cardio'
    });
    setEditingVideo(null);
    setShowForm(false);
  };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      youtubeId: video.youtubeId,
      description: video.description,
      category: video.category
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa video này?')) {
      deleteVideo(id);
    }
  };

  const categories = ['Cardio', 'Strength', 'Flexibility', 'HIIT', 'Yoga', 'Other'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-fitness-black">Quản lý video hướng dẫn</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-fitness-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm video</span>
        </button>
      </div>

      {/* Videos List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative aspect-video bg-gray-200">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-fitness-red text-white px-2 py-1 rounded text-xs font-medium">
                  {video.category}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(video)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-fitness-black mb-2 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-fitness-black mb-4">
                {editingVideo ? 'Chỉnh sửa video' : 'Thêm video mới'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề video
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL hoặc Video ID
                  </label>
                  <input
                    type="text"
                    value={formData.youtubeId}
                    onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ hoặc dQw4w9WgXcQ"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Bạn có thể dán toàn bộ URL YouTube hoặc chỉ Video ID
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                {formData.youtubeId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xem trước
                    </label>
                    <div className="aspect-video bg-gray-200 rounded">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeId(formData.youtubeId)}`}
                        title="Preview"
                        className="w-full h-full rounded"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

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
                    {editingVideo ? 'Cập nhật' : 'Thêm'}
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

export default VideoManagement;