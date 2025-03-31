'use client';

import React, { useState, useCallback } from 'react';
import { SearchIcon } from 'lucide-react';
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

export function Search({ className }: { className?: string }) {
    const [search, setSearch] = useState('');
    const router = useRouter();
    const t = useTranslations('search');

    const handleSearch = useCallback(() => {
        if (search.trim()) {
            router.push(`/tools/${encodeURIComponent(search.trim())}`);
        }
    }, [search, router]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'Return') {
            handleSearch();
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <Command className={cn("rounded-lg border shadow-md w-full", className)}>
                <CommandInput 
                    placeholder={t('input_placeholder')} 
                    value={search} 
                    onValueChange={setSearch}
                    onKeyDown={handleKeyDown}
                />
                <CommandList className="hidden">
                    <CommandEmpty></CommandEmpty>
                </CommandList>
            </Command>
            {search.trim() &&
                <Button 
                    variant="outline" 
                    className='mt-6' 
                    onClick={handleSearch}
                >
                    <SearchIcon size={16} className='mr-2 opacity-80' />
                    {t('button')}
                </Button>
            }
        </div>
    )
}
