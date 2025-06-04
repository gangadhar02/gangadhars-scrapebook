import { useState } from "react";
import { NotesWall } from "@/components/NotesWall";
import { NoteCreator } from "@/components/NoteCreator";
import { SocialIcons } from "@/components/SocialIcons";
import { StickyNote } from "@/components/StickyNote";
import { StickyNote as StickyNoteType } from "@/types/StickyNote";
import { STICKY_NOTE_COLORS } from "@/types/StickyNote";
import { toast } from "sonner";

const Index = () => {
  const [notes, setNotes] = useState<StickyNoteType[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  const handleNoteComplete = (noteData: {
    message: string;
    authorName?: string;
  }) => {
    const newNote: StickyNoteType = {
      id: Date.now().toString(),
      message: noteData.message,
      color: STICKY_NOTE_COLORS[colorIndex],
      authorName: noteData.authorName,
      position: {
        x: Math.random() * 70 + 10,
        y: Math.random() * 60 + 20
      },
      rotation: Math.random() * 20 - 10,
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
    <div className="min-h-screen paper-texture">
      {/* Desktop Layout */}
      <div className="hidden md:block relative overflow-hidden min-h-screen">
        {/* Header */}
        <header className="relative z-10 text-center py-8 px-4">
          <h1 className="text-4xl md:text-6xl font-marker text-sky-600 mb-4 drop-shadow-lg">
            Gangadhar's Scrapebook
          </h1>
          <p className="text-lg md:text-xl text-sky-500 max-w-2xl mx-auto">
            Share your thoughts, memories, and messages on this virtual wall of memories.
          </p>
        </header>

        {/* Notes Wall Background */}
        <NotesWall notes={notes} />

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
      </div>

      {/* Mobile Layout - Scrollable */}
      <div className="md:hidden min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="text-center py-8 px-4 bg-scrapbook-bg">
          <h1 className="text-4xl font-marker text-sky-600 mb-4 drop-shadow-lg">
            Gangadhar's Scrapebook
          </h1>
          <p className="text-lg text-sky-500 max-w-2xl mx-auto">
            Share your thoughts, memories, and messages on this virtual wall of memories.
          </p>
        </header>

        {/* Mobile Notes Container */}
        <div className="px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-50 relative">
          {/* Background texture overlay */}
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-amber-50 to-orange-50"></div>
          
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(139, 69, 19, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Notes */}
          <div className="relative space-y-6 max-w-xs mx-auto pb-32">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className="relative w-full flex justify-center"
                style={{
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (Math.random() * 3 + 1)}deg)`,
                }}
              >
                <StickyNote
                  note={{
                    ...note,
                    position: { x: 0, y: 0 },
                    rotation: 0
                  }}
                  onClick={() => {
                    const message = note.authorName 
                      ? `"${note.message}" - ${note.authorName}`
                      : `"${note.message}"`;
                    
                    toast(message, {
                      description: `Posted on ${note.createdAt.toLocaleDateString()}`,
                      duration: 3000,
                    });
                  }}
                />
              </div>
            ))}

            {/* Instructions for empty state */}
            {notes.length === 0 && !isCreating && (
              <div className="text-center text-sky-400/60 py-20">
                <div className="text-6xl mb-4 animate-float">📋</div>
                <p className="text-xl font-handwritten">
                  This wall is waiting for your first note!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

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
        <NoteCreator onComplete={handleNoteComplete} onCancel={handleCancelCreating} />
      )}

      {/* Social Media Icons */}
      <SocialIcons />
    </div>
  );
};

export default Index;
