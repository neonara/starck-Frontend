import React, { useEffect, useState } from "react";
import ApiService from "../Api/Api";
import ReactApexChart from "react-apexcharts";

const DashboardInstallateur = () => {
  const [installStats, setInstallStats] = useState(null);
  const [alarmStats, setAlarmStats] = useState(null);
  const [prodStats, setProdStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jour");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resInstall, resAlarmes, resProd] = await Promise.all([
          ApiService.getInstallationStats(),
          ApiService.getAlarmesInstallateur(),
          ApiService.getStatistiquesInstallateurProduction()
        ]);
        setInstallStats(resInstall.data);
        setAlarmStats(resAlarmes.data);
        console.log("Alarm stats", resAlarmes.data);

        setProdStats(resProd.data);
      } catch (err) {
        console.error("Erreur récupération stats installateur", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Chargement...</div>;

  const chartConfig = {
    jour: {
      title: "Production journalière",
      data: prodStats?.prod_journaliere || {},
      type: "area",
      color: "#3b82f6"
    },
    mois: {
      title: "Production mensuelle",
      data: prodStats?.prod_mensuelle || {},
      type: "bar",
      color: "#10b981"
    },
    annee: {
      title: "Production annuelle",
      data: prodStats?.prod_annuelle || {},
      type: "bar",
      color: "#f59e0b"
    },
    totale: {
      title: "Production totale",
      data: { "Total": prodStats?.prod_totale || 0 },
      type: "bar",
      color: "#6366f1"
    }
  };

  const current = chartConfig[activeTab];
  const categories = Object.keys(current.data);
  const values = Object.values(current.data);

  return (
    <div className="p-6 space-y-8">
      {/* Cartes donuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="État des Installations" color="blue">
         {installStats && (
  <ReactApexChart
    type="donut"
    series={[
      installStats.total_normales || 0,
      installStats.total_en_panne || 0
    ]}
    options={{
      labels: ['Fonctionnelles', 'En panne'],
      colors: ["#60a5fa", "#ef4444"],
      legend: { position: 'bottom' },
      dataLabels: { enabled: true },
      plotOptions: { pie: { donut: { size: '70%' } } },
      tooltip: {
        y: { formatter: (val) => `${val} installations` }
      }
    }}
    height={250}
  />
)}

        </Card>

        <Card title="Alarmes Actives" color="red">
          {alarmStats && (

          <ReactApexChart
            type="donut"
           series={[
  Number(alarmStats?.critique || 0),
  Number(alarmStats?.majeure || 0),
  Number(alarmStats?.mineure || 0)
]}
            options={{
              labels: ['Critiques', 'Majeures', 'Mineures'],
              colors: ['#ef4444', '#f59e0b', '#facc15'],
              legend: { position: 'bottom' },
              dataLabels: { enabled: true },
              plotOptions: { pie: { donut: { size: '70%' } } },
              tooltip: {
                y: { formatter: (val) => `${val} alarmes` }
              }
            }}
            height={250}
          />
          )}

        </Card>
      </div>

      <Card title="">
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md border">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-bold text-gray-800">📊 Statistiques de production</h2>
            </div>
          </div>

          <div className="flex gap-3 mb-6 flex-wrap">
            {Object.entries(chartConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  activeTab === key
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {config.title}
              </button>
            ))}
          </div>

          <ReactApexChart
            type={current.type}
            series={[{ name: "Production", data: values }]}
            options={{
              chart: {
                id: "production-chart",
                toolbar: { show: false },
                animations: {
                  enabled: true,
                  easing: "easeinout",
                  speed: 700
                }
              },
              stroke: { curve: "smooth", width: 2 },
              dataLabels: { enabled: false },
              xaxis: {
                categories,
                labels: { style: { fontSize: "13px" } }
              },
              colors: [current.color],
              tooltip: {
                y: {
                  formatter: (val) => `${val} kWh`
                }
              },
              grid: {
                borderColor: "#e5e7eb",
                row: { colors: ["#f9fafb", "transparent"], opacity: 0.5 }
              }
            }}
            height={320}
          />
        </div>
      </Card>
    </div>
  );
};

const Card = ({ title, children, color = "gray" }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 transition-all hover:shadow-lg">
    {title && <h2 className={`text-lg font-semibold text-${color}-600 mb-4`}>{title}</h2>}
    {children}
  </div>
);

export default DashboardInstallateur;
