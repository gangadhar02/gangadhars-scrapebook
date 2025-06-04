
import { useState } from "react";
import { Pin } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/StickyNote";

interface StickyNoteProps {
  note: StickyNoteType;
  onClick?: () => void;
}

export const StickyNote = ({ note, onClick }: StickyNoteProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`absolute cursor-pointer transform transition-all duration-200 ${
        isHovered ? 'scale-110 z-20' : 'z-10'
      } animate-stick-note`}
      style={{
        left: `${note.position.x}%`,
        top: `${note.position.y}%`,
        transform: `rotate(${note.rotation}deg) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
        '--rotation': `${note.rotation}deg`,
      } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div
        className="w-48 h-48 p-4 sticky-note-shadow rounded-lg border-l-2 border-t-2 border-white/30 relative"
        style={{ backgroundColor: note.color }}
      >
        {/* Pin in the center */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <Pin 
            size={16} 
            className="text-red-600 drop-shadow-sm rotate-12" 
            fill="currentColor"
          />
        </div>
        
        {/* Message */}
        <div className="h-full flex flex-col justify-between text-amber-900 pt-6">
          <p className="text-sm leading-relaxed break-words overflow-hidden font-handwritten">
            {note.message}
          </p>
          
          {/* Author name */}
          {note.authorName && (
            <div className="text-xs text-right text-amber-700/80 mt-2 border-t border-amber-900/20 pt-1">
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
