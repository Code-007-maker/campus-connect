import { useState, useEffect } from 'react'

export function useFetch(asyncFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    asyncFn()
      .then(res => mounted && setData(res))
      .catch(err => mounted && setError(err))
      .finally(() => mounted && setLoading(false))
    return () => mounted = false
  }, deps)

  return { data, loading, error }
}
