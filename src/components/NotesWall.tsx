
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

  // Grid-based positioning to prevent overlapping
  const getGridPosition = (index: number) => {
    const columns = 4; // Number of columns in the grid
    const rows = Math.ceil(notes.length / columns);
    
    const col = index % columns;
    const row = Math.floor(index / columns);
    
    // Calculate position with some spacing and random offset within the cell
    const cellWidth = 100 / columns;
    const cellHeight = 100 / Math.max(rows, 3); // Minimum 3 rows for better spacing
    
    const baseX = col * cellWidth + cellWidth * 0.1; // 10% padding from cell edge
    const baseY = row * cellHeight + cellHeight * 0.1;
    
    // Add small random offset within the cell for natural look
    const randomOffsetX = Math.random() * (cellWidth * 0.3);
    const randomOffsetY = Math.random() * (cellHeight * 0.3);
    
    return {
      x: Math.min(baseX + randomOffsetX, 100 - 20), // Ensure note doesn't go off screen
      y: Math.min(baseY + randomOffsetY, 100 - 25)
    };
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-amber-50 to-orange-50"></div>
      
      {/* Notes container - Desktop only */}
      <div className="relative w-full h-full">
        {notes.map((note, index) => {
          const gridPosition = getGridPosition(index);
          return (
            <StickyNote
              key={note.id}
              note={{
                ...note,
                position: gridPosition
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
