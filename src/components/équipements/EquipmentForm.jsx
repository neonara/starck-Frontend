import React, { useState, useEffect } from "react"; // Ajout explicite de useEffect
import ApiService from "../../Api/Api";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

const EquipmentFormModal = ({ installationId, onAdd, onEdit, equipment, onClose }) => {
  const [formData, setFormData] = useState({
    nom: "",
    type_appareil: "",
    numero_serie: "",
    etat: "actif",
  });

  const typesAppareil = [
    "onduleur",
    "compteur",
    "micro-onduleur",
    "batterie",
    "station_meteo",
    "boite_jonction",
    "repetiteur",
    "ventilateur",
    "erm",
  ];

  // Initialiser le formulaire avec les données de l'équipement à modifier
  useEffect(() => {
    if (equipment) {
      setFormData({
        nom: equipment.nom || "",
        type_appareil: equipment.type_appareil || "",
        numero_serie: equipment.numero_serie || "",
        etat: equipment.etat || "actif",
      });
    } else {
      setFormData({
        nom: "",
        type_appareil: "",
        numero_serie: "",
        etat: "actif",
      });
    }
  }, [equipment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!installationId) {
      toast.error("Veuillez sélectionner une installation");
      return;
    }

    const data = { ...formData, installation: installationId };
    try {
      if (equipment) {
        const updatedEquipment = { ...equipment, ...data, id: equipment.id };
        onEdit(updatedEquipment); // Appelle l'API via EquipmentSection
      } else {
        const response = await ApiService.ajouterEquipement(data);
        onAdd(response.data);
      }
      onClose();
    } catch (error) {
      toast.error("Erreur lors de l'ajout ou de la modification");
      console.error("Erreur :", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {equipment ? "Modifier un équipement" : "Ajouter un équipement"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
              Nom de l'appareil
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="type_appareil" className="block text-sm font-medium text-gray-700">
              Type d'appareil
            </label>
            <select
              id="type_appareil"
              name="type_appareil"
              value={formData.type_appareil}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">-- Sélectionner un type --</option>
              {typesAppareil.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="numero_serie" className="block text-sm font-medium text-gray-700">
              Numéro de série
            </label>
            <input
              type="text"
              id="numero_serie"
              name="numero_serie"
              value={formData.numero_serie}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="etat" className="block text-sm font-medium text-gray-700">
              État
            </label>
            <select
              id="etat"
              name="etat"
              value={formData.etat}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 border rounded text-gray-600 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {equipment ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentFormModal;