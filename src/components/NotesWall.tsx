
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
      
      {/* Desktop Notes container - 2 column grid */}
      <div className="relative w-full h-full px-8 py-4">
        <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
          {notes.map((note, index) => (
            <div
              key={note.id}
              className="flex justify-center items-start py-4"
              style={{
                transform: `rotate(${(index % 4 === 0 || index % 4 === 3) ? 
                  Math.random() * 4 - 2 : 
                  Math.random() * 4 - 2}deg)`
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
