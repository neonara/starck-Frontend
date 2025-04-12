import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import dayjs from "dayjs";

const baseURL = "http://localhost:8000/";

const getAccessToken = () => localStorage.getItem("accessToken") || "";
const getRefreshToken = () => localStorage.getItem("refreshToken") || "";

const api = axios.create({
  baseURL,
  withCredentials: true,  
  headers: {
    Authorization: getAccessToken() ? `Bearer ${getAccessToken()}` : "",
    "Content-Type": "application/json",
    "X-CSRFToken": Cookies.get("csrftoken") || "",  
  },
});

api.interceptors.request.use(async (req) => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
    const user = jwtDecode(accessToken);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    try {
      const resp = await axios.post(`${baseURL}token/refresh/`, { refresh: refreshToken });
      console.log("Nouveau token d'accès: ", resp.data.access);
      localStorage.setItem("accessToken", resp.data.access);
      req.headers.Authorization = `Bearer ${resp.data.access}`;
    } catch (err) {
      console.error("Erreur lors du rafraîchissement du token", err);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";  
    }
  }

  return req;
});

const ApiService = {
  // Utilisateur
  addUser: (userData) => api.post("users/register/", userData),
  getProfile: () => api.get("users/profile/"),
  updateProfile: (userData) => api.patch("users/update-profile/", userData),
  getAllUsers: (params = {}) => api.get("users/", { params }),
  deleteUser: (id) => api.delete(`users/usersdetail/${id}/`),
  getUserById: (id) => api.get(`users/usersdetail/${id}/`),
  updateUser: (id, userData) => api.patch(`users/usersdetail/${id}/`, userData),
  getClients: () => api.get("users/clients/"),
  getInstallateurs: () => api.get("users/installateurs/"),
  getTechnicien: () => api.get("users/techniciens/"),

//dashboard

getUserStats: () => api.get("users/stats/"),
getInstallationStats: () => api.get("statistiques/"),


  // Déconnexion
  logout: async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      console.error("Aucun token de rafraîchissement trouvé !");
      return;
    }

    try {
      await api.post("users/logout/", { refresh_token: refreshToken });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      console.log("Déconnexion réussie !");
      
      window.location.href = "/";  
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  },

  // Installation
  ajouterInstallation: (data) =>
    api.post("installations/ajouter-installation/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

    getInstallations: (params = {}) => api.get("installations/installations/", { params }),
    deleteInstallation: (id) => api.delete(`installations/supprimer-installation/${id}/`),
    getInstallationById: (id) => api.get(`installations/detail-installation/${id}/`),
    updateInstallation: (id, data) => api.put(`installations/modifier-installation/${id}/`, data),
    //getInstallationStats: () => api.get("installations/statistiques/"),

    

  // Notifications
  getNotifications: () => api.get("notification/get-my-notifications/"),
  markAsRead: (id) => api.patch(`notification/mark-read/${id}/`),
  markAllAsRead: () => api.patch("notification/mark-all-read/"),
  deleteNotification: (id) => api.delete(`notification/delete/${id}/`),


  //code alarme
  getAlarmeCodes: (params = {}) => api.get("alarme/codes/liste/", { params }),
addAlarmeCode: (data) => api.post("alarme/codes/ajouter/", data),
updateAlarmeCode: (id, data) => api.put(`alarme/codes/modifier/${id}/`, data),
deleteAlarmeCode: (id) => api.delete(`alarme/codes/supprimer/${id}/`),
getAlarmeCodeById: (id) => api.get(`alarme/codes/detail/${id}/`),
//Alarme décleché
getAlarmesDeclenchees: (params = {}) =>
  api.get("alarme/liste/", { params }),

getAlarmeDeclencheeById: (id) =>
  api.get(`alarme/detail/${id}/`),

ajouterAlarmeDeclenchee: (data) =>
  api.post("alarme/ajouter/", data),

modifierAlarmeDeclenchee: (id, data) => api.patch(`alarme/modifier/${id}/`, data),

supprimerAlarmeDeclenchee: (id) =>
  api.delete(`alarme/supprimer/${id}/`),



getStatistiquesAlarmes: () =>
  api.get("alarme/stats/"),



  // Historique
  exportHistorique: {
    getExports: () => api.get("historique/liste/"),
    creerExport: (format = "csv", installationId) =>
      api.post("historique/creer-export/", { format, installation_id: installationId }),
    creerExportGlobal: (params) =>
      api.post("historique/export-global/", params),
    exportAlarmeCodes: (format = "csv") =>
      api.post("historique/export-alarmecodes/", { format }),
    exportAlarmesDeclenchees: (format = "csv") =>
      api.post("historique/export-alarmes-declenchees/", { format }),
    deleteExport: (id) => api.delete(`historique/supprimer/${id}/`),
    creerExportGlobalUtilisateurs: (params) =>
      api.post("historique/export-utilisateurs/", params),
   
  },


// Production
ajouterDonnees: (prodData) => api.post("ajouter_prod/", prodData), 
listeProduction: () => api.get("list_prod/"), 
statistiquesProduction: (installationId) => api.get(`production/statistiques/${installationId}/`),  // Statistiques pour une installation
statistiquesGlobales: () => api.get("production/statistiques/globales/"),  // Statistiques globales


// Interventions
getInterventions: (params = {}) => api.get("intervention/interventions/", { params }),
createIntervention: (data) => api.post("intervention/interventions/creer/", data),
getInterventionDetail: (id) => api.get(`intervention/interventions/${id}/`),
updateIntervention: (id, data) => api.put(`intervention/interventions/${id}/modifier/`, data),
deleteIntervention: (id) => api.delete(`intervention/interventions/${id}/supprimer/`),
changeInterventionStatus: (id, status) => api.patch(`intervention/interventions/${id}/changer-statut/`, { status }),
assignTechnicianToIntervention: (id, technicianId) => api.post(`intervention/interventions/${id}/assigner-technicien/`, { technician_id: technicianId }),
};

export default ApiService;
