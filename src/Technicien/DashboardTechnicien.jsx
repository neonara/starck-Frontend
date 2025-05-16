import UpcomingEntretienList from "./UpcomingEntretienList";
const DashboardTechnicien = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur votre dashboard</h1>
      <UpcomingEntretienList />
    </div>
  );
};

export default DashboardTechnicien;
