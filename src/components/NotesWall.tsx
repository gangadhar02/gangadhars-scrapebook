
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
    <div className="relative w-full">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-amber-50 to-orange-50"></div>
      
      {/* Notes container */}
      <div className="relative w-full">
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onClick={() => handleNoteClick(note)}
          />
        ))}
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
