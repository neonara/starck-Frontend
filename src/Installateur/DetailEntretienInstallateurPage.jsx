import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../Api/Api";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";

const DetailEntretienInstallateurPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entretien, setEntretien] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntretien = async () => {
      try {
        const res = await ApiService.getEntretienInstallateurDetail(id);
        setEntretien(res.data);
      } catch (error) {
        console.error("Erreur chargement détail entretien :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntretien();
  }, [id]);

  const formatDate = (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "Non spécifiée");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (!entretien) {
    return <div className="text-center text-red-500 pt-20">Entretien non trouvé.</div>;
  }
return (
    <div className="max-w-4xl mx-auto mt-24 p-6 bg-white rounded-lg shadow text-left">
      <button
        onClick={() => navigate("/MesEntrentientinstallateur")}
        className="text-gray-600 hover:underline text-sm mb-6"
      >
        ⬅ Retour à la liste
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Détails de l'entretien</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
        <div><strong>🔧 Type :</strong> {entretien.type_entretien}</div>
        <div><strong>📊 Statut :</strong> {entretien.statut}</div>
        <div><strong>📅 Début :</strong> {formatDate(entretien.date_debut)}</div>
        <div><strong>⏱️ Fin :</strong> {formatDate(entretien.date_fin)}</div>
        <div><strong>⏳ Durée estimée :</strong> {entretien.duree_estimee} min</div>
        <div><strong>🏭 Installation :</strong> {entretien.installation_details?.nom || "Non spécifiée"}</div>
        <div><strong>👷 Technicien :</strong> {entretien.technicien_details?.first_name} {entretien.technicien_details?.last_name}</div>
        <div className="sm:col-span-2"><strong>🗒️ Notes :</strong> {entretien.notes || "Aucune"}</div>
      </div>
    </div>
  );
};

export default DetailEntretienInstallateurPage;