import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => void;
  setData: (data: T) => void;
}

// GET isteği için hook
export function useApi<T>(
  url: string,
  params?: any,
  immediate: boolean = true
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiService.get<T>(url, params);
      setState({ data, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [url, params]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return { ...state, refetch, setData };
}

// POST isteği için hook
export function useApiPost<T, D = any>(): {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (url: string, data?: D) => Promise<T | null>;
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (url: string, data?: D): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiService.post<T>(url, data);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setState({ data: null, loading: false, error: errorMessage });
      return null;
    }
  }, []);

  return { ...state, execute };
}

// PUT isteği için hook
export function useApiPut<T, D = any>(): {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (url: string, data?: D) => Promise<T | null>;
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (url: string, data?: D): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiService.put<T>(url, data);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setState({ data: null, loading: false, error: errorMessage });
      return null;
    }
  }, []);

  return { ...state, execute };
}

// DELETE isteği için hook
export function useApiDelete<T>(): {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (url: string) => Promise<T | null>;
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (url: string): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiService.delete<T>(url);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      setState({ data: null, loading: false, error: errorMessage });
      return null;
    }
  }, []);

  return { ...state, execute };
}
