import React, { useEffect, useState } from "react";
import ApiService from "../../Api/Api";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const ListeEntretiensClient = () => {
  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntretiens = async () => {
      try {
        const res = await ApiService.getEntretiensClient(); // ⚠️ À ajouter dans ApiService.js
        setEntretiens(Array.isArray(res.data) ? res.data : res.data.results || []);
      } catch (error) {
        console.error("Erreur récupération entretiens :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntretiens();
  }, []);

  const getStatusColor = (statut) => {
    switch (statut) {
      case "planifie":
        return "bg-yellow-100 text-yellow-800";
      case "en_cours":
        return "bg-blue-100 text-blue-800";
      case "termine":
        return "bg-green-100 text-green-800";
      case "annule":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-24 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mes entretiens</h1>

      {loading ? (
        <div className="text-gray-500">Chargement...</div>
      ) : entretiens.length === 0 ? (
        <p className="text-gray-600">Aucun entretien trouvé.</p>
      ) : (
        <div className="grid gap-4">
          {entretiens.map((entretien) => (
            <div key={entretien.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  📅 Début : {dayjs(entretien.date_debut).format("DD/MM/YYYY HH:mm")}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(entretien.statut)}`}>
                  {entretien.statut_display}
                </span>
              </div>

              <p className="text-gray-800 font-semibold">🔧 {entretien.titre || "Entretien sans titre"}</p>
              <p className="text-sm text-gray-600">
                🏠 Installation : {entretien.installation_nom || "Non spécifiée"}
              </p>
              <p className="text-sm text-gray-600">
                👨‍🔧 Technicien : {entretien.technicien_nom || "Non assigné"}
              </p>
              <p className="text-sm text-gray-600">
                ⚙️ Type : {entretien.type_display}
              </p>

              <Link
  to={`/client/entretiens/${entretien.id}`}
  className="inline-block mt-3 text-blue-600 hover:underline text-sm"
>
  Voir les détails →
</Link>

            </div>
          ))}

        </div>
        
      )}

    </div>
  );
};

export default ListeEntretiensClient;
