import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import { Checkbox } from './Checkbox';

const FilterPanel = ({
  filters = [],
  onFilterChange,
  resultCount = 0,
  onClearFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  useEffect(() => {
    const initialValues = {};
    filters?.forEach((filter) => {
      if (filter?.type === 'checkbox') {
        initialValues[filter.id] = [];
      } else {
        initialValues[filter.id] = '';
      }
    });
    setFilterValues(initialValues);
  }, [filters]);

  const handleFilterChange = (filterId, value) => {
    const newValues = { ...filterValues, [filterId]: value };
    setFilterValues(newValues);
    if (onFilterChange) {
      onFilterChange(newValues);
    }
  };

  const handleCheckboxChange = (filterId, optionValue, checked) => {
    const currentValues = filterValues?.[filterId] || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues?.filter((v) => v !== optionValue);

    handleFilterChange(filterId, newValues);
  };

  const handleClearAll = () => {
    const clearedValues = {};
    filters?.forEach((filter) => {
      if (filter?.type === 'checkbox') {
        clearedValues[filter.id] = [];
      } else {
        clearedValues[filter.id] = '';
      }
    });
    setFilterValues(clearedValues);
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const renderFilter = (filter) => {
    switch (filter?.type) {
      case 'text':
        return (
          <Input
            type="text"
            label={filter?.label}
            placeholder={filter?.placeholder}
            value={filterValues?.[filter?.id] || ''}
            onChange={(e) => handleFilterChange(filter?.id, e?.target?.value)}
          />
        );

      case 'select':
        return (
          <Select
            label={filter?.label}
            options={filter?.options}
            value={filterValues?.[filter?.id] || ''}
            onChange={(value) => handleFilterChange(filter?.id, value)}
            placeholder={filter?.placeholder}
          />
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">{filter?.label}</label>
            {filter?.options?.map((option) => (
              <Checkbox
                key={option?.value}
                label={option?.label}
                checked={(filterValues?.[filter?.id] || [])?.includes(option?.value)}
                onChange={(e) =>
                  handleCheckboxChange(filter?.id, option?.value, e?.target?.checked)
                }
              />
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">{filter?.label}</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filterValues?.[`${filter?.id}_min`] || ''}
                onChange={(e) =>
                  handleFilterChange(`${filter?.id}_min`, e?.target?.value)
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={filterValues?.[`${filter?.id}_max`] || ''}
                onChange={(e) =>
                  handleFilterChange(`${filter?.id}_max`, e?.target?.value)
                }
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          fullWidth
          iconName="Filter"
          iconPosition="left"
          onClick={() => setIsOpen(!isOpen)}
        >
          Filters {resultCount > 0 && `(${resultCount} results)`}
        </Button>
      </div>
      <div
        className={`
          fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto
          bg-background lg:bg-transparent
          ${isOpen ? 'block' : 'hidden lg:block'}
        `}
      >
        <div className="h-full lg:h-auto overflow-y-auto lg:overflow-visible p-4 lg:p-0">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Icon name="Filter" size={20} />
                <h3 className="text-lg font-semibold">Filters</h3>
                {resultCount > 0 && (
                  <span className="badge badge-primary">{resultCount}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  iconName="X"
                  iconPosition="left"
                >
                  Clear
                </Button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden p-2 hover:bg-muted rounded-lg"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {filters?.map((filter) => (
                <div key={filter?.id}>{renderFilter(filter)}</div>
              ))}
            </div>

            <div className="lg:hidden mt-6 pt-6 border-t border-border">
              <Button
                variant="default"
                fullWidth
                onClick={() => setIsOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FilterPanel;