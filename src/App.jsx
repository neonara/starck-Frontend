import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from './components/layout/AppLayout';
import './App.css'
import "flowbite";
import "./index.css";
import 'leaflet/dist/leaflet.css';


// Authentification
import RegisterAdmin from "./components/Authentification/RegisterAdmin";
import Login from './components/Authentification/Login';
import UserManagement from './components/Authentification/UserManagement';
import CompleteRegistration from './components/Authentification/CompleteRegistration';
import ForgotPassword from './components/Authentification/ForgotPassword';
import ResetPassword from'./components/Authentification/ResetPassword';

import UpdateProfile from './components/Authentification/UpdateProfile';

// Admin 
import Dashboard from './components/Admin-dashboard/Dashboard';
import ClientDashboard from"./components/Client-dashboard/ClientDashboard";

//Insttalation
import ListeInstallationPage from "./components/Installations/liste-installations";
import AjouterInstallation from "./components/Installations/ajouter-installation";
import DashboardInstallation from "./components/Installations/DashboardInstallation";
import EditInstallation from "./components/Installations/modifier-installation";
//Clients
import ListeClientsPage from "./components/Utilisateurs/Clients/Liste-Client";
import ModifierClientPage from "./components/Utilisateurs/Clients/modifier-client";
//notifications
import NotificationsPage from "./components/notifications/notifications";
//historique
//Alarmes
import ListeCodesAlarmes from "./components/Alarmes/Code-alarmes/ListeCodesAlarmes";
import AjouterCodeAlarmePage from "./components/Alarmes/Code-alarmes/AjouterCodeAlarmePage";
import ListeAlarmesDeclenchees from "./components/Alarmes/AlarmesDeclenche/ListeAlarmesDeclenchees";

//intervention
import ListeInterventions from "./components/Intervention/ListeInterventions";

import AjouterInterventionPage from "./components/Intervention/AjouterInterventionPage"; 
import ModifierInterventionPage from "./components/Intervention/ModifierInterventionPage";
import DetailleIntervention from "./components/Intervention/DetailleIntervention";
//entretien
import ListeEntretiensPage from "./components/Entretien/ListeEntretiensPage";
import FormulaireEntretien from "./components/Entretien/FormulaireEntretien";
import EntretienDetailModal from "./components/Entretien/EtretienDetailModal";
import ModifierEntretienPage from "./components/Entretien/ModifierEntretienPage";
import CalendrierEntretiens from "./components/Entretien/CalendrierEntretiens";
import StatistiquesEntretiens from "./components/Entretien/StatistiquesEntretiens";

//Reclamations
import ListeReclamationsPage from "./components/Reclamation/ListeReclamationPage";
import ModifierReclamationPage from "./components/Reclamation/ModifierReclamationPage";
import ReclamationClient from "./components/Client-dashboard/ReclamationClient";

//Rapports
import RapportProductionPage from "./components/Rapports/RapportProductionPage";
import RapportConsommationPage from"./components/Rapports/RapportConsommationPage";
import InstallationMap from "./components/Installations/InstallationMap";
import HistoriqueReclamationsClient from "./components/Client-dashboard/HistoriqueReclamationsClient";
import RapportAlarmesPage from "./components/Rapports/RapportAlarmesPage";
import RapportProductionClientPage from "./components/Rapports/RapportProductionClientPage";
import RapportConsommationClientPage from "./components/Rapports/RapportConsommationClientPage";
import RapportAlarmesClientPage from "./components/Rapports/RapportAlarmesClientPage";
import ListeInterventionsClient from "./components/Intervention/ListeInterventionsClient";
import DetailleInterventionClient from "./components/Intervention/DetailleInterventionClient";
import ListeEntretiensClient from "./components/Entretien/ListeEntretiensClient";
import DetailleEntretienClient from "./components/Entretien/DetailleEntretienClient";
function App() {
  return (
    <Router>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register-admin" element={<RegisterAdmin />} />
    <Route path="/complete-registration" element={<CompleteRegistration />} />

    <Route path="/" element={<AppLayout />}>
      
      <Route path="admin-dashboard" element={<Dashboard />} />
      <Route path="client-dashboard" element={<ClientDashboard />} />

      
      <Route path="user-management" element={<UserManagement />} />
      <Route path="update-profile" element={<UpdateProfile />} />
      <Route path="liste-installations" element={<ListeInstallationPage />} />
      <Route path="ajouter-installation" element={<AjouterInstallation />} />
      <Route path="dashboard-installation/:id" element={<DashboardInstallation />} />
      <Route path="modifier-installation/:id" element={< EditInstallation/>} />
       <Route path="liste-clients" element={<ListeClientsPage/>}/>
       <Route path="modifier-client/:id" element={<ModifierClientPage />} />
       <Route path="/forgot-password" element={<ForgotPassword />} />
       <Route path="/reset-password" element={<ResetPassword />} />
       <Route path="/notification" element={<NotificationsPage/>}/>

       <Route path="/ListeCodesAlarmes" element={<ListeCodesAlarmes/>}/>
       <Route path="/codes-alarmes/ajouter" element={<AjouterCodeAlarmePage />} />
       <Route path="/ListeAlarmesDeclenchees" element={<ListeAlarmesDeclenchees/>} />
       
       <Route path="/installationMap" element={<InstallationMap/>} />

       
       <Route path="/liste-interventions" element={<ListeInterventions/>} />
       <Route path="/ajouter-intervention" element={<AjouterInterventionPage />} />
       <Route path="/modifier-intervention/:id" element={<ModifierInterventionPage />} />
       <Route path="/detaille-intervention/:id" element={<DetailleIntervention />} />
       

       <Route path="/liste-entretiens" element={<ListeEntretiensPage />} />
       <Route path="/ajouter-entretien" element={<FormulaireEntretien />} />
       <Route path="/details-entretien/:id" element={<EntretienDetailModal />} />
       <Route path="/modifier-entretien/:id" element={<ModifierEntretienPage />} />
       <Route path="/calendrier-entretiens" element={<CalendrierEntretiens />} />
       <Route path="/statistiques-entretiens" element={<StatistiquesEntretiens />} />


       <Route path="/list_reclamations" element={<ListeReclamationsPage />} />
       <Route path="/reclamations/:id/edit" element={<ModifierReclamationPage />} />
       
       
       <Route path="/rapport_production" element={<RapportProductionPage />} />
       <Route path="/rapport_consommation" element={<RapportConsommationPage />} />
       <Route path="/rapport_alarme" element={<RapportAlarmesPage />} />
       
       
       <Route path="/client-reclamations" element={<ReclamationClient />} />
       <Route path="/liste-reclamations" element={<HistoriqueReclamationsClient />} />
       
       
       <Route path="/rapports-production" element={<RapportProductionClientPage />} />
       <Route path="/rapports-consommation" element={<RapportConsommationClientPage />} />
       <Route path="/rapports-alarme" element={<RapportAlarmesClientPage />} />
       
       
       <Route path="/client-mes-interventions" element={<ListeInterventionsClient />} />
       <Route path="/client/details-interventions/:id" element={<DetailleInterventionClient />} />
       
       

       
       </Route>
  </Routes>
</Router>
  );
}

export default App;
