import React, { useEffect, useMemo, useState } from "react";
import ApiService from "../Api/Api";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ModalModifierStatutEntretien from "../Technicien/ModalModifierStatutEntretien";
import RappelForm from "../Technicien/RappelForm";

const statutColors = {
  planifie: "bg-yellow-100 text-yellow-700",
  en_cours: "bg-blue-100 text-blue-700",
  termine: "bg-green-100 text-green-700",
  annule: "bg-red-100 text-red-700",
};

const ListeEntretiensTechnicien = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [periodeFilter, setPeriodeFilter] = useState("tous");
  const [selectedEntretien, setSelectedEntretien] = useState(null);
  const [showRappelForm, setShowRappelForm] = useState(false);
  const [entretienRappelId, setEntretienRappelId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ApiService.getEntretiensTechnicien();
        if (!Array.isArray(res.data)) throw new Error("Format inattendu");

        let results = res.data;
        const now = new Date();

        if (typeFilter) results = results.filter(e => e.type_entretien === typeFilter);
        if (statutFilter) results = results.filter(e => e.statut === statutFilter);

        if (periodeFilter === "jour") {
          results = results.filter(e => new Date(e.date_debut).toDateString() === now.toDateString());
        } else if (periodeFilter === "semaine") {
          const start = new Date(now);
          start.setDate(now.getDate() - now.getDay());
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          results = results.filter(e => {
            const d = new Date(e.date_debut);
            return d >= start && d <= end;
          });
        } else if (periodeFilter === "mois") {
          results = results.filter(e => {
            const d = new Date(e.date_debut);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          });
        }

        if (globalFilter) {
          const search = globalFilter.toLowerCase();
          results = results.filter(e =>
            e.installation_nom?.toLowerCase().includes(search) ||
            e.type_display?.toLowerCase().includes(search) ||
            e.statut?.toLowerCase().includes(search)
          );
        }

        setData(results);
      } catch (err) {
        toast.error("Erreur de chargement des entretiens");
      }
    };

    fetchData();
  }, [typeFilter, statutFilter, periodeFilter, globalFilter]);

  const columns = useMemo(() => [
    {
      header: "Installation",
      accessorKey: "installation_nom",
    },
    {
      header: "Type",
      accessorKey: "type_display",
    },
    {
      header: "Début",
      accessorKey: "date_debut",
      cell: info => new Date(info.getValue()).toLocaleString(),
    },
    {
      header: "Fin",
      accessorKey: "date_fin",
      cell: info => new Date(info.getValue()).toLocaleString(),
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: info => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${statutColors[info.getValue()] || "bg-gray-100 text-gray-700"}`}>
          {info.getValue()}
        </span>
      ),
    },
    {
      header: "Rappel",
      id: "rappel",
      cell: ({ row }) => (
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            setEntretienRappelId(row.original.id);
            setShowRappelForm(true);
          }}
        >
          Rappel
        </button>
      )
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize: pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize]);

  return (
    <div className="pt-24 px-6 w-full">
      <Toaster />

      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-600">Afficher</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border text-gray-500 rounded px-2 py-1 text-sm"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border rounded text-gray-600 px-2 py-1 text-sm">
            <option value="">Tous les types</option>
            <option value="preventif">Préventif</option>
            <option value="correctif">Correctif</option>
            <option value="diagnostic">Diagnostic</option>
          </select>

          <select value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)} className="border rounded text-gray-600 px-2 py-1 text-sm">
            <option value="">Tous les statuts</option>
            <option value="planifie">Planifié</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminé</option>
            <option value="annule">Annulé</option>
          </select>

          <select value={periodeFilter} onChange={(e) => setPeriodeFilter(e.target.value)} className="border rounded text-gray-600 px-2 py-1 text-sm">
            <option value="tous">Toutes les périodes</option>
            <option value="jour">Aujourd’hui</option>
            <option value="semaine">Cette semaine</option>
            <option value="mois">Ce mois</option>
          </select>

          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border px-3 py-1 rounded w-64 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full mt-4">
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
                <tr key={row.id} className="hover:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
            <div>
              Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>

      {showRappelForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
              onClick={() => {
                setShowRappelForm(false);
                setEntretienRappelId(null);
              }}
            >
              &times;
            </button>
            <RappelForm
              entretienId={entretienRappelId}
              onSuccess={() => {
                toast.success("Rappel ajouté !");
                setShowRappelForm(false);
                setEntretienRappelId(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeEntretiensTechnicien;
