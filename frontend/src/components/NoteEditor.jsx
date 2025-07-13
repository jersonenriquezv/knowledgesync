import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const NoteEditor = ({ user, onLogout }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [conversations, setConversations] = useState([])
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    fetchNote()
    fetchConversations()
  }, [id])

  const fetchNote = async () => {
    try {
      const response = await fetch(`http://localhost:8000/notes/${id}`)
      if (response.ok) {
        const noteData = await response.json()
        // Verify that the note belongs to the user
        if (noteData.user_id !== user.id) {
          alert('You don\'t have permission to edit this note')
          navigate('/dashboard')
          return
        }
        setNote(noteData)
      } else {
        alert('Note not found')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching note:', error)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const fetchConversations = async () => {
    try {
      const response = await fetch(`http://localhost:8000/ai/conversations/${id}?user_id=${user.id}`)
      if (response.ok) {
        const conversationsData = await response.json()
        setConversations(conversationsData)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`http://localhost:8000/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content
        })
      })

      if (response.ok) {
        alert('Note saved successfully')
      } else {
        alert('Error saving note')
      }
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Error saving note')
    } finally {
      setSaving(false)
    }
  }

  const handleAskAI = async (e) => {
    e.preventDefault()
    if (!aiQuestion.trim()) return

    try {
      const response = await fetch('http://localhost:8000/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: aiQuestion,
          note_id: parseInt(id),
          user_id: user.id
        })
      })

      if (response.ok) {
        const aiResponse = await response.json()
        setAiQuestion('')
        // Recargar conversaciones
        fetchConversations()
      } else {
        alert('Error consulting AI')
      }
    } catch (error) {
      console.error('Error asking AI:', error)
      alert('Error consulting AI')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!note) {
    return <div className="flex justify-center items-center h-screen">Note not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-indigo-600 hover:text-indigo-500"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Note</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowChat(!showChat)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {showChat ? 'Hide Chat' : 'Ask AI'}
              </button>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Note Editor */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => setNote({...note, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={note.content || ''}
                  onChange={(e) => setNote({...note, content: e.target.value})}
                  rows="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Write your note content here..."
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                {saving ? 'Saving...' : 'Save Note'}
              </button>
            </div>

            {/* AI Chat */}
            {showChat && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Ask AI</h3>
                
                {/* Ask AI Form */}
                <form onSubmit={handleAskAI} className="mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question about this note
                    </label>
                    <textarea
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                              placeholder="Ask a question about the content of this note..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Ask AI
                  </button>
                </form>

                {/* Conversations */}
                <div className="space-y-4">
                  <h4 className="font-medium">Conversation History</h4>
                  {conversations.length === 0 ? (
                    <p className="text-gray-500 text-sm">No conversations yet</p>
                  ) : (
                    conversations.map((conv) => (
                      <div key={conv.id} className="border rounded-lg p-4">
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-900">Question:</p>
                          <p className="text-sm text-gray-700">{conv.question}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Answer:</p>
                          <p className="text-sm text-gray-700">{conv.answer}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(conv.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default NoteEditor 