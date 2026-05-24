import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { RegisterForm } from '../components/register-form'
import { registerFn } from '../server/auth.functions'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (data: {
    email: string
    username: string
    password: string
  }) => {
    setServerError('')
    const result = await registerFn({ data })
    if (result?.error) {
      setServerError(result.error)
    } else if (result?.success) {
      navigate({ to: '/dashboard' })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Create Your Account</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Pick a username — it becomes your public profile URL.
        </p>
        {serverError && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}
        <div className="mt-6 flex justify-center">
          <RegisterForm onSubmit={handleRegister} />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
