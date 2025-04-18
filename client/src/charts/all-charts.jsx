import BarChartComponent from "@/charts/firstOne"
import TableDemo from "@/charts/monthly-payment" 

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="w-full lg:w-1/2">
      <TableDemo />
      </div>
      <div className="w-full lg:w-1/2"> 
      <BarChartComponent />
      </div>
    </div>
  )
}
