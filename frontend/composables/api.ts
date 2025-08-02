// Use the API client from the Nuxt plugin
export const useApiClient = () => {
  const { $apiClient } = useNuxtApp()
  return $apiClient
}

// Default export for backward compatibility
export default useApiClient
