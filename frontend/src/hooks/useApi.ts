import { useState, useEffect } from 'react'
import api from '../services/api'
import { AxiosError } from 'axios'

interface UseApiOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: unknown
  skip?: boolean
}

interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useApi<T>({
  url,
  method = 'GET',
  data,
  skip = false,
}: UseApiOptions<T>): UseApiResult<T> {
  const [result, setResult] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(!skip)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (skip) return

    try {
      setLoading(true)
      setError(null)

      const response = await api.request<T>({
        url,
        method,
        data,
      })

      setResult(response.data)
    } catch (err) {
      const axiosError = err as AxiosError
      setError(axiosError.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, method, skip])

  return {
    data: result,
    loading,
    error,
    refetch: fetchData,
  }
}

