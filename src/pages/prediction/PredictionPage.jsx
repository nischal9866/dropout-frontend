import { useState } from 'react';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  ChartBarIcon, 
  AcademicCapIcon, 
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const PredictionPage = () => {
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Info
    Age: '',
    Gender: '',
    Department: '',
    Semester: '',
    
    // Academic Performance
    GPA: '',
    Semester_GPA: '',
    CGPA: '',
    Study_Hours_per_Day: '',
    Attendance_Rate: '',
    Assignment_Delay_Days: '',
    
    // Financial & Support
    Family_Income: '',
    Scholarship: '',
    Part_Time_Job: '',
    
    // Other Factors
    Internet_Access: '',
    Travel_Time_Minutes: '',
    Stress_Index: '',
    Parental_Education: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Convert string values to numbers
      const predictionData = {};
      for (const key in formData) {
        let value = formData[key];
        
        // Convert numeric fields
        if (['Age', 'GPA', 'Semester_GPA', 'CGPA', 'Study_Hours_per_Day', 
             'Attendance_Rate', 'Assignment_Delay_Days', 'Family_Income', 
             'Travel_Time_Minutes', 'Stress_Index'].includes(key)) {
          value = parseFloat(value) || 0;
        }
        
        predictionData[key] = value;
      }
      
      const response = await axios.post('prediction/predict/', predictionData);
      
      if (response.data.success) {
        setPredictionResult(response.data.data);
        toast.success('Prediction completed!');
        // Scroll to results
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        toast.error(response.data.error || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error(error.response?.data?.error || 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Age: '',
      Gender: '',
      Department: '',
      Semester: '',
      GPA: '',
      Semester_GPA: '',
      CGPA: '',
      Study_Hours_per_Day: '',
      Attendance_Rate: '',
      Assignment_Delay_Days: '',
      Family_Income: '',
      Scholarship: '',
      Part_Time_Job: '',
      Internet_Access: '',
      Travel_Time_Minutes: '',
      Stress_Index: '',
      Parental_Education: ''
    });
    setPredictionResult(null);
  };

  const getRiskColor = (risk) => {
    if (risk.includes('Critical')) return 'bg-red-100 text-red-800 border-red-200';
    if (risk.includes('High')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (risk.includes('Moderate')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getRiskIcon = (risk) => {
    if (risk.includes('Critical')) return <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />;
    if (risk.includes('High')) return <ExclamationTriangleIcon className="w-12 h-12 text-orange-600" />;
    if (risk.includes('Moderate')) return <ChartBarIcon className="w-12 h-12 text-yellow-600" />;
    return <CheckCircleIcon className="w-12 h-12 text-green-600" />;
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Student Dropout Prediction System</h1>
        <p className="text-primary-100">
          Early warning system to identify students at risk of dropping out
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Student Information Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="Age"
                      value={formData.Age}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="e.g., 20.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="Gender"
                      value={formData.Gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      name="Department"
                      value={formData.Department}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Department</option>
                      <option value="CS">Computer Science</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Business">Business</option>
                      <option value="Arts">Arts</option>
                      <option value="Science">Science</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semester/Year
                    </label>
                    <select
                      name="Semester"
                      value={formData.Semester}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Semester</option>
                      <option value="Year 1">Year 1</option>
                      <option value="Year 2">Year 2</option>
                      <option value="Year 3">Year 3</option>
                      <option value="Year 4">Year 4</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Academic Performance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Academic Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current GPA (0-4)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="GPA"
                      value={formData.GPA}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="e.g., 3.2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Semester GPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="Semester_GPA"
                      value={formData.Semester_GPA}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="e.g., 3.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CGPA (Cumulative)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="CGPA"
                      value={formData.CGPA}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="e.g., 3.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Study Hours per Day
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="Study_Hours_per_Day"
                      value={formData.Study_Hours_per_Day}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Hours"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attendance Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="Attendance_Rate"
                      value={formData.Attendance_Rate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="0-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assignment Delay Days
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="Assignment_Delay_Days"
                      value={formData.Assignment_Delay_Days}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Average delay days"
                    />
                  </div>
                </div>
              </div>

              {/* Financial & Support */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Financial & Support
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Family Income (USD)
                    </label>
                    <input
                      type="number"
                      name="Family_Income"
                      value={formData.Family_Income}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Annual income"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scholarship
                    </label>
                    <select
                      name="Scholarship"
                      value={formData.Scholarship}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Part-Time Job
                    </label>
                    <select
                      name="Part_Time_Job"
                      value={formData.Part_Time_Job}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parental Education
                    </label>
                    <select
                      name="Parental_Education"
                      value={formData.Parental_Education}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select</option>
                      <option value="No Formal Education">No Formal Education</option>
                      <option value="High School">High School</option>
                      <option value="Bachelor">Bachelor's Degree</option>
                      <option value="Master">Master's Degree</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Other Factors */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <BuildingOfficeIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Other Factors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Internet Access
                    </label>
                    <select
                      name="Internet_Access"
                      value={formData.Internet_Access}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Travel Time (Minutes)
                    </label>
                    <input
                      type="number"
                      name="Travel_Time_Minutes"
                      value={formData.Travel_Time_Minutes}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Minutes to college"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stress Index (1-10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="Stress_Index"
                      value={formData.Stress_Index}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="1-10"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </div>
                  ) : (
                    'Predict Dropout Risk'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-1" id="results">
          {predictionResult ? (
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Prediction Results</h2>
              
              {/* Risk Level */}
              <div className={`rounded-lg p-4 mb-4 border-2 ${getRiskColor(predictionResult.risk_level)}`}>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    {getRiskIcon(predictionResult.risk_level)}
                  </div>
                  <h3 className="text-lg font-bold mb-1">Risk Level</h3>
                  <p className="text-xl font-bold">{predictionResult.risk_level}</p>
                </div>
              </div>

              {/* Dropout Probability */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dropout Probability: {predictionResult.dropout_probability}%
                </label>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${
                      predictionResult.dropout_probability < 30 ? 'bg-green-500' :
                      predictionResult.dropout_probability < 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${predictionResult.dropout_probability}%` }}
                  ></div>
                </div>
              </div>

              {/* Prediction */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Prediction:</p>
                <p className={`font-bold text-lg ${
                  predictionResult.prediction === 'At Risk of Dropout' 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {predictionResult.prediction}
                </p>
              </div>

              {/* Confidence */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confidence Score: {predictionResult.confidence_score}%
                </label>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${predictionResult.confidence_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Model Info */}
              <div className="mb-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <p>Model: {predictionResult.model_used}</p>
                <p>Recall Rate: {predictionResult.recall_rate}</p>
                <p>Threshold: {predictionResult.threshold_used}%</p>
              </div>

              {/* Key Factors */}
              {predictionResult.key_factors && predictionResult.key_factors.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-1 text-red-500" />
                    Key Risk Factors:
                  </h3>
                  <ul className="space-y-1">
                    {predictionResult.key_factors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {predictionResult.recommendations && predictionResult.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <InformationCircleIcon className="w-4 h-4 mr-1 text-blue-500" />
                    Recommendations:
                  </h3>
                  <ul className="space-y-1">
                    {predictionResult.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Timestamp */}
              <div className="mt-4 pt-3 border-t text-xs text-gray-500">
                Analysis completed: {new Date(predictionResult.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Predict</h3>
              <p className="text-gray-500 text-sm">
                Fill in the student details on the left and click "Predict Dropout Risk" to see the analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;