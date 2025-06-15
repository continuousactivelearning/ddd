import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function PieChartComponent() {

  let n=22;
  let handleanswerClick=()=>{
    let new_data=[...data];
    new_data[0].value+=1;
    new_data[1].value-=1;
    setdata(new_data);
    console.log(data,'Answered');
  };
  
  let [data,setdata] = useState([
    { category: "Answered", value: 0 },
    { category: "Not-answered", value: n }
  ]);
  const customLabels = data.map(item=>`${(item.value/n*100).toFixed(2)}%(${item.value})`);
  const legendlabels=data.map(item=>item.category);

  const renderLabel = ({ index }) => customLabels[index];

  let colors = ["#57B9FF", "#517891"];

  const renderCustomLegend = () => {
    return <div><ul className="list">{legendlabels.map((item,index)=>(<li key={index} className="list-item"style={{backgroundColor:colors[index%colors.length]}}>{item}</li>))}</ul></div>;
  };
  return (
    <>
    <button onClick={handleanswerClick}>Answered</button>
      <div
        style={{
          width: "50%",
          height: 400,
          border: "1px solid black",
        }}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              isAnimationActive={false}
              cx="60%"
              cy="50%"
              outerRadius={150}
              innerRadius={100}
              label={renderLabel}
              labelLine={true}
            >
              {data.map((entry, index) => (
                <Cell key={customLabels[index]} fill={colors[index % colors.length]}></Cell>
              ))}
            </Pie>
            <Tooltip></Tooltip>
            <Legend content={renderCustomLegend} align="right" layout="vertical" verticalAlign="top"></Legend>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default PieChartComponent;
