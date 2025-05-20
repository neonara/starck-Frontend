import React, { useEffect, useState } from "react";
import UpcomingEntretienList from "./UpcomingEntretienList";
import TechnicianActivityChart from "./TechnicianActivityChart";
import TaskCard from "./TaskCard";
import ApiService from "../Api/Api";

const DashboardTechnicien = () => {
  const [stats, setStats] = useState({
    entretiens_par_semaine: {},
    interventions_par_semaine: {},
    anomalies_critiques_non_resolues: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await ApiService.getActivitesMensuellesTechnicien();
        setStats(res.data);
      } catch (e) {
        console.error("Erreur lors du chargement des statistiques :", e);
      }
    };
    fetchStats();
  }, []);

  const weeks = new Set([
    ...Object.keys(stats.entretiens_par_semaine),
    ...Object.keys(stats.interventions_par_semaine),
  ]);

  const chartData = Array.from(weeks).map((week) => ({
    semaine: week,
    entretiens: stats.entretiens_par_semaine[week] || 0,
    interventions: stats.interventions_par_semaine[week] || 0,
  }));

  return (
    <div className="p-6 space-y-6">
      <UpcomingEntretienList />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TechnicianActivityChart data={chartData} />
        <TaskCard
          entretiensCount={Object.values(stats.entretiens_par_semaine).reduce((a, b) => a + b, 0)}
          interventionsCount={Object.values(stats.interventions_par_semaine).reduce((a, b) => a + b, 0)}
          anomaliesCount={stats.anomalies_critiques_non_resolues}
        />
      </div>
    </div>
  );
};

export default DashboardTechnicien;
