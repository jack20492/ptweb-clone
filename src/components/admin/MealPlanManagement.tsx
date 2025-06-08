import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit, Trash2, User, Calendar, Utensils, Search, X } from 'lucide-react';

const MealPlanManagement: React.FC = () => {
  const { mealPlans, addMealPlan, updateMealPlan, deleteMealPlan } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [meals, setMeals] = useState([
    { name: 'Bữa sáng', calories: 0, protein: 0, carbs: 0, fat: 0, foods: [''] },
    { name: 'Bữa trưa', calories: 0, protein: 0, carbs: 0, fat: 0, foods: [''] },
    { name: 'Bữa tối', calories: 0, protein: 0, carbs: 0, fat: 0, foods: [''] }
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
    
    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    
    const planData = {
      id: editingPlan?.id || `meal-plan-${Date.now()}`,
      clientId: selectedClient,
      meals: meals.filter(meal => meal.foods.some(food => food.trim())),
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
      { name: 'Bữa sáng', calories: 0, protein: 0, carbs: 0, fat: 0, foods: [''] },
      { name: 'Bữa trưa', calories: 0, protein: 0, carbs: 0, fat: 0, foods: [''] },
      { name: 'Bữa tối', calories: 0, protein: 0, carbs: 0, fat: 0, foods: [''] }
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
    newMeals[mealIndex].foods.push('');
    setMeals(newMeals);
  };

  const removeFood = (mealIndex: number, foodIndex: number) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foods.splice(foodIndex, 1);
    setMeals(newMeals);
  };

  const updateFood = (mealIndex: number, foodIndex: number, value: string) => {
    const newMeals = [...meals];
    newMeals[mealIndex].foods[foodIndex] = value;
    setMeals(newMeals);
  };

  const addMeal = () => {
    setMeals([...meals, { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, foods: [''] }]);
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

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-fitness-black">Quản lý chế độ dinh dưỡng</h2>
          <p className="text-gray-600 mt-1">Tạo và quản lý meal plan cho học viên</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-fitness-red to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Tạo meal plan</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên học viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Meal Plans List */}
      <div className="grid gap-6 mb-6">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-fitness-black mb-2">
                    Meal Plan - {getClientName(plan.clientId)}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{getClientName(plan.clientId)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Utensils className="h-4 w-4" />
                      <span>{plan.meals.length} bữa ăn</span>
                    </span>
                    <span className="bg-fitness-red text-white px-3 py-1 rounded-full text-xs font-medium">
                      {plan.totalCalories} kcal/ngày
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa meal plan này?')) {
                        deleteMealPlan(plan.id);
                      }
                    }}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plan.meals.map((meal, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-fitness-black mb-3">{meal.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span className="font-medium">{meal.calories} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium">{meal.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span className="font-medium">{meal.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span className="font-medium">{meal.fat}g</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h5 className="font-medium text-gray-700 mb-2">Thực phẩm:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {meal.foods.map((food, foodIndex) => (
                          <li key={foodIndex}>• {food}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {plan.notes && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Ghi chú:</h4>
                  <p className="text-blue-800 text-sm">{plan.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Chưa có meal plan nào</h3>
          <p className="text-gray-400">Tạo meal plan đầu tiên cho học viên</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-fitness-black">
                  {editingPlan ? '✏️ Chỉnh sửa meal plan' : '🍽️ Tạo meal plan mới'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn học viên
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent transition-all duration-200"
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

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-fitness-black">Các bữa ăn</h4>
                    <button
                      type="button"
                      onClick={addMeal}
                      className="text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Thêm bữa ăn
                    </button>
                  </div>

                  {meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="text"
                          value={meal.name}
                          onChange={(e) => updateMeal(mealIndex, 'name', e.target.value)}
                          className="text-lg font-semibold bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-300 rounded px-3 py-2"
                          placeholder="Tên bữa ăn"
                          required
                        />
                        {meals.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMeal(mealIndex)}
                            className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Calories (kcal)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={meal.calories}
                            onChange={(e) => updateMeal(mealIndex, 'calories', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Protein (g)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={meal.protein}
                            onChange={(e) => updateMeal(mealIndex, 'protein', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Carbs (g)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={meal.carbs}
                            onChange={(e) => updateMeal(mealIndex, 'carbs', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fat (g)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={meal.fat}
                            onChange={(e) => updateMeal(mealIndex, 'fat', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Thực phẩm
                          </label>
                          <button
                            type="button"
                            onClick={() => addFood(mealIndex)}
                            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                          >
                            Thêm thực phẩm
                          </button>
                        </div>
                        <div className="space-y-2">
                          {meal.foods.map((food, foodIndex) => (
                            <div key={foodIndex} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={food}
                                onChange={(e) => updateFood(mealIndex, foodIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent"
                                placeholder="Tên thực phẩm và khối lượng"
                                required
                              />
                              {meal.foods.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeFood(mealIndex, foodIndex)}
                                  className="text-red-500 hover:bg-red-100 p-2 rounded transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-fitness-red focus:border-transparent transition-all duration-200"
                    placeholder="Ghi chú về chế độ dinh dưỡng, lưu ý đặc biệt..."
                  />
                </div>

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-fitness-red to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
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