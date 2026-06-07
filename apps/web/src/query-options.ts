import { queryOptions } from '@tanstack/react-query'
import { apiClient } from './api-client'

export const helloOptions = queryOptions({
  queryKey: ['api', 'hello'] as const,
  queryFn: async () => {
    const res = await apiClient.get('/hello')
    return res.data as { message: string }
  },
  staleTime: 1000 * 60,
})
