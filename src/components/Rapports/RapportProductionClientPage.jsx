import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import ApiService from "../../Api/Api";

const RapportProductionClientPage = () => {
  const [mois, setMois] = useState(dayjs().format("YYYY-MM"));
  const [donnees, setDonnees] = useState([]);

  const fetchRapport = async () => {
    try {
      const res = await ApiService.rapports.getProductionClient(mois);
      setDonnees(res.data);
    } catch (err) {
      console.error("Erreur chargement rapport production :", err);
    }
  };

  useEffect(() => {
    fetchRapport();
  }, [mois]);

  const handleExport = async () => {
    try {
      const res = await await ApiService.rapports.exportProductionExcel(mois);
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport_production_${mois}.xlsx`;
      a.click();
    } catch (err) {
      console.error("Erreur export Excel :", err);
    }
  };

  const handleExportPDF = async () => {
    try {
      const res = await ApiService.rapports.exportProductionPDF(mois);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport_production_${mois}.pdf`;
      a.click();
    } catch (err) {
      console.error("Erreur export PDF :", err);
    }
  };

  return (
    <div className="p-6 text-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Rapport de Production Mensuelle</h2>

      <div className="flex justify-center pt-8">
  <label htmlFor="mois" className="block text-sm font-semibold text-gray-600 mb-2">
    Mois de rapport
  </label>
  <input
    id="mois"
    type="month"
    value={mois}
    onChange={(e) => setMois(e.target.value)}
    className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition-all duration-200"
  />
</div>

      {donnees.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8 pt-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Données de production</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Production (kWh)</th>
                  </tr>
                </thead>
                <tbody>
                  {donnees.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border">{item.jour}</td>
                      <td className="p-2 border">{item.production_kwh.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Graphique de production</h3>
            <Chart
              type="line"
              height={320}
              options={{
                chart: { id: "prod-chart" },
                xaxis: {
                  categories: donnees.map((d) => d.jour),
                  title: { text: "Jour" },
                },
                yaxis: {
                  title: { text: "kWh" },
                },
                stroke: { curve: "smooth" },
              }}
              series={[
                {
                  name: "Production",
                  data: donnees.map((d) => d.production_kwh),
                },
              ]}
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              📤 Exporter Excel
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              📄 Exporter PDF
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Aucune donnée pour ce mois.</p>
      )}
    </div>
  );
};

export default RapportProductionClientPage;
