import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from './defaultData';

const LOCAL_STORAGE_KEY = 'vazquez_multitransport_config_v1';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(url?: string, key?: string): SupabaseClient | null {
  if (url && key) {
    try {
      return createClient(url, key);
    } catch (e) {
      console.error('Error initializing Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

// Load config from LocalStorage first, fallback to DEFAULT_SITE_CONFIG
export function loadSiteConfig(): SiteConfig {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SITE_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Error loading config from localStorage:', e);
  }
  return DEFAULT_SITE_CONFIG;
}

// Save config to LocalStorage and sync CSS colors
export function saveSiteConfig(config: SiteConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    applyThemeColors(config.primaryColor, config.secondaryColor);
  } catch (e) {
    console.error('Error saving config to localStorage:', e);
  }
}

// Apply CSS root variables dynamically for instant live color changes
export function applyThemeColors(primary: string, secondary: string): void {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primary || '#0E5197');
    root.style.setProperty('--secondary-color', secondary || '#1D7946');
  }
}

// Optional Supabase DB Sync helper
export async function syncToSupabase(config: SiteConfig): Promise<{ success: boolean; message: string }> {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    return { success: false, message: 'Falta configurar la URL y Anon Key de Supabase.' };
  }

  try {
    const client = createClient(config.supabaseUrl, config.supabaseAnonKey);
    const { error } = await client
      .from('site_config')
      .upsert({ id: 'main_config', content: config, updated_at: new Date().toISOString() });

    if (error) {
      // If table doesn't exist yet, return friendly message
      return { success: false, message: `Error en Supabase: ${error.message}. Verifica que la tabla 'site_config' exista.` };
    }

    return { success: true, message: '¡Configuración guardada correctamente en Supabase!' };
  } catch (err: any) {
    return { success: false, message: `Error de conexión con Supabase: ${err.message}` };
  }
}

// Optional Supabase Image Upload helper with base64 data-URL fallback
export async function uploadImageFile(
  file: File, 
  config: SiteConfig
): Promise<string> {
  // If Supabase is configured and storage is enabled
  if (config.useSupabaseStorage && config.supabaseUrl && config.supabaseAnonKey) {
    try {
      const client = createClient(config.supabaseUrl, config.supabaseAnonKey);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await client.storage
        .from(config.supabaseBucketName || 'vazquez-media')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = client.storage
          .from(config.supabaseBucketName || 'vazquez-media')
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch (e) {
      console.warn('Supabase upload failed, falling back to base64 DataURL', e);
    }
  }

  // Fallback: convert file to Base64 Data URL so it uploads immediately and displays locally
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
