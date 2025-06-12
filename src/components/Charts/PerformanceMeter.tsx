import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Correct', value: 75 },
  { name: 'Incorrect', value: 25 },
];

const COLORS = ['#00C49F', '#FF8042'];

const PerformanceMeter = () => (
  <PieChart width={200} height={200}>
    <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} fill="#8884d8" dataKey="value">
      {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
    </Pie>
    <Tooltip />
  </PieChart>
);

export default PerformanceMeter;