import { useState } from "react";
import { NotesWall } from "@/components/NotesWall";
import { NoteCreator } from "@/components/NoteCreator";
import { SocialIcons } from "@/components/SocialIcons";
import { StickyNote as StickyNoteType } from "@/types/StickyNote";
import { STICKY_NOTE_COLORS } from "@/types/StickyNote";

const Index = () => {
  const [notes, setNotes] = useState<StickyNoteType[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  
  const generateGridPosition = (noteIndex: number) => {
    const notesPerRow = 5; // 5 notes per row
    const noteSpacing = 18; // Spacing between notes in percentage
    const startX = 8; // Starting X position
    const startY = 35; // Starting Y position (below button)
    const rowHeight = 25; // Height between rows
    
    // Calculate row and column for this note
    const row = Math.floor(noteIndex / notesPerRow);
    const col = noteIndex % notesPerRow;
    
    return {
      x: startX + (col * noteSpacing),
      y: startY + (row * rowHeight)
    };
  };
  
  const handleNoteComplete = (noteData: {
    message: string;
    authorName?: string;
  }) => {
    const position = generateGridPosition(notes.length);
    
    const newNote: StickyNoteType = {
      id: Date.now().toString(),
      message: noteData.message,
      color: STICKY_NOTE_COLORS[colorIndex],
      authorName: noteData.authorName,
      position,
      rotation: Math.random() * 20 - 10, // Random rotation between -10 and 10 degrees
      createdAt: new Date()
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
    setColorIndex(prevIndex => (prevIndex + 1) % STICKY_NOTE_COLORS.length);
    setIsCreating(false);
  };
  
  const handleStartCreating = () => {
    setIsCreating(true);
  };
  
  const handleCancelCreating = () => {
    setIsCreating(false);
  };

  // Calculate dynamic height based on number of notes
  const calculateMinHeight = () => {
    if (notes.length === 0) return "100vh";
    const rows = Math.ceil(notes.length / 5);
    const minHeight = 500 + (rows * 250); // Base height + rows * approximate note height
    return `${Math.max(minHeight, window.innerHeight)}px`;
  };
  
  return (
    <div 
      className="relative overflow-auto paper-texture"
      style={{ minHeight: calculateMinHeight() }}
    >
      {/* Header */}
      <header className="relative z-10 text-center py-8 px-4">
        <h1 className="text-4xl md:text-6xl font-marker text-sky-600 mb-4 drop-shadow-lg">
          Gangadhar's Scrapebook
        </h1>
        <p className="text-lg md:text-xl text-sky-500 max-w-2xl mx-auto mb-6">
          Share your thoughts, memories, and messages on this virtual wall of memories.
        </p>
        
        {/* Hero Section Leave a Note Button */}
        {!isCreating && (
          <button
            onClick={handleStartCreating}
            className="bg-scrapbook-yellow hover:bg-yellow-300 text-amber-800 font-handwritten font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-amber-200"
          >
            📝 Leave a Note
          </button>
        )}
      </header>

      {/* Notes Wall Background */}
      <NotesWall notes={notes} />

      {/* Note Creator */}
      {isCreating && (
        <NoteCreator onComplete={handleNoteComplete} onCancel={handleCancelCreating} />
      )}

      {/* Instructions for empty state */}
      {notes.length === 0 && !isCreating && (
        <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
          <div className="text-center text-sky-400/60 max-w-md mx-auto px-4">
            <div className="text-6xl mb-4 animate-float">📋</div>
            <p className="text-xl font-handwritten">
              This wall is waiting for your first note!
            </p>
          </div>
        </div>
      )}

      {/* Social Media Icons - positioned at bottom */}
      <div className="relative z-10 mt-8">
        <SocialIcons />
      </div>
    </div>
  );
};

export default Index;
