
"use client"

import { useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { transformerNotes as initialNotes, Note } from '@/lib/data';
import { useUserRole } from '@/contexts/user-role-context';
import { cn } from '@/lib/utils';
import { MessageCircle, Send, AlertTriangle, ChevronsUp, CheckCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

interface CommunicationLogProps {
  transformerId: string;
}

const userAvatars: Record<string, string | undefined> = {
    'Ravi Kumar': PlaceHolderImages.find(p => p.id === 'user-avatar-1')?.imageUrl,
    'Rohan Sharma': PlaceHolderImages.find(p => p.id === 'user-avatar-1')?.imageUrl,
    'Priya Sharma': PlaceHolderImages.find(p => p.id === 'user-avatar-2')?.imageUrl,
    'Anil Singh': PlaceHolderImages.find(p => p.id === 'user-avatar-3')?.imageUrl,
    'Meena Iyer': PlaceHolderImages.find(p => p_id === 'user-avatar-4')?.imageUrl,
    'Sanjay Das': PlaceHolderImages.find(p => p.id === 'user-avatar-5')?.imageUrl,
};

function NoteCard({ note, onReply, onEscalate, onResolve }: { note: Note, onReply: (noteId: string, content: string) => void, onEscalate: (noteId: string) => void, onResolve: (noteId: string) => void }) {
  const { role } = useUserRole();
  const [replyContent, setReplyContent] = useState('');
  const [showReply, setShowReply] = useState(false);

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(note.noteId, replyContent);
      setReplyContent('');
      setShowReply(false);
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={userAvatars[note.author]} />
        <AvatarFallback>{getInitials(note.author)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <p className="font-semibold">{note.author}</p>
                <p className="text-xs text-muted-foreground capitalize">{note.authorRole.replace('_', ' ')}</p>
            </div>
            <p className="text-xs text-muted-foreground">{formatDistanceToNow(parseISO(note.timestamp), { addSuffix: true })}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg mt-1 border">
           <p className="text-sm">{note.content}</p>
            {note.escalationStatus === 'escalated' && (
                <Badge variant="destructive" className="mt-2"><AlertTriangle className="w-3 h-3 mr-1"/> Escalated</Badge>
            )}
             {note.escalationStatus === 'resolved' && (
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1"/> Resolved</Badge>
            )}
        </div>
        
        {note.replies.map(reply => (
            <div key={reply.noteId} className="flex gap-3 mt-3">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={userAvatars[reply.author]} />
                    <AvatarFallback>{getInitials(reply.author)}</AvatarFallback>
                </Avatar>
                 <div className="flex-1">
                    <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{reply.author}</p>
                         </div>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(parseISO(reply.timestamp), { addSuffix: true })}</p>
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
                {note.escalationStatus !== 'escalated' && note.escalationStatus !== 'resolved' && (
                    <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700" onClick={() => onEscalate(note.noteId)}>
                        <ChevronsUp className="w-4 h-4 mr-1"/> Escalate
                    </Button>
                )}
                 {note.escalationStatus === 'escalated' && (
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" onClick={() => onResolve(note.noteId)}>
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
  const { role } = useUserRole();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>(() => 
    initialNotes.filter(n => n.transformerId === transformerId).sort((a,b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime())
  );
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;

    const newNote: Note = {
      noteId: `NOTE-${Date.now()}`,
      transformerId,
      author: role === 'manager' ? 'Rohan Sharma' : 'Priya Sharma', // Simulate current user
      authorRole: role,
      timestamp: new Date().toISOString(),
      content: newNoteContent,
      replies: [],
      escalationStatus: 'none',
    };

    setNotes(prev => [newNote, ...prev]);
    setNewNoteContent('');
    toast({ title: 'Note Added', description: 'Your note has been added to the log.' });
  };

  const handleReply = (noteId: string, content: string) => {
    const newReply: Note = {
      noteId: `REPLY-${Date.now()}`,
      transformerId,
      author: 'Rohan Sharma', // Assume manager is replying
      authorRole: 'manager',
      timestamp: new Date().toISOString(),
      content,
      replies: [],
      escalationStatus: 'none',
    };

    setNotes(prev => prev.map(n => n.noteId === noteId ? { ...n, replies: [...n.replies, newReply] } : n));
    toast({ title: 'Reply Sent', description: 'Your reply has been added.' });
  };

  const handleEscalate = (noteId: string) => {
    setNotes(prev => prev.map(n => n.noteId === noteId ? { ...n, escalationStatus: 'escalated' } : n));
    toast({ title: 'Issue Escalated', description: 'The note has been marked for priority attention.', variant: 'destructive' });
  };
  
  const handleResolve = (noteId: string) => {
    setNotes(prev => prev.map(n => n.noteId === noteId ? { ...n, escalationStatus: 'resolved' } : n));
    toast({ title: 'Issue Resolved', description: 'The escalation has been marked as resolved.', className: 'bg-green-100 border-green-200 text-green-800' });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageCircle /> Communication Log</CardTitle>
        <CardDescription>Simulated real-time feedback and notes from field engineers and managers.</CardDescription>
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
            {notes.length > 0 ? (
                notes.map(note => <NoteCard key={note.noteId} note={note} onReply={handleReply} onEscalate={handleEscalate} onResolve={handleResolve} />)
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No communication history for this transformer.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
