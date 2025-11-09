import React, { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useGlobalSearch } from '@/hooks/use-global-search';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Zap, Users, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

const iconMap = {
  Expense: DollarSign,
  Income: TrendingUp,
  Bill: Zap,
  Family: Users,
};

interface GlobalSearchProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, setOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data: results, isLoading } = useGlobalSearch(debouncedSearchTerm);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const handleSelect = (url: string) => {
    navigate(url);
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search expenses, income, bills..."
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        {isLoading && debouncedSearchTerm.length > 1 && (
          <div className="p-4 flex justify-center items-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        {!isLoading && !results?.length && debouncedSearchTerm.length > 1 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {results && results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((result) => {
              const Icon = iconMap[result.type];
              return (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => handleSelect(result.url)}
                  value={`${result.title} ${result.description}`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{result.title}</span>
                  <span className="text-xs text-muted-foreground ml-2 truncate">{result.description}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};