import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../../Api/Api';
import toast, { Toaster } from 'react-hot-toast';

const ModifierInterventionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [installations, setInstallations] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [formData, setFormData] = useState({
    installation: '',
    technicien: '',
    date_prevue: '',
    statut: '',
    description: ''
  });

  const statutOptions = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'en_cours', label: 'En cours' },
    { value: 'terminee', label: 'Terminée' },
    { value: 'annulee', label: 'Annulée' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [interventionRes, installationsRes, techniciensRes] = await Promise.all([
          ApiService.getInterventionDetail(id),
          ApiService.getInstallations(),
          ApiService.getTechnicien()
        ]);

        setFormData({
          installation: interventionRes.data.installation,
          technicien: interventionRes.data.technicien,
          date_prevue: interventionRes.data.date_prevue,
          statut: interventionRes.data.statut,
          description: interventionRes.data.description || ''
        });

        setInstallations(installationsRes.data?.results || installationsRes.data || []);
        setTechniciens(techniciensRes.data?.results || techniciensRes.data || []);

      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        toast.error("Erreur lors du chargement des données ❌");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const interventionData = {
        installation: parseInt(formData.installation),
        technicien: parseInt(formData.technicien),
        date_prevue: formData.date_prevue,
        statut: formData.statut,
        description: formData.description || 'Aucune description'
      };

      await ApiService.updateIntervention(id, interventionData);
      toast.success("Intervention modifiée avec succès ✅");
      navigate('/liste-interventions');
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      toast.error("Erreur lors de la modification ❌");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="pt-24 px-6">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Modifier l'intervention</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Installation</label>
            <select
              name="installation"
              value={formData.installation}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Sélectionner une installation</option>
              {installations.map(install => (
                <option key={install.id} value={install.id}>
                  {install.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Technicien</label>
            <select
              name="technicien"
              value={formData.technicien}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Sélectionner un technicien</option>
              {techniciens.map(tech => (
                <option key={tech.id} value={tech.id}>
                  {`${tech.first_name || ''} ${tech.last_name || ''}`.trim() || tech.email || 'Technicien sans nom'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date prévue</label>
            <input
              type="date"
              name="date_prevue"
              value={formData.date_prevue}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Sélectionner un statut</option>
              {statutOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
              placeholder="Description de l'intervention"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => navigate('/liste-interventions')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifierInterventionPage;