import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({ user, onLogout }) => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/notes/`)
      if (response.ok) {
        const allNotes = await response.json()
        // Filtrar notas del usuario actual
        const userNotes = allNotes.filter(note => note.user_id === user.id)
        setNotes(userNotes)
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newNote,
          user_id: user.id
        })
      })

      if (response.ok) {
        const createdNote = await response.json()
        setNotes([...notes, createdNote])
        setNewNote({ title: '', content: '' })
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`${API_URL}/notes/${noteId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setNotes(notes.filter(note => note.id !== noteId))
        }
      } catch (error) {
        console.error('Error deleting note:', error)
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">KnowledgeSync</h1>
              <p className="text-gray-600">Welcome, {user.name}</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Create note button */}
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                          >
                {showCreateForm ? 'Cancel' : 'New Note'}
              </button>
          </div>

          {/* Create note form */}
          {showCreateForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-medium mb-4">Create New Note</h3>
              <form onSubmit={handleCreateNote}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Create Note
                </button>
              </form>
            </div>
          )}

          {/* Notes grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {note.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {note.content || 'No content'}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/note/${note.id}`)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">You don't have any notes yet. Create your first note!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard 