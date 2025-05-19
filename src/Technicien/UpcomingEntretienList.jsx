import React, { useEffect, useState } from "react";
import ApiService from "../Api/Api";
import { format } from "date-fns";
import { CalendarCheck, Loader2 } from "lucide-react";

const statusClass = {
  Planifie: "bg-blue-100 text-blue-800",
  Termine: "bg-green-100 text-green-800",
  Annulé: "bg-red-100 text-red-800",
 En_cours: "bg-gray-200 text-gray-700",
};

const UpcomingEntretienTable = () => {
  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await ApiService.getMesEntretiens7Jours();
        setEntretiens(res.data);
      } catch (e) {
        console.error("Erreur récupération entretiens 7j :", e);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-primary" />
          Entretiens des 7 prochains jours
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8 text-gray-500">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : entretiens.length === 0 ? (
        <p className="text-gray-500">Aucun entretien prévu cette semaine.</p>
      ) : (
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3">Installation</th>
              <th className="p-3">Type</th>
              <th className="p-3">Date</th>
              <th className="p-3">Durée</th>
              <th className="p-3">Statut</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y">
            {entretiens.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50 transition">
<td className="p-3 font-medium">
  {e.installation_details?.nom || e.installation_nom || "—"}
</td>
                <td className="p-3 capitalize">{e.type_entretien}</td>
                <td className="p-3">
                  {format(new Date(e.date_debut), "dd MMM yyyy à HH:mm")}
                </td>
                <td className="p-3">{e.duree_estimee} min</td>
                <td className="p-3">
               <span
  className={`text-xs px-2 py-1 rounded-full font-medium ${
    statusClass[e.statut_display] || "bg-gray-100 text-gray-800"
  }`}
>
  {e.statut_display}
</span>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UpcomingEntretienTable;
