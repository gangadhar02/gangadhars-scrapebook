
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

  // Calculate positions for notes in a responsive grid
  const getGridPosition = (index: number) => {
    const isMobile = window.innerWidth < 768;
    const notesPerRow = isMobile ? 1 : 5; // 1 note per row on mobile, 5 on desktop
    const noteWidth = isMobile ? 80 : 16; // 80% width on mobile, 16% on desktop
    const noteHeight = 25; // Height of each note area in vh
    const startY = 40; // Start below hero section
    
    const row = Math.floor(index / notesPerRow);
    const col = index % notesPerRow;
    
    // Calculate x position
    let x;
    if (isMobile) {
      x = 10; // Center the single note on mobile with 10% left margin
    } else {
      const spacing = (100 - (notesPerRow * noteWidth)) / (notesPerRow + 1);
      x = spacing + col * (noteWidth + spacing);
    }
    
    // Calculate y position
    const y = startY + row * noteHeight;
    
    return { x, y };
  };

  // Calculate the minimum height needed for the page
  const calculateMinHeight = () => {
    if (notes.length === 0) return '100vh';
    
    const isMobile = window.innerWidth < 768;
    const notesPerRow = isMobile ? 1 : 5;
    const noteHeight = 25;
    const startY = 40;
    
    const totalRows = Math.ceil(notes.length / notesPerRow);
    const minHeight = startY + totalRows * noteHeight + 20; // Add 20vh padding at bottom
    
    return `${Math.max(100, minHeight)}vh`;
  };

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={{ minHeight: calculateMinHeight() }}
    >
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-amber-50 to-orange-50"></div>
      
      {/* Notes container */}
      <div className="relative w-full h-full">
        {notes.map((note, index) => {
          const position = getGridPosition(index);
          console.log(`Note ${index} positioned at:`, position);
          
          return (
            <StickyNote
              key={note.id}
              note={{
                ...note,
                position: position,
                rotation: Math.random() * 10 - 5 // Small random rotation for authenticity
              }}
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
