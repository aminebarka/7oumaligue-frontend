import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getAcademies, createAcademy } from '../services/api';
import { Building, Plus, Search, Edit, Trash2, Eye, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { Academy, CreateAcademyForm } from '../types';

const Academies: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { t, isRTL } = useLanguage();
  
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [createForm, setCreateForm] = useState<CreateAcademyForm>({
    name: '',
    description: '',
    address: '',
    city: '',
    region: '',
    phone: '',
    email: '',
    website: '',
    socialMedia: {},
    history: '',
    values: ''
  });

  useEffect(() => {
    loadAcademies();
  }, []);

  const loadAcademies = async () => {
    try {
      setLoading(true);
      const academiesData = await getAcademies();
      setAcademies(academiesData);
    } catch (error: any) {
      setError(error.message || 'Erreur lors du chargement des académies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAcademy = async () => {
    try {
      const newAcademy = await createAcademy(createForm);
      setAcademies([...academies, newAcademy]);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        description: '',
        address: '',
        city: '',
        region: '',
        phone: '',
        email: '',
        website: '',
        socialMedia: {},
        history: '',
        values: ''
      });
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création de l\'académie');
    }
  };

  const filteredAcademies = academies.filter(academy =>
    academy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    academy.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building className="mr-3 text-blue-600" size={28} />
            Gestion des Académies
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez les académies de football et écoles sportives
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Académie
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une académie..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAcademies.map(academy => (
          <div key={academy.id} className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{academy.name}</h3>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{academy.city}, {academy.region}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              {academy.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {academy.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                {academy.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{academy.phone}</span>
                  </div>
                )}
                {academy.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{academy.email}</span>
                  </div>
                )}
                {academy.website && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>{academy.website}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Voir
                </button>
                
                {currentUser?.id === academy.ownerId && (
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700 flex items-center">
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </button>
                    <button className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 flex items-center">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAcademies.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune académie trouvée
          </h3>
          <p className="text-gray-600">
            Commencez par créer votre première académie
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Créer une nouvelle académie
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'académie *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nom de l'académie"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  value={createForm.city}
                  onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ville"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région *
                </label>
                <input
                  type="text"
                  value={createForm.region}
                  onChange={(e) => setCreateForm({ ...createForm, region: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Région"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse complète *
                </label>
                <input
                  type="text"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Adresse complète"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Description de l'académie"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateAcademy}
                disabled={!createForm.name || !createForm.address || !createForm.city || !createForm.region}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer l'académie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academies;
