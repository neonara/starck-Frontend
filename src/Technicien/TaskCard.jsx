import React from "react";
import { AlertCircle, CalendarCheck2, CheckCircle2, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const TaskCard = ({ entretiensCount, interventionsCount, anomaliesCount }) => {
  const tasks = [
    {
      icon: <CalendarCheck2 className="text-blue-600 w-5 h-5" />,
      label: `${entretiensCount} entretiens à venir`,
      link: "/liste-entretien-technicien",
    },
    {
      icon: <Wrench className="text-green-600 w-5 h-5" />,
      label: `${interventionsCount} interventions à valider`,
      link: "/technicien-interventions",
    },
 
  ];

  return (
    <div className="bg-white shadow rounded-xl p-4 h-full">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        À faire
      </h3>

      <ul className="space-y-3">
        {tasks.map((task, index) => (
          <li key={index}>
            <Link
              to={task.link}
              className="flex items-center gap-3 hover:bg-gray-100 px-2 py-2 rounded-md transition"
            >
              {task.icon}
              <span className="text-sm text-gray-800">{task.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskCard;
