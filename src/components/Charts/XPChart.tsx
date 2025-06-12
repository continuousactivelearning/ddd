import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { day: 'Mon', XP: 120 },
  { day: 'Tue', XP: 200 },
];

const XPChart = () => (
  <BarChart width={300} height={200} data={data}>
    <XAxis dataKey="day" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="XP" fill="#8884d8" />
  </BarChart>
);

export default XPChart;