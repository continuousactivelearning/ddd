import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { day: 'Mon', Active: 4, Completed: 3, Missed: 1 },
  { day: 'Tue', Active: 5, Completed: 4, Missed: 0 },
];

const ProgressChart = () => (
  <LineChart width={500} height={300} data={data}>
    <XAxis dataKey="day" />
    <YAxis />
    <Tooltip />
    <CartesianGrid stroke="#ccc" />
    <Line type="monotone" dataKey="Active" stroke="#8884d8" />
    <Line type="monotone" dataKey="Completed" stroke="#82ca9d" />
    <Line type="monotone" dataKey="Missed" stroke="#ff7300" />
  </LineChart>
);

export default ProgressChart;