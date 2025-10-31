import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  addedDate: string;
  value: number;
  plPercent: number;
  trades: number;
  hasReviewPrompt: boolean;
}

interface PortfolioViewProps {
  onViewStock: (symbol: string) => void;
  onTradeJournal: (symbol: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onViewStock, onTradeJournal }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  // Mock portfolio data
  const portfolioSummary = {
    totalValue: 77800,
    totalPL: 5988,
    holdings: 2,
    openPositions: 2
  };

  const holdings: PortfolioHolding[] = [
    {
      id: '1',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      addedDate: '03/09/2025',
      value: 54000,
      plPercent: 12.5,
      trades: 3,
      hasReviewPrompt: true
    },
    {
      id: '2',
      symbol: 'VERT',
      name: 'Vertiv Holdings',
      addedDate: '01/09/2025',
      value: 23800,
      plPercent: -3.2,
      trades: 5,
      hasReviewPrompt: true
    }
  ];

  const filteredHoldings = holdings.filter(holding => {
    if (activeFilter === 'gainers') return holding.plPercent > 0;
    if (activeFilter === 'losers') return holding.plPercent < 0;
    return true;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const handleDelete = (symbol: string) => {
    console.log('Delete:', symbol);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Page Title */}
          <h1 className="text-2xl text-gray-900 mb-6">My Portfolio</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <Card className="p-3 md:p-4 shadow-sm border-gray-200 bg-white">
              <div className="text-xs text-gray-500 mb-1">Total Value</div>
              <div className="text-xl md:text-2xl text-gray-900">{formatCurrency(portfolioSummary.totalValue)}</div>
            </Card>
            <Card className="p-3 md:p-4 shadow-sm border-gray-200 bg-white">
              <div className="text-xs text-gray-500 mb-1">Total P&L</div>
              <div className={`text-xl md:text-2xl ${portfolioSummary.totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(portfolioSummary.totalPL)}
              </div>
            </Card>
            <Card className="p-3 md:p-4 shadow-sm border-gray-200 bg-white hidden md:block">
              <div className="text-xs text-gray-500 mb-1">Holdings</div>
              <div className="text-2xl text-gray-900">{portfolioSummary.holdings}</div>
            </Card>
            <Card className="p-3 md:p-4 shadow-sm border-gray-200 bg-white hidden md:block">
              <div className="text-xs text-gray-500 mb-1">Open Positions</div>
              <div className="text-2xl text-gray-900">{portfolioSummary.openPositions}</div>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
                className={`h-8 px-3 md:px-4 text-xs rounded-lg ${
                  activeFilter === 'all'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All
              </Button>
              <Button
                variant={activeFilter === 'gainers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('gainers')}
                className={`h-8 px-3 md:px-4 text-xs rounded-lg ${
                  activeFilter === 'gainers'
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Gainers
              </Button>
              <Button
                variant={activeFilter === 'losers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('losers')}
                className={`h-8 px-3 md:px-4 text-xs rounded-lg ${
                  activeFilter === 'losers'
                    ? 'bg-gray-900 hover:bg-gray-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Losers
              </Button>
            </div>
            <div className="text-xs text-gray-500 hidden md:block">Sort by value ▼</div>
          </div>

          {/* Holdings List */}
          <div className="space-y-3">
            {filteredHoldings.map((holding) => (
              <Card key={holding.id} className="p-3 md:p-4 shadow-sm border-gray-200 bg-white">
                {/* Mobile Layout */}
                <div className="md:hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="h-6 px-2 text-xs bg-emerald-600 hover:bg-emerald-600 text-white">
                          ${holding.symbol}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-900 mb-0.5">{holding.name}</div>
                      <div className="text-xs text-gray-500">Added {holding.addedDate}</div>
                    </div>
                  </div>

                  {/* Mobile Metrics Row */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                    <div>
                      <div className="text-[10px] text-gray-500 mb-0.5">Value</div>
                      <div className="text-sm text-gray-900">{formatCurrency(holding.value)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500 mb-0.5">P&L</div>
                      <div className={`text-sm ${holding.plPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercent(holding.plPercent)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500 mb-0.5">Trades</div>
                      <div className="text-sm text-gray-900">{holding.trades}</div>
                    </div>
                  </div>

                  {holding.hasReviewPrompt && (
                    <div className="text-xs text-orange-600 mb-3">Review tips to add conclusion</div>
                  )}

                  {/* Mobile Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewStock(holding.symbol)}
                      className="flex-1 h-8 text-xs hover:bg-gray-50"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTradeJournal(holding.symbol)}
                      className="flex-1 h-8 text-xs hover:bg-gray-50"
                    >
                      Journal
                    </Button>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between">
                  {/* Left: Stock Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <Badge className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-600 text-white">
                      ${holding.symbol}
                    </Badge>
                    <div>
                      <div className="text-base text-gray-900 mb-0.5">{holding.name}</div>
                      <div className="text-xs text-gray-500">Added {holding.addedDate}</div>
                      {holding.hasReviewPrompt && (
                        <div className="text-xs text-orange-600 mt-0.5">Review tips to add conclusion</div>
                      )}
                    </div>
                  </div>

                  {/* Center: Metrics */}
                  <div className="flex items-center gap-8 mr-8">
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500 mb-0.5">Value</div>
                      <div className="text-base text-gray-900">{formatCurrency(holding.value)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500 mb-0.5">P&L</div>
                      <div className={`text-base ${holding.plPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercent(holding.plPercent)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500 mb-0.5">Trades</div>
                      <div className="text-base text-gray-900">{holding.trades}</div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewStock(holding.symbol)}
                      className="h-8 px-4 text-xs hover:bg-gray-50"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTradeJournal(holding.symbol)}
                      className="h-8 px-4 text-xs hover:bg-gray-50"
                    >
                      Trade Journal
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(holding.symbol)}
                      className="h-8 px-4 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredHoldings.length === 0 && (
            <Card className="p-8 shadow-sm border-gray-200 bg-white">
              <div className="text-center text-sm text-gray-500">
                No {activeFilter === 'all' ? 'holdings' : activeFilter} found
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};