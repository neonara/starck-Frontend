import React, { useEffect, useState } from "react";
import ApiService from "../Api/Api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, CalendarCheck2, Wrench } from "lucide-react";

const TechnicianActivityChart = ({ data }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <CalendarCheck2 className="w-5 h-5 text-primary" />
        Suivi des activités du mois
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="semaine" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="entretiens" fill="#3b82f6" name="Entretiens" />
          <Bar dataKey="interventions" fill="#10b981" name="Interventions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TechnicianActivityChart;
