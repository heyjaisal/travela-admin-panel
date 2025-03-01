// Dashboard.jsx
import React from 'react';
import { BarChartComponent } from '../charts/Barchart'; // Adjust the import path as necessary
import { AreaChartComponent } from '../charts/Areachart'; // Adjust the import path as necessary
import Component from '@/charts/Piechart';
import LineChartComponent from '@/charts/Linechart';

const Dashboard = () => {
  return (
    <div className="mx-auto p-4">

      <Component/>
    </div>
  );
};

export default Dashboard;