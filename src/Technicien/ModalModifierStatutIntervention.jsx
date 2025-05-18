import React, { useState } from "react";
import ApiService from "../Api/Api";
import toast from "react-hot-toast";

const ModalModifierStatutIntervention = ({ intervention, onClose, onRefresh }) => {
  const [statut, setStatut] = useState(intervention.statut);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await ApiService.changeInterventionStatusTechnicien(intervention.id, statut);
      toast.success("Statut mis à jour avec succès ✅");
      onClose();
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la mise à jour ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center">Modifier le statut de l'intervention</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-sm">Statut</label>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalModifierStatutIntervention;
