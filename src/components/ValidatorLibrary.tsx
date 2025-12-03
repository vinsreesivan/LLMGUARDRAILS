import React, { useState, useMemo } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { VALIDATOR_TEMPLATES, VALIDATOR_CATEGORIES, USE_CASES, ValidatorTemplate } from '@/data/validatorTemplates';
import { Search, Filter, CheckCircle2, Circle } from 'lucide-react';

interface ValidatorLibraryProps {
  selectedValidators: string[];
  onToggleValidator: (validatorId: string) => void;
  onSelectAll: (category: string) => void;
  onClearAll: () => void;
}

export const ValidatorLibrary: React.FC<ValidatorLibraryProps> = ({
  selectedValidators,
  onToggleValidator,
  onSelectAll,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredValidators = useMemo(() => {
    return VALIDATOR_TEMPLATES.filter((validator) => {
      const matchesSearch =
        searchQuery === '' ||
        validator.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        validator.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        validator.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || validator.category === selectedCategory;

      const matchesUseCase =
        selectedUseCase === 'all' ||
        validator.useCases.includes(selectedUseCase);

      return matchesSearch && matchesCategory && matchesUseCase;
    });
  }, [searchQuery, selectedCategory, selectedUseCase]);

  const groupedValidators = useMemo(() => {
    const grouped: Record<string, ValidatorTemplate[]> = {};
    filteredValidators.forEach((validator) => {
      if (!grouped[validator.category]) {
        grouped[validator.category] = [];
      }
      grouped[validator.category].push(validator);
    });
    return grouped;
  }, [filteredValidators]);

  const selectedCount = selectedValidators.length;
  const totalCount = VALIDATOR_TEMPLATES.length;

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Validator Library
          </h3>
          <p className="text-sm text-gray-600">
            {selectedCount} of {totalCount} validators selected
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button size="sm" variant="outline" onClick={onClearAll}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search validators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {VALIDATOR_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use Case
              </label>
              <select
                value={selectedUseCase}
                onChange={(e) => setSelectedUseCase(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Use Cases</option>
                {USE_CASES.map((useCase) => (
                  <option key={useCase.id} value={useCase.id}>
                    {useCase.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Validators by Category */}
      <div className="space-y-6">
        {VALIDATOR_CATEGORIES.map((category) => {
          const categoryValidators = groupedValidators[category.id] || [];
          if (categoryValidators.length === 0) return null;

          const categorySelectedCount = categoryValidators.filter((v) =>
            selectedValidators.includes(v.id)
          ).length;

          return (
            <Card
              key={category.id}
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-sm text-gray-500">
                      ({categorySelectedCount}/{categoryValidators.length})
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelectAll(category.id)}
                  >
                    Select All
                  </Button>
                </div>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {categoryValidators.map((validator) => {
                  const isSelected = selectedValidators.includes(validator.id);
                  return (
                    <div
                      key={validator.id}
                      onClick={() => onToggleValidator(validator.id)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 bg-white hover:border-purple-300'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {validator.displayName}
                            </h4>
                            <span
                              className={`
                                text-xs px-2 py-0.5 rounded-full
                                ${
                                  validator.infrastructure === 'ML'
                                    ? 'bg-blue-100 text-blue-700'
                                    : validator.infrastructure === 'LLM'
                                    ? 'bg-purple-100 text-purple-700'
                                    : validator.infrastructure === 'Rule-based'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-orange-100 text-orange-700'
                                }
                              `}
                            >
                              {validator.infrastructure}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            {validator.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {validator.useCases.slice(0, 3).map((useCase) => (
                              <span
                                key={useCase}
                                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                              >
                                {useCase}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredValidators.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No validators found matching your criteria</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedUseCase('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
