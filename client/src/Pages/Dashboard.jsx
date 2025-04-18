
import DashboardCharts from '@/charts/all-charts'
import Linechart from '@/charts/bookings'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='p-5'>
      <div className='mb-4'>
      <Linechart/>
      </div>
  <DashboardCharts/>
    </div>
  )
}

export default Dashboard