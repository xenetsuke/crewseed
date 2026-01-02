import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, resultCount, onSortChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    'Electrician in Brooklyn',
    'Construction worker',
    'Plumber near me'
  ]);
  const [suggestions] = useState([
    'Electrician',
    'Plumber',
    'Carpenter',
    'Welder',
    'HVAC Technician',
    'Painter',
    'Construction Supervisor',
    'Heavy Equipment Operator'
  ]);
  const [sortBy, setSortBy] = useState('best-match');
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    };

    document?.addEventListener('mousedown', handleClickOutside);
    return () => document?.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()?.length >= 2) {
      // Add to history if not already present
      if (!searchHistory?.includes(searchQuery)) {
        setSearchHistory([searchQuery, ...searchHistory?.slice(0, 9)]);
      }
      if (onSearch) {
        onSearch(searchQuery);
      }
      setShowSuggestions(false);
      setShowHistory(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    
    if (value?.length >= 2) {
      setShowSuggestions(true);
      setShowHistory(false);
    } else if (value?.length === 0) {
      setShowHistory(true);
      setShowSuggestions(false);
    } else {
      setShowSuggestions(false);
      setShowHistory(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  const handleHistoryClick = (historyItem) => {
    setSearchQuery(historyItem);
    setShowHistory(false);
    if (onSearch) {
      onSearch(historyItem);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    setShowHistory(true);
    if (onSearch) {
      onSearch('');
    }
  };

  const handleVoiceSearch = () => {
    // Voice search functionality placeholder
    console.log('Voice search activated');
  };

  const handleSortChange = (e) => {
    const value = e?.target?.value;
    setSortBy(value);
    if (onSortChange) {
      onSortChange(value);
    }
  };

  const filteredSuggestions = suggestions?.filter((s) =>
    s?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="card p-6 mb-6">
      <form onSubmit={handleSearch}>
        <div className="flex gap-2 mb-4" ref={searchRef}>
          <div className="flex-1 relative">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Icon name="Search" size={20} color="var(--color-muted-foreground)" />
              </div>
              <Input
                type="text"
                placeholder="Search by role, skill or city..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => {
                  if (searchQuery?.length === 0) {
                    setShowHistory(true);
                  } else if (searchQuery?.length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
                className="pl-10 pr-20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Icon name="X" size={16} color="var(--color-muted-foreground)" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                  title="Voice search"
                >
                  <Icon name="Mic" size={16} color="var(--color-muted-foreground)" />
                </button>
              </div>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions?.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-3 py-2">Suggestions</p>
                  {filteredSuggestions?.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Icon name="Search" size={14} color="var(--color-muted-foreground)" />
                      <span className="text-sm">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search History Dropdown */}
            {showHistory && searchHistory?.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-xs text-muted-foreground">Recent searches</p>
                    <button
                      type="button"
                      onClick={() => setSearchHistory([])}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  {searchHistory?.map((historyItem, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleHistoryClick(historyItem)}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Icon name="History" size={14} color="var(--color-muted-foreground)" />
                      <span className="text-sm">{historyItem}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button type="submit" iconName="Search" iconPosition="left">
            Search
          </Button>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsAdvanced(!isAdvanced)}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Icon name={isAdvanced ? 'ChevronUp' : 'ChevronDown'} size={16} />
              Advanced Filters
            </button>
            {resultCount > 0 && (
              <span className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{resultCount}</span> workers
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select 
              value={sortBy}
              onChange={handleSortChange}
              className="text-sm border border-input rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="best-match">Best Match</option>
              <option value="nearest">Nearest Location</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="most-experienced">Most Experienced</option>
              <option value="recently-active">Recently Active</option>
              <option value="lowest-wage">Lowest Wage Expectation</option>
            </select>
          </div>
        </div>

        {isAdvanced && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                label="Job Category"
                placeholder="e.g., Construction, Manufacturing"
              />
              <Input
                type="text"
                label="Minimum Experience (years)"
                placeholder="e.g., 3"
              />
              <Input
                type="text"
                label="Maximum Distance (km)"
                placeholder="e.g., 25"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;