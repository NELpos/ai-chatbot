import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { UserRoundCheck, Wand } from "lucide-react";

interface DataTableToolbarButtonActionProps {
  data: any[];
  title?: string;
  options: {
    label: string;
    value: string;
  }[];
}

const DataTableToolbarButtonAction: React.FC<
  DataTableToolbarButtonActionProps
> = ({ data, title, options }) => {
  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);
  const handleSelectItem = (item: any) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(item)) {
        return prevSelected.filter((i) => i !== item);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleActionButtonClick = () => {
    // Perform action with selectedItems
    console.log("Selected items:", selectedItems);
    // Add your action logic here
  };

  return (
    <div>
      {/* Render your table here */}
      {/* {data.map((item) => (
        <div key={item.id}>
          <input
            type="checkbox"
            checked={selectedItems.includes(item)}
            onChange={() => handleSelectItem(item)}
          />
          {item.name}
        </div>
      ))} */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            onClick={handleActionButtonClick}
            disabled={data.length === 0}
            variant="outline"
            size="sm"
            className="h-8 border-dashed"
          >
            <Wand />
            {title}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Command>
            <CommandInput placeholder="Search status..." />
            <CommandList>
              <CommandEmpty>No status found</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option.value}>{option.label}</CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DataTableToolbarButtonAction;
