import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Correct', value: 55 },
  { name: 'Incorrect', value: 35},
  { name: 'Unattempted', value: 20 },
];

const COLORS = ['#00C49F', '#FF8042', '#FFBB28'];

const PerformanceMeter = () => (
  <PieChart width={200} height={200}>
    <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} fill="#8884d8" dataKey="value">
      {data.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
    </Pie>
    <Tooltip />
  </PieChart>
);

export default PerformanceMeter;