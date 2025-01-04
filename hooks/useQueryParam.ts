"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export default function useQueryParam(name: string): [string|null, (value: string) => void] {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const createQueryString = useCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value);
    
        return params.toString();
    }, [searchParams]);

    const queryParam = useMemo(() => {
        return searchParams.get(name);
    }, [searchParams]);

    const setQueryParam = (value: string) => {
        router.push(pathname + '?' + createQueryString(value));
    };

    return [queryParam, setQueryParam];
}