
import React from 'react';

const ChartContainer = ({ config = {}, children }) => {
  if (!config) {
    return <div>Error: Chart configuration is missing.</div>;
  }

 
  return (
    <div className="chart-container">
      {children}
    </div>
  );
};

export default ChartContainer;