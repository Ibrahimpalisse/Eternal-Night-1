import React, { useState } from 'react';
import { Calendar, DatePicker, DateRangePicker } from '../ui';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  DateRange,
  Sparkles
} from 'lucide-react';

const CalendarExamples = () => {
  // États pour les différents exemples
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
            Composants Calendrier Modernes
          </h1>
          <p className="text-gray-400">
            Exemples d'utilisation des composants calendrier intégrés au style du site
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Calendrier de base */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Calendrier de Base</h3>
                <p className="text-sm text-gray-400">Sélection de date simple</p>
              </div>
            </div>
            
            <Calendar
              value={calendarDate}
              onChange={setCalendarDate}
              className="w-full"
            />
            
            {calendarDate && (
              <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-blue-400">Date sélectionnée :</span>
                  <br />
                  {calendarDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}
          </div>

          {/* DatePicker simple */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">DatePicker Simple</h3>
                <p className="text-sm text-gray-400">Sélecteur de date avec input</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                label="Date de publication"
                placeholder="Choisir une date"
                required
              />
              
              <DatePicker
                value={selectedDateTime}
                onChange={setSelectedDateTime}
                label="Date et heure"
                placeholder="Choisir date et heure"
                showTime
              />
            </div>
            
            {(selectedDate || selectedDateTime) && (
              <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <p className="text-sm text-gray-300">
                  {selectedDate && (
                    <>
                      <span className="font-medium text-green-400">Date simple :</span>
                      <br />
                      {selectedDate.toLocaleDateString('fr-FR')}
                      <br />
                    </>
                  )}
                  {selectedDateTime && (
                    <>
                      <span className="font-medium text-green-400">Date et heure :</span>
                      <br />
                      {selectedDateTime.toLocaleDateString('fr-FR')} à {selectedDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* DateRangePicker */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <DateRange className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Plage de Dates</h3>
                <p className="text-sm text-gray-400">Sélection de période</p>
              </div>
            </div>
            
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              label="Période de publication"
              placeholder="Sélectionner une période"
              required
            />
            
            {(startDate || endDate) && (
              <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-purple-400">Période sélectionnée :</span>
                  <br />
                  {startDate && `Du ${startDate.toLocaleDateString('fr-FR')}`}
                  {startDate && endDate && ' '}
                  {endDate && `au ${endDate.toLocaleDateString('fr-FR')}`}
                </p>
                {startDate && endDate && (
                  <p className="text-xs text-gray-400 mt-1">
                    Durée : {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} jour(s)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Exemple avec limitations */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Avec Limites</h3>
                <p className="text-sm text-gray-400">Min/Max et validations</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <DatePicker
                value={null}
                onChange={() => {}}
                label="Future uniquement"
                placeholder="Sélectionner une date future"
                minDate={new Date()}
              />
              
              <DatePicker
                value={null}
                onChange={() => {}}
                label="Année courante uniquement"
                placeholder="Sélectionner dans l'année"
                minDate={new Date(new Date().getFullYear(), 0, 1)}
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
              />
              
              <DatePicker
                value={null}
                onChange={() => {}}
                label="Désactivé"
                placeholder="Champ désactivé"
                disabled
              />
            </div>
          </div>

          {/* Cas d'usage réels */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-xl lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Cas d'Usage Réels</h3>
                <p className="text-sm text-gray-400">Exemples d'intégration dans l'application</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formulaire de création de chapitre */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-white">Création de Chapitre</h4>
                <DatePicker
                  value={null}
                  onChange={() => {}}
                  label="Date de publication prévue"
                  placeholder="Quand publier ce chapitre ?"
                  minDate={new Date()}
                  showTime
                />
                <DateRangePicker
                  startDate={null}
                  endDate={null}
                  onChange={() => {}}
                  label="Période de rédaction"
                  placeholder="Période d'écriture"
                />
              </div>
              
              {/* Filtres de recherche */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-white">Filtres de Recherche</h4>
                <DateRangePicker
                  startDate={null}
                  endDate={null}
                  onChange={() => {}}
                  label="Filtrer par période"
                  placeholder="Rechercher dans une période"
                />
                <DatePicker
                  value={null}
                  onChange={() => {}}
                  label="Dernière activité après"
                  placeholder="Activité récente uniquement"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Code examples */}
        <div className="mt-12 bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Exemples de Code</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">DatePicker Simple</h4>
              <pre className="bg-slate-900/50 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto">
{`<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  label="Date de publication"
  placeholder="Choisir une date"
  required
/>`}
              </pre>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">DateRangePicker</h4>
              <pre className="bg-slate-900/50 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto">
{`<DateRangePicker
  startDate={startDate}
  endDate={endDate}
  onChange={(start, end) => {
    setStartDate(start);
    setEndDate(end);
  }}
  label="Période"
  placeholder="Sélectionner une période"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarExamples; 