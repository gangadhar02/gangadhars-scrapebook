
import { useState, useEffect } from "react";
import { NotesWall } from "@/components/NotesWall";
import { NoteCreator } from "@/components/NoteCreator";
import { SocialIcons } from "@/components/SocialIcons";
import { StickyNote as StickyNoteType } from "@/types/StickyNote";
import { STICKY_NOTE_COLORS } from "@/types/StickyNote";
import { findAvailablePosition, calculateRequiredHeight, positionToPercentage } from "@/utils/positionManager";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [notes, setNotes] = useState<StickyNoteType[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);

  // Update container height only when notes actually need more space
  useEffect(() => {
    if (notes.length > 0) {
      // Convert percentage positions back to pixels for calculation
      const pixelPositions = notes.map(note => ({
        x: (note.position.x / 100) * window.innerWidth,
        y: (note.position.y / 100) * containerHeight
      }));
      
      const requiredHeight = calculateRequiredHeight(pixelPositions);
      // Only update if we actually need more height
      if (requiredHeight > containerHeight) {
        setContainerHeight(requiredHeight);
      }
    }
  }, [notes]);

  const handleNoteComplete = (noteData: {
    message: string;
    authorName?: string;
  }) => {
    const containerWidth = window.innerWidth;
    
    // Get existing positions in pixels
    const existingPixelPositions = notes.map(note => ({
      x: (note.position.x / 100) * containerWidth,
      y: (note.position.y / 100) * containerHeight
    }));

    // Find available position in pixels (prioritizes current screen space)
    const pixelPosition = findAvailablePosition(
      existingPixelPositions,
      containerWidth,
      containerHeight
    );

    // Convert to percentage for storage
    const percentagePosition = positionToPercentage(
      pixelPosition,
      containerWidth,
      containerHeight
    );

    const newNote: StickyNoteType = {
      id: Date.now().toString(),
      message: noteData.message,
      color: STICKY_NOTE_COLORS[colorIndex],
      authorName: noteData.authorName,
      position: percentagePosition,
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
    <div 
      className="min-h-screen relative overflow-hidden paper-texture"
      style={{ minHeight: `${containerHeight}px` }}
    >
      {/* Header - Fixed height hero section */}
      <header className="relative z-10 text-center py-8 px-4 h-96 flex flex-col justify-center">
        <h1 className="text-4xl md:text-6xl font-handwritten font-extrabold text-sky-600 mb-4 drop-shadow-lg">
          Gangadhar's Scrapebook
        </h1>
        <p className="text-lg md:text-xl text-sky-500 max-w-2xl mx-auto mb-6">
          Share your thoughts, memories, and messages on this virtual wall of memories.
        </p>
        
        {/* Leave a Note Button */}
        {!isCreating && (
          <Button
            onClick={handleStartCreating}
            className="bg-scrapbook-yellow hover:bg-yellow-300 text-amber-800 font-handwritten font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse-glow border-2 border-amber-200 mx-auto"
          >
            📝 Leave a Note
          </Button>
        )}
      </header>

      {/* Notes Wall Background - positioned below hero */}
      <div className="absolute inset-0 w-full h-full" style={{ top: '384px' }}>
        <NotesWall notes={notes} />
      </div>

      {/* Note Creator */}
      {isCreating && (
        <NoteCreator onComplete={handleNoteComplete} onCancel={handleCancelCreating} />
      )}

      {/* Instructions for empty state - positioned below hero */}
      {notes.length === 0 && !isCreating && (
        <div className="absolute left-0 right-0 flex items-center justify-center z-5 pointer-events-none" style={{ top: '450px' }}>
          <div className="text-center text-sky-400/60 max-w-md mx-auto px-4">
            <div className="text-6xl mb-4 animate-float">📋</div>
            <p className="text-xl font-handwritten">
              Click the button above to leave your first note!
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
