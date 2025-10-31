import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ChevronRight, Plus, Calendar, Save, DollarSign, ArrowLeft } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface PostNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tips: Array<{
    id: string;
    title: string;
    stockSymbol: string;
    stockName: string;
  }>;
  activeStockSymbol?: string;
  onMobileBack?: () => void;
  showMobileBack?: boolean;
}

export const PostNotesPanel: React.FC<PostNotesPanelProps> = ({ 
  isOpen, 
  onClose, 
  tips,
  activeStockSymbol,
  onMobileBack,
  showMobileBack = false
}) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNoteStockSymbol, setNewNoteStockSymbol] = useState<string | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const [noteSentiment, setNoteSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('bullish');
  const [noteTargetPrice, setNoteTargetPrice] = useState('');

  if (!isOpen) return null;

  // Group tips by stock symbol to show unique stocks
  const uniqueStocks = tips.reduce((acc, tip) => {
    if (!acc.find(s => s.stockSymbol === tip.stockSymbol)) {
      acc.push({
        stockSymbol: tip.stockSymbol,
        stockName: tip.stockName,
        tipId: tip.id
      });
    }
    return acc;
  }, [] as Array<{ stockSymbol: string; stockName: string; tipId: string }>);

  // Mock notes organized by stock symbol
  const mockNotesByStock: Record<string, Array<{
    id: string;
    date: string;
    content: string;
  }>> = {
    'MSFT': [
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
    'AAPL': [
      {
        id: '3',
        date: 'Oct 20, 2025',
        content: 'Services revenue growth is impressive. Wearables segment could be undervalued by market. Watch for iPhone cycle dynamics.'
      }
    ],
    'TSLA': [
      {
        id: '4',
        date: 'Oct 22, 2025',
        content: 'Energy storage business is the hidden gem here. Megapack backlog suggests strong demand. FSD adoption rate improving but regulatory risk remains.'
      }
    ],
    'GOOG': [
      {
        id: '5',
        date: 'Oct 24, 2025',
        content: 'GCP finally turning profitable is significant. AI search integration could be transformative for monetization. YouTube Shorts scaling well.'
      }
    ]
  };

  const handleAddNote = (stockSymbol: string) => {
    setNewNoteStockSymbol(stockSymbol);
    setCurrentNote('');
    setNoteSentiment('bullish');
    setNoteTargetPrice('');
  };

  const handleSaveNote = () => {
    if (!currentNote.trim() || !newNoteStockSymbol) return;
    
    // In real app, this would save to database
    console.log('Saving note:', {
      stockSymbol: newNoteStockSymbol,
      content: currentNote,
      sentiment: noteSentiment,
      targetPrice: noteTargetPrice,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    
    // Reset form
    setCurrentNote('');
    setNoteSentiment('bullish');
    setNoteTargetPrice('');
    setNewNoteStockSymbol(null);
  };

  const handleCancelNote = () => {
    setCurrentNote('');
    setNoteSentiment('bullish');
    setNoteTargetPrice('');
    setNewNoteStockSymbol(null);
  };

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

      {/* Assessment Notes Header */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h4 className="text-xs text-gray-700">Assessment Notes</h4>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1.5 text-xs text-gray-600 hover:text-gray-900"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Scrollable Notes Area */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {uniqueStocks.map((stock) => {
            const notes = mockNotesByStock[stock.stockSymbol] || [];
            const isActive = activeStockSymbol === stock.stockSymbol;
            
            return (
              <div key={stock.stockSymbol} className={`transition-all ${isActive ? 'ring-2 ring-green-500 ring-opacity-50 rounded-lg' : ''}`}>
                {/* Stock Symbol Header */}
                <div className={`flex items-center justify-between mb-2 px-2 py-1.5 rounded ${isActive ? 'bg-green-50' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      isActive 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {stock.stockSymbol}
                    </span>
                    <span className="text-xs text-gray-500">{stock.stockName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddNote(stock.stockSymbol)}
                    className="h-5 w-5 p-0 hover:bg-gray-200"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>

                {/* Notes for this stock */}
                {newNoteStockSymbol === stock.stockSymbol && (
                  <Card className="shadow-sm border-gray-200 mb-2 p-2.5">
                    {/* Date */}
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
                          <RadioGroupItem value="bullish" id={`note-bullish-${stock.stockSymbol}`} className="peer sr-only" />
                          <Label
                            htmlFor={`note-bullish-${stock.stockSymbol}`}
                            className="flex items-center justify-center rounded border-2 border-muted bg-popover px-2 py-1 text-[10px] hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-50 cursor-pointer w-full"
                          >
                            Bullish
                          </Label>
                        </div>
                        <div className="flex items-center flex-1">
                          <RadioGroupItem value="neutral" id={`note-neutral-${stock.stockSymbol}`} className="peer sr-only" />
                          <Label
                            htmlFor={`note-neutral-${stock.stockSymbol}`}
                            className="flex items-center justify-center rounded border-2 border-muted bg-popover px-2 py-1 text-[10px] hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-gray-600 peer-data-[state=checked]:bg-gray-50 cursor-pointer w-full"
                          >
                            Neutral
                          </Label>
                        </div>
                        <div className="flex items-center flex-1">
                          <RadioGroupItem value="bearish" id={`note-bearish-${stock.stockSymbol}`} className="peer sr-only" />
                          <Label
                            htmlFor={`note-bearish-${stock.stockSymbol}`}
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

                    {/* Note Content */}
                    <Textarea 
                      placeholder="Add assessment notes..."
                      value={currentNote}
                      onChange={(e) => setCurrentNote(e.target.value)}
                      className="min-h-[80px] mb-2 resize-y text-xs"
                      autoFocus
                    />
                    
                    {/* Action Buttons */}
                    <div className="flex gap-1.5">
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="flex-1 h-7 text-xs"
                        onClick={handleCancelNote}
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

                <div className="space-y-2">
                  {notes.length === 0 ? (
                    <p className="text-xs text-gray-400 italic px-2 py-2">No notes yet</p>
                  ) : (
                    notes.map((note) => (
                      <Card key={note.id} className="shadow-sm border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-gray-500">{note.date}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 px-1 text-[10px] text-gray-500 hover:text-gray-700"
                            >
                              Edit
                            </Button>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed">{note.content}</p>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};