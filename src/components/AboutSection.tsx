import React from 'react';
import { ValueAddedItem } from '../types';
import { ShieldCheck, Truck, Clock, CheckCircle2, Award } from 'lucide-react';

interface AboutSectionProps {
  title: string;
  subtitle: string;
  description: string;
  values: ValueAddedItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  subtitle,
  description,
  values,
}) => {
  const renderIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7 text-[#0E5197]" />;
      case 'Truck':
        return <Truck className="w-7 h-7 text-[#1D7946]" />;
      case 'Clock':
        return <Clock className="w-7 h-7 text-[#0E5197]" />;
      default:
        return <Award className="w-7 h-7 text-[#0E5197]" />;
    }
  };

  return (
    <section id="nosotros" className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-block bg-[#0E5197]/10 text-[#0E5197] font-extrabold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
            Nosotros
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-lg font-semibold text-[#1D7946]">
            {subtitle}
          </p>
        </div>

        {/* Business Description & Visual Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 leading-snug">
              Líderes en Logística, Fletes y Mudanzas Locales y Foráneas
            </h3>

            <p className="text-gray-700 text-base leading-relaxed">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-[#1D7946] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Trailer Caja Seca 53 Pies</h4>
                  <p className="text-xs text-gray-600">Capacidad para grandes volúmenes y mudanzas completas.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-[#1D7946] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Servicio los 365 Días</h4>
                  <p className="text-xs text-gray-600">Atención continua sin interrupción en todo el país.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=800&q=80"
                alt="Personal de Mudanzas Vazquez"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="bg-[#1D7946] text-white font-extrabold text-xs uppercase px-2.5 py-1 rounded-md">
                  Garantía de Satisfacción
                </span>
                <p className="font-extrabold text-lg pt-1">Personal Altamente Capacitado</p>
                <p className="text-xs text-gray-200">Protección, embalaje y manejo delicado de sus pertenencias.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Value Added Points (3 Valores Agregados Grid Matching Theme) */}
        <div className="pt-8 border-t border-gray-100">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-extrabold text-[#0E5197]">
              Valores Agregados de Nuestro Servicio
            </h3>
            <p className="text-xs text-gray-500 mt-1">Garantía, confianza y puntualidad en cada traslado</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white">
            {/* Left Welcome Text */}
            <div className="space-y-4 p-6 bg-gray-50/60 rounded-xl border border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0E5197] mb-2">Bienvenidos</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  En Vazque Multitransport, entendemos que cada objeto tiene un valor especial. Ofrecemos soluciones integrales de logística y transporte local con los más altos estándares de cuidado.
                </p>
              </div>
              <a href="#contacto" className="pt-4 flex items-center gap-2 text-[#1D7946] text-[10px] font-bold uppercase tracking-wider hover:underline">
                <div className="w-6 h-[1px] bg-[#1D7946]"></div> Conócenos más
              </a>
            </div>

            {/* Middle Values List */}
            <div className="space-y-4 p-6 bg-white rounded-xl border border-gray-200">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nuestros Valores</h3>
              <ul className="space-y-3.5">
                {values && values.map((val, index) => (
                  <li key={val.id || index} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      index % 2 === 0 ? 'bg-blue-50 text-[#0E5197]' : 'bg-green-50 text-[#1D7946]'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-900">{val.title}</p>
                      <p className="text-[10px] text-gray-400">{val.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Quick WhatsApp Quote Card */}
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center items-center text-center border border-gray-200 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#1D7946]/10 text-[#1D7946] flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-[#1D7946]" />
              </div>
              <h4 className="text-sm font-bold text-gray-800 mb-1">Cotiza tu mudanza</h4>
              <p className="text-[10px] text-gray-500 mb-4">Respondemos al instante vía WhatsApp para tu comodidad.</p>
              <a
                href="#contacto"
                className="w-full py-2.5 bg-[#1D7946] hover:bg-emerald-700 text-white rounded text-xs font-bold text-center transition-colors shadow-xs"
              >
                CONTACTAR AHORA
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
