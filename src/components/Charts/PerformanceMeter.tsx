import { PieChart, Pie, Cell } from 'recharts';

const percentage = 87;
const circleData = [
  { name: 'progress', value: percentage },
  { name: 'rest', value: 100 - percentage },
];

const COLORS = ['#2C9A65', '#e0e0e0'];

const EvaluationMeter = () => {
  return (
    <div
      style={{
        backgroundColor: 'transparent',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        maxWidth: '700px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        fontFamily: 'Arial, sans-serif',
        color: '#1f2937',
      }}
    >
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#1f2937',
          marginBottom: '24px',
        }}
      >
        Performance Score
      </h2>

      <div
        style={{
          alignSelf: 'center',
          position: 'relative',
          width: '120px',
          height: '120px',
          marginBottom: '24px',
        }}
      >
        <PieChart width={120} height={120}>
          <Pie
            data={circleData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={55}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            {circleData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#2C9A65',
              lineHeight: '1.2',
            }}
          >
            87%
          </div>
          <div style={{ fontSize: '14px', color: '#4b5563' }}>Overall</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          padding: '0 32px',
          background:'transparent'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>8.5/10</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Quiz score</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>92%</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Accuracy</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>15</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Questions</div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationMeter;
