
import { StickyNote } from "./StickyNote";
import { StickyNote as StickyNoteType } from "@/types/StickyNote";
import { toast } from "sonner";

interface NotesWallProps {
  notes: StickyNoteType[];
}

export const NotesWall = ({ notes }: NotesWallProps) => {
  console.log('NotesWall rendering with notes:', notes.length);
  
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
    <div className="absolute inset-0 w-full h-full overflow-visible">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-amber-50 to-orange-50"></div>
      
      {/* Notes container */}
      <div className="relative w-full h-full">
        {notes.map((note) => {
          console.log('Rendering note:', note.id, 'at position:', note.position);
          return (
            <StickyNote
              key={note.id}
              note={note}
              onClick={() => handleNoteClick(note)}
            />
          );
        })}
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
