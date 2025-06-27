import { Column } from "@tanstack/react-table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { cn } from "@/lib/utils";

interface DataTableFacetedFilterProps<TData, TValue, OValue> {
  column?: Column<TData, TValue>;
  title: string;
  disabled?: boolean;
  options: {
    label: React.ReactNode;
    value: OValue;
    key: React.Key;
  }[];
}

export const DataTableFacetedFilter = <TData, TValue, OValue>({
  column,
  title,
  disabled,
  options,
}: DataTableFacetedFilterProps<TData, TValue, OValue>) => {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as OValue[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={disabled} variant="outline" size="sm">
          {selectedValues.size > 0 && (
            <Badge variant="secondary" size="sm">
              {selectedValues.size}
            </Badge>
          )}
          {title}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((options) => {
                const isSelected = selectedValues.has(options.value);
                return (
                  <CommandItem
                    key={options.key}
                    className="cursor-pointer"
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(options.value);
                      } else {
                        selectedValues.add(options.value);
                      }
                      const filterValues = [...selectedValues];

                      column?.setFilterValue(
                        filterValues.length > 0 ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-3 rounded-[4px] border",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-input"
                      )}
                    >
                      <CheckIcon className="text-primary-foreground size-3.5" />
                    </div>
                    <span>{options.label}</span>
                    {facets?.get(options.value) && (
                      <span className="text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs">
                        {facets.get(options.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center cursor-pointer"
                  >
                    Clear
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
