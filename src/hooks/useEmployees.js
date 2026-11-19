import { useQuery } from '@tanstack/react-query';
import { fetchEmployees } from '../api/employees.js';

/** @param {Record<string, string | number | undefined>} filters */
export function useEmployees(filters) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => fetchEmployees(filters),
    placeholderData: (previous) => previous,
  });
}
