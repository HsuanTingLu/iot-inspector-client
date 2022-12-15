import React, { useEffect } from 'react'
import { useState } from 'react'

// const API_ENDPOINT = 'https://ocupop.github.io/iot-docs'
const API_ENDPOINT = 'https://adroit-parsnip.cloudvent.net/'

const useCopy = (path) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})

  useEffect(() => {
    const asyncInit = async () => {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINT}${path}`)
      const jsonBody = await response.json()
      setData(jsonBody)
      setLoading(false)
    }
    asyncInit()
  }, [])

  return { data, loading }
}

export default useCopy
