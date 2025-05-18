import React, { useEffect, useMemo, useState } from "react";
import ApiService from "../Api/Api";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaEdit, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import ModalModifierStatutIntervention from "../Technicien/ModalModifierStatutIntervention";

const statutColors = {
  en_attente: "bg-yellow-100 text-yellow-700",
  en_cours: "bg-blue-100 text-blue-700",
  termine: "bg-green-100 text-green-700",
  annulee: "bg-red-100 text-red-700",
};

const ListeInterventionsTechnicien = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [installationFilter, setInstallationFilter] = useState("");
  const [selectedIntervention, setSelectedIntervention] = useState(null);

  const fetchData = async () => {
    try {
      const res = await ApiService.getInterventionsTechnicien();
      const interventions = res.data.results || res.data;

      let results = interventions;

      if (globalFilter) {
        const lower = globalFilter.toLowerCase();
        results = results.filter((e) =>
          e.installation_nom?.toLowerCase().includes(lower) ||
          e.type_intervention?.toLowerCase().includes(lower) ||
          e.statut?.toLowerCase().includes(lower)
        );
      }

      if (statutFilter) {
        results = results.filter((e) => e.statut === statutFilter);
      }

      if (typeFilter) {
        results = results.filter((e) => e.type_intervention === typeFilter);
      }

      if (installationFilter) {
        results = results.filter((e) => e.installation_nom === installationFilter);
      }

      setData(results);
    } catch (err) {
      toast.error("Erreur de chargement des interventions");
    }
  };

  useEffect(() => {
    fetchData();
  }, [globalFilter, statutFilter, typeFilter, installationFilter]);

  const columns = useMemo(() => [
    {
      header: "Installation",
      accessorKey: "installation_nom",
    },
    {
      header: "Type",
      accessorKey: "type_intervention",
    },
    {
      header: "Date prévue",
      accessorKey: "date_prevue",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (info) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${statutColors[info.getValue()] || "bg-gray-100 text-gray-700"}`}>
          {info.getValue()}
        </span>
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedIntervention(row.original)}
          className="text-blue-600 hover:text-blue-800 text-lg"
          title="Modifier le statut"
        >
          <FaEdit />
        </button>
      ),
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize]);

  const uniqueInstallations = [...new Set(data.map((d) => d.installation_nom))];
  const uniqueTypes = [...new Set(data.map((d) => d.type_intervention))];

  return (
    <div className="pt-24 px-6 w-full">
      <Toaster />
      {selectedIntervention && (
        <ModalModifierStatutIntervention
          intervention={selectedIntervention}
          onClose={() => setSelectedIntervention(null)}
          onRefresh={fetchData}
        />
      )}

      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Afficher</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded px-2 text-gray-700 py-1 text-sm"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border px-2 py-1 rounded text-sm text-gray-700"
          >
            <option value="">Tous les types</option>
            {uniqueTypes.map((type, idx) => (
              <option key={idx} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={installationFilter}
            onChange={(e) => setInstallationFilter(e.target.value)}
            className="border px-2 py-1 rounded text-sm text-gray-700"
          >
            <option value="">Toutes les installations</option>
            {uniqueInstallations.map((nom, idx) => (
              <option key={idx} value={nom}>{nom}</option>
            ))}
          </select>

          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="border px-2 py-1 rounded text-sm text-gray-700"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            <option value="annulee">Annulée</option>
          </select>

          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border px-3 py-1 rounded text-sm w-60"
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <div className="bg-white rounded-xl shadow p-6 w-full">
          <table className="w-full table-auto text-sm text-left text-gray-800">
            <thead className="bg-gray-100 text-xs uppercase">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-2 cursor-pointer whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: <FaSortUp />, desc: <FaSortDown /> }[header.column.getIsSorted()] || <FaSort className="text-xs" />}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListeInterventionsTechnicien;
