
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StickyNote } from "@/types/StickyNote";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type DatabaseNote = Tables<"sticky_notes">;

// Convert database note to app note format
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

export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      console.log('Fetching notes from database...');
      const { data, error } = await supabase
        .from('sticky_notes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching notes:', error);
        throw error;
      }

      console.log('Fetched notes:', data);
      return data?.map(transformNote) || [];
    },
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteData: { message: string; authorName?: string; color: string; position: { x: number; y: number }; rotation: number }) => {
      console.log('Creating note:', noteData);
      
      const insertData: TablesInsert<"sticky_notes"> = {
        message: noteData.message,
        author_name: noteData.authorName || null,
        color: noteData.color,
        position_x: noteData.position.x,
        position_y: noteData.position.y,
        rotation: noteData.rotation
      };

      const { data, error } = await supabase
        .from('sticky_notes')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating note:', error);
        throw error;
      }

      console.log('Created note:', data);
      return transformNote(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
