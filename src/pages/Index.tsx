
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
  
  const generateNonOverlappingPosition = (existingNotes: StickyNoteType[]) => {
    const noteWidth = 12; // Approximate width in percentage (192px / 1600px)
    const noteHeight = 12; // Approximate height in percentage (192px / 900px)
    const minDistance = 8; // Minimum distance between note centers
    const maxAttempts = 50;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const position = {
        x: Math.random() * (85 - noteWidth) + 5, // Keep within 5% to 85% range
        y: Math.random() * (70 - noteHeight) + 15 // Keep within 15% to 85% range
      };
      
      // Check if this position conflicts with existing notes
      const hasConflict = existingNotes.some(note => {
        const distance = Math.sqrt(
          Math.pow(position.x - note.position.x, 2) + 
          Math.pow(position.y - note.position.y, 2)
        );
        return distance < minDistance;
      });
      
      if (!hasConflict) {
        return position;
      }
    }
    
    // Fallback: if we can't find a non-overlapping position, use a grid-based approach
    const gridCols = 6;
    const gridRows = 4;
    const usedPositions = new Set(
      existingNotes.map(note => 
        `${Math.floor(note.position.x / (100 / gridCols))}-${Math.floor(note.position.y / (100 / gridRows))}`
      )
    );
    
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const gridKey = `${col}-${row}`;
        if (!usedPositions.has(gridKey)) {
          return {
            x: (col * (100 / gridCols)) + Math.random() * 5 + 5,
            y: (row * (100 / gridRows)) + Math.random() * 5 + 20
          };
        }
      }
    }
    
    // Final fallback
    return {
      x: Math.random() * 70 + 10,
      y: Math.random() * 60 + 20
    };
  };
  
  const handleNoteComplete = (noteData: {
    message: string;
    authorName?: string;
  }) => {
    const position = generateNonOverlappingPosition(notes);
    
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
  
  return (
    <div className="min-h-screen relative overflow-hidden paper-texture">
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

      {/* Social Media Icons */}
      <SocialIcons />
    </div>
  );
};

export default Index;
