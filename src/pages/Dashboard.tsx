import Streak from "../components/Dashboard/Streak";
import ProgressChart from "../components/Charts/ProgressChart";
import XPChart from "../components/Charts/XPChart";
import PerformanceMeter from "../components/Charts/PerformanceMeter";
import MiniGames from "../components/Gamification/MiniGames";
import Badges from "../components/Dashboard/Badges";
import Leaderboard from "../components/Leaderboard/Leaderboard";

const Dashboard = () => {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Streak />
        <ProgressChart />
        <XPChart />
        <PerformanceMeter />
        <MiniGames />
        <Badges />
        <Leaderboard />
      </section>
    </main>
  );
};

export default Dashboard;
