import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Dumbbell, Calendar, Scale, Utensils, TrendingUp, TrendingDown, ChefHat } from 'lucide-react';
import Timer from '../components/Timer';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { workoutPlans, mealPlans, weightRecords, addWeightRecord, updateWorkoutPlan } = useData();
  const [activeTab, setActiveTab] = useState('workout');
  const [newWeight, setNewWeight] = useState('');
  const [weightNotes, setWeightNotes] = useState('');

  const userWorkoutPlans = workoutPlans.filter(plan => plan.clientId === user?.id);
  const currentWeekPlan = userWorkoutPlans.sort((a, b) => b.weekNumber - a.weekNumber)[0];
  const previousWeekPlan = userWorkoutPlans.find(plan => plan.weekNumber === (currentWeekPlan?.weekNumber || 1) - 1);
  
  const userMealPlans = mealPlans.filter(plan => plan.clientId === user?.id);
  const currentMealPlan = userMealPlans[0];
  
  const userWeightRecords = weightRecords.filter(record => record.clientId === user?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeight && user) {
      addWeightRecord({
        id: `weight-${Date.now()}`,
        clientId: user.id,
        weight: parseFloat(newWeight),
        date: new Date().toISOString().split('T')[0],
        notes: weightNotes
      });
      setNewWeight('');
      setWeightNotes('');
    }
  };

  const updateSetData = (dayIndex: number, exerciseIndex: number, setIndex: number, field: string, value: number) => {
    if (!currentWeekPlan) return;
    
    const updatedPlan = { ...currentWeekPlan };
    const set = updatedPlan.days[dayIndex].exercises[exerciseIndex].sets[setIndex];
    set[field] = value;
    
    // Calculate volume
    if (field === 'reality' || field === 'weight') {
      set.volume = set.reality * set.weight;
    }
    
    updateWorkoutPlan(currentWeekPlan.id, updatedPlan);
  };

  const getVolumeComparison = (currentVolume: number, dayIndex: number, exerciseIndex: number, setIndex: number) => {
    if (!previousWeekPlan) return 'bg-gray-100';
    
    const previousSet = previousWeekPlan.days[dayIndex]?.exercises[exerciseIndex]?.sets[setIndex];
    if (!previousSet) return 'bg-gray-100';
    
    const previousVolume = previousSet.volume || 0;
    
    if (currentVolume > previousVolume) return 'bg-green-100 text-green-800';
    if (currentVolume < previousVolume) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getMacroColor = (macroType: string) => {
    switch (macroType) {
      case 'Carb': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pro': return 'bg-green-100 text-green-800 border-green-200';
      case 'Fat': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tabs = [
    { id: 'workout', label: 'Bài tập', icon: Dumbbell },
    { id: 'meal', label: 'Chế độ ăn', icon: Utensils },
    { id: 'weight', label: 'Cân nặng', icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-fitness-black to-fitness-red rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">👋 Chào mừng, {user?.fullName}!</h1>
            <p className="text-gray-200 text-sm sm:text-base">Theo dõi tiến độ tập luyện và chế độ dinh dưỡng của bạn</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 mb-6 sm:mb-8 shadow-lg border border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 sm:px-4 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-fitness-red to-red-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Workout Tab */}
        {activeTab === 'workout' && (
          <div>
            {currentWeekPlan ? (
              <div>
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-fitness-black">🏋️ {currentWeekPlan.name}</h2>
                    <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Tuần {currentWeekPlan.weekNumber}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {currentWeekPlan.days.map((day, idx) => (
                      <div
                        key={idx}
                        className={`p-2 sm:p-3 rounded-lg text-center text-xs ${
                          day.isRestDay 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <div className="font-medium truncate">{day.day}</div>
                        <div className="text-xs">{day.isRestDay ? '😴' : `${day.exercises.length} bài`}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Workouts */}
                <div className="space-y-4 sm:space-y-6">
                  {currentWeekPlan.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                      <h3 className="text-lg sm:text-xl font-bold text-fitness-black mb-4">📅 {day.day}</h3>
                      
                      {day.isRestDay ? (
                        <div className="text-center py-8 sm:py-12 text-gray-500">
                          <span className="text-3xl sm:text-4xl">🛌</span>
                          <p className="text-base sm:text-lg mt-2">Ngày nghỉ - Hãy thư giãn và phục hồi!</p>
                        </div>
                      ) : (
                        <div className="space-y-4 sm:space-y-6">
                          {day.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 space-y-3 lg:space-y-0">
                                <h4 className="text-base sm:text-lg font-semibold text-fitness-black">💪 {exercise.name}</h4>
                                <div className="w-full lg:w-auto">
                                  <Timer />
                                </div>
                              </div>
                              
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs sm:text-sm">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="text-left py-2 px-2 sm:px-3">Set</th>
                                      <th className="text-center py-2 px-2 sm:px-3">Reps</th>
                                      <th className="text-center py-2 px-2 sm:px-3">Reality</th>
                                      <th className="text-center py-2 px-2 sm:px-3">Weight (kg)</th>
                                      <th className="text-center py-2 px-2 sm:px-3">Volume</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {exercise.sets.map((set, setIndex) => (
                                      <tr key={setIndex} className="border-b border-gray-100">
                                        <td className="py-2 px-2 sm:px-3 font-medium">Set {set.set}</td>
                                        <td className="py-2 px-2 sm:px-3 text-center">{set.reps}</td>
                                        <td className="py-2 px-2 sm:px-3">
                                          <input
                                            type="number"
                                            min="0"
                                            value={set.reality || set.reps}
                                            onChange={(e) => updateSetData(dayIndex, exerciseIndex, setIndex, 'reality', parseInt(e.target.value) || 0)}
                                            className="w-12 sm:w-16 px-1 sm:px-2 py-1 border border-gray-300 rounded text-center text-xs sm:text-sm"
                                          />
                                        </td>
                                        <td className="py-2 px-2 sm:px-3">
                                          <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={set.weight || 0}
                                            onChange={(e) => updateSetData(dayIndex, exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                                            className="w-14 sm:w-20 px-1 sm:px-2 py-1 border border-gray-300 rounded text-center text-xs sm:text-sm"
                                          />
                                        </td>
                                        <td className="py-2 px-2 sm:px-3">
                                          <div className={`px-1 sm:px-2 py-1 rounded text-center text-xs font-medium ${
                                            getVolumeComparison(set.volume || 0, dayIndex, exerciseIndex, setIndex)
                                          }`}>
                                            {set.volume || 0}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center border border-gray-200">
                <Dumbbell className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Chưa có bài tập nào</h3>
                <p className="text-sm sm:text-base text-gray-500">PT sẽ sớm tạo chương trình tập luyện cho bạn!</p>
              </div>
            )}
          </div>
        )}

        {/* Meal Plan Tab */}
        {activeTab === 'meal' && (
          <div>
            {currentMealPlan ? (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-fitness-black mb-6">🍽️ Chế độ dinh dưỡng</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {currentMealPlan.meals.map((meal, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-fitness-black text-sm sm:text-base">{meal.name}</h3>
                        <span className="bg-fitness-red text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                          {meal.totalCalories} kcal
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {meal.foods.map((food, foodIndex) => (
                          <div key={foodIndex} className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800 text-xs sm:text-sm">{food.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMacroColor(food.macroType)}`}>
                                {food.macroType}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span className="font-medium">{food.calories} kcal</span>
                              {food.notes && (
                                <span className="italic text-gray-500">"{food.notes}"</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-fitness-red to-red-600 bg-opacity-10 rounded-xl border border-fitness-red border-opacity-20">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-fitness-black text-sm sm:text-base">📊 Tổng calories trong ngày:</span>
                    <span className="text-lg sm:text-xl font-bold text-fitness-red">{currentMealPlan.totalCalories} kcal</span>
                  </div>
                  {currentMealPlan.notes && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">💡 {currentMealPlan.notes}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center border border-gray-200">
                <ChefHat className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Chưa có chế độ dinh dưỡng</h3>
                <p className="text-sm sm:text-base text-gray-500">PT sẽ sớm tạo chế độ ăn phù hợp cho bạn!</p>
              </div>
            )}
          </div>
        )}

        {/* Weight Tracking Tab */}
        {activeTab === 'weight' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Add Weight Form */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-fitness-black mb-4">⚖️ Ghi nhận cân nặng</h2>
              <form onSubmit={handleWeightSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Cân nặng (kg)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={weightNotes}
                    onChange={(e) => setWeightNotes(e.target.value)}
                    placeholder="Ghi chú (tùy chọn)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fitness-red focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 bg-gradient-to-r from-fitness-red to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm sm:text-base font-medium"
                >
                  Thêm
                </button>
              </form>
            </div>

            {/* Weight History */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-fitness-black mb-4">📈 Lịch sử cân nặng</h3>
              {userWeightRecords.length > 0 ? (
                <div className="space-y-3">
                  {userWeightRecords.map((record, index) => {
                    const previousRecord = userWeightRecords[index + 1];
                    const weightChange = previousRecord ? record.weight - previousRecord.weight : 0;
                    
                    return (
                      <div key={record.id} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <div className="font-semibold text-fitness-black text-sm sm:text-base">{record.weight} kg</div>
                          <div className="text-xs sm:text-sm text-gray-600">{new Date(record.date).toLocaleDateString('vi-VN')}</div>
                          {record.notes && (
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">💭 {record.notes}</div>
                          )}
                        </div>
                        {weightChange !== 0 && (
                          <div className={`flex items-center space-x-1 ${
                            weightChange > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {weightChange > 0 ? (
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            <span className="text-xs sm:text-sm font-medium">
                              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Scale className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm sm:text-base">Chưa có dữ liệu cân nặng. Hãy thêm lần đo đầu tiên!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;