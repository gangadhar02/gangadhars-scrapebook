
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { getRandomColor } from "@/types/StickyNote";
import { X } from "lucide-react";

interface NoteCreatorProps {
  onComplete: (noteData: { message: string; color: string; authorName?: string }) => void;
  onCancel: () => void;
}

export const NoteCreator = ({ onComplete, onCancel }: NoteCreatorProps) => {
  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [noteColor] = useState(getRandomColor());
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSubmit = () => {
    if (message.trim().length === 0) return;

    onComplete({
      message: message.trim(),
      color: noteColor,
      authorName: isAnonymous ? undefined : authorName.trim() || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30 p-4">
      <div
        className="relative p-6 rounded-lg shadow-2xl transform animate-scale-in max-w-md w-full sticky-note-shadow border-l-4 border-t-4 border-white/30"
        style={{ backgroundColor: noteColor }}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Tape effect */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-white/40 rounded-sm border border-white/20"></div>

        <div className="space-y-4">
          <h3 className="text-xl font-handwritten font-bold text-amber-900 text-center">
            Write your note!
          </h3>

          <Textarea
            placeholder="What's on your mind? (max 200 characters)"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 200))}
            onKeyDown={handleKeyDown}
            className="min-h-[120px] resize-none border-amber-300 bg-white/50 font-handwritten text-amber-900 placeholder:text-amber-600/70 focus:ring-amber-400 writing-animation"
            autoFocus
          />

          <div className="text-right text-xs text-amber-700">
            {message.length}/200 characters
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
              />
              <label htmlFor="anonymous" className="text-sm text-amber-800 font-handwritten">
                Post anonymously
              </label>
            </div>

            {!isAnonymous && (
              <Input
                placeholder="Your name (optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value.slice(0, 30))}
                className="border-amber-300 bg-white/50 font-handwritten text-amber-900 placeholder:text-amber-600/70 focus:ring-amber-400"
              />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-amber-400 text-amber-800 hover:bg-amber-100 font-handwritten"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={message.trim().length === 0}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-handwritten"
            >
              Stick it! 📌
            </Button>
          </div>

          <p className="text-xs text-center text-amber-700/80 font-handwritten">
            Press Ctrl+Enter to submit quickly
          </p>
        </div>

        {/* Corner fold effect */}
        <div className="absolute top-0 right-0 w-6 h-6 bg-white/20 transform rotate-45 translate-x-3 -translate-y-3 rounded-sm"></div>
      </div>
    </div>
  );
};
