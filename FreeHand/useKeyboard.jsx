import { useEffect, useRef } from 'react'

export default function useKeyboard() {
  const keyMap = useRef({})

  useEffect(() => {
    const onDocumentKey = (e) => {
      // if keydown, true
      // if keyup, false
      keyMap.current[e.code] = e.type === 'keydown'
      // do something here according to keyMap.current
      console.log(e.code)
    }
    document.addEventListener('keydown', onDocumentKey)
    document.addEventListener('keyup', onDocumentKey)
    return () => {
      document.removeEventListener('keydown', onDocumentKey)
      document.removeEventListener('keyup', onDocumentKey)
    }
  }, [])

  return keyMap.current
}