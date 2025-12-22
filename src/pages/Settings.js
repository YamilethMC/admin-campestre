import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../shared/context/AppContext';
import apiClient from '../shared/api/apiClient';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { addToast } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    language: 'es',
    theme: 'light',
    notificationsEnabled: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await apiClient.get('/user/settings');
      if (data) {
        setSettings({
          language: data.language || 'es',
          theme: data.theme || 'light',
          notificationsEnabled: data.notificationsEnabled ?? true,
        });
        i18n.changeLanguage(data.language || 'es');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await apiClient.patch('/user/settings', settings);
      i18n.changeLanguage(settings.language);
      localStorage.setItem('userLanguage', settings.language);
      addToast(t('settings.saveSuccess'), 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      addToast(t('settings.saveError'), 'error');
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('settings.title')}</h1>

        <div className="space-y-6">
          {/* User Preferences Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('settings.userPreferences')}</h2>

            <div className="space-y-4">
              {/* Language selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.language')}
                </label>
                <select 
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="es">{t('settings.spanish')}</option>
                  <option value="en">{t('settings.english')}</option>
                </select>
              </div>

              {/* Theme selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('settings.theme')}
                </label>
                <select 
                  value={settings.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="light">{t('settings.light')}</option>
                  <option value="dark">{t('settings.dark')}</option>
                </select>
              </div>

              {/* Notifications toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                  {t('settings.enableNotifications')}
                </label>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('settings.systemInfo')}</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('settings.version')}:</span>
                <span className="text-sm font-medium text-gray-800">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('settings.lastUpdate')}:</span>
                <span className="text-sm font-medium text-gray-800">21 Dic 2024</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button 
              type="button"
              onClick={() => loadSettings()}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
            >
              {t('common.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
