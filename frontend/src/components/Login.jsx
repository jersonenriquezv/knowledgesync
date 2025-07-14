import { useState } from 'react'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: ''
  })
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const url = isRegistering 
        ? `${API_URL}/user/` 
        : `${API_URL}/user/users`
      
      const response = await fetch(url, {
        method: isRegistering ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: isRegistering ? JSON.stringify(formData) : undefined
      })

      if (response.ok) {
        if (isRegistering) {
          const userData = await response.json()
          onLogin(userData)
        } else {
          // Para login, buscar usuario por username
          const users = await response.json()
          const user = users.find(u => u.username === formData.username)
          if (user) {
            onLogin(user)
          } else {
            alert('User not found')
          }
        }
      } else {
        alert('Authentication error')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Connection error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            KnowledgeSync - Your intelligent notes platform
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            {isRegistering && (
              <>
                <div>
                  <input
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <input
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isRegistering ? 'Register' : 'Sign In'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-500"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Already have an account? Sign in' : 'Don\'t have an account? Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login 