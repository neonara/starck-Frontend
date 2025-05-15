import React, { useState } from "react";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

const EquipmentTable = ({ equipments, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterState, setFilterState] = useState("all");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showExportOptions, setShowExportOptions] = useState(false);

  const filteredEquipments = equipments.filter((equipement) => {
    if (filterState === "all") return true;
    return equipement.etat === filterState;
  });

  const sortedEquipments = [...filteredEquipments].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn] || "";
    const bValue = b[sortColumn] || "";
    if (sortDirection === "asc") {
      return String(aValue).localeCompare(String(bValue));
    }
    return String(bValue).localeCompare(String(aValue));
  });

  
  const totalItems = sortedEquipments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEquipments = sortedEquipments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };


  const exportToCSV = () => {
    const currentDateTime = new Date().toLocaleString("fr-FR", {
      timeZone: "CET",
    }); 
    const headers = [
      "État d'appareil",
      "Nom de l'appareil",
      "Nom de la centrale",
      "Type d'appareil",
    ];
    const rows = equipments.map((equipement) => [
      equipement.etat,
      equipement.nom,
     equipement.installation_details?.nom || "Non défini",
      equipement.type_appareil.charAt(0).toUpperCase() +
        equipement.type_appareil.slice(1).replace("_", " "),
    ]);

    const csvContent = [
      `Exporté le : ${currentDateTime}`,
      "",
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `equipements_${currentDateTime.replace(/[:/]/g, "-")}.csv`
    );
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: "État d'appareil",
      accessorKey: "etat",
      cell: (equipement) => (
        <span
          className={
            equipement.etat === "actif"
              ? "text-green-600 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {equipement.etat.charAt(0).toUpperCase() + equipement.etat.slice(1)}
        </span>
      ),
    },
    { header: "Nom de l'appareil", accessorKey: "nom" },
    { header: "Nom de la centrale", accessorKey: "installation_details.nom" },

    {
      header: "Type d'appareil",
      accessorKey: "type_appareil",
      cell: (equipement) =>
        equipement.type_appareil.charAt(0).toUpperCase() +
        equipement.type_appareil.slice(1).replace("_", " "),
    },
    {
  header: "QR Code",
  accessorKey: "qr_code_image",
  cell: (equipement) =>
    equipement.qr_code_image ? (
     <a href={`http://localhost:8000${equipement.qr_code_image}`} download>
  <img
    src={`http://localhost:8000${equipement.qr_code_image}`}
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
      cell: (equipement) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(equipement)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(equipement.id)}
            className="text-red-500 hover:text-red-700"
          >
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
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">entrées</span>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">État</label>
            <select
              value={filterState}
              onChange={(e) => {
                setFilterState(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">Tous</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaDownload /> Télécharger
            </button>
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    exportToCSV();
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Exporter en CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessorKey || column.header}
                  onClick={() =>
                    column.accessorKey && handleSort(column.accessorKey)
                  }
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.accessorKey &&
                      sortColumn === column.accessorKey ? (
                      sortDirection === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : column.accessorKey && <FaSort className="text-xs" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedEquipments.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  Aucune donnée
                </td>
              </tr>
            ) : (
              paginatedEquipments.map((equipement) => (
                <tr
                  key={equipement.id}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {columns.map((column) => (
                   <td key={column.header} className="px-4 py-2 whitespace-nowrap">
  {column.cell
    ? column.cell(equipement)
    : column.accessorKey.includes(".")
    ? equipement[column.accessorKey.split(".")[0]]?.[
        column.accessorKey.split(".")[1]
      ] ?? "N/A"
    : equipement[column.accessorKey]}
</td>

                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between text-sm items-center">
        <span>
          Affichage de {totalItems > 0 ? startIndex + 1 : 0} à{" "}
          {Math.min(startIndex + itemsPerPage, totalItems)} sur {totalItems}{" "}
          entrées
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
    </div>
  );
};

export default EquipmentTable;