import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit, Trash2, Star, User } from 'lucide-react';

const TestimonialManagement: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    rating: 5,
    avatar: '',
    beforeImage: '',
    afterImage: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const testimonialData = {
      id: editingTestimonial?.id || `testimonial-${Date.now()}`,
      ...formData
    };

    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, testimonialData);
    } else {
      addTestimonial(testimonialData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      content: '',
      rating: 5,
      avatar: '',
      beforeImage: '',
      afterImage: ''
    });
    setEditingTestimonial(null);
    setShowForm(false);
  };

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar || '',
      beforeImage: testimonial.beforeImage || '',
      afterImage: testimonial.afterImage || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa phản hồi này?')) {
      deleteTestimonial(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-fitness-black">Quản lý phản hồi học viên</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-fitness-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm phản hồi</span>
        </button>
      </div>

      {/* Testimonials List */}
      <div className="grid gap-6 mb-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-fitness-red rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-fitness-black">{testimonial.name}</h3>
                  <div className="flex">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
            {(testimonial.beforeImage || testimonial.afterImage) && (
              <div className="flex space-x-4">
                {testimonial.beforeImage && (
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">Ảnh trước</p>
                    <img
                      src={testimonial.beforeImage}
                      alt="Before"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                {testimonial.afterImage && (
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">Ảnh sau</p>
                    <img
                      src={testimonial.afterImage}
                      alt="After"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-fitness-black mb-4">
                {editingTestimonial ? 'Chỉnh sửa phản hồi' : 'Thêm phản hồi mới'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung phản hồi
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đánh giá (số sao)
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} sao</option>
                    ))}
                  </select>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Ảnh trước (tùy chọn)
                  </label>
                  <input
                    type="url"
                    value={formData.beforeImage}
                    onChange={(e) => setFormData({ ...formData, beforeImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    placeholder="https://example.com/before.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Ảnh sau (tùy chọn)
                  </label>
                  <input
                    type="url"
                    value={formData.afterImage}
                    onChange={(e) => setFormData({ ...formData, afterImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                    placeholder="https://example.com/after.jpg"
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
                    {editingTestimonial ? 'Cập nhật' : 'Thêm'}
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

export default TestimonialManagement;