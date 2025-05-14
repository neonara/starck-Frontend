import React, { useEffect, useState } from "react";
import ApiService from "../../Api/Api";
import { Search } from "lucide-react";

const InstallationSelector = ({ onSelect }) => {
  const [installations, setInstallations] = useState([]);
  const [filteredInstallations, setFilteredInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInstallations = async () => {
      try {
        const response = await ApiService.getInstallations();
        setInstallations(response.data);
        setFilteredInstallations(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des installations :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstallations();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = installations.filter((installation) =>
        installation.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInstallations(filtered);
    } else {
      setFilteredInstallations(installations);
    }
  }, [searchTerm, installations]);

  const handleSelect = (installationId) => {
    onSelect(installationId);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Sélectionner une installation
        </h2>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Saisissez un nom d'installation"
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : filteredInstallations.length === 0 ? (
        <p className="text-gray-500">Aucune installation trouvée</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInstallations.map((installation) => (
            <div
              key={installation.id}
              onClick={() => handleSelect(installation.id)}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 cursor-pointer transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {installation.nom || `Installation ${installation.id}`}
              </h3>
              <p className="text-sm text-gray-600">{installation.adresse || "Adresse non spécifiée"}</p>
              <p className="text-sm text-gray-500 mt-1">
                Capacité : {installation.capacite_kw || "N/A"} kW
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstallationSelector;