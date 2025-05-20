import React, { useEffect, useState } from "react";
import ApiService from "../Api/Api";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import toast from "react-hot-toast";

Chart.register(...registerables);

const RapportTechniqueTechnicien = () => {
  const [kpi, setKpi] = useState({});
  const [charts, setCharts] = useState({});

  useEffect(() => {
    const fetchRapport = async () => {
      try {
        const res = await ApiService.rapportTechnicien.getRapport();
        setKpi(res.data.kpi);
        setCharts(res.data.graphiques);
      } catch (error) {
        toast.error("Erreur lors du chargement du rapport technique.");
        console.error(error);
      }
    };
    fetchRapport();
  }, []);

  const downloadExcel = async () => {
    try {
      const res = await ApiService.rapportTechnicien.exportExcel();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapport_technicien.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Erreur lors de l'export Excel.");
    }
  };

  const downloadPDF = async () => {
    try {
      const res = await ApiService.rapportTechnicien.exportPDF();
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapport_technicien.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error("Erreur lors de l'export PDF.");
    }
  };

  return (
    <div className="pt-24 px-6 w-full">
      <h1 className="text-2xl text-gray-500  font-bold mb-6">📋 Rapport Technique</h1>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 text-gray-500  md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <h2 className="text-gray-500 text-sm">Interventions</h2>
          <p className="text-2xl font-bold">{kpi.total_interventions || 0}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <h2 className="text-gray-500 text-sm">Entretiens</h2>
          <p className="text-2xl font-bold">{kpi.total_entretiens || 0}</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <h2 className="text-gray-500 text-sm">Durée moyenne</h2>
          <p className="text-2xl font-bold">{kpi.moyenne_duree_entretiens || 0} min</p>
        </div>
        <div className="bg-white shadow p-4 rounded-xl text-center">
          <h2 className="text-gray-500 text-sm">Activités totales</h2>
          <p className="text-2xl font-bold">
            {(kpi.total_interventions || 0) + (kpi.total_entretiens || 0)}
          </p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 text-gray-500  md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-3">📊 Interventions par Type</h2>
          <Pie
            data={{
              labels: charts.types_intervention?.map(e => e.type_intervention),
              datasets: [{
                label: 'Interventions',
                data: charts.types_intervention?.map(e => e.count),
                backgroundColor: ['#60a5fa', '#34d399', '#f87171'],
              }]
            }}
          />
        </div>

        <div className="bg-white p-4 text-gray-500  shadow rounded-xl">
          <h2 className="text-lg font-semibold mb-3">📊 Entretiens par Type</h2>
          <Pie
            data={{
              labels: charts.types_entretien?.map(e => e.type_entretien),
              datasets: [{
                label: 'Entretiens',
                data: charts.types_entretien?.map(e => e.count),
                backgroundColor: ['#818cf8', '#facc15', '#4ade80', '#f472b6'],
              }]
            }}
          />
        </div>

        <div className="bg-white p-4 shadow text-gray-500  rounded-xl col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-3">📅 Activités par Mois</h2>
          <Bar
            data={{
              labels: charts.interventions_par_mois?.map(e => e.month),
              datasets: [
                {
                  label: 'Interventions',
                  data: charts.interventions_par_mois?.map(e => e.count),
                  backgroundColor: '#60a5fa',
                },
                {
                  label: 'Entretiens',
                  data: charts.entretiens_par_mois?.map(e => e.count),
                  backgroundColor: '#34d399',
                }
              ]
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>

      {/* Boutons d'export */}
      <div className="flex gap-4 text-gray-500  mt-4">
        <button
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <FaFileExcel /> Export Excel
        </button>
        <button
          onClick={downloadPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
        >
          <FaFilePdf /> Export PDF
        </button>
      </div>
    </div>
  );
};

export default RapportTechniqueTechnicien;
