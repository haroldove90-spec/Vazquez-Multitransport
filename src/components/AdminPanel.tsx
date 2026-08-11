import React, { useState, useRef } from 'react';
import { SiteConfig, HeroSlide, ValueAddedItem, ServiceItem, GalleryImage } from '../types';
import { uploadImageFile, syncToSupabase, saveSiteConfig } from '../lib/supabaseClient';
import {
  X,
  Upload,
  Save,
  Palette,
  Image as ImageIcon,
  Phone,
  FileText,
  Sliders,
  Database,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Lock
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [activeTab, setActiveTab] = useState<'general' | 'contacts' | 'slider' | 'content' | 'services' | 'gallery' | 'supabase'>('general');
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const sliderFileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    // Save to LocalStorage and update global state
    saveSiteConfig(formData);
    onUpdateConfig(formData);

    // If Supabase credentials are configured, sync to DB as well
    if (formData.supabaseUrl && formData.supabaseAnonKey) {
      setSaveStatus({ type: null, message: 'Guardando en Supabase...' });
      const res = await syncToSupabase(formData);
      if (res.success) {
        setSaveStatus({ type: 'success', message: '¡Guardado localmente y en Supabase exitosamente!' });
      } else {
        setSaveStatus({ type: 'error', message: res.message });
      }
    } else {
      setSaveStatus({ type: 'success', message: '¡Cambios guardados correctamente en la aplicación!' });
    }

    setTimeout(() => {
      setSaveStatus({ type: null, message: '' });
    }, 4000);
  };

  // Handle Logo File Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, formData);
      setFormData(prev => ({ ...prev, logoUrl: url }));
    } catch (err) {
      console.error('Error subiendo logo:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Hero Slide Image Upload
  const handleSlideImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, formData);
      setFormData(prev => {
        const newSlides = [...prev.heroSlides];
        newSlides[index] = { ...newSlides[index], imageUrl: url };
        return { ...prev, heroSlides: newSlides };
      });
    } catch (err) {
      console.error('Error subiendo imagen de slider:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Gallery Image Upload
  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, formData);
      const newImg: GalleryImage = {
        id: `gal-${Date.now()}`,
        url: url,
        title: `Unidad Vazquez Multitransport ${formData.galleryImages.length + 1}`
      };
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, newImg]
      }));
    } catch (err) {
      console.error('Error subiendo imagen a galería:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      {/* Top Admin Header Bar matching theme screenshot */}
      <div className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-blue-600 text-white">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                ADMIN MODE: VAZQUE MULTITRANSPORT
              </span>
              <span className="opacity-50 text-xs hidden sm:inline">|</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Conectado a Supabase (snjcjrjyoouzhixymbnq)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Panel Autoadministrable • Hostinger & Supabase Cloud Ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded transition-colors border border-white/20 cursor-pointer"
          >
            <span>Ver Sitio en Vivo</span>
          </button>
        </div>
      </div>

      {/* Main Admin Page Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col">
        {/* Status Toast Notification */}
        {saveStatus.message && (
          <div className={`mb-4 p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-semibold shadow-sm ${
            saveStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : saveStatus.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <RefreshCw className={`w-5 h-5 shrink-0 ${!saveStatus.type ? 'animate-spin text-blue-600' : 'text-emerald-600'}`} />
              <span>{saveStatus.message}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex-1 flex flex-col overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto bg-gray-50 border-b border-gray-200 scrollbar-none px-4 pt-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'general'
                ? 'border-[#0E5197] text-[#0E5197] bg-white rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Identidad & Colores</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'contacts'
                ? 'border-[#0E5197] text-[#0E5197] bg-white rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Teléfonos & WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('slider')}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'slider'
                ? 'border-[#0E5197] text-[#0E5197] bg-white rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Slider Principal (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'content'
                ? 'border-[#0E5197] text-[#0E5197] bg-white rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Bienvenida & Empresa</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'services'
                ? 'border-[#0E5197] text-[#0E5197] bg-white rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Servicios</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'gallery'
                ? 'border-[#0E5197] text-[#0E5197] bg-white rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galería de Flota</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'supabase'
                ? 'border-[#0E5197] text-[#0E5197] bg-white rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Base de Datos Supabase</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Message */}
          {saveStatus.message && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
                saveStatus.type === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {saveStatus.type === 'error' ? (
                <AlertCircle className="w-5 h-5 shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{saveStatus.message}</span>
            </div>
          )}

          {/* TAB 1: IDENTIDAD & COLORES */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Configuración General de la Página</h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Título Principal del Sitio
                  </label>
                  <input
                    type="text"
                    value={formData.pageTitle}
                    onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0E5197]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Subtexto / Eslogan del Logo
                  </label>
                  <input
                    type="text"
                    value={formData.logoSubtext}
                    onChange={(e) => setFormData({ ...formData, logoSubtext: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0E5197]"
                  />
                </div>
              </div>

              {/* Logo Upload Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Subir Logo Oficial</h3>
                <p className="text-xs text-gray-600">Puede subir una imagen de su logotipo (PNG, JPG, SVG) o utilizar el diseño vectorial predeterminado.</p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 bg-[#0E5197] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-900 transition-colors shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Subiendo imagen...' : 'Subir Imagen de Logo'}</span>
                  </button>

                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Restablecer Logo Predeterminado
                    </button>
                  )}
                </div>

                {formData.logoUrl && (
                  <div className="p-3 bg-white rounded-xl border border-gray-200 inline-block">
                    <img src={formData.logoUrl} alt="Logo Preview" className="h-16 w-auto object-contain" />
                  </div>
                )}
              </div>

              {/* Dynamic Theme Colors */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Ajuste de Colores de la Marca</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Color Principal (Header, Títulos, Alas)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.primaryColor || '#0E5197'}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor || '#0E5197'}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Color Secundario (Botones WhatsApp, Mapa, Acentos)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.secondaryColor || '#1D7946'}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor || '#1D7946'}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TELÉFONOS & WHATSAPP */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Barra Superior de Teléfonos (Top Bar Header)</h3>
                <p className="text-xs text-gray-600">Agregue o modifique los números telefónicos que se muestran en la barra superior del header.</p>

                <div className="space-y-3">
                  {formData.topPhones.map((phone, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          const newPhones = [...formData.topPhones];
                          newPhones[idx] = e.target.value;
                          setFormData({ ...formData, topPhones: newPhones });
                        }}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPhones = formData.topPhones.filter((_, i) => i !== idx);
                          setFormData({ ...formData, topPhones: newPhones });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, topPhones: [...formData.topPhones, '55-0000-0000'] })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5197] hover:underline pt-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar otro teléfono</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">WhatsApp Directo y Redes Sociales</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Número de WhatsApp (con código de país ej. 525563477853)
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Página de Facebook
                    </label>
                    <input
                      type="text"
                      value={formData.facebookPage}
                      onChange={(e) => setFormData({ ...formData, facebookPage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Mensaje Inicial Predeterminado de WhatsApp
                  </label>
                  <textarea
                    rows={2}
                    value={formData.whatsappMessage}
                    onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SLIDER PRINCIPAL */}
          {activeTab === 'slider' && (
            <div className="space-y-6">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-[#0E5197]">
                  Configure las 3 imágenes y mensajes del slider principal de la página de inicio.
                </p>
              </div>

              {formData.heroSlides.map((slide, idx) => (
                <div key={slide.id || idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-extrabold text-sm text-[#0E5197] uppercase">
                      Diapositiva #{idx + 1}
                    </span>
                  </div>

                  {/* Slide Image Upload */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Imagen del Slider #{idx + 1}
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <img
                        src={slide.imageUrl}
                        alt={`Slide ${idx + 1}`}
                        className="w-32 h-20 object-cover rounded-xl border border-gray-300 shadow-2xs"
                      />
                      <div className="space-y-2 flex-1 w-full">
                        <input
                          type="file"
                          ref={sliderFileInputRefs[idx]}
                          onChange={(e) => handleSlideImageUpload(idx, e)}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => sliderFileInputRefs[idx].current?.click()}
                          disabled={isUploading}
                          className="inline-flex items-center gap-2 bg-[#0E5197] text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-blue-900 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Subir Imagen Directamente</span>
                        </button>
                        <input
                          type="text"
                          placeholder="O ingrese URL de imagen..."
                          value={slide.imageUrl}
                          onChange={(e) => {
                            const newSlides = [...formData.heroSlides];
                            newSlides[idx] = { ...newSlides[idx], imageUrl: e.target.value };
                            setFormData({ ...formData, heroSlides: newSlides });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Título de la Diapositiva
                    </label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => {
                        const newSlides = [...formData.heroSlides];
                        newSlides[idx] = { ...newSlides[idx], title: e.target.value };
                        setFormData({ ...formData, heroSlides: newSlides });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Subtítulo / Descripción
                    </label>
                    <textarea
                      rows={2}
                      value={slide.subtitle}
                      onChange={(e) => {
                        const newSlides = [...formData.heroSlides];
                        newSlides[idx] = { ...newSlides[idx], subtitle: e.target.value };
                        setFormData({ ...formData, heroSlides: newSlides });
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: BIENVENIDA & NOSOTROS */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Mensaje de Bienvenida (Abajo del Slider)</h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Título del Mensaje
                  </label>
                  <input
                    type="text"
                    value={formData.welcomeMessageTitle}
                    onChange={(e) => setFormData({ ...formData, welcomeMessageTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={formData.welcomeMessageSubtitle}
                    onChange={(e) => setFormData({ ...formData, welcomeMessageSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-[#1D7946]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Cuerpo del Mensaje de Bienvenida
                  </label>
                  <textarea
                    rows={4}
                    value={formData.welcomeMessageBody}
                    onChange={(e) => setFormData({ ...formData, welcomeMessageBody: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-normal"
                  />
                </div>
              </div>

              {/* About Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Sección "Nosotros" (Descripción de la Empresa)</h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={formData.aboutTitle}
                    onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Descripción del Negocio
                  </label>
                  <textarea
                    rows={5}
                    value={formData.aboutDescription}
                    onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-normal"
                  />
                </div>
              </div>

              {/* 3 Value Added Points */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">3 Valores Agregados de la Empresa</h3>

                {formData.aboutValues.map((val, idx) => (
                  <div key={val.id || idx} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                    <span className="font-extrabold text-xs text-[#0E5197] uppercase">Valor #{idx + 1}</span>
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => {
                        const newVals = [...formData.aboutValues];
                        newVals[idx] = { ...newVals[idx], title: e.target.value };
                        setFormData({ ...formData, aboutValues: newVals });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-bold"
                    />
                    <textarea
                      rows={2}
                      value={val.description}
                      onChange={(e) => {
                        const newVals = [...formData.aboutValues];
                        newVals[idx] = { ...newVals[idx], description: e.target.value };
                        setFormData({ ...formData, aboutValues: newVals });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SERVICIOS */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900">Catálogo de Servicios</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newServ: ServiceItem = {
                        id: `serv-${Date.now()}`,
                        iconName: 'Truck',
                        title: 'Nuevo Servicio',
                        description: 'Descripción del nuevo servicio ofrecido por Vazquez Multitransport.',
                        badge: 'Disponible'
                      };
                      setFormData({ ...formData, servicesList: [...formData.servicesList, newServ] });
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#0E5197] text-white text-xs font-bold px-3 py-2 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Servicio</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.servicesList.map((serv, idx) => (
                    <div key={serv.id || idx} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={serv.title}
                          onChange={(e) => {
                            const newServs = [...formData.servicesList];
                            newServs[idx] = { ...newServs[idx], title: e.target.value };
                            setFormData({ ...formData, servicesList: newServs });
                          }}
                          className="font-bold text-sm px-3 py-1.5 rounded-lg border border-gray-300 w-2/3"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newServs = formData.servicesList.filter((_, i) => i !== idx);
                            setFormData({ ...formData, servicesList: newServs });
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Etiqueta / Badge (ej. Especializado)"
                          value={serv.badge || ''}
                          onChange={(e) => {
                            const newServs = [...formData.servicesList];
                            newServs[idx] = { ...newServs[idx], badge: e.target.value };
                            setFormData({ ...formData, servicesList: newServs });
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={serv.description}
                        onChange={(e) => {
                          const newServs = [...formData.servicesList];
                          newServs[idx] = { ...newServs[idx], description: e.target.value };
                          setFormData({ ...formData, servicesList: newServs });
                        }}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GALERÍA DE FLOTA */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900">Imágenes del Negocio y Flota</h3>
                    <p className="text-xs text-gray-600">Estas imágenes se muestran en el slider horizontal continuo.</p>
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={galleryFileInputRef}
                      onChange={handleGalleryImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-2 bg-[#1D7946] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Subir Nueva Imagen</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.galleryImages.map((img, idx) => (
                    <div key={img.id || idx} className="p-3 bg-white rounded-xl border border-gray-200 flex items-center gap-3">
                      <img src={img.url} alt={img.title} className="w-20 h-16 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={img.title}
                          onChange={(e) => {
                            const newImgs = [...formData.galleryImages];
                            newImgs[idx] = { ...newImgs[idx], title: e.target.value };
                            setFormData({ ...formData, galleryImages: newImgs });
                          }}
                          className="w-full text-xs font-bold px-2 py-1 border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = formData.galleryImages.filter((_, i) => i !== idx);
                            setFormData({ ...formData, galleryImages: newImgs });
                          }}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SUPABASE DATABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
                  <Database className="w-5 h-5 text-[#1D7946]" />
                  <span>Configuración del Proyecto Supabase (vazquezadmin)</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Su proyecto de Supabase está preconfigurado para sincronización en la nube en tiempo real. Cuando realice cambios desde este panel autoadministrable, se actualizarán en Supabase y se cargarán automáticamente en su página web alojada en Hostinger.
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      ID del Proyecto (Project ID)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="snjcjrjyoouzhixymbnq"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs font-mono bg-gray-100 text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Bucket de Storage (Imágenes)
                    </label>
                    <input
                      type="text"
                      placeholder="vazquez-media"
                      value={formData.supabaseBucketName}
                      onChange={(e) => setFormData({ ...formData, supabaseBucketName: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://snjcjrjyoouzhixymbnq.supabase.co"
                    value={formData.supabaseUrl}
                    onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Supabase Anon Key (API Key)
                  </label>
                  <input
                    type="text"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={formData.supabaseAnonKey}
                    onChange={(e) => setFormData({ ...formData, supabaseAnonKey: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="useSupabaseStorage"
                    checked={formData.useSupabaseStorage}
                    onChange={(e) => setFormData({ ...formData, useSupabaseStorage: e.target.checked })}
                    className="w-4 h-4 text-[#0E5197] rounded cursor-pointer"
                  />
                  <label htmlFor="useSupabaseStorage" className="text-xs font-bold text-gray-800 cursor-pointer">
                    Activar subida directa de imágenes y logos a Supabase Storage
                  </label>
                </div>
              </div>

              {/* Guía para Hostinger y Código SQL de Inicialización */}
              <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex items-center gap-2 text-[#0E5197] font-extrabold text-sm uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-[#0E5197]" />
                  <span>Script SQL de Inicialización en Supabase (Copiar en SQL Editor)</span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed font-normal">
                  Si aún no ha creado la tabla de configuración en su panel de Supabase, vaya al <strong>SQL Editor</strong> de su proyecto en Supabase (ID: <code>snjcjrjyoouzhixymbnq</code>) y ejecute este comando:
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 text-emerald-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`-- 1. Crear tabla para guardar la configuración completa del sitio
create table if not exists public.site_config (
  id text primary key,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Habilitar permisos de lectura y actualización pública
alter table public.site_config enable row level security;
create policy "Acceso Publico site_config" on public.site_config for all using (true) with check (true);

-- 3. Crear Bucket 'vazquez-media' en Supabase Storage
insert into storage.buckets (id, name, public) values ('vazquez-media', 'vazquez-media', true) on conflict do nothing;
create policy "Acceso Publico Storage Media" on storage.objects for all using (bucket_id = 'vazquez-media') with check (bucket_id = 'vazquez-media');`}
                  </pre>
                </div>

                <div className="pt-2 border-t border-blue-200/80">
                  <h4 className="text-xs font-bold text-[#0E5197] uppercase mb-1">
                    🚀 Pasos para publicar su sitio web en Hostinger:
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-gray-700 space-y-1 pl-1">
                    <li>Generar la compilación ejecutando el comando de exportación o build de la aplicación.</li>
                    <li>Subir el contenido generado en la carpeta <code>dist/</code> al directorio <code>public_html</code> del File Manager en Hostinger.</li>
                    <li>¡Listo! El sitio cargará los datos guardados en Supabase automáticamente. Para editar el contenido en Hostinger, puede ingresar agregando <code>/#admin</code> a su dominio.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel Footer Action */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Volver a la Página Principal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-[#1D7946] hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todos los Cambios</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};
