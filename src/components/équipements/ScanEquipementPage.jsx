import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../Api/Api";

const ScanEquipementPage = () => {
  const { code } = useParams(); 
  const [equipement, setEquipement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipement = async () => {
      try {
        const response = await ApiService.getEquipementParQRCode(code);
        setEquipement(response.data);
      } catch (err) {
        setError("Équipement introuvable.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipement();
  }, [code]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Détails de l'équipement</h1>
      <ul className="space-y-2">
        <li><strong>Nom :</strong> {equipement.nom}</li>
        <li><strong>Type :</strong> {equipement.type_appareil}</li>
        <li><strong>Numéro de série :</strong> {equipement.numero_serie}</li>
        <li><strong>État :</strong> {equipement.etat}</li>
        <li><strong>Installation :</strong> {equipement.installation?.nom || "Non associée"}</li>
        <li>
          <strong>QR Code :</strong><br />
          {equipement.qr_code_image ? (
            <img
src={`http://192.168.1.109:8000${equipement.qr_code_image}`}              alt="QR Code"
              className="w-40 mt-2 border rounded"
            />
          ) : (
            "Non disponible"
          )}
        </li>
      </ul>
    </div>
  );
};

export default ScanEquipementPage;
