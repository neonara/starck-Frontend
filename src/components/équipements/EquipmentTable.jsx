import React, { useState } from "react";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaDownload,
} from "react-icons/fa";
import ApiService from "../../Api/Api";
import { toast } from "react-hot-toast";

const EquipmentTable = ({ equipments, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterState, setFilterState] = useState("all");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showModalExports, setShowModalExports] = useState(false);
  const [exports, setExports] = useState([]);

  const filteredEquipments = equipments.filter((e) =>
    filterState === "all" ? true : e.etat === filterState
  );

  const sortedEquipments = [...filteredEquipments].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn] || "";
    const bValue = b[sortColumn] || "";
    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const totalItems = sortedEquipments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEquipments = sortedEquipments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleExportClick = async (format) => {
    setShowExportOptions(false);
    try {
      await ApiService.exportEquipements(format);
      toast.success(`Export ${format.toUpperCase()} lancé ✅`);
      setShowModalExports(true);
      setTimeout(() => loadExports(), 1000);
    } catch {
      toast.error("Erreur export ❌");
    }
  };

  const loadExports = async () => {
    try {
      const res = await ApiService.exportHistorique.getExports();
      setExports(res.data.results.filter((e) => e.nom.includes("equipements")));
    } catch {
      toast.error("Erreur chargement exports ❌");
    }
  };

  const handleDeleteExport = async (id) => {
    try {
      await ApiService.exportHistorique.deleteExport(id);
      loadExports();
      toast.success("Fichier supprimé ✅");
    } catch {
      toast.error("Erreur suppression ❌");
    }
  };

  const columns = [
    {
      header: "État d'appareil",
      accessorKey: "etat",
      cell: (e) => (
        <span
          className={
            e.etat === "actif"
              ? "text-green-600 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {e.etat.charAt(0).toUpperCase() + e.etat.slice(1)}
        </span>
      ),
    },
    { header: "Nom de l'appareil", accessorKey: "nom" },
    {
      header: "Nom de la centrale",
      accessorKey: "installation_details.nom",
    },
    {
      header: "Type d'appareil",
      accessorKey: "type_appareil",
      cell: (e) =>
        e.type_appareil.charAt(0).toUpperCase() +
        e.type_appareil.slice(1).replace("_", " "),
    },
    {
      header: "QR Code",
      accessorKey: "qr_code_image",
      cell: (e) =>
        e.qr_code_image ? (
          <a href={`http://localhost:8000${e.qr_code_image}`} download>
            <img
              src={`http://localhost:8000${e.qr_code_image}`}
              alt="QR"
              className="w-12 h-12 object-contain border rounded"
            />
          </a>
        ) : (
          <span className="text-gray-400">Non disponible</span>
        ),
    },
    {
      header: "Actions",
      cell: (e) => (
        <div className="flex gap-2">
          <button onClick={() => onEdit(e)} className="text-blue-500 hover:text-blue-700">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(e.id)} className="text-red-500 hover:text-red-700">
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-600">Afficher</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entrées</span>
        </div>
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
              <button onClick={() => handleExportClick("pdf")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">Exporter PDF</button>
              <button onClick={() => handleExportClick("xlsx")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">Exporter Excel</button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessorKey || col.header}
                  onClick={() => col.accessorKey && handleSort(col.accessorKey)}
                  className="px-4 py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.accessorKey && sortColumn === col.accessorKey ? (
                      sortDirection === "asc" ? <FaSortUp /> : <FaSortDown />
                    ) : col.accessorKey && <FaSort className="text-xs" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedEquipments.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.header} className="px-4 py-2 whitespace-nowrap">
                    {col.cell
                      ? col.cell(e)
                      : col.accessorKey.includes(".")
                      ? e[col.accessorKey.split(".")[0]]?.[col.accessorKey.split(".")[1]] || "—"
                      : e[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between text-sm items-center">
        <span>
          Affichage de {totalItems > 0 ? startIndex + 1 : 0} à {Math.min(startIndex + itemsPerPage, totalItems)} sur {totalItems} entrées
        </span>
        <div className="space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border text-gray-600 disabled:opacity-50"
          >
            Précédent
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border text-gray-600 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>

      {showModalExports && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-[600px]">
            <h2 className="text-lg font-bold mb-4">📁 Historique d’exports – Équipements</h2>
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-2 px-3">Fichier</th>
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
                      <a
                        href={`http://localhost:8000${exp.fichier}`}
                        download={exp.nom}
                        className="text-blue-600 hover:underline text-sm"
                      >
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
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-1 border rounded"
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

export default EquipmentTable;
