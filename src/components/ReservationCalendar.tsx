import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  getCalendarReservations, 
  getStadiums, 
  getStadiumAvailability,
  createReservation 
} from '../services/api';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Trophy,
  Target,
  Building
} from 'lucide-react';
import { Reservation, Stadium, Field, CalendarView, ReservationFilters } from '../types';

interface ReservationCalendarProps {
  onClose?: () => void;
  showNewReservationModal?: boolean;
  onShowNewReservationModal?: (show: boolean) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ 
  onClose, 
  showNewReservationModal: externalShowModal,
  onShowNewReservationModal 
}) => {
  const { user: currentUser } = useAuth();
  const { t, isRTL } = useLanguage();
  
  // États principaux
  const [view, setView] = useState<CalendarView['type']>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [selectedStadium, setSelectedStadium] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les filtres
  const [filters, setFilters] = useState<ReservationFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour les modals
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  
  // Utiliser le modal externe si fourni, sinon utiliser l'état local
  const isModalOpen = externalShowModal !== undefined ? externalShowModal : showReservationModal;
  const setIsModalOpen = onShowNewReservationModal || setShowReservationModal;
  
  // États pour le formulaire de réservation
  const [reservationForm, setReservationForm] = useState({
    title: '',
    description: '',
    purpose: 'match' as const,
    teamId: '',
    phoneNumber: ''
  });

  // Charger les données initiales
  useEffect(() => {
    loadStadiums();
    loadCalendarData();
  }, [view, currentDate, selectedStadium]);

  const loadStadiums = async () => {
    try {
      const stadiumsData = await getStadiums();
      setStadiums(stadiumsData);
    } catch (error) {
      console.error('Erreur lors du chargement des stades:', error);
    }
  };

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const calendarData = await getCalendarReservations(
        view,
        currentDate.toISOString(),
        selectedStadium || undefined
      );
      
      setReservations(calendarData.reservations || []);
    } catch (error: any) {
      setError(error.message || 'Erreur lors du chargement du calendrier');
    } finally {
      setLoading(false);
    }
  };

  // Navigation dans le calendrier
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Générer les créneaux horaires
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 22; hour++) {
      slots.push({
        hour,
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`
      });
    }
    return slots;
  };

  // Générer les jours de la semaine
  const generateWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Vérifier si un créneau est réservé
  const isSlotReserved = (date: Date, hour: number, fieldId: number) => {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    return reservations.find(reservation => 
      reservation.fieldId === fieldId &&
      new Date(reservation.startTime) < slotEnd &&
      new Date(reservation.endTime) > slotStart
    );
  };

  // Obtenir le statut d'un créneau
  const getSlotStatus = (date: Date, hour: number, fieldId: number) => {
    const reservation = isSlotReserved(date, hour, fieldId);
    if (!reservation) return 'available';
    
    switch (reservation.status) {
      case 'confirmed': return 'confirmed';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return 'available';
    }
  };

  // Gérer le clic sur un créneau
  const handleSlotClick = (date: Date, hour: number, field: Field) => {
    const status = getSlotStatus(date, hour, field.id);
    if (status === 'available') {
      setSelectedSlot({ date, hour, field });
      setSelectedField(field);
      setIsModalOpen(true);
    }
  };

  // Créer une réservation
  const handleCreateReservation = async () => {
    try {
      if (!selectedField) {
        setError('Veuillez sélectionner un terrain');
        return;
      }

             if (!selectedSlot) {
         setError('Veuillez sélectionner une date et heure');
         return;
       }

       if (!reservationForm.phoneNumber) {
         setError('Veuillez saisir votre numéro de téléphone');
         return;
       }

       // Validation basique du format du numéro de téléphone
       const phoneRegex = /^[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}$/;
       if (!phoneRegex.test(reservationForm.phoneNumber.replace(/\s/g, ''))) {
         setError('Veuillez saisir un numéro de téléphone valide (format: 06 12 34 56 78)');
         return;
       }

      const startTime = new Date(selectedSlot.date);
      startTime.setHours(selectedSlot.hour, 0, 0, 0);
      const endTime = new Date(selectedSlot.date);
      endTime.setHours(selectedSlot.hour + 1, 0, 0, 0);

             const reservationData = {
         fieldId: selectedField.id,
         title: reservationForm.title,
         description: reservationForm.description,
         startTime: startTime.toISOString(),
         endTime: endTime.toISOString(),
         purpose: reservationForm.purpose,
         teamId: reservationForm.teamId || undefined,
         phoneNumber: reservationForm.phoneNumber
       };

      await createReservation(reservationData);
      
             // Réinitialiser le formulaire et fermer le modal
       setReservationForm({
         title: '',
         description: '',
         purpose: 'match',
         teamId: '',
         phoneNumber: ''
       });
      setIsModalOpen(false);
      setSelectedSlot(null);
      setSelectedField(null);
      
      // Recharger les données
      loadCalendarData();
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création de la réservation');
    }
  };

  // Rendu du calendrier jour
  const renderDayView = () => {
    const timeSlots = generateTimeSlots();
    const fields = selectedStadium 
      ? stadiums.find(s => s.id === selectedStadium)?.fields || []
      : stadiums.flatMap(s => s.fields);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-50 min-w-[100px]">Heure</th>
              {fields.map(field => (
                <th key={field.id} className="border border-gray-300 p-2 bg-gray-50 min-w-[150px]">
                  <div className="text-center">
                    <div className="font-semibold">{field.name}</div>
                    <div className="text-xs text-gray-500">{field.type}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot.hour}>
                <td className="border border-gray-300 p-2 text-center bg-gray-50 font-medium">
                  {slot.startTime}
                </td>
                {fields.map(field => {
                  const status = getSlotStatus(currentDate, slot.hour, field.id);
                  const reservation = isSlotReserved(currentDate, slot.hour, field.id);
                  
                  return (
                    <td 
                      key={field.id} 
                      className={`border border-gray-300 p-1 cursor-pointer transition-colors ${
                        status === 'available' ? 'hover:bg-green-50' :
                        status === 'confirmed' ? 'bg-red-100' :
                        status === 'pending' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}
                      onClick={() => handleSlotClick(currentDate, slot.hour, field)}
                    >
                      {reservation && (
                        <div className="text-xs p-1 rounded">
                          <div className="font-medium truncate">{reservation.title}</div>
                          <div className="text-gray-600">{reservation.user.name}</div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Rendu du calendrier semaine
  const renderWeekView = () => {
    const days = generateWeekDays();
    const timeSlots = generateTimeSlots();
    const fields = selectedStadium 
      ? stadiums.find(s => s.id === selectedStadium)?.fields || []
      : stadiums.flatMap(s => s.fields);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-gray-50 min-w-[100px]">Heure</th>
              {days.map(day => (
                <th key={day.toISOString()} className="border border-gray-300 p-2 bg-gray-50 min-w-[120px]">
                  <div className="text-center">
                    <div className="font-semibold">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                    <div className="text-sm">{day.getDate()}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(slot => (
              <tr key={slot.hour}>
                <td className="border border-gray-300 p-2 text-center bg-gray-50 font-medium">
                  {slot.startTime}
                </td>
                {days.map(day => {
                  const dayReservations = reservations.filter(reservation => {
                    const reservationDate = new Date(reservation.startTime);
                    return reservationDate.toDateString() === day.toDateString() &&
                           reservationDate.getHours() === slot.hour;
                  });

                  return (
                    <td key={day.toISOString()} className="border border-gray-300 p-1">
                      {dayReservations.map(reservation => (
                        <div 
                          key={reservation.id}
                          className={`text-xs p-1 rounded mb-1 ${
                            reservation.status === 'confirmed' ? 'bg-red-100' :
                            reservation.status === 'pending' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}
                        >
                          <div className="font-medium truncate">{reservation.title}</div>
                          <div className="text-gray-600">{reservation.field.name}</div>
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Rendu du calendrier mois
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
          <div key={day} className="p-2 text-center font-semibold bg-gray-50">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayReservations = reservations.filter(reservation => {
            const reservationDate = new Date(reservation.startTime);
            return reservationDate.toDateString() === day.toDateString();
          });

          const isCurrentMonth = day.getMonth() === month;
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div 
              key={day.toISOString()} 
              className={`p-2 min-h-[80px] border border-gray-200 ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-sm font-medium ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {day.getDate()}
              </div>
              
              {dayReservations.length > 0 && (
                <div className="mt-1">
                  <div className="text-xs text-gray-600">
                    {dayReservations.length} réservation(s)
                  </div>
                  {dayReservations.slice(0, 2).map(reservation => (
                    <div 
                      key={reservation.id}
                      className={`text-xs p-1 rounded mt-1 truncate ${
                        reservation.status === 'confirmed' ? 'bg-red-100' :
                        reservation.status === 'pending' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}
                    >
                      {reservation.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="mr-3 text-blue-600" size={28} />
            Calendrier des Réservations
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez et visualisez les réservations de terrains
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stade
              </label>
              <select
                value={selectedStadium || ''}
                onChange={(e) => setSelectedStadium(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tous les stades</option>
                {stadiums.map(stadium => (
                  <option key={stadium.id} value={stadium.id}>
                    {stadium.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de terrain
              </label>
              <select
                value={filters.fieldType || ''}
                onChange={(e) => setFilters({ ...filters, fieldType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="synthétique">Synthétique</option>
                <option value="gazon naturel">Gazon naturel</option>
                <option value="couvert">Couvert</option>
                <option value="extérieur">Extérieur</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quartier
              </label>
              <select
                value={filters.neighborhood || ''}
                onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tous les quartiers</option>
                {stadiums
                  .map(s => s.neighborhood)
                  .filter((n, i, arr) => n && arr.indexOf(n) === i)
                  .map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Contrôles du calendrier */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevious}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Aujourd'hui
              </button>
              
              <button
                onClick={goToNext}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('fr-FR', { 
                month: 'long', 
                year: 'numeric',
                ...(view === 'day' && { day: 'numeric' })
              })}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 text-sm font-medium rounded-lg ${
                view === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm font-medium rounded-lg ${
                view === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm font-medium rounded-lg ${
                view === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mois
            </button>
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-600">Libre</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-sm text-gray-600">Confirmé</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-sm text-gray-600">En attente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">Annulé</span>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
      </div>

      {/* Modal de réservation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nouvelle Réservation
            </h3>
            
            <div className="space-y-4">
              {selectedField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terrain
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    {selectedField.name} - {selectedField.type}
                  </div>
                </div>
              )}
              
              {selectedSlot && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date et heure
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                    {selectedSlot.date.toLocaleDateString('fr-FR')} à {selectedSlot.hour}:00
                  </div>
                </div>
              )}
              
              {!selectedField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sélectionner un terrain
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onChange={(e) => {
                      const field = stadiums.flatMap(s => s.fields || []).find(f => f.id === parseInt(e.target.value));
                      setSelectedField(field || null);
                    }}
                  >
                    <option value="">Choisir un terrain...</option>
                    {stadiums.flatMap(stadium => stadium.fields || []).map(field => (
                      <option key={field.id} value={field.id}>
                        {field.name} - {field.type} ({stadiums.find(s => s.fields?.some(f => f.id === field.id))?.name})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {!selectedSlot && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date et heure
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onChange={(e) => {
                        if (!selectedSlot) {
                          setSelectedSlot({ date: new Date(e.target.value), hour: 8, field: null });
                        }
                      }}
                    />
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onChange={(e) => {
                        if (selectedSlot) {
                          setSelectedSlot({ ...selectedSlot, hour: parseInt(e.target.value) });
                        }
                      }}
                    >
                      {generateTimeSlots().map(slot => (
                        <option key={slot.hour} value={slot.hour}>
                          {slot.startTime}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={reservationForm.title}
                  onChange={(e) => setReservationForm({ ...reservationForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Titre de la réservation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={reservationForm.description}
                  onChange={(e) => setReservationForm({ ...reservationForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Description optionnelle"
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   But
                 </label>
                 <select
                   value={reservationForm.purpose}
                   onChange={(e) => setReservationForm({ ...reservationForm, purpose: e.target.value as any })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                 >
                   <option value="match">Match</option>
                   <option value="entraînement">Entraînement</option>
                   <option value="tournoi">Tournoi</option>
                   <option value="événement">Événement</option>
                 </select>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Numéro de téléphone *
                 </label>
                 <input
                   type="tel"
                   value={reservationForm.phoneNumber}
                   onChange={(e) => setReservationForm({ ...reservationForm, phoneNumber: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                   placeholder="06 12 34 56 78"
                   pattern="[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}"
                 />
                 <p className="text-xs text-gray-500 mt-1">Format: 06 12 34 56 78</p>
               </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
                             <button
                 onClick={handleCreateReservation}
                 disabled={!reservationForm.title || !reservationForm.phoneNumber || !selectedField || !selectedSlot}
                 className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Réserver
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default ReservationCalendar;
