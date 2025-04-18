import { useEffect, useRef } from "react"

export const useOnceEffect = (callback) => {
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    callback()
  }, [])
}
