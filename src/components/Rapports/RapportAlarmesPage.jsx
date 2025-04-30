import React, { useEffect, useState } from "react";
import ApiService from "../../Api/Api";
import Chart from "react-apexcharts";
import dayjs from "dayjs";

const RapportAlarmesPage = () => {
  const [installations, setInstallations] = useState([]);
  const [installationId, setInstallationId] = useState("");
  const [mois, setMois] = useState(dayjs().format("YYYY-MM"));
  const [donnees, setDonnees] = useState([]);

  const fetchInstallations = async () => {
    try {
      const res = await ApiService.getInstallations();
      setInstallations(res.data.results || res.data);
    } catch (err) {
      console.error("Erreur installations :", err);
    }
  };

  const fetchRapport = async () => {
    try {
      const res = await ApiService.rapports.getRapportAlarmesMensuelles(installationId, mois);
      console.log("Données reçues pour alarmes :", res.data);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setDonnees(data);
    } catch (err) {
      console.error("Erreur chargement alarmes :", err);
      setDonnees([]);
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (installationId && mois) fetchRapport();
  };

  const handleExport = async (format) => {
    try {
      const exportFn =
        format === "pdf"
          ? ApiService.rapports.exportRapportAlarmesPDF
          : ApiService.rapports.exportRapportAlarmesExcel;
  
      const res = await exportFn({
        installation_id: installationId,
        mois,
      });
  
      const blob = new Blob([res.data], {
        type:
          format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
  
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport_alarmes_${mois}.${format}`;
      a.click();
    } catch (err) {
      console.error("Erreur export :", err);
    }
  };
  

  const gravites = ["mineure", "majeure", "critique"];
  const couleurs = {
    mineure: "#60a5fa",
    majeure: "#facc15",
    critique: "#ef4444",
  };

  return (
    <div className="p-8 text-gray-800">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Rapport Historique des Alarmes</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4 items-center">
        <select
          value={installationId}
          onChange={(e) => setInstallationId(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-auto"
        >
          <option value="">-- Sélectionner une installation --</option>
          {installations.map((inst) => (
            <option key={inst.id} value={inst.id}>{inst.nom}</option>
          ))}
        </select>

        <input
          type="month"
          value={mois}
          onChange={(e) => setMois(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Générer
        </button>
      </form>

      {/* Résultats */}
      {donnees.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tableau */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Tableau des alarmes</h3>
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Gravité</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {donnees.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border">{item.date}</td>
                      <td className="p-2 border capitalize">{item.gravite}</td>
                      <td className="p-2 border">{item.type}</td>
                      <td className="p-2 border">{item.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Graphique */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Alarmes par gravité</h3>
            <Chart
              type="bar"
              height={320}
              options={{
                chart: { id: "alarm-bar" },
                xaxis: {
                  categories: gravites.map((g) => g.charAt(0).toUpperCase() + g.slice(1)),
                },
                colors: gravites.map((g) => couleurs[g]),
              }}
              series={[
                {
                  name: "Nombre",
                  data: gravites.map(
                    (g) => donnees.filter((a) => a.gravite === g).length
                  ),
                },
              ]}
            />
          </div>

          {/* Boutons d'export */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              onClick={() => handleExport("xlsx")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              📤 Exporter Excel
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              📄 Exporter PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RapportAlarmesPage;
