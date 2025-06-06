
import { useState } from "react";
import { StickyNote as StickyNoteType } from "@/types/StickyNote";

interface StickyNoteProps {
  note: StickyNoteType;
  onClick?: () => void;
}

export const StickyNote = ({ note, onClick }: StickyNoteProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate dynamic height based on message length
  const getMinHeight = () => {
    const messageLength = note.message.length;
    if (messageLength > 200) return 'min-h-64'; // 256px
    if (messageLength > 120) return 'min-h-56'; // 224px
    return 'min-h-48'; // 192px (default)
  };

  return (
    <div
      className={`cursor-pointer transform transition-all duration-200 ${
        isHovered ? 'scale-110 z-20' : 'z-10'
      } animate-stick-note md:absolute relative`}
      style={{
        left: note.position.x > 0 ? `${note.position.x}%` : 'auto',
        top: note.position.y > 0 ? `${note.position.y}%` : 'auto',
        transform: `rotate(${note.rotation}deg) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
        '--rotation': `${note.rotation}deg`,
      } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className={`w-48 ${getMinHeight()} p-4 sticky-note-shadow rounded-lg border-l-2 border-t-2 border-white/30 relative flex flex-col`}
        style={{ backgroundColor: note.color }}
      >
        {/* Tape effect */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-4 bg-white/40 rounded-sm border border-white/20"></div>
        
        {/* Message */}
        <div className="flex-1 flex flex-col justify-between text-amber-900">
          <p className="text-sm leading-relaxed break-words font-handwritten flex-1">
            {note.message}
          </p>
          
          {/* Author name */}
          {note.authorName && (
            <div className="text-xs text-right text-amber-700/80 mt-3 pt-2 border-t border-amber-900/20">
              - {note.authorName}
            </div>
          )}
        </div>

        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-white/20 transform rotate-45 translate-x-2 -translate-y-2 rounded-sm"></div>
      </div>
    </div>
  );
};
