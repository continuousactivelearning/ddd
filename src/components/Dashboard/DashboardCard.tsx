import React from 'react';
import './styles.css';

export interface CardProps {
  icon: React.ReactNode;
  value: string;
  title: string;
  subtitle: string;
  change: string;
}

const DashboardCard: React.FC<CardProps> = ({ icon, value, title, subtitle, change }) => (
  <div className="dashboard-card">
    <div className="icon-circle">{icon}</div>
    <div className="card-content">
      <div className="main-value">{value}</div>
      <div className="label">{title}</div>
      <div className="sublabel">{subtitle}</div>
    </div>
    <div className="delta">{change}</div>
  </div>
);

export default DashboardCard;
