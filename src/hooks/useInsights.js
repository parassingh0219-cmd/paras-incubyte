import { useQuery } from '@tanstack/react-query';
import {
  fetchCountryMetrics,
  fetchJobTitleAverages,
  fetchSalaryHistogram,
} from '../api/insights.js';

export function useCountryMetrics() {
  return useQuery({
    queryKey: ['insights', 'countries'],
    queryFn: fetchCountryMetrics,
    staleTime: 60_000,
  });
}

/** @param {string} country */
export function useJobTitleAverages(country) {
  return useQuery({
    queryKey: ['insights', 'country', country, 'job-titles'],
    queryFn: () => fetchJobTitleAverages(country),
    enabled: !!country,
    staleTime: 60_000,
  });
}

/**
 * @param {string} country
 * @param {number} [bucketCount]
 */
export function useSalaryHistogram(country, bucketCount) {
  return useQuery({
    queryKey: ['insights', 'country', country, 'histogram', bucketCount],
    queryFn: () => fetchSalaryHistogram(country, bucketCount),
    enabled: !!country,
    staleTime: 60_000,
  });
}
