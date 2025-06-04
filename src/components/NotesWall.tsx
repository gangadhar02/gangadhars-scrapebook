
import { StickyNote } from "./StickyNote";
import { StickyNote as StickyNoteType } from "@/types/StickyNote";
import { toast } from "sonner";

interface NotesWallProps {
  notes: StickyNoteType[];
}

export const NotesWall = ({ notes }: NotesWallProps) => {
  const handleNoteClick = (note: StickyNoteType) => {
    const message = note.authorName 
      ? `"${note.message}" - ${note.authorName}`
      : `"${note.message}"`;
    
    toast(message, {
      description: `Posted on ${note.createdAt.toLocaleDateString()}`,
      duration: 3000,
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-amber-50 to-orange-50"></div>
      
      {/* Notes container - responsive layout */}
      <div className="relative w-full h-full">
        {/* Desktop: Random positioning */}
        <div className="hidden md:block relative w-full h-full">
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onClick={() => handleNoteClick(note)}
            />
          ))}
        </div>

        {/* Mobile: Vertical stacking with proper positioning */}
        <div className="md:hidden absolute top-0 left-0 right-0 bottom-0 overflow-y-auto">
          {/* Spacer to push content below header */}
          <div className="h-64"></div>
          
          {/* Notes container */}
          <div className="px-4 py-8">
            <div className="space-y-6 max-w-xs mx-auto pb-32">
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
                    onClick={() => handleNoteClick(note)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle grid overlay for authenticity */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 69, 19, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 69, 19, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </div>
  );
};
