import React, { useState } from "react";
import ApiService from "../Api/Api";
import toast from "react-hot-toast";

const ModalModifierStatutEntretien = ({ entretien, onClose, onRefresh }) => {
  const [statut, setStatut] = useState(entretien.statut || "planifie");

const handleSave = async () => {
  try {
    await ApiService.updateStatutEntretien(entretien.id, statut.toLowerCase());
    toast.success("Statut mis à jour ✅");
    onClose();
    onRefresh();
  } catch (error) {
    toast.error("Erreur lors de la mise à jour");
    console.error(error);
  }
};


  return (
    <div className="fixed inset-0 flex text-gray-700 items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 text-gray-700 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl text-gray-700  font-semibold mb-4">Modifier le statut</h2>

        <p className="mb-2">
          <strong>Installation :</strong> {entretien.installation_nom}
        </p>
        <p className="mb-4">
          <strong>Date début :</strong>{" "}
          {new Date(entretien.date_debut).toLocaleString()}
        </p>

        <label className="block mb-2 font-medium text-sm text-gray-700">
          Statut :
        </label>
        <select
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="planifie">Planifié</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
          <option value="annule">Annulé</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalModifierStatutEntretien;
