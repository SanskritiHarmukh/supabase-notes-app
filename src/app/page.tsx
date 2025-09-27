"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NotesApp() {
    type Note = {
    id: string;
    title: string;
    content: string;
    created_at: string;
  };
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("Fetch error:", error);
    else setNotes(data || []);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!title.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("notes").insert([{ title, content }]);
    if (error) console.error("Insert error:", error);
    else {
      setTitle("");
      setContent("");
      fetchNotes();
    }

    setLoading(false);
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    else fetchNotes();
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("notes")
      .update({ title: editTitle, content: editContent })
      .eq("id", editingId);

    if (error) console.error("Update error:", error);
    else {
      cancelEdit();
      fetchNotes();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Notes App</h1>

        {/* Add Note */}
        <div className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addNote}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Adding..." : "Add Note"}
          </button>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 && <p className="text-gray-500 text-center">No notes yet.</p>}

          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start"
            >
              {/* Note content or edit inputs */}
              {editingId === note.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="space-x-2 mt-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{note.title}</h2>
                  <p className="text-gray-700 mt-1">{note.content}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              {editingId !== note.id && (
                <div className="mt-2 md:mt-0 md:ml-4 flex space-x-2">
                  <button
                    onClick={() => startEdit(note)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
