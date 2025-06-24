import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const PeerComparisonRadar = () => {
  const data = {
    labels: ['Teamwork', 'Communication', 'Creativity', 'Consistency', 'Initiative'],
    datasets: [
      {
        label: 'You',
        data: [8, 6, 7, 9, 8],
        backgroundColor: 'rgba(34, 197, 94, 0.4)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2
      },
      {
        label: 'Class Avg',
        data: [6, 7, 6, 7, 6],
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
      }
    ]
  };

  const options = {
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 10,
        pointLabels: {
          font: {
            size: 16 
          },
          color: '#1e293b'
        },
        ticks: {
          stepSize: 1,
          backdropColor: 'transparent',
          color: '#334155',
          font: {
            size: 14 
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14 
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false 
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4" style={{ height: '500px' }}>
      <h2 className="text-xl font-bold mb-4">Peer Comparison</h2>
      <Radar data={data} options={options} />
    </div>
  );
};

export default PeerComparisonRadar;