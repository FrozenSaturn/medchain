'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/auth/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
   console.log('Attempting signup with:', { email: data.email })

   const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Supabase signup error:', error.message)
    console.error('Error code:', error.status)
    // Redirect with error details for debugging
    redirect(`/auth/error?message=${encodeURIComponent(error.message)}`)
  }
   console.log('Signup successful:', authData)

  // revalidatePath('/', 'layout')
  if (authData.user && !authData.session) {
    console.log('Email confirmation required')
    // You might want to redirect to a "check your email" page instead
    redirect('/auth/login?message=Please check your email to confirm your account')
  }

  redirect('/auth/login')
}