"use client";

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
import { useStoreModal } from "@/hooks/useStoreModal";
import { cn } from "@/lib/utils";
import { Store } from "@prisma/client";
import {
  CheckIcon,
  ChevronsUpDown,
  PlusCircleIcon,
  StoreIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, useState } from "react";

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface Props extends PopoverTriggerProps {
  store: Store[];
}

export default function StoreSwitcher({ className, store = [] }: Props) {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const formattedStores = store.map((store) => ({
    label: store.name,
    value: store.id,
  }));

  const currentStore = formattedStores.find(
    (store) => store.value === params.storeId
  );

  const switchStore = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select store"
          className={cn("w-[200px] justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label || "Current Store"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedStores.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => switchStore(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Create New Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
