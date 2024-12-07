import { Session, User } from '@supabase/supabase-js'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { supabase } from '../lib/supabase'

type AuthData = {
  session: Session | null
  mounting: boolean
}

const AuthContext = createContext<AuthData>({
  session: null,
  mounting: true,
})

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [mounting, setMounting] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        if (error.message.includes('invalid refresh token')) {
          alert('Session expired, please log in again.')
        }
      }

      setSession(session)
      setMounting(false)
    }

    fetchSession()
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ session, mounting }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
