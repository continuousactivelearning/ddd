import  { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface DataPoint {
  day: string;
  name: string;
  score: number;
  hours: number;
}

const data: DataPoint[] = [
  { day: 'Mon', name: 'Monday', score: 65, hours: 3.2 },
  { day: 'Tue', name: 'Tuesday', score: 72, hours: 4.1 },
  { day: 'Wed', name: 'Wednesday', score: 68, hours: 2.8 },
  { day: 'Thu', name: 'Thursday', score: 75, hours: 5.2 },
  { day: 'Fri', name: 'Friday', score: 82, hours: 4.7 },
  { day: 'Sat', name: 'Saturday', score: 78, hours: 3.9 },
  { day: 'Sun', name: 'Sunday', score: 85, hours: 6.1 }
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: DataPoint;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        padding: '12px',
        color: '#fff',
        fontSize: '14px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
      }}>
        <p style={{ fontWeight: '600', marginBottom: '4px' }}>
          {`${data.name}: ${data.score}%`}
        </p>
        <p style={{ color: '#aaa', fontSize: '12px' }}>
          {`Hours: ${data.hours}h`}
        </p>
      </div>
    );
  }
  return null;
};

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: DataPoint;
  active?: boolean;
}

const CustomDot = ({ cx, cy, active }: DotProps) => {
  if (active && cx !== undefined && cy !== undefined) {
    return (
      <>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="#81d2d6"
          stroke="#ffffff"
          strokeWidth={2}
        />
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill="#ffffff"
        />
      </>
    );
  }
  
  if (cx !== undefined && cy !== undefined) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#81d2d6"
        stroke="#ffffff"
        strokeWidth={2}
      />
    );
  }
  
  return null;
};

const ProgressChart = () => {
  const [_hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const peakScore = Math.max(...data.map(d => d.score));
  const averageScore = Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length);
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);

  const handleMouseMove = (e: any) => {
    if (e && e.activePayload && e.activePayload[0]) {
      setHoveredPoint(e.activePayload[0].payload as DataPoint);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div style={{ width: '100%', color: '#fff' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#5ae66a',
            marginBottom: '0.25rem'
          }}>
            Learning Progress
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#aaa'
          }}>
            Last 7 days performance
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(129, 210, 214, 0.2)',
            padding: '0.5rem',
            borderRadius: '0.5rem'
          }}>
            <svg width="16" height="16" fill="none" stroke="#81d2d6" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span style={{
            color: '#6ee7b7',
            fontWeight: '600',
            fontSize: '0.875rem'
          }}>
            +12%
          </span>
          <span style={{
            color: '#aaa',
            fontSize: '0.875rem'
          }}>
            vs last week
          </span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '300px', marginBottom: '2rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#aaa' }}
              dy={10}
            />
            <YAxis 
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#aaa' }}
              dx={-10}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#81d2d6"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 6, fill: '#81d2d6', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        textAlign: 'center'
      }}>
        <div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '0.25rem'
          }}>
            {peakScore}%
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#aaa'
          }}>
            Peak Score
          </div>
        </div>
        <div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '0.25rem'
          }}>
            {averageScore}%
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#aaa'
          }}>
            Average
          </div>
        </div>
        <div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '0.25rem'
          }}>
            {totalHours.toFixed(0)}h
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#aaa'
          }}>
            Total Time
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;