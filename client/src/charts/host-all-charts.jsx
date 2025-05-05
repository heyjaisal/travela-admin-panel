import BarChartComponent from "@/charts/host-bookings";
import TableDemo from "@/charts/host-monthly-payment";

export default function HostDashboard({ id }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <TableDemo id={id} />
      </div>
      <div className="w-full">
        <BarChartComponent id={id} />
      </div>
    </div>
  );
}
