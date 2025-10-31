import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ChevronRight, Plus, Calendar, Save, DollarSign, ArrowLeft } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface StockNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockName: string;
  tips: Array<{
    id: string;
    title: string;
    year: string;
  }>;
  activeTipId?: string;
  onMobileBack?: () => void;
  showMobileBack?: boolean;
}

export const StockNotesPanel: React.FC<StockNotesPanelProps> = ({ 
  isOpen, 
  onClose, 
  stockSymbol,
  stockName,
  tips,
  activeTipId,
  onMobileBack,
  showMobileBack = false
}) => {
  const [newNoteTipId, setNewNoteTipId] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const [noteSentiment, setNoteSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');
  const [noteTargetPrice, setNoteTargetPrice] = useState('');

  if (!isOpen) return null;

  // Mock notes organized by tip ID
  const mockNotesByTip: Record<string, Array<{
    id: string;
    date: string;
    content: string;
  }>> = {
    '1': [
      {
        id: '1',
        date: 'Oct 25, 2025',
        content: 'Reviewed Q3 earnings - strong performance in cloud segment. Consider increasing position if price dips below $145.'
      },
      {
        id: '2',
        date: 'Sep 15, 2025',
        content: 'Management commentary on earnings call was optimistic. New product launch showing traction in enterprise.'
      }
    ],
    '2': [
      {
        id: '3',
        date: 'Oct 20, 2025',
        content: 'Services revenue growth is impressive. Wearables segment could be undervalued by market.'
      }
    ]
  };

  const handleAddNote = (tipId: string) => {
    setNewNoteTipId(tipId);
    setCurrentNote('');
    setNoteSentiment('bullish');
    setNoteTargetPrice('');
  };

  const handleSaveNote = () => {
    if (!currentNote.trim() || !newNoteTipId) return;
    
    // In real app, this would save to database
    console.log('Saving note:', {
      tipId: newNoteTipId,
      stockSymbol,
      content: currentNote,
      sentiment: noteSentiment,
      targetPrice: noteTargetPrice,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    
    // Reset form
    setCurrentNote('');
    setNoteSentiment('bullish');
    setNoteTargetPrice('');
    setNewNoteTipId(null);
  };

  const handleCancelNote = () => {
    setCurrentNote('');
    setNoteSentiment('bullish');
    setNoteTargetPrice('');
    setNewNoteTipId(null);
  };

  // Determine which tip to show - prioritize active tip, then first tip, then new note tip
  const displayTipId = activeTipId || tips[0]?.id || newNoteTipId;
  const displayTip = tips.find(t => t.id === displayTipId);

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
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
          <h3 className="text-xs text-gray-500 uppercase tracking-wide border-l-[3px] border-green-600 pl-2.5">Notes</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={showMobileBack ? onMobileBack : onClose}
          className="h-6 w-6"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Stock Header */}
          <div className="pb-2 border-b border-gray-200">
            <div className="text-lg text-gray-900">{stockSymbol}</div>
            <div className="text-xs text-gray-600">{stockName}</div>
          </div>

          {/* Tips Navigation/Sections */}
          {tips.map((tip) => {
            const tipNotes = mockNotesByTip[tip.id] || [];
            const isActive = tip.id === displayTipId;
            const isAddingNote = newNoteTipId === tip.id;

            return (
              <div key={tip.id} className={`transition-all ${isActive ? 'ring-2 ring-green-500 ring-opacity-50 rounded-lg' : ''}`}>
                {/* Tip Header */}
                <div className={`flex items-start justify-between gap-2 px-2 py-1.5 rounded ${isActive ? 'bg-green-50' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-red-600 tracking-wide mb-0.5">{tip.year}</div>
                    <div className="text-sm text-gray-900 leading-snug">{tip.title}</div>
                  </div>
                  {!isAddingNote && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddNote(tip.id)}
                      className="h-7 px-2 gap-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </Button>
                  )}
                </div>

                {/* Add Note Form */}
                {isAddingNote && (
                  <div className="px-2 pb-2">
                    <Card className="border-gray-200 bg-gray-50">
                      <div className="p-3 space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-700">Sentiment</Label>
                        <RadioGroup 
                          value={noteSentiment} 
                          onValueChange={(value: 'bullish' | 'bearish' | 'neutral') => setNoteSentiment(value)}
                          className="flex gap-3"
                        >
                          <div className="flex items-center space-x-1.5">
                            <RadioGroupItem value="bullish" id={`bullish-${tip.id}`} className="h-3.5 w-3.5" />
                            <Label htmlFor={`bullish-${tip.id}`} className="text-xs text-gray-700 cursor-pointer">
                              Bullish
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <RadioGroupItem value="neutral" id={`neutral-${tip.id}`} className="h-3.5 w-3.5" />
                            <Label htmlFor={`neutral-${tip.id}`} className="text-xs text-gray-700 cursor-pointer">
                              Neutral
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <RadioGroupItem value="bearish" id={`bearish-${tip.id}`} className="h-3.5 w-3.5" />
                            <Label htmlFor={`bearish-${tip.id}`} className="text-xs text-gray-700 cursor-pointer">
                              Bearish
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`target-price-${tip.id}`} className="text-xs text-gray-700 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Target Price (optional)
                        </Label>
                        <Input
                          id={`target-price-${tip.id}`}
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={noteTargetPrice}
                          onChange={(e) => setNoteTargetPrice(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`note-${tip.id}`} className="text-xs text-gray-700">Note</Label>
                        <Textarea
                          id={`note-${tip.id}`}
                          placeholder="Add your thoughts..."
                          value={currentNote}
                          onChange={(e) => setCurrentNote(e.target.value)}
                          className="min-h-[100px] text-xs resize-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveNote}
                          disabled={!currentNote.trim()}
                          className="flex-1 h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelNote}
                          className="h-8 px-3 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                    </Card>
                  </div>
                )}

                {/* Existing Notes */}
                {tipNotes.length > 0 && (
                  <div className="space-y-2 px-2 pb-2">
                    {tipNotes.map((note) => (
                      <Card key={note.id} className="border-gray-200">
                        <div className="p-3 space-y-1">
                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <Calendar className="w-2.5 h-2.5" />
                            <span>{note.date}</span>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed">{note.content}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {tipNotes.length === 0 && !isAddingNote && (
                  <div className="text-xs text-gray-500 italic px-2 pb-2">
                    No notes yet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};