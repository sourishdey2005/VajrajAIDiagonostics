
"use client"

import { useState, useEffect } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUserRole } from '@/contexts/user-role-context';
import { cn } from '@/lib/utils';
import { notesData, Transformer } from '@/lib/data';
import { MessageCircle, Send, AlertTriangle, ChevronsUp, CheckCircle, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

interface CommunicationLogProps {
  transformerId: string;
}

export type Note = {
  id: number;
  transformer_id: string;
  author_name: string;
  author_role: 'field_engineer' | 'manager';
  created_at: string;
  content: string;
  parent_log_id: number | null;
  escalation_status: 'none' | 'escalated' | 'resolved';
  replies?: Note[];
};

const userAvatars: Record<string, string | undefined> = {
    'Ravi Kumar': PlaceHolderImages.find(p => p.id === 'user-avatar-1')?.imageUrl,
    'Rohan Sharma': PlaceHolderImages.find(p => p.id === 'user-avatar-1')?.imageUrl,
    'Priya Sharma': PlaceHolderImages.find(p => p.id === 'user-avatar-2')?.imageUrl,
    'Anil Singh': PlaceHolderImages.find(p => p.id === 'user-avatar-3')?.imageUrl,
    'Meena Iyer': PlaceHolderImages.find(p => p.id === 'user-avatar-4')?.imageUrl,
    'Sanjay Das': PlaceHolderImages.find(p => p.id === 'user-avatar-5')?.imageUrl,
};

function NoteCard({ note, onReply, onEscalate, onResolve }: { note: Note, onReply: (noteId: number, content: string) => void, onEscalate: (noteId: number) => void, onResolve: (noteId: number) => void }) {
  const { role } = useUserRole();
  const [replyContent, setReplyContent] = useState('');
  const [showReply, setShowReply] = useState(false);

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(note.id, replyContent);
      setReplyContent('');
      setShowReply(false);
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={userAvatars[note.author_name]} />
        <AvatarFallback>{getInitials(note.author_name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <p className="font-semibold">{note.author_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{note.author_role.replace('_', ' ')}</p>
            </div>
            <p className="text-xs text-muted-foreground">{formatDistanceToNow(parseISO(note.created_at), { addSuffix: true })}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg mt-1 border">
           <p className="text-sm">{note.content}</p>
            {note.escalation_status === 'escalated' && (
                <Badge variant="destructive" className="mt-2"><AlertTriangle className="w-3 h-3 mr-1"/> Escalated</Badge>
            )}
             {note.escalation_status === 'resolved' && (
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1"/> Resolved</Badge>
            )}
        </div>
        
        {note.replies && note.replies.map(reply => (
            <div key={reply.id} className="flex gap-3 mt-3">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={userAvatars[reply.author_name]} />
                    <AvatarFallback>{getInitials(reply.author_name)}</AvatarFallback>
                </Avatar>
                 <div className="flex-1">
                    <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{reply.author_name}</p>
                         </div>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(parseISO(reply.created_at), { addSuffix: true })}</p>
                    </div>
                    <div className="p-2 bg-background rounded-lg mt-1 border">
                       <p className="text-sm">{reply.content}</p>
                    </div>
                </div>
            </div>
        ))}

        {role === 'manager' && (
             <div className="mt-2 flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowReply(!showReply)}>Reply</Button>
                {note.escalation_status !== 'escalated' && note.escalation_status !== 'resolved' && (
                    <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700" onClick={() => onEscalate(note.id)}>
                        <ChevronsUp className="w-4 h-4 mr-1"/> Escalate
                    </Button>
                )}
                 {note.escalation_status === 'escalated' && (
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" onClick={() => onResolve(note.id)}>
                        <CheckCircle className="w-4 h-4 mr-1"/> Mark as Resolved
                    </Button>
                )}
            </div>
        )}
        {showReply && (
            <div className="mt-2 flex items-center gap-2">
                <Textarea 
                    placeholder="Write a reply..." 
                    className="flex-1"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={2}
                />
                <Button size="icon" onClick={handleReplySubmit}><Send className="w-4 h-4" /></Button>
            </div>
        )}
      </div>
    </div>
  )
}

export function CommunicationLog({ transformerId }: CommunicationLogProps) {
  const { role, userName } = useUserRole();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
        const filteredNotes = notesData
            .filter(note => note.transformer_id === transformerId)
            .sort((a, b) => parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime());
        setNotes(filteredNotes as Note[]);
        setIsLoading(false);
    }, 500);
  }, [transformerId]);

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      transformer_id: transformerId,
      author_name: userName,
      author_role: role as 'manager' | 'field_engineer',
      created_at: new Date().toISOString(),
      content: newNoteContent,
      parent_log_id: null,
      escalation_status: 'none',
      replies: []
    };

    setNotes(prev => [newNote, ...prev]);
    setNewNoteContent('');
    toast({ title: 'Note Added', description: 'Your note has been added to the log.' });
  };

  const handleReply = (noteId: number, content: string) => {
    const newReply: Note = {
      id: Date.now(),
      transformer_id: transformerId,
      author_name: userName,
      author_role: role as 'manager' | 'field_engineer',
      created_at: new Date().toISOString(),
      content,
      parent_log_id: noteId,
      escalation_status: 'none'
    };

    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          replies: [...(note.replies || []), newReply]
        }
      }
      return note;
    }));
    toast({ title: 'Reply Sent' });
  };

  const handleEscalate = (noteId: number) => {
    setNotes(prev => prev.map(note => note.id === noteId ? { ...note, escalation_status: 'escalated' } : note));
    toast({ title: 'Issue Escalated', variant: 'destructive' });
  };
  
  const handleResolve = (noteId: number) => {
    setNotes(prev => prev.map(note => note.id === noteId ? { ...note, escalation_status: 'resolved' } : note));
    toast({ title: 'Issue Resolved', className: 'bg-green-100 border-green-200 text-green-800' });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageCircle /> Communication Log</CardTitle>
        <CardDescription>Real-time feedback and notes from field engineers and managers.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a new note or observation..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
            />
            <Button onClick={handleAddNote} disabled={!newNoteContent.trim()}>Add Note</Button>
          </div>
          <div className="space-y-6 pt-4">
            {isLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : notes.length > 0 ? (
                notes.map(note => <NoteCard key={note.id} note={note} onReply={handleReply} onEscalate={handleEscalate} onResolve={handleResolve} />)
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No communication history for this transformer.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
