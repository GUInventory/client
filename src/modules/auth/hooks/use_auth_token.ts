import { useLocalStorage } from 'react-use'

export const useAuthToken = () => {
  const [authToken, setAuthToken] = useLocalStorage<string>('TOKEN')
  const removeAuthToken = () => localStorage.removeItem('TOKEN')

  return { authToken, setAuthToken, removeAuthToken }
}
