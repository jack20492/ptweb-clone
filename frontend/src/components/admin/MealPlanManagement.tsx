import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit, Trash2, User, Calendar, Utensils, Search, X, ChefHat } from 'lucide-react';

const MealPlanManagement: React.FC = () => {
  const { mealPlans, addMealPlan, updateMealPlan, deleteMealPlan } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [meals, setMeals] = useState([
    { 
      name: 'Bữa sáng', 
      totalCalories: 0, 
      foods: [{ 
        name: '', 
        macroType: 'Carb', 
        calories: 0, 
        notes: '' 
      }] 
    },
    { 
      name: 'Bữa trưa', 
      totalCalories: 0, 
      foods: [{ 
        name: '', 
        macroType: 'Pro', 
        calories: 0, 
        notes: '' 
      }] 
    },
    { 
      name: 'Bữa tối', 
      totalCalories: 0, 
      foods: [{ 
        name: '', 
        macroType: 'Pro', 
        calories: 0, 
        notes: '' 
      }] 
    }
  ]);
  const [notes, setNotes] = useState('');

  const clients = JSON.parse(localStorage.getItem('pt_users') || '[]')
    .filter((u: any) => u.role === 'client');

  const filteredPlans = mealPlans.filter(plan => {
    const client = clients.find((c: any) => c.id === plan.clientId);
    const clientName = client?.fullName || '';
    return clientName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    
    const planData = {
      id: editingPlan?.id || `meal-plan-${Date.now()}`,
      clientId: selectedClient,
      meals: meals.filter(meal => meal.foods.some(food => food.name.trim())),
      totalCalories,
      notes
    };

    if (editingPlan) {
      updateMealPlan(editingPlan.id, planData);
    } else {
      addMealPlan(planData);
    }

    resetForm();
  };

  const resetForm = () => {
    setSelectedClient('');
    setMeals([
      { 
        name: 'Bữa sáng', 
        totalCalories: 0, 
        foods: [{ 
          name: '', 
          macroType: 'Carb', 
          calories: 0, 
          notes: '' 
        }] 
      },
      { 
        name: 'Bữa trưa', 
        totalCalories: 0, 
        foods: [{ 
          name: '', 
          macroType: 'Pro', 
          calories: 0, 
          notes: '' 
        }] 
      },
      { 
        name: 'Bữa tối', 
        totalCalories: 0, 
        foods: [{ 
          name: '', 
          macroType: 'Pro', 
          calories: 0, 
          notes: '' 
        }] 
      }
    ]);
    setNotes('');
    setEditingPlan(null);
    setShowForm(false);
  };

  const updateMeal = (mealIndex: number, field: string, value: any) => {
    const newMeals = [...meals];
    newMeals[mealIndex][field] = value;
    setMeals(newMeals);
  };

  const addFood = (mealIndex: number) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foods.push({ 
      name: '', 
      macroType: 'Carb', 
      calories: 0, 
      notes: '' 
    });
    setMeals(newMeals);
  };

  const removeFood = (mealIndex: number, foodIndex: number) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foods.splice(foodIndex, 1);
    setMeals(newMeals);
  };

  const updateFood = (mealIndex: number, foodIndex: number, field: string, value: any) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foods[foodIndex][field] = value;
    setMeals(newMeals);
  };

  const addMeal = () => {
    setMeals([...meals, { 
      name: '', 
      totalCalories: 0, 
      foods: [{ 
        name: '', 
        macroType: 'Carb', 
        calories: 0, 
        notes: '' 
      }] 
    }]);
  };

  const removeMeal = (mealIndex: number) => {
    if (meals.length > 1) {
      const newMeals = meals.filter((_, index) => index !== mealIndex);
      setMeals(newMeals);
    }
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setSelectedClient(plan.clientId);
    setMeals(plan.meals);
    setNotes(plan.notes || '');
    setShowForm(true);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c: any) => c.id === clientId);
    return client?.fullName || 'Không tìm thấy';
  };

  const getMacroColor = (macroType: string) => {
    switch (macroType) {
      case 'Carb': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pro': return 'bg-green-100 text-green-800 border-green-200';
      case 'Fat': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 sm:mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-fitness-black">🍽️ Quản lý chế độ dinh dưỡng</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Tạo và quản lý meal plan chi tiết cho học viên</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-fitness-red to-red-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="font-medium">Tạo meal plan</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên học viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Meal Plans List */}
      <div className="grid gap-4 sm:gap-6 mb-6">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-fitness-black mb-2">
                    🍽️ Meal Plan - {getClientName(plan.clientId)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{getClientName(plan.clientId)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Utensils className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{plan.meals.length} bữa ăn</span>
                    </span>
                    <span className="bg-fitness-red text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                      {plan.totalCalories} kcal/ngày
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 sm:p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa meal plan này?')) {
                        deleteMealPlan(plan.id);
                      }
                    }}
                    className="p-2 sm:p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plan.meals.map((meal, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-fitness-black text-sm sm:text-base">{meal.name}</h4>
                      <span className="bg-fitness-red text-white px-2 py-1 rounded-full text-xs font-medium">
                        {meal.totalCalories} kcal
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {meal.foods.map((food, foodIndex) => (
                        <div key={foodIndex} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-800 text-sm">{food.name}</h5>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMacroColor(food.macroType)}`}>
                              {food.macroType}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>{food.calories} kcal</span>
                            {food.notes && (
                              <span className="italic">"{food.notes}"</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {plan.notes && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">📝 Ghi chú:</h4>
                  <p className="text-blue-800 text-xs sm:text-sm">{plan.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
          <ChefHat className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-2">Chưa có meal plan nào</h3>
          <p className="text-sm sm:text-base text-gray-400">Tạo meal plan đầu tiên cho học viên</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold text-fitness-black">
                  {editingPlan ? '✏️ Chỉnh sửa meal plan' : '🍽️ Tạo meal plan mới'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn học viên
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    required
                  >
                    <option value="">Chọn học viên</option>
                    {clients.map((client: any) => (
                      <option key={client.id} value={client.id}>
                        {client.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base sm:text-lg font-semibold text-fitness-black">🍽️ Các bữa ăn</h4>
                    <button
                      type="button"
                      onClick={addMeal}
                      className="text-xs sm:text-sm bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Thêm bữa ăn
                    </button>
                  </div>

                  {meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                        <input
                          type="text"
                          value={meal.name}
                          onChange={(e) => updateMeal(mealIndex, 'name', e.target.value)}
                          className="text-base sm:text-lg font-semibold bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-300 rounded px-3 py-2 flex-1"
                          placeholder="Tên bữa ăn"
                          required
                        />
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={meal.totalCalories}
                            onChange={(e) => updateMeal(mealIndex, 'totalCalories', parseInt(e.target.value) || 0)}
                            className="w-20 sm:w-24 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent text-xs sm:text-sm"
                            placeholder="Calo"
                            required
                          />
                          <span className="text-xs sm:text-sm text-gray-600">kcal</span>
                          {meals.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMeal(mealIndex)}
                              className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700">
                            🥘 Thực phẩm
                          </label>
                          <button
                            type="button"
                            onClick={() => addFood(mealIndex)}
                            className="text-xs sm:text-sm bg-blue-500 text-white px-2 sm:px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                          >
                            Thêm món
                          </button>
                        </div>
                        <div className="space-y-3">
                          {meal.foods.map((food, foodIndex) => (
                            <div key={foodIndex} className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                                <input
                                  type="text"
                                  value={food.name}
                                  onChange={(e) => updateFood(mealIndex, foodIndex, 'name', e.target.value)}
                                  className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent text-xs sm:text-sm"
                                  placeholder="Tên món ăn"
                                  required
                                />
                                <select
                                  value={food.macroType}
                                  onChange={(e) => updateFood(mealIndex, foodIndex, 'macroType', e.target.value)}
                                  className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent text-xs sm:text-sm"
                                >
                                  <option value="Carb">🍞 Carb</option>
                                  <option value="Pro">🥩 Pro</option>
                                  <option value="Fat">🥑 Fat</option>
                                </select>
                                <input
                                  type="number"
                                  min="0"
                                  value={food.calories}
                                  onChange={(e) => updateFood(mealIndex, foodIndex, 'calories', parseInt(e.target.value) || 0)}
                                  className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent text-xs sm:text-sm"
                                  placeholder="Calo"
                                  required
                                />
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={food.notes}
                                    onChange={(e) => updateFood(mealIndex, foodIndex, 'notes', e.target.value)}
                                    className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent text-xs sm:text-sm"
                                    placeholder="Ghi chú"
                                  />
                                  {meal.foods.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeFood(mealIndex, foodIndex)}
                                      className="text-red-500 hover:bg-red-100 p-2 rounded transition-colors"
                                    >
                                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    placeholder="Ghi chú về chế độ dinh dưỡng, lưu ý đặc biệt..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm sm:text-base"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-fitness-red to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium text-sm sm:text-base"
                  >
                    {editingPlan ? 'Cập nhật' : 'Tạo meal plan'}
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

export default MealPlanManagement;