import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../Api/Api";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
 
const statutColors = {
  planifie: "bg-yellow-100 text-yellow-700",
  en_cours: "bg-blue-100 text-blue-700",
  termine: "bg-green-100 text-green-700",
  annule: "bg-red-100 text-red-700",
};
 
const ListeEntretiensPage = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [technicienFilter, setTechnicienFilter] = useState("");
  const [installationFilter, setInstallationFilter] = useState("");
  const [techniciens, setTechniciens] = useState([]);
  const [installations, setInstallations] = useState([]);
 
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchEntretiens = async () => {
      try {
        const params = {};
        if (globalFilter) params.search = globalFilter;
        if (statutFilter) params.statut = statutFilter;
        if (technicienFilter) params.technicien_id = technicienFilter;
        if (installationFilter) params.installation_id = installationFilter;
 
        const res = await ApiService.getAllEntretiens(params);
        setData(res.data);
      } catch (err) {
        console.error("Erreur chargement entretiens", err);
        toast.error("Erreur de chargement ❌");
      }
    };
 
    fetchEntretiens();
  }, [globalFilter, statutFilter, technicienFilter, installationFilter]);
 
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [techRes, instRes] = await Promise.all([
          ApiService.getTechnicien(),
          ApiService.getInstallations()
        ]);
        setTechniciens(techRes.data.results || techRes.data);
        setInstallations(instRes.data.results || instRes.data);
      } catch (err) {
        console.error("Erreur chargement filtres", err);
      }
    };
    loadFilters();
  }, []);
 
  const columns = useMemo(() => [
    {
      header: "Installation",
      accessorKey: "installation_details.nom",
      cell: (info) => info.row.original.installation_details?.nom || "—",
    },
    {
      header: "Type",
      accessorKey: "type_entretien",
    },
    {
      header: "Début",
      accessorKey: "date_debut",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    },
    {
      header: "Fin",
      accessorKey: "date_fin",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    },
    {
      header: "Statut",
      accessorKey: "statut",
      cell: (info) => (
<span className={`px-2 py-1 rounded text-xs font-medium ${
          statutColors[info.getValue()] || "bg-gray-100 text-gray-700"
        }`}>
          {info.getValue()}
</span>
      ),
    },
    {
      header: "Technicien",
      accessorKey: "technicien_details",
      cell: (info) => {
        const val = info.getValue();
        return val ? `${val.first_name ?? ""} ${val.last_name ?? ""}` : "—";
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
<div className="flex gap-2">
<button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => navigate(`/modifier-entretien/${row.original.id}`)}>
<FaEdit />
</button>
<button
            className="text-red-600 hover:text-red-800"
            onClick={async () => {
              const confirmed = window.confirm("Supprimer cet entretien ?");
              if (!confirmed) return;
              try {
                await ApiService.deleteEntretien(row.original.id);
                toast.success("Entretien supprimé ✅");
                setData((prev) => prev.filter((item) => item.id !== row.original.id));
              } catch (err) {
                console.error("Erreur suppression :", err);
                toast.error("Erreur lors de la suppression ❌");
              }
            }}>
<FaTrash />
</button>
</div>
      ),
    },
  ], [navigate]);
 
  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize } },
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
  });
 
  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize]);
 
  return (
<div className="pt-24 px-6 w-full">
<Toaster />
 
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
<div className="flex gap-2 items-center">
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
 
        <div className="flex flex-wrap gap-3 items-center">
<select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
            className="border rounded px-2 py-1 text-gray-700 text-sm"
>
<option value="">Tous les statuts</option>
<option value="planifie">Planifié</option>
<option value="en_cours">En cours</option>
<option value="termine">Terminé</option>
<option value="annule">Annulé</option>
</select>
 
          <select
            value={technicienFilter}
            onChange={(e) => setTechnicienFilter(e.target.value)}
            className="border rounded px-2 py-1 text-gray-700 text-sm"
>
<option value="">Tous les techniciens</option>
            {techniciens.map((t) => (
<option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
            ))}
</select>
 
          <select
            value={installationFilter}
            onChange={(e) => setInstallationFilter(e.target.value)}
            className="border rounded px-2 py-1 text-gray-700 text-sm"
>
<option value="">Toutes les installations</option>
            {installations.map((inst) => (
<option key={inst.id} value={inst.id}>{inst.nom}</option>
            ))}
</select>
 
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border px-3 py-1 rounded w-64 text-sm"
          />
 
          <button
            onClick={() => navigate("/ajouter-entretien")}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
>
<FaPlus /> Planifier
</button>
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
                        {{ asc: <FaSortUp />, desc: <FaSortDown /> }[
                          header.column.getIsSorted()
                        ] || <FaSort className="text-xs" />}
</div>
</th>
                  ))}
</tr>
              ))}
</thead>
<tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
<tr
                  key={row.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    if (e.target.closest("button")) return;
                    navigate(`/details-entretien/${row.original.id}`);
                  }}
>
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
 
export default ListeEntretiensPage;