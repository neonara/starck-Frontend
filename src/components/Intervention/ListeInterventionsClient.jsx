import React, { useEffect, useState } from "react";
import ApiService from "../../Api/Api";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const ListeInterventionsClient = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const res = await ApiService.getInterventionsClient();
        console.log("Interventions reçues :", res.data);
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setInterventions(data);
      } catch (error) {
        console.error("Erreur lors du chargement des interventions :", error);
        setInterventions([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInterventions();
  }, []);
  
  const getStatusColor = (statut) => {
    switch (statut) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "en_cours":
        return "bg-blue-100 text-blue-800";
      case "terminee":
        return "bg-green-100 text-green-800";
      case "annulee":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-24 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mes interventions</h1>

      {loading ? (
        <div className="text-gray-500">Chargement...</div>
      ) : interventions.length === 0 ? (
        <p className="text-gray-600">Aucune intervention trouvée.</p>
      ) : (
        <div className="grid gap-4">
          {interventions.map((intervention) => (
            <div key={intervention.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  📅 Date prévue : {dayjs(intervention.date_prevue).format("DD/MM/YYYY")}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(intervention.statut)}`}>
                  {intervention.statut_display}
                </span>
              </div>

              <p className="text-gray-800 font-semibold">🔧 {intervention.description}</p>
              <p className="text-sm text-gray-600 mt-1">
                🏠 Installation : {intervention.installation_details?.nom || "Non spécifiée"}
              </p>

              <Link to={`/client/details-interventions/${intervention.id}`} className="inline-block mt-3 text-blue-600 hover:underline text-sm">
              Voir les détails →
              </Link>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListeInterventionsClient;
