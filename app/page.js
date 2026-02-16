'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [bookmarks, setBookmarks] = useState([])

  // Get logged in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  // Fetch bookmarks when user loads
  useEffect(() => {
    if (user) fetchBookmarks()
  }, [user])

  // Realtime updates
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        () => fetchBookmarks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const login = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  const fetchBookmarks = async () => {
    if (!user) return

    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setBookmarks(data || [])
  }

  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from('bookmarks').insert([
      { title, url, user_id: user.id }
    ])

    setTitle('')
    setUrl('')
  }

  const deleteBookmark = async (id) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  // Login screen
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <button
          onClick={login}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Login with Google
        </button>
      </div>
    )
  }

  // Main app
  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-xl mb-4">Welcome {user.email}</h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Logout
      </button>

      {/* Add Bookmark */}
      <div className="mb-6">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={addBookmark}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Add Bookmark
        </button>
      </div>

      {/* Bookmark List */}
      <div>
        {bookmarks.length === 0 && (
          <p className="text-gray-500">No bookmarks yet</p>
        )}

        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="border p-3 mb-2 flex justify-between items-center rounded"
          >
            <a
              href={b.url}
              target="_blank"
              className="text-blue-600 underline"
            >
              {b.title}
            </a>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
