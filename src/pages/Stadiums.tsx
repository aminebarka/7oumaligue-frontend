import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { usePermissions } from '../hooks/usePermissions';
import { useNavigate, Navigate } from 'react-router-dom';
import { Plus, Edit, Trash2, MapPin, Users, Calendar, Star, Search, Filter, Grid, List, Eye, Phone, Mail, Clock, Award, Shield, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ReadOnlyBanner from '../components/ReadOnlyBanner';

interface Stadium {
  id: number;
  name: string;
  address: string;
  city: string;
  region: string;
  capacity: number;
  fieldCount: number;
  fieldTypes: string[];
  amenities: string[];
  images: string[];
  contactInfo: any;
  pricing: any;
  description?: string;
  isPartner: boolean;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

const Stadiums: React.FC = () => {
  const { user } = useAuth();
  const { canEdit, canDelete, canCreate } = usePermissions();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStadium, setEditingStadium] = useState<Stadium | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'city'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);

  const [newStadium, setNewStadium] = useState<Omit<Stadium, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    address: '',
    city: '',
    region: '',
    capacity: 0,
    fieldCount: 1,
    fieldTypes: ['11v11'],
    amenities: [],
    images: [],
    contactInfo: {},
    pricing: {},
    description: '',
    isPartner: false,
    ownerId: 1
  });

  const fieldTypeOptions = [
    '5v5',
    '7v7',
    '11v11'
  ];

  const amenityOptions = [
    'Parking',
    'Douches',
    'Café',
    'Vestiaires',
    'Éclairage',
    'Tribunes',
    'Boutique'
  ];

  useEffect(() => {
    if (!showCreateModal) {
      setNewStadium({
        name: '',
        address: '',
        city: '',
        region: '',
        capacity: 0,
        fieldCount: 1,
        fieldTypes: ['11v11'],
        amenities: [],
        images: [],
        contactInfo: {},
        pricing: {},
        description: '',
        isPartner: false,
        ownerId: 1
      });
    }
  }, [showCreateModal]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCreateStadium = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStadium.name || !newStadium.city || newStadium.capacity <= 0) {
      alert("Veuillez remplir tous les champs requis (nom, ville, capacité)");
      return;
    }

    try {
      const { axiosInstance } = await import('../services/api');
      
      const response = await axiosInstance.post('/stadiums', {
        ...newStadium,
        capacity: parseInt(newStadium.capacity.toString()),
        fieldCount: parseInt(newStadium.fieldCount.toString())
      });

      if (response.data.success) {
        setStadiums(prev => [...prev, response.data.data]);
        setShowCreateModal(false);
        alert('Stade créé avec succès!');
      }
    } catch (error: any) {
      console.error('Erreur lors de la création du stade:', error);
      alert(`Erreur lors de la création du stade: ${error.response?.data?.message || 'Erreur inconnue'}`);
    }
  };

  const handleUpdateStadium = async (stadium: Stadium) => {
    try {
      const { axiosInstance } = await import('../services/api');
      
      const response = await axiosInstance.put(`/stadiums/${stadium.id}`, {
        ...stadium,
        capacity: parseInt(stadium.capacity.toString()),
        fieldCount: parseInt(stadium.fieldCount.toString())
      });

      if (response.data.success) {
        setStadiums(prev => prev.map(s => s.id === stadium.id ? response.data.data : s));
        setEditingStadium(null);
        alert('Stade mis à jour avec succès!');
      }
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du stade:', error);
      alert(`Erreur lors de la mise à jour du stade: ${error.response?.data?.message || 'Erreur inconnue'}`);
    }
  };

  const handleDeleteStadium = async (stadiumId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce stade ?')) {
      return;
    }

    try {
      const { axiosInstance } = await import('../services/api');
      
      const response = await axiosInstance.delete(`/stadiums/${stadiumId}`);

      if (response.data.success) {
        setStadiums(prev => prev.filter(s => s.id !== stadiumId));
        alert('Stade supprimé avec succès!');
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression du stade:', error);
      alert(`Erreur lors de la suppression du stade: ${error.response?.data?.message || 'Erreur inconnue'}`);
    }
  };

  const loadStadiums = async () => {
    try {
      const { axiosInstance } = await import('../services/api');
      
      const response = await axiosInstance.get('/stadiums');
      
      if (response.data.success) {
        setStadiums(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stades:', error);
    }
  };

  useEffect(() => {
    loadStadiums();
  }, []);

  // Filtrer et trier les stades
  const filteredAndSortedStadiums = stadiums
    .filter(stadium => 
      stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCity === '' || stadium.city.toLowerCase().includes(filterCity.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'capacity') {
        aValue = a.capacity;
        bValue = b.capacity;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const cities = [...new Set(stadiums.map(s => s.city))];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <ReadOnlyBanner />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-grid-white/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-2xl"
            >
              <MapPin className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                {isArabic ? '7OUMA الملاعب' : '7OUMA Stades'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              {isArabic 
                ? 'اكتشف أفضل الملاعب والمرافق الرياضية في منطقتك'
                : 'Découvrez les meilleurs stades et installations sportives de votre région'
              }
            </p>
            
            {canCreate && (
              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300"
              >
                <Plus className="w-6 h-6 mr-2" />
                {isArabic ? 'إضافة ملعب جديد' : 'Ajouter un stade'}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filtres et recherche */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-12 border border-white/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Search className="inline w-4 h-4 mr-2" />
                {isArabic ? 'البحث' : 'Rechercher'}
              </label>
              <input
                type="text"
                placeholder={isArabic ? "اسم الملعب..." : "Nom du stade..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Filter className="inline w-4 h-4 mr-2" />
                {isArabic ? 'المدينة' : 'Ville'}
              </label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              >
                <option value="">{isArabic ? 'جميع المدن' : 'Toutes les villes'}</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {isArabic ? 'ترتيب حسب' : 'Trier par'}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'capacity' | 'city')}
                className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              >
                <option value="name">{isArabic ? 'الاسم' : 'Nom'}</option>
                <option value="capacity">{isArabic ? 'السعة' : 'Capacité'}</option>
                <option value="city">{isArabic ? 'المدينة' : 'Ville'}</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Liste des stades */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-6"
          }
        >
          {filteredAndSortedStadiums.map((stadium, index) => (
            <motion.div
              key={stadium.id}
              variants={itemVariants}
              className={viewMode === 'grid' 
                ? "group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:scale-105"
                : "group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20"
              }
            >
              {/* Image du stade */}
              <div className="relative h-64 overflow-hidden">
                {stadium.images && stadium.images.length > 0 ? (
                  <img
                    src={stadium.images[0]}
                    alt={stadium.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                    <div className="text-white text-center">
                      <MapPin size={64} className="mx-auto mb-4 opacity-80" />
                      <p className="text-2xl font-bold">{stadium.name}</p>
                    </div>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  {stadium.isPartner && (
                    <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {isArabic ? 'شريك' : 'Partenaire'}
                    </div>
                  )}
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {stadium.fieldCount} {isArabic ? 'ملعب' : 'terrain(s)'}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => setSelectedStadium(stadium)}
                    className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white transition-colors"
                    title={isArabic ? 'عرض التفاصيل' : 'Voir détails'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {canEdit && (
                    <button
                      onClick={() => setEditingStadium(stadium)}
                      className="p-2 bg-blue-500/90 backdrop-blur-sm text-white rounded-xl hover:bg-blue-600 transition-colors"
                      title={isArabic ? 'تعديل' : 'Modifier'}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteStadium(stadium.id)}
                      className="p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-xl hover:bg-red-600 transition-colors"
                      title={isArabic ? 'حذف' : 'Supprimer'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stadium.name}</h3>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {stadium.city}, {stadium.region}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <div className="flex items-center mb-2">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-semibold text-gray-700">{isArabic ? 'السعة' : 'Capacité'}</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{stadium.capacity.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-2xl p-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm font-semibold text-gray-700">{isArabic ? 'الأنواع' : 'Types'}</span>
                      </div>
                      <p className="text-sm font-semibold text-purple-600">{stadium.fieldTypes.join(', ')}</p>
                    </div>
                  </div>
                  
                  {stadium.amenities && stadium.amenities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">{isArabic ? 'المرافق' : 'Équipements'}</h4>
                      <div className="flex flex-wrap gap-2">
                        {stadium.amenities.slice(0, 4).map((amenity, index) => (
                          <span key={index} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            {amenity}
                          </span>
                        ))}
                        {stadium.amenities.length > 4 && (
                          <span className="text-xs text-gray-500">+{stadium.amenities.length - 4}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {stadium.description && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 line-clamp-2">{stadium.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredAndSortedStadiums.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
              <MapPin size={80} className="mx-auto text-gray-400 mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                {searchTerm || filterCity ? (isArabic ? 'لم يتم العثور على ملاعب' : 'Aucun stade trouvé') : (isArabic ? 'لا توجد ملاعب متاحة' : 'Aucun stade disponible')}
              </h3>
              <p className="text-gray-500 text-lg">
                {searchTerm || filterCity 
                  ? (isArabic ? 'جرب تعديل معايير البحث الخاصة بك' : 'Essayez de modifier vos critères de recherche')
                  : (isArabic ? 'ابدأ بإضافة ملعبك الأول' : 'Commencez par ajouter votre premier stade')
                }
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{isArabic ? 'إضافة ملعب جديد' : 'Ajouter un stade'}</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleCreateStadium} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isArabic ? 'اسم الملعب' : 'Nom du stade'} *
                    </label>
                    <input
                      type="text"
                      value={newStadium.name}
                      onChange={(e) => setNewStadium({...newStadium, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isArabic ? 'المدينة' : 'Ville'} *
                    </label>
                    <input
                      type="text"
                      value={newStadium.city}
                      onChange={(e) => setNewStadium({...newStadium, city: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isArabic ? 'العنوان' : 'Adresse'}
                  </label>
                  <input
                    type="text"
                    value={newStadium.address}
                    onChange={(e) => setNewStadium({...newStadium, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isArabic ? 'المنطقة' : 'Région'}
                    </label>
                    <input
                      type="text"
                      value={newStadium.region}
                      onChange={(e) => setNewStadium({...newStadium, region: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isArabic ? 'السعة' : 'Capacité'} *
                    </label>
                    <input
                      type="number"
                      value={newStadium.capacity}
                      onChange={(e) => setNewStadium({...newStadium, capacity: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isArabic ? 'عدد الملاعب' : 'Nombre de terrains'}
                    </label>
                    <input
                      type="number"
                      value={newStadium.fieldCount}
                      onChange={(e) => setNewStadium({...newStadium, fieldCount: parseInt(e.target.value) || 1})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {isArabic ? 'أنواع الملاعب' : 'Types de terrains'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {fieldTypeOptions.map(option => (
                      <label key={option} className="flex items-center p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newStadium.fieldTypes.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewStadium({
                                ...newStadium,
                                fieldTypes: [...newStadium.fieldTypes, option]
                              });
                            } else {
                              setNewStadium({
                                ...newStadium,
                                fieldTypes: newStadium.fieldTypes.filter(t => t !== option)
                              });
                            }
                          }}
                          className="mr-3"
                        />
                        <span className="text-sm font-medium text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {isArabic ? 'المرافق المتاحة' : 'Équipements disponibles'}
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                    {amenityOptions.map(option => (
                      <label key={option} className="flex items-center p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newStadium.amenities.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewStadium({
                                ...newStadium,
                                amenities: [...newStadium.amenities, option]
                              });
                            } else {
                              setNewStadium({
                                ...newStadium,
                                amenities: newStadium.amenities.filter(a => a !== option)
                              });
                            }
                          }}
                          className="mr-3"
                        />
                        <span className="text-sm font-medium text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isArabic ? 'الوصف' : 'Description'}
                  </label>
                  <textarea
                    value={newStadium.description}
                    onChange={(e) => setNewStadium({...newStadium, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center p-4 bg-blue-50 rounded-2xl">
                  <input
                    type="checkbox"
                    id="isPartner"
                    checked={newStadium.isPartner}
                    onChange={(e) => setNewStadium({...newStadium, isPartner: e.target.checked})}
                    className="mr-3"
                  />
                  <label htmlFor="isPartner" className="text-sm font-medium text-gray-700">
                    {isArabic ? 'ملعب شريك' : 'Stade partenaire'}
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    {isArabic ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
                  >
                    {isArabic ? 'إنشاء' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal d'édition */}
      {editingStadium && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{isArabic ? 'تعديل الملعب' : 'Modifier le stade'}</h2>
                <button
                  onClick={() => setEditingStadium(null)}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateStadium(editingStadium); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isArabic ? 'اسم الملعب' : 'Nom du stade'} *
                    </label>
                    <input
                      type="text"
                      value={editingStadium.name}
                      onChange={(e) => setEditingStadium({...editingStadium, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isArabic ? 'المدينة' : 'Ville'} *
                    </label>
                    <input
                      type="text"
                      value={editingStadium.city}
                      onChange={(e) => setEditingStadium({...editingStadium, city: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isArabic ? 'العنوان' : 'Adresse'}
                  </label>
                  <input
                    type="text"
                    value={editingStadium.address}
                    onChange={(e) => setEditingStadium({...editingStadium, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isArabic ? 'المنطقة' : 'Région'}
                    </label>
                    <input
                      type="text"
                      value={editingStadium.region}
                      onChange={(e) => setEditingStadium({...editingStadium, region: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isArabic ? 'السعة' : 'Capacité'} *
                    </label>
                    <input
                      type="number"
                      value={editingStadium.capacity}
                      onChange={(e) => setEditingStadium({...editingStadium, capacity: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {isArabic ? 'عدد الملاعب' : 'Nombre de terrains'}
                    </label>
                    <input
                      type="number"
                      value={editingStadium.fieldCount}
                      onChange={(e) => setEditingStadium({...editingStadium, fieldCount: parseInt(e.target.value) || 1})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {isArabic ? 'أنواع الملاعب' : 'Types de terrains'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {fieldTypeOptions.map(option => (
                      <label key={option} className="flex items-center p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingStadium.fieldTypes.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingStadium({
                                ...editingStadium,
                                fieldTypes: [...editingStadium.fieldTypes, option]
                              });
                            } else {
                              setEditingStadium({
                                ...editingStadium,
                                fieldTypes: editingStadium.fieldTypes.filter(t => t !== option)
                              });
                            }
                          }}
                          className="mr-3"
                        />
                        <span className="text-sm font-medium text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {isArabic ? 'المرافق المتاحة' : 'Équipements disponibles'}
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                    {amenityOptions.map(option => (
                      <label key={option} className="flex items-center p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingStadium.amenities.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingStadium({
                                ...editingStadium,
                                amenities: [...editingStadium.amenities, option]
                              });
                            } else {
                              setEditingStadium({
                                ...editingStadium,
                                amenities: editingStadium.amenities.filter(a => a !== option)
                              });
                            }
                          }}
                          className="mr-3"
                        />
                        <span className="text-sm font-medium text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {isArabic ? 'الوصف' : 'Description'}
                  </label>
                  <textarea
                    value={editingStadium.description}
                    onChange={(e) => setEditingStadium({...editingStadium, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center p-4 bg-blue-50 rounded-2xl">
                  <input
                    type="checkbox"
                    id="editIsPartner"
                    checked={editingStadium.isPartner}
                    onChange={(e) => setEditingStadium({...editingStadium, isPartner: e.target.checked})}
                    className="mr-3"
                  />
                  <label htmlFor="editIsPartner" className="text-sm font-medium text-gray-700">
                    {isArabic ? 'ملعب شريك' : 'Stade partenaire'}
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditingStadium(null)}
                    className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    {isArabic ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
                  >
                    {isArabic ? 'تحديث' : 'Mettre à jour'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Stadiums; 