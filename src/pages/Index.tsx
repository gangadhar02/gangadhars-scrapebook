
import { useState } from "react";
import { NotesWall } from "@/components/NotesWall";
import { NoteCreator } from "@/components/NoteCreator";
import { StickyNote as StickyNoteType } from "@/types/StickyNote";

const Index = () => {
  const [notes, setNotes] = useState<StickyNoteType[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleNoteComplete = (noteData: { message: string; color: string; authorName?: string }) => {
    const newNote: StickyNoteType = {
      id: Date.now().toString(),
      message: noteData.message,
      color: noteData.color,
      authorName: noteData.authorName,
      position: {
        x: Math.random() * 70 + 10, // Random position between 10% and 80%
        y: Math.random() * 60 + 20, // Random position between 20% and 80%
      },
      rotation: Math.random() * 20 - 10, // Random rotation between -10 and 10 degrees
      createdAt: new Date(),
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
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
        <h1 className="text-4xl md:text-6xl font-marker text-amber-800 mb-4 drop-shadow-lg">
          Gangadhar's Scrapbook
        </h1>
        <p className="text-lg md:text-xl text-amber-700 max-w-2xl mx-auto">
          Leave a note on our virtual wall! Click below to add your message to the scrapbook.
        </p>
      </header>

      {/* Notes Wall Background */}
      <NotesWall notes={notes} />

      {/* Floating Action Button */}
      {!isCreating && (
        <div className="fixed bottom-8 right-8 z-20">
          <button
            onClick={handleStartCreating}
            className="bg-scrapbook-yellow hover:bg-yellow-300 text-amber-800 font-handwritten font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse-glow border-2 border-amber-200"
          >
            📝 Leave a Note
          </button>
        </div>
      )}

      {/* Note Creator */}
      {isCreating && (
        <NoteCreator
          onComplete={handleNoteComplete}
          onCancel={handleCancelCreating}
        />
      )}

      {/* Instructions for empty state */}
      {notes.length === 0 && !isCreating && (
        <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
          <div className="text-center text-amber-600/60 max-w-md mx-auto px-4">
            <div className="text-6xl mb-4 animate-float">📋</div>
            <p className="text-xl font-handwritten">
              This wall is waiting for your first note!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
