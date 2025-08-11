import { supabase } from './supabase'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

export interface User {
  id: string
  email: string
  emailConfirmed: boolean
  profile?: {
    displayName?: string
    avatarUrl?: string
    phone?: string
    isAdmin: boolean
  }
}

class AuthService {
  private user: User | null = null
  private session: Session | null = null

  async register(email: string, password: string, displayName?: string) {
    // Use Supabase directly for registration
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: displayName || null
        }
      }
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error('User creation failed')
    }

    // Create profile in our database
    if (authData.user.id) {
      try {
        const { error: profileError } = await supabase
          .from('Profile')
          .insert([{
            userId: authData.user.id,
            displayName: displayName || null,
            isAdmin: false,
            updatedAt: new Date().toISOString()
          }])
        
        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      } catch (error) {
        console.error('Profile creation failed:', error)
      }
    }

    return {
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        emailConfirmed: authData.user.email_confirmed_at !== null
      }
    }
  }

  async login(email: string, password: string) {
    // Use Supabase directly for login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (!authData.user || !authData.session) {
      throw new Error('Login failed')
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('Profile')
      .select('displayName, avatarUrl, phone, isAdmin')
      .eq('userId', authData.user.id)
      .single()

    const userData: User = {
      id: authData.user.id,
      email: authData.user.email!,
      emailConfirmed: authData.user.email_confirmed_at !== null,
      profile: profile || undefined
    }

    // Store in memory and localStorage
    this.user = userData
    this.session = authData.session
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(userData))
      localStorage.setItem('auth_session', JSON.stringify(authData.session))
    }

    return {
      success: true,
      user: userData,
      session: authData.session
    }
  }

  async logout() {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }

    this.user = null
    this.session = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_session')
    }
  }

  getUser(): User | null {
    if (this.user) return this.user

    // Only try localStorage on client side
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
          this.user = JSON.parse(storedUser)
          return this.user
        }
      } catch (error) {
        console.error('Error reading user from localStorage:', error)
        // Clear corrupted data
        localStorage.removeItem('auth_user')
      }
    }

    return null
  }

  getSession(): Session | null {
    if (this.session) return this.session

    // Only try localStorage on client side
    if (typeof window !== 'undefined') {
      try {
        const storedSession = localStorage.getItem('auth_session')
        if (storedSession) {
          this.session = JSON.parse(storedSession)
          return this.session
        }
      } catch (error) {
        console.error('Error reading session from localStorage:', error)
        // Clear corrupted data
        localStorage.removeItem('auth_session')
      }
    }

    return null
  }

  isAuthenticated(): boolean {
    const session = this.getSession()
    if (!session) return false

    // Check if session is expired
    if (session.expires_at && Date.now() / 1000 > session.expires_at) {
      this.logout()
      return false
    }

    return true
  }

  getAuthHeaders(): HeadersInit {
    const session = this.getSession()
    if (!session) return { 'Content-Type': 'application/json' }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  }
}

export const authService = new AuthService()