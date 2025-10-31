import React, { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
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

interface JournalViewProps {
  stockSymbol: string;
  stockName: string;
  position: Position | null;
  onBack: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  stockSymbol,
  stockName,
  position,
  onBack
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
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
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
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
            <div className="text-xs text-gray-600 mt-0.5">Trade Journal</div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
          {/* Position Summary */}
          {position && (
            <Card className="border-gray-200 shadow-sm">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xs text-gray-900">Position Summary</h3>
              </div>
              <div className="p-4">
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
            <div className="p-4">
              {trades.length > 0 ? (
                <div>
                  <div className="text-[10px] text-gray-500 mb-2">Trades (newest first)</div>
                  
                  {/* Desktop Table View */}
                  <div className="hidden md:block border border-gray-200 overflow-x-auto">
                    <table className="w-full text-[11px] min-w-[640px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-2 py-1.5 text-[10px] text-gray-600">Date</th>
                          <th className="text-left px-2 py-1.5 text-[10px] text-gray-600">Action</th>
                          <th className="text-right px-2 py-1.5 text-[10px] text-gray-600">Qty</th>
                          <th className="text-right px-2 py-1.5 text-[10px] text-gray-600">Price</th>
                          <th className="text-right px-2 py-1.5 text-[10px] text-gray-600">Fees</th>
                          <th className="text-left px-2 py-1.5 text-[10px] text-gray-600">Reason</th>
                          <th className="text-right px-2 py-1.5 text-[10px] text-gray-600 w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {trades.map((trade) => (
                          <tr key={trade.id} className="hover:bg-gray-50">
                            <td className="px-2 py-2 text-gray-700 whitespace-nowrap">{formatDate(trade.date)}</td>
                            <td className="px-2 py-2">
                              <Badge
                                className={`h-5 px-1.5 text-[9px] whitespace-nowrap ${
                                  trade.action === 'Buy' || trade.action === 'Add'
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                                }`}
                              >
                                {trade.action}
                              </Badge>
                            </td>
                            <td className="px-2 py-2 text-right text-gray-700">{trade.quantity}</td>
                            <td className="px-2 py-2 text-right text-gray-700 whitespace-nowrap">{formatCurrency(trade.price)}</td>
                            <td className="px-2 py-2 text-right text-gray-700 whitespace-nowrap">{formatCurrency(trade.fees)}</td>
                            <td className="px-2 py-2 text-gray-700">{trade.reason}</td>
                            <td className="px-2 py-2 text-right">
                              <button 
                                onClick={() => handleDeleteTrade(trade.id)}
                                className="text-red-600 hover:text-red-700 p-1 transition-colors"
                                aria-label="Delete trade"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-2">
                    {trades.map((trade) => (
                      <div key={trade.id} className="border border-gray-200 bg-white">
                        <div className="p-3 space-y-2">
                          {/* Header: Date & Action */}
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] text-gray-700">{formatDate(trade.date)}</div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`h-5 px-1.5 text-[9px] whitespace-nowrap ${
                                  trade.action === 'Buy' || trade.action === 'Add'
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-red-100 text-red-700 hover:bg-red-100'
                                }`}
                              >
                                {trade.action}
                              </Badge>
                              <button 
                                onClick={() => handleDeleteTrade(trade.id)}
                                className="text-red-600 hover:text-red-700 p-0.5 transition-colors"
                                aria-label="Delete trade"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Metrics Grid */}
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <div className="text-[9px] text-gray-500 mb-0.5">Qty</div>
                              <div className="text-[11px] text-gray-900">{trade.quantity}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-gray-500 mb-0.5">Price</div>
                              <div className="text-[11px] text-gray-900">{formatCurrency(trade.price)}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-gray-500 mb-0.5">Fees</div>
                              <div className="text-[11px] text-gray-900">{formatCurrency(trade.fees)}</div>
                            </div>
                          </div>
                          
                          {/* Reason */}
                          {trade.reason && (
                            <div>
                              <div className="text-[9px] text-gray-500 mb-0.5">Reason</div>
                              <div className="text-[11px] text-gray-700">{trade.reason}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center py-4">
                  No trades logged yet. Click "Log Trade" to add your first trade.
                </div>
              )}
            </div>
          </Card>
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
