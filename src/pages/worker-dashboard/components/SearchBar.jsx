import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, placeholder = "Search assignments by title, company, or location..." }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e?.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name="Search" size={20} color="var(--color-muted-foreground)" />
        </div>
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="pl-12 pr-24"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
          >
            <Icon name="X" size={16} color="var(--color-muted-foreground)" />
          </button>
        )}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button type="submit" size="sm" iconName="Search" iconPosition="left">
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;