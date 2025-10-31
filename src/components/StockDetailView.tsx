import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, ThumbsUp, Minus, ThumbsDown, Calendar, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface Position {
  openQty: number;
  avgCost: number;
  valuation: number;
  unrealizedPL: number;
  realizedPL: number;
  winRate: number;
}

interface Tip {
  id: string;
  year: string;
  title: string;
  sentiment: 'bullish' | 'bearish';
  assessment?: 'agree' | 'neutral' | 'disagree' | null;
}

interface Note {
  id: string;
  tipId: string;
  tipTitle: string;
  date: string;
  content: string;
}

interface Trade {
  id: string;
  date: string;
  action: 'Buy' | 'Sell' | 'Add' | 'Trim';
  quantity: number;
  price: number;
  fees: number;
  account: string;
  reason: string;
}

interface StockDetailViewProps {
  stockSymbol: string;
  stockName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  position: Position | null;
  tips: Tip[];
  notes: Note[];
  onBack: () => void;
  onTipClick: (tipId: string) => void;
}

export const StockDetailView: React.FC<StockDetailViewProps> = ({
  stockSymbol,
  stockName,
  currentPrice,
  priceChange,
  priceChangePercent,
  position,
  tips,
  notes,
  onBack,
  onTipClick
}) => {
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([
    {
      id: '1',
      date: '2025-06-27',
      action: 'Buy',
      quantity: 10,
      price: 140.00,
      fees: 1.50,
      account: '',
      reason: 'Initial position based on SOTP.'
    },
    {
      id: '2',
      date: '2025-07-27',
      action: 'Add',
      quantity: 5,
      price: 150.00,
      fees: 1.20,
      account: '',
      reason: 'Cloud growth beating comps.'
    },
    {
      id: '3',
      date: '2025-09-10',
      action: 'Trim',
      quantity: 3,
      price: 175.00,
      fees: 1.00,
      account: '',
      reason: 'Risk mgmt pre-earnings.'
    }
  ]);

  const [formData, setFormData] = useState({
    action: 'Buy' as 'Buy' | 'Sell' | 'Add' | 'Trim',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    price: '',
    fees: '',
    account: '',
    reason: ''
  });

  // Calculate assessment summary
  const assessmentSummary = tips.reduce((acc, tip) => {
    if (tip.assessment === 'agree') acc.agree++;
    else if (tip.assessment === 'neutral') acc.neutral++;
    else if (tip.assessment === 'disagree') acc.disagree++;
    return acc;
  }, { agree: 0, neutral: 0, disagree: 0 });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleAddTrade = () => {
    if (!formData.quantity || !formData.price) return;

    const newTrade: Trade = {
      id: Date.now().toString(),
      date: formData.date,
      action: formData.action,
      quantity: parseFloat(formData.quantity),
      price: parseFloat(formData.price),
      fees: formData.fees ? parseFloat(formData.fees) : 0,
      account: formData.account,
      reason: formData.reason
    };

    setTrades([newTrade, ...trades]);
    handleClearForm();
    setIsTradeDialogOpen(false);
  };

  const handleClearForm = () => {
    setFormData({
      action: 'Buy',
      date: new Date().toISOString().split('T')[0],
      quantity: '',
      price: '',
      fees: '',
      account: '',
      reason: ''
    });
  };

  const handleDeleteTrade = (tradeId: string) => {
    setTrades(trades.filter(t => t.id !== tradeId));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-7 px-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl text-gray-900">{stockSymbol}</h1>
              <span className="text-sm text-gray-600">{stockName}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl text-gray-900">{formatCurrency(currentPrice)}</div>
            <div className={`text-xs flex items-center gap-1 justify-end ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{formatCurrency(Math.abs(priceChange))} ({formatPercent(priceChangePercent)})</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Position Summary */}
          {position && (
            <Card className="border-gray-200 shadow-sm">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xs text-gray-900">Position Summary</h3>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Open Qty</div>
                    <div className="text-base text-gray-900">{position.openQty}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Avg Cost</div>
                    <div className="text-base text-gray-900">{formatCurrency(position.avgCost)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Valuation</div>
                    <div className="text-base text-gray-900">{formatCurrency(position.valuation)}</div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Unrealized P&L</div>
                    <div className={`text-base ${position.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {position.unrealizedPL >= 0 ? '+' : ''}{formatCurrency(position.unrealizedPL)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Realized P&L</div>
                    <div className={`text-base ${position.realizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {position.realizedPL >= 0 ? '+' : ''}{formatCurrency(position.realizedPL)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Win Rate</div>
                    <div className="text-base text-gray-900">{position.winRate}%</div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Trade Journal */}
          <Card className="border-gray-200 shadow-sm">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xs text-gray-900">Trade Journal</h3>
              <Button
                size="sm"
                onClick={() => setIsTradeDialogOpen(true)}
                className="h-6 px-2 text-[10px] bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-3 h-3 mr-1" />
                Log Trade
              </Button>
            </div>
            <div className="p-3">
              {trades.length > 0 ? (
                <div>
                  <div className="text-[10px] text-gray-500 mb-2">Trades (newest first)</div>
                  <div className="border border-gray-200 overflow-hidden">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-2 py-1.5 text-[10px] text-gray-600">Date</th>
                          <th className="text-left px-2 py-1.5 text-[10px] text-gray-600">Action</th>
                          <th className="text-right px-2 py-1.5 text-[10px] text-gray-600">Qty</th>
                          <th className="text-right px-2 py-1.5 text-[10px] text-gray-600">Price</th>
                          <th className="text-right px-2 py-1.5 text-[10px] text-gray-600">Fees</th>
                          <th className="text-left px-2 py-1.5 text-[10px] text-gray-600">Reason</th>
                          <th className="text-right px-2 py-1.5 text-[10px] text-gray-600"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {trades.map((trade) => (
                          <tr key={trade.id} className="hover:bg-gray-50">
                            <td className="px-2 py-2 text-gray-700">{formatDate(trade.date)}</td>
                            <td className="px-2 py-2">
                              <Badge
                                className={`h-5 px-1.5 text-[9px] ${
                                  trade.action === 'Buy' || trade.action === 'Add'
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                                }`}
                              >
                                {trade.action}
                              </Badge>
                            </td>
                            <td className="px-2 py-2 text-right text-gray-700">{trade.quantity}</td>
                            <td className="px-2 py-2 text-right text-gray-700">{formatCurrency(trade.price)}</td>
                            <td className="px-2 py-2 text-right text-gray-700">{formatCurrency(trade.fees)}</td>
                            <td className="px-2 py-2 text-gray-700">{trade.reason}</td>
                            <td className="px-2 py-2 text-right">
                              <button 
                                onClick={() => handleDeleteTrade(trade.id)}
                                className="text-red-600 hover:text-red-700 underline text-[10px]"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center py-4">
                  No trades logged yet. Click "Log Trade" to add your first trade.
                </div>
              )}
            </div>
          </Card>

          {/* Assessment Summary */}
          <Card className="border-gray-200 shadow-sm">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <h3 className="text-xs text-gray-900">Assessment Summary</h3>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Agree</div>
                    <div className="text-base text-gray-900">{assessmentSummary.agree}</div>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                    <Minus className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Neutral</div>
                    <div className="text-base text-gray-900">{assessmentSummary.neutral}</div>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Disagree</div>
                    <div className="text-base text-gray-900">{assessmentSummary.disagree}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tips for this Stock */}
          <Card className="border-gray-200 shadow-sm">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs text-gray-900">Analysis Timeline</h3>
                <span className="text-[10px] text-gray-500">{tips.length} tip{tips.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  onClick={() => onTipClick(tip.id)}
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-red-600 tracking-wide">{tip.year}</span>
                        <Badge 
                          variant={tip.sentiment === 'bullish' ? 'default' : 'destructive'}
                          className={`h-4 px-1.5 text-[9px] ${
                            tip.sentiment === 'bullish' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                              : ''
                          }`}
                        >
                          {tip.sentiment === 'bullish' ? 'BULLISH' : 'BEARISH'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-900 leading-snug">{tip.title}</p>
                    </div>
                    {tip.assessment && (
                      <div className="flex-shrink-0">
                        {tip.assessment === 'agree' && (
                          <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
                            <ThumbsUp className="w-3 h-3 text-green-600" />
                          </div>
                        )}
                        {tip.assessment === 'neutral' && (
                          <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center">
                            <Minus className="w-3 h-3 text-gray-600" />
                          </div>
                        )}
                        {tip.assessment === 'disagree' && (
                          <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center">
                            <ThumbsDown className="w-3 h-3 text-red-600" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* All Notes for this Stock */}
          {notes.length > 0 && (
            <Card className="border-gray-200 shadow-sm">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs text-gray-900">All Notes</h3>
                  <span className="text-[10px] text-gray-500">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="p-3 space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>{note.date}</span>
                      <span>•</span>
                      <span className="text-gray-600">{note.tipTitle}</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-snug pl-4">{note.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Trade Entry Dialog */}
      <Dialog open={isTradeDialogOpen} onOpenChange={setIsTradeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base">Log Trade</DialogTitle>
            <DialogDescription>
              Record a new trade transaction for {stockSymbol}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="action" className="text-xs text-gray-600">Action</Label>
                <Select
                  value={formData.action}
                  onValueChange={(value: 'Buy' | 'Sell' | 'Add' | 'Trim') => 
                    setFormData({ ...formData, action: value })
                  }
                >
                  <SelectTrigger id="action" className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Sell">Sell</SelectItem>
                    <SelectItem value="Add">Add</SelectItem>
                    <SelectItem value="Trim">Trim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs text-gray-600">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="quantity" className="text-xs text-gray-600">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="1"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs text-gray-600">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="100"
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fees" className="text-xs text-gray-600">Fees (optional)</Label>
                <Input
                  id="fees"
                  type="number"
                  step="0.01"
                  value={formData.fees}
                  onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                  placeholder="0"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="account" className="text-xs text-gray-600">Account (optional)</Label>
                <Input
                  id="account"
                  type="text"
                  value={formData.account}
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reason" className="text-xs text-gray-600">Reason</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Why this trade?"
                className="min-h-[120px] text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={handleClearForm}
                className="h-9 px-4 text-sm"
              >
                Clear
              </Button>
              <Button
                onClick={handleAddTrade}
                disabled={!formData.quantity || !formData.price}
                className="h-9 px-4 text-sm bg-emerald-600 hover:bg-emerald-700"
              >
                Add Trade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
