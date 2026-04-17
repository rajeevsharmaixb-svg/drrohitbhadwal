import { useState, useEffect } from 'react';
import { createClient } from '../lib/supabase/client';
import type { Database } from '../lib/types';

export type ClinicSettings = Database['public']['Tables']['clinic_settings']['Row'];

export function useClinicSettings() {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    async function fetchSettings() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('clinic_settings')
          .select('clinic_name, tagline, phone, email, address, working_hours, social_links')
          .limit(1)
          .single();

        if (supabaseError) throw supabaseError;

        if (isMounted && data) {
          setSettings(data as ClinicSettings);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch clinic settings:", err);
          setError(err instanceof Error ? err : new Error('Unknown error fetching settings'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, isLoading, error };
}
