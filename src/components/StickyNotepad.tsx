
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { StickyNote, XCircle, Save, Minimize, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

interface Note {
  id: string;
  content: string;
  color: string;
}

const StickyNotepad: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNoteContent, setNewNoteContent] = useState('');
  const [minimized, setMinimized] = useState(true); // Start minimized by default
  const [noteColor, setNoteColor] = useState('#FFEAA7'); // Default yellow

  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: newNoteContent,
        color: noteColor
      };
      setNotes([...notes, newNote]);
      setNewNoteContent('');
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const colors = [
    '#FFEAA7', // Yellow
    '#81ECEC', // Cyan
    '#74B9FF', // Blue
    '#A29BFE', // Purple
    '#FD79A8', // Pink
    '#55EFC4', // Green
  ];

  if (minimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-12 w-12 shadow-md" 
          onClick={() => setMinimized(false)}
        >
          <StickyNote className="h-6 w-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 w-80 z-50"
    >
      <Card className="shadow-lg border-t-4" style={{ borderTopColor: noteColor }}>
        <div className="flex justify-between items-center p-3 border-b">
          <div className="flex items-center">
            <StickyNote className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Sticky Notes</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setMinimized(true)}>
            <Minimize className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-3 space-y-3">
          <div className="flex space-x-2">
            {colors.map(color => (
              <button
                key={color}
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
                onClick={() => setNoteColor(color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>

          <Textarea
            placeholder="Type your note here..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />

          <Button onClick={handleAddNote} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Note
          </Button>
        </div>

        {notes.length > 0 && (
          <div className="p-3 pt-0 max-h-[250px] overflow-y-auto">
            <h4 className="text-sm font-medium mb-2">Saved Notes</h4>
            <div className="space-y-2">
              {notes.map(note => (
                <div 
                  key={note.id} 
                  className="p-2 rounded relative group"
                  style={{ backgroundColor: note.color }}
                >
                  <p className="text-sm break-words pr-6">{note.content}</p>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete note"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default StickyNotepad;
