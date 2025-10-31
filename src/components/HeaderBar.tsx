import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Menu } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Logo } from './Logo';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from './ui/dialog';

type Segment = 'stock' | 'sector';

interface Entity {
  segment: Segment;
  value: string;
  label: string;
}

// Mock data for autocomplete
const autocompleteData: Record<Segment, string[]> = {
  stock: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX', 'JPM', 'V', 'WMT', 'DIS'],
  sector: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'AI', 'Crypto', 'Manufacturing', 'Retail', 'Industrial']
};

interface HeaderBarProps {
  onPortfolioClick?: () => void;
  onAboutClick?: () => void;
  onAuthClick?: () => void;
  onLogoClick?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ onPortfolioClick, onAboutClick, onAuthClick, onLogoClick }) => {
  const [selectedSegment, setSelectedSegment] = useState<Segment>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on search query
  const suggestions = searchQuery
    ? autocompleteData[selectedSegment]
        .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 8)
    : autocompleteData[selectedSegment].slice(0, 8);

  // Handle segment change
  const handleSegmentChange = (segment: Segment) => {
    setSelectedSegment(segment);
    setSearchQuery('');
    setShowSuggestions(false);
    setHighlightedIndex(0);
  };

  // Handle entity selection
  const handleSelectEntity = (value: string) => {
    setSelectedEntity({
      segment: selectedSegment,
      value,
      label: value
    });
    setSearchQuery('');
    setShowSuggestions(false);
    setHighlightedIndex(0);
  };

  // Clear entity
  const handleClearEntity = () => {
    setSelectedEntity(null);
    setSearchQuery('');
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setShowSuggestions(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[highlightedIndex]) {
          handleSelectEntity(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSearchQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get context display
  const getContextDisplay = () => {
    if (selectedEntity) {
      return `${selectedEntity.segment.charAt(0).toUpperCase() + selectedEntity.segment.slice(1)} • ${selectedEntity.label}`;
    }
    return null;
  };

  const contextDisplay = getContextDisplay();

  return (
    <div className="bg-white border-b border-[#e5e7eb]">
      {/* Desktop: Single row layout */}
      <div className="hidden sm:flex px-4 py-2.5 items-center gap-2">
        {/* Left: Logo */}
        <div className="mr-2">
          <Logo onClick={onLogoClick} />
        </div>

        {/* Segmented Control */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
          {(['stock', 'sector'] as const).map((segment) => (
            <button
              key={segment}
              onClick={() => handleSegmentChange(segment)}
              className={`
                px-3 py-1 text-xs rounded-lg transition-colors
                ${selectedSegment === segment
                  ? 'bg-green-600 text-white'
                  : 'text-[#6b7280] hover:text-[#111827]'
                }
              `}
              style={{ minWidth: '60px' }}
            >
              <span className={selectedSegment === segment ? 'font-medium' : ''}>
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Center: Autocomplete Input */}
        <div className="flex-1 max-w-md relative min-w-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                setHighlightedIndex(0);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder={`Search ${selectedSegment}...`}
              className="pl-8 h-8 text-xs bg-gray-50 border-gray-200 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 w-full"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg z-50 overflow-hidden"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  onClick={() => handleSelectEntity(suggestion)}
                  className={`
                    px-3 py-2 text-xs cursor-pointer transition-colors
                    ${index === highlightedIndex 
                      ? 'bg-red-50 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Context Pill (if active) */}
        {contextDisplay && (
          <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5">
            <span className="text-xs text-gray-700">{contextDisplay}</span>
            <button
              onClick={handleClearEntity}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear context"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Right: My Portfolio, About, and Auth Links */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPortfolioClick}
            className="px-4 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap text-[#6b7280] hover:text-[#111827]"
          >
            My Portfolio
          </button>
          <button
            onClick={onAboutClick}
            className="px-4 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap text-[#6b7280] hover:text-[#111827]"
          >
            About
          </button>
          <button
            onClick={onAuthClick}
            className="px-4 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap text-[#6b7280] hover:text-[#111827]"
          >
            Log In / Sign Up
          </button>
        </div>
      </div>

      {/* Mobile: Multi-row layout */}
      <div className="sm:hidden">
        {/* Row 1: Hamburger, Logo, Action Icons */}
        <div className="px-3 py-2.5 flex items-center justify-between gap-2">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-2">
            <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DialogTrigger asChild>
                <button
                  className="p-2 rounded-lg border transition-all bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  aria-label="Open menu"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <Menu className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[340px] p-0 gap-0 rounded-lg overflow-hidden border-gray-200">
                {/* Green accent bar at top */}
                <div className="h-1 bg-green-600" />
                
                {/* Accessible title (visually hidden) */}
                <DialogTitle className="sr-only">Navigation Menu</DialogTitle>
                <DialogDescription className="sr-only">
                  Access portfolio, about page, and authentication options
                </DialogDescription>
                
                {/* Menu content */}
                <div className="p-6">
                  <h2 className="text-center mb-6 text-gray-900">Menu</h2>
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        onPortfolioClick?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-200 transition-colors bg-white text-gray-700 hover:border-green-600 hover:bg-green-50 hover:text-gray-900"
                    >
                      My Portfolio
                    </button>
                    <button
                      onClick={() => {
                        onAboutClick?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-200 transition-colors bg-white text-gray-700 hover:border-green-600 hover:bg-green-50 hover:text-gray-900"
                    >
                      About
                    </button>
                    <button
                      onClick={() => {
                        onAuthClick?.();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-5 py-3.5 text-sm rounded-lg border border-gray-200 transition-colors bg-white text-gray-700 hover:border-green-600 hover:bg-green-50 hover:text-gray-900"
                    >
                      Log In / Sign Up
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Logo onClick={onLogoClick} />
          </div>

          {/* Right: Context Pill (if active) */}
          {contextDisplay && (
            <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1.5">
              <span className="text-xs text-gray-700">{contextDisplay}</span>
              <button
                onClick={handleClearEntity}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear context"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Row 2: Stock/Sector Selector + Search Field */}
        <div className="px-3 pb-2 flex items-start gap-2 relative">
          {/* Stock/Sector Pills */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {(['stock', 'sector'] as const).map((segment) => (
              <button
                key={segment}
                onClick={() => handleSegmentChange(segment)}
                className={`
                  px-3 py-2 text-xs rounded-lg transition-colors border
                  ${selectedSegment === segment
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-gray-100 text-[#6b7280] border-gray-200 hover:text-[#111827] hover:border-gray-300'
                  }
                `}
                style={{ minHeight: '44px' }}
              >
                <span className={selectedSegment === segment ? 'font-medium' : ''}>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </span>
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="flex-1 min-w-0 relative">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none z-10" />
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  setHighlightedIndex(0);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder={`Search ${selectedSegment}...`}
                className="pl-8 h-10 text-xs bg-gray-50 border-gray-200 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 w-full"
                style={{ minHeight: '44px' }}
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg z-50 overflow-hidden"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    onClick={() => handleSelectEntity(suggestion)}
                    className={`
                      px-3 py-2.5 text-xs cursor-pointer transition-colors
                      ${index === highlightedIndex 
                        ? 'bg-red-50 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    style={{ minHeight: '44px' }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};