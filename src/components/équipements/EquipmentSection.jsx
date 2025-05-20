import React, { useState, useEffect } from "react";
import InstallationList from "./InstallationList";
import EquipmentFormModal from "./EquipmentForm";
import EquipmentTable from "./EquipmentTable";
import ApiService from "../../Api/Api";
import { toast } from "react-hot-toast";
import { Plus } from "lucide-react";

const EquipmentSection = () => {
  const [selectedInstallationId, setSelectedInstallationId] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  useEffect(() => {
    if (selectedInstallationId) {
      setLoading(true);
      const fetchEquipments = async () => {
        try {
          const response = await ApiService.getEquipementsParInstallation(selectedInstallationId);
          setEquipments(response.data);
        } catch (error) {
          toast.error("Erreur lors de la récupération des équipements");
          console.error("Erreur :", error);
          setEquipments([]);
        } finally {
          setLoading(false);
        }
      };
      fetchEquipments();
    } else {
      setEquipments([]);
    }
  }, [selectedInstallationId]);

  const handleAddEquipment = (newEquipment) => {
    setEquipments((prev) => [...prev, newEquipment]);
    toast.success("Équipement ajouté avec succès");
  };

  const handleEditEquipment = async (updatedEquipment) => {
    try {
      // Appel à l'API pour modifier l'équipement
      await ApiService.modifierEquipement(updatedEquipment.id, {
        nom: updatedEquipment.nom,
        type_appareil: updatedEquipment.type_appareil,
        numero_serie: updatedEquipment.numero_serie,
        etat: updatedEquipment.etat,
        installation: selectedInstallationId,
      });
      // Mise à jour locale des équipements
      setEquipments((prev) =>
        prev.map((eq) =>
          eq.id === updatedEquipment.id ? updatedEquipment : eq
        )
      );
      toast.success("Équipement modifié avec succès");
    } catch (error) {
      toast.error("Erreur lors de la modification de l'équipement");
      console.error("Erreur :", error);
    } finally {
      setEditingEquipment(null);
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet équipement ?")) {
      try {
        await ApiService.supprimerEquipement(id); // Utilisation de la méthode correcte
        setEquipments((prev) => prev.filter((eq) => eq.id !== id));
        toast.success("Équipement supprimé avec succès");
      } catch (error) {
        toast.error("Erreur lors de la suppression de l'équipement");
        console.error("Erreur :", error);
      }
    }
  };

  const openModal = (equipment = null) => {
    if (!selectedInstallationId) {
      toast.error("Veuillez sélectionner une installation");
      return;
    }
    setEditingEquipment(equipment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEquipment(null);
  };

  return (
    <div className="flex h-screen">
      <InstallationList onSelect={setSelectedInstallationId} />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold mb-6">Gestion des équipements</h1>
        {selectedInstallationId && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Équipements de l'installation
              </h2>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Ajouter un équipement
              </button>
            </div>
            {loading ? (
              <p>Chargement des équipements...</p>
            ) : (
              <EquipmentTable
                equipments={equipments}
                onEdit={openModal}
                onDelete={handleDeleteEquipment}
              />
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <EquipmentFormModal
          installationId={selectedInstallationId}
          onAdd={handleAddEquipment}
          onEdit={handleEditEquipment}
          equipment={editingEquipment}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default EquipmentSection;