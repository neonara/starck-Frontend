import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../Api/Api";
import {  FaEdit, FaTrash, FaDownload, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import FormCodeAlarme from "./AjouterCodeAlarmePage";

const ListeCodesAlarmes = () => {
  const navigate = useNavigate();
  const [codes, setCodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtreMarque, setFiltreMarque] = useState("");
  const [filtreGravite, setFiltreGravite] = useState("");
  const [filtreType, setFiltreType] = useState("");
  const [codeAModifier, setCodeAModifier] = useState(null);
  const [modaleVisible, setModaleVisible] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
const [showExportOptions, setShowExportOptions] = useState(false);
const [showModalExports, setShowModalExports] = useState(false);
const [exports, setExports] = useState([]);



  const ouvrirModale = (code) => {
    setCodeAModifier(code);
    setModaleVisible(true);
  };
  
  const fermerModale = () => {
    setModaleVisible(false);
    setCodeAModifier(null);
  };
  


  const fetchCodes = async () => {
    try {
      const params = {
        marque: filtreMarque || undefined,
        gravite: filtreGravite || undefined,
        type_alarme: filtreType || undefined,
        search: searchQuery || undefined,
      };
      const res = await ApiService.getAlarmeCodes(params);
      setCodes(res.data.results || []);

    } catch (error) {
      toast.error("Erreur de chargement des codes");
    }
  };

  useEffect(() => {
    fetchCodes();
  }, [filtreMarque, filtreGravite, filtreType]);

  const supprimerCode = async (id) => {
    if (!window.confirm("Supprimer ce code ?")) return;
    try {
      await ApiService.deleteAlarmeCode(id);
      toast.success("Code supprimé");
      fetchCodes();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };
  const handleExportClick = async (format) => {
    setExportFormat(format);
    setShowExportOptions(false);
    try {
      await ApiService.exportHistorique.exportAlarmeCodes(format);
      toast.success(`Export ${format.toUpperCase()} lancé ✅`);
      setShowModalExports(true);
      setTimeout(() => loadExports(), 1000);
    } catch (err) {
      console.error("❌ Détail de l’erreur export :", err);
      toast.error("Erreur lors de l’export ❌");
    }
  };
  
  const loadExports = async () => {
    try {
      const res = await ApiService.exportHistorique.getExports();
      const result = Array.isArray(res.data.results) ? res.data.results : [];
      setExports(result.filter((e) => e.nom.includes("alarme"))); 
    } catch (err) {
      toast.error("Erreur de chargement des exports");
      setExports([]);
    }
  };
  
  const handleDeleteExport = async (id) => {
    try {
      await ApiService.exportHistorique.deleteExport(id);
      toast.success("Fichier supprimé ✅");
      loadExports();
    } catch (err) {
      toast.error("Erreur suppression ❌");
    }
  };
  
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📋 Codes d’Alarme</h2>
        <button
  onClick={() => navigate("/codes-alarmes/ajouter")}
  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  <FaPlus /> Ajouter
</button>
<div className="relative">
  <button
    type="button"
    onClick={() => setShowExportOptions(!showExportOptions)}
    className="flex items-center gap-2 px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
  >
    <FaDownload /> Exporter
  </button>
  {showExportOptions && (
    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
      <button
        onClick={(e) => { e.preventDefault(); handleExportClick("csv"); }}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        Export CSV
      </button>
      <button
        onClick={(e) => { e.preventDefault(); handleExportClick("xlsx"); }}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        Export Excel
      </button>
    </div>
  )}
</div>



      </div>

      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border rounded"
          value={filtreMarque}
          onChange={(e) => setFiltreMarque(e.target.value)}
        >
          <option value="">📦 Toutes les marques</option>
          <option value="Huawei">Huawei</option>
          <option value="Kstar">Kstar</option>
          <option value="Solax">Solax</option>
        </select>

        <select
          className="p-2 border rounded"
          value={filtreType}
          onChange={(e) => setFiltreType(e.target.value)}
        >
          <option value="">⚙️ Tous les types</option>
          <option value="DC">Partie DC</option>
          <option value="AC">Partie AC</option>
          <option value="Terre">Partie Terre</option>
          <option value="Logiciel">Logiciel</option>
          <option value="autre">Autre</option>
        </select>

        <select
          className="p-2 border rounded"
          value={filtreGravite}
          onChange={(e) => setFiltreGravite(e.target.value)}
        >
          <option value="">🚨 Toutes les gravités</option>
          <option value="critique">Critique</option>
          <option value="majeure">Majeure</option>
          <option value="mineure">Mineure</option>
        </select>
        <input
  type="text"
  placeholder="🔍 Rechercher..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="p-2 border rounded w-full max-w-xs"
/>
      </div>

      <table className="w-full table-auto border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Marque</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Gravité</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((code) => (
            <tr key={code.id}>
              <td className="p-2 border">{code.code_constructeur}</td>
              <td className="p-2 border">{code.marque}</td>
              <td className="p-2 border">{code.type_alarme}</td>
              <td className="p-2 border">{code.gravite}</td>
              <td className="p-2 border">{code.description}</td>
              <td className="p-2 border flex gap-2 justify-center">
              <button
  onClick={() => ouvrirModale(code)}
  className="text-blue-600 hover:text-blue-800"
>
  <FaEdit />
</button>

                <button
                  onClick={() => supprimerCode(code.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {codes.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                Aucun code trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {modaleVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded shadow p-6 w-[500px] max-w-full">
      <FormCodeAlarme
        initialData={codeAModifier}
        onClose={fermerModale}
        onSuccess={fetchCodes}
      />
    </div>
  </div>
)}
{showModalExports && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[600px]">
      <h2 className="text-lg font-bold mb-4">Exports – Codes d'Alarme</h2>
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-2 px-3">Nom</th>
            <th className="text-left py-2 px-3">Créé le</th>
            <th className="text-left py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exports.map((exp) => (
            <tr key={exp.id} className="hover:bg-gray-50">
              <td className="py-2 px-3">{exp.nom}</td>
              <td className="py-2 px-3">{new Date(exp.date_creation).toLocaleString()}</td>
              <td className="py-2 px-3 flex gap-2">
                <a href={exp.fichier} download>
                  <FaDownload className="text-blue-600 cursor-pointer" />
                </a>
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteExport(exp.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs mt-4 text-gray-500">
        10 fichiers maximum conservés pendant 3 jours.
      </p>
      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-1 border rounded text-gray-600 hover:bg-gray-100"
          onClick={() => setShowModalExports(false)}
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ListeCodesAlarmes;
