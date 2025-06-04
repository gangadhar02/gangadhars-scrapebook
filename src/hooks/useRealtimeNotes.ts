
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StickyNote } from '@/types/StickyNote';
import { Tables } from '@/integrations/supabase/types';

type DatabaseNote = Tables<"sticky_notes">;

const transformNote = (dbNote: DatabaseNote): StickyNote => ({
  id: dbNote.id,
  message: dbNote.message,
  color: dbNote.color,
  authorName: dbNote.author_name || undefined,
  position: {
    x: Number(dbNote.position_x),
    y: Number(dbNote.position_y)
  },
  rotation: Number(dbNote.rotation),
  createdAt: new Date(dbNote.created_at)
});

export const useRealtimeNotes = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up realtime subscription...');
    
    const channel = supabase
      .channel('sticky-notes-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sticky_notes'
        },
        (payload) => {
          console.log('New note added:', payload.new);
          const newNote = transformNote(payload.new as DatabaseNote);
          
          queryClient.setQueryData(['notes'], (oldNotes: StickyNote[] = []) => {
            // Check if note already exists to avoid duplicates
            if (oldNotes.some(note => note.id === newNote.id)) {
              return oldNotes;
            }
            return [...oldNotes, newNote];
          });
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
