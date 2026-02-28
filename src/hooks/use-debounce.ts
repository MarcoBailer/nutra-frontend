/**
 * @fileoverview Hook de debounce para valores.
 * 
 * Útil para atrasar execução de buscas e outras operações custosas.
 */

import { useState, useEffect } from 'react';

/**
 * Hook que retorna um valor com debounce.
 * 
 * @param value - Valor a ser debounced
 * @param delay - Tempo de delay em ms (padrão: 500)
 * @returns Valor debounced
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 * 
 * useEffect(() => {
 *   // Executar busca apenas quando debouncedSearch mudar
 *   performSearch(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
