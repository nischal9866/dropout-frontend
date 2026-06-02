import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name || user?.username}!
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your account today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Quick Stats</h3>
          <p className="text-gray-600">Dashboard content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;