import React, { useState } from 'react';
import { ChevronRight, Save, Calendar, Edit2, DollarSign, Plus, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface Note {
  id: string;
  date: string;
  content: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  targetPrice?: string;
}

interface Conviction {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  level: 'high' | 'medium' | 'low';
  targetPrice: string;
  rationale: string;
}

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tip: {
    id: string;
    title: string;
    year: string;
    sentiment: 'bullish' | 'bearish';
  } | null;
  onMobileBack?: () => void;
  showMobileBack?: boolean;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({ isOpen, onClose, tip, onMobileBack, showMobileBack = false }) => {
  const [currentNote, setCurrentNote] = useState('');
  const [noteSentiment, setNoteSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');
  const [noteTargetPrice, setNoteTargetPrice] = useState('');
  const [isEditingConviction, setIsEditingConviction] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // Mock conviction data per tip - in real app, this would be stored in a database
  const [convictions, setConvictions] = useState<Record<string, Conviction>>({
    '1': {
      sentiment: 'bullish',
      level: 'high',
      targetPrice: '$185',
      rationale: 'Strong AI market momentum'
    }
  });

  // Mock notes per tip - in real app, this would be stored in a database
  const [tipNotes, setTipNotes] = useState<Record<string, Note[]>>({
    '1': [
      {
        id: '1',
        date: 'Oct 15, 2025',
        content: 'Reviewed Q3 earnings - strong performance in cloud segment. Consider increasing position if price dips below $145.'
      },
      {
        id: '2',
        date: 'Sep 22, 2025',
        content: 'Management commentary on earnings call was optimistic. New product launch showing early traction.'
      }
    ],
    '2': [
      {
        id: '3',
        date: 'Oct 10, 2025',
        content: 'Subscription model showing strong traction. Customer retention metrics improving.'
      }
    ]
  });

  const [editedConviction, setEditedConviction] = useState<Conviction>({
    sentiment: 'bullish',
    level: 'high',
    targetPrice: '',
    rationale: ''
  });

  if (!isOpen || !tip) return null;

  const currentConviction = convictions[tip.id] || {
    sentiment: tip.sentiment,
    level: 'medium',
    targetPrice: '',
    rationale: ''
  };

  const savedNotes = tipNotes[tip.id] || [];

  const handleSaveNote = () => {
    if (!currentNote.trim()) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content: currentNote,
      sentiment: noteSentiment,
      targetPrice: noteTargetPrice
    };

    setTipNotes(prev => ({
      ...prev,
      [tip.id]: [newNote, ...(prev[tip.id] || [])]
    }));
    
    setCurrentNote('');
    setNoteTargetPrice('');
    setNoteSentiment('bullish');
    setIsAddingNote(false);
  };

  const handleSaveConviction = () => {
    setConvictions(prev => ({
      ...prev,
      [tip.id]: editedConviction
    }));
    setIsEditingConviction(false);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'bearish':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'neutral':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getConvictionColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="h-full bg-white border-l border-gray-300 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5 flex-shrink-0 bg-[#fafafa]">
        <div className="flex items-center gap-2">
          {showMobileBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileBack}
              className="md:hidden gap-1.5 h-6 px-1.5 -ml-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
          )}
          <h2 className="text-xs text-gray-500 uppercase tracking-wide border-l-[3px] border-green-600 pl-2.5">Your Notes</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={showMobileBack ? onMobileBack : onClose}>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* Current Conviction */}
          <Card className="p-3 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs text-gray-900">Current Conviction</h4>
              <Dialog open={isEditingConviction} onOpenChange={(open) => {
                setIsEditingConviction(open);
                if (open) {
                  setEditedConviction(currentConviction);
                }
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 px-1.5 text-[10px]"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-base">Edit Conviction</DialogTitle>
                    <DialogDescription>
                      Edit your conviction sentiment, level, target price, and rationale for this tip.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Sentiment */}
                    <div className="space-y-2">
                      <Label className="text-xs">Sentiment</Label>
                      <RadioGroup 
                        value={editedConviction.sentiment}
                        onValueChange={(value) => setEditedConviction(prev => ({
                          ...prev,
                          sentiment: value as 'bullish' | 'bearish' | 'neutral'
                        }))}
                        className="flex gap-2"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="bullish" id="bullish" className="peer sr-only" />
                          <Label
                            htmlFor="bullish"
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 cursor-pointer"
                          >
                            Bullish
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="neutral" id="neutral" className="peer sr-only" />
                          <Label
                            htmlFor="neutral"
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-600 peer-data-[state=checked]:bg-gray-50 cursor-pointer"
                          >
                            Neutral
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="bearish" id="bearish" className="peer sr-only" />
                          <Label
                            htmlFor="bearish"
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-50 cursor-pointer"
                          >
                            Bearish
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Conviction Level */}
                    <div className="space-y-2">
                      <Label className="text-xs">Conviction Level</Label>
                      <RadioGroup 
                        value={editedConviction.level}
                        onValueChange={(value) => setEditedConviction(prev => ({
                          ...prev,
                          level: value as 'high' | 'medium' | 'low'
                        }))}
                        className="flex gap-2"
                      >
                        <div className="flex items-center">
                          <RadioGroupItem value="high" id="high" className="peer sr-only" />
                          <Label
                            htmlFor="high"
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                          >
                            High
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
                          <Label
                            htmlFor="medium"
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                          >
                            Medium
                          </Label>
                        </div>
                        <div className="flex items-center">
                          <RadioGroupItem value="low" id="low" className="peer sr-only" />
                          <Label
                            htmlFor="low"
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                          >
                            Low
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Target Price */}
                    <div className="space-y-2">
                      <Label htmlFor="targetPrice" className="text-xs">Target Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                          id="targetPrice"
                          value={editedConviction.targetPrice}
                          onChange={(e) => setEditedConviction(prev => ({
                            ...prev,
                            targetPrice: e.target.value
                          }))}
                          placeholder="185"
                          className="pl-8 h-8 text-xs"
                        />
                      </div>
                    </div>

                    {/* Rationale */}
                    <div className="space-y-2">
                      <Label htmlFor="rationale" className="text-xs">Brief Rationale</Label>
                      <Textarea
                        id="rationale"
                        value={editedConviction.rationale}
                        onChange={(e) => setEditedConviction(prev => ({
                          ...prev,
                          rationale: e.target.value
                        }))}
                        placeholder="e.g., strong AI market momentum"
                        className="min-h-[60px] resize-none text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingConviction(false)}
                      className="h-8 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveConviction}
                      className="h-8 text-xs bg-red-600 hover:bg-red-700"
                    >
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-900">{tip.title.split('-')[0].trim()}</span>
                <Badge className={`h-4 px-1.5 text-[10px] ${getSentimentColor(currentConviction.sentiment)}`}>
                  {currentConviction.sentiment.charAt(0).toUpperCase() + currentConviction.sentiment.slice(1)}
                </Badge>
              </div>
              
              {currentConviction.targetPrice && (
                <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                  <DollarSign className="w-3 h-3" />
                  <span>Target: {currentConviction.targetPrice}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-[10px] text-gray-600">
                <span className={getConvictionColor(currentConviction.level)}>
                  {currentConviction.level.charAt(0).toUpperCase() + currentConviction.level.slice(1)} Conviction
                </span>
              </div>
              
              {currentConviction.rationale && (
                <p className="text-[10px] text-gray-700 italic mt-1">
                  "{currentConviction.rationale}"
                </p>
              )}
            </div>
          </Card>

          {/* Assessment Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs text-gray-900">Assessment Notes</h4>
              {!isAddingNote && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingNote(true)}
                  className="h-6 w-6 p-0 hover:bg-green-50 hover:text-green-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
            
            {/* New Note Editor - Collapsible */}
            {isAddingNote && (
              <Card className="p-2.5">
                <div className="flex items-center gap-1.5 mb-2 text-[10px] text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                {/* Sentiment Selection */}
                <div className="mb-2.5">
                  <RadioGroup 
                    value={noteSentiment}
                    onValueChange={(value) => setNoteSentiment(value as 'bullish' | 'bearish' | 'neutral')}
                    className="flex gap-1.5"
                  >
                    <div className="flex items-center flex-1">
                      <RadioGroupItem value="bullish" id="note-bullish" className="peer sr-only" />
                      <Label
                        htmlFor="note-bullish"
                        className="flex items-center justify-center rounded border-2 border-muted bg-popover px-2 py-1 text-[10px] hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 cursor-pointer w-full"
                      >
                        Bullish
                      </Label>
                    </div>
                    <div className="flex items-center flex-1">
                      <RadioGroupItem value="neutral" id="note-neutral" className="peer sr-only" />
                      <Label
                        htmlFor="note-neutral"
                        className="flex items-center justify-center rounded border-2 border-muted bg-popover px-2 py-1 text-[10px] hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-600 peer-data-[state=checked]:bg-gray-50 cursor-pointer w-full"
                      >
                        Neutral
                      </Label>
                    </div>
                    <div className="flex items-center flex-1">
                      <RadioGroupItem value="bearish" id="note-bearish" className="peer sr-only" />
                      <Label
                        htmlFor="note-bearish"
                        className="flex items-center justify-center rounded border-2 border-muted bg-popover px-2 py-1 text-[10px] hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-50 cursor-pointer w-full"
                      >
                        Bearish
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Target Price */}
                <div className="mb-2.5">
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      value={noteTargetPrice}
                      onChange={(e) => setNoteTargetPrice(e.target.value)}
                      placeholder="Target price"
                      className="pl-7 h-7 text-xs"
                    />
                  </div>
                </div>

                <Textarea 
                  placeholder="Add assessment notes..."
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  className="min-h-[80px] mb-2 resize-y text-xs"
                />
                <div className="flex gap-1.5">
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="flex-1 h-7 text-xs"
                    onClick={() => {
                      setIsAddingNote(false);
                      setCurrentNote('');
                      setNoteTargetPrice('');
                      setNoteSentiment('bullish');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-red-600 hover:bg-red-700 h-7 text-xs"
                    onClick={handleSaveNote}
                  >
                    <Save className="w-3 h-3 mr-1.5" />
                    Save
                  </Button>
                </div>
              </Card>
            )}

            {/* Past Notes */}
            {savedNotes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] text-gray-500 tracking-wide">PAST NOTES</h4>
                {savedNotes.map((note) => (
                  <Card key={note.id} className="p-2 bg-[#fafafa]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{note.date}</span>
                      </div>
                      {note.sentiment && (
                        <Badge className={`h-3.5 px-1.5 text-[9px] ${getSentimentColor(note.sentiment)}`}>
                          {note.sentiment.charAt(0).toUpperCase() + note.sentiment.slice(1)}
                        </Badge>
                      )}
                    </div>
                    {note.targetPrice && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-1">
                        <DollarSign className="w-2.5 h-2.5" />
                        <span>Target: {note.targetPrice}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-700 leading-snug">{note.content}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};