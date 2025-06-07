import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Star, Play, Phone, MessageCircle, Mail, Facebook } from 'lucide-react';
import Login from '../components/Login';

const Home: React.FC = () => {
  const { testimonials, videos, contactInfo, homeContent } = useData();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-fitness-black via-gray-800 to-fitness-red text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              {homeContent.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto animate-slide-up">
              {homeContent.heroSubtitle}
            </p>
            {!user && (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-fitness-gold hover:bg-yellow-500 text-fitness-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-fitness-black mb-6">Về PT Phi Nguyễn</h2>
            <div className="w-24 h-1 bg-fitness-red mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {homeContent.aboutText}
            </p>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-fitness-black mb-6">{homeContent.servicesTitle}</h2>
            <div className="w-24 h-1 bg-fitness-red mx-auto mb-8"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeContent.services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-fitness-red"
              >
                <div className="h-12 w-12 bg-fitness-red rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <p className="text-gray-700 text-center font-medium">{service}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-fitness-black mb-6">Phản hồi từ học viên</h2>
              <div className="w-24 h-1 bg-fitness-red mx-auto mb-8"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-fitness-red rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-fitness-black">{testimonial.name}</h4>
                      <div className="flex">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed">"{testimonial.content}"</p>
                  {(testimonial.beforeImage || testimonial.afterImage) && (
                    <div className="flex space-x-4 mt-4">
                      {testimonial.beforeImage && (
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-2">Trước</p>
                          <img
                            src={testimonial.beforeImage}
                            alt="Before"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      {testimonial.afterImage && (
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-2">Sau</p>
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
          </section>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-fitness-black mb-6">Video hướng dẫn</h2>
              <div className="w-24 h-1 bg-fitness-red mx-auto mb-8"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative aspect-video bg-gray-200">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-fitness-red text-white px-2 py-1 rounded text-xs font-medium">
                        {video.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-fitness-black mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className="bg-fitness-black text-white rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Liên hệ với tôi</h2>
            <div className="w-24 h-1 bg-fitness-red mx-auto mb-8"></div>
            <p className="text-xl text-gray-300">
              Sẵn sàng bắt đầu hành trình fitness của bạn? Liên hệ ngay!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href={`tel:${contactInfo.phone}`}
              className="bg-green-600 hover:bg-green-700 p-6 rounded-xl text-center transition-colors duration-300 group"
            >
              <Phone className="h-8 w-8 mx-auto mb-3 group-hover:animate-bounce" />
              <p className="font-medium mb-1">Điện thoại</p>
              <p className="text-sm text-green-100">{contactInfo.phone}</p>
            </a>
            <a
              href={contactInfo.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 p-6 rounded-xl text-center transition-colors duration-300 group"
            >
              <Facebook className="h-8 w-8 mx-auto mb-3 group-hover:animate-bounce" />
              <p className="font-medium mb-1">Facebook</p>
              <p className="text-sm text-blue-100">Nhắn tin</p>
            </a>
            <a
              href={contactInfo.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 p-6 rounded-xl text-center transition-colors duration-300 group"
            >
              <MessageCircle className="h-8 w-8 mx-auto mb-3 group-hover:animate-bounce" />
              <p className="font-medium mb-1">Zalo</p>
              <p className="text-sm text-blue-100">Chat trực tiếp</p>
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="bg-red-600 hover:bg-red-700 p-6 rounded-xl text-center transition-colors duration-300 group"
            >
              <Mail className="h-8 w-8 mx-auto mb-3 group-hover:animate-bounce" />
              <p className="font-medium mb-1">Email</p>
              <p className="text-sm text-red-100">{contactInfo.email}</p>
            </a>
          </div>
        </section>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default Home;