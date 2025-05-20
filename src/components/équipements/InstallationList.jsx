import React, { useEffect, useState } from "react";
import ApiService from "../../Api/Api";
import { Search } from "lucide-react";

const InstallationList = ({ onSelect }) => {
  const [installations, setInstallations] = useState([]);
  const [filteredInstallations, setFilteredInstallations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstallationId, setSelectedInstallationId] = useState("");

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

  const handleSelect = (id) => {
    setSelectedInstallationId(id);
    onSelect(id);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Installations
        </h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Saisissez un nom"
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : filteredInstallations.length === 0 ? (
            <p className="text-gray-500">Aucune installation trouvée</p>
          ) : (
            filteredInstallations.map((installation) => (
              <div
                key={installation.id}
                onClick={() => handleSelect(installation.id)}
                className={`p-2 rounded-md cursor-pointer ${
                  selectedInstallationId === installation.id
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <p className="text-sm font-medium">
                  {installation.nom || `Installation ${installation.id}`}
                </p>
                <p className="text-xs text-gray-500">
                  {installation.adresse || "Adresse non spécifiée"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallationList;