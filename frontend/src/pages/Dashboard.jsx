import 'animate.css';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import EarningsGraph from '../components/EarningsGraph';
import Engagement from '../components/Engagement';
import LikesShares from '../components/LikesShares';
import FollowersGrowth from '../components/FollowersGrowth.jsx';
import ChatUI from '../components/ChatUI.jsx';


const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Title with subtle animation */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 animate__animated animate__fadeIn">
        Social Media Analyzer
      </h1>

      {/* Grid Layout for the Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">

        {/* BarChart */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
          <BarChart />
        </div>

        {/* PieChart */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
          <PieChart />
        </div>

        {/* EarningsGraph */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
          <EarningsGraph />
        </div>

        {/* Engagement */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
          <Engagement />
        </div>

        {/* FollowersGrowth */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
          <FollowersGrowth />
        </div>

        {/* LikesShares */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
          <LikesShares />
        </div>
      </div>
      <ChatUI />
    </div>
  );
};

export default Dashboard;
