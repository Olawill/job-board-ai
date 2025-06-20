"use client"

import {dark} from "@clerk/themes"
import {ClerkProvider as OriginalClerkProvider} from '@clerk/nextjs'

import { useIsDarkMode } from '@/hooks/useIsDarkMode'
import { Suspense } from "react"

export const ClerkProvider = ({ children }: { children: React.ReactNode }) => {
    const isDarkMode = useIsDarkMode()

    return (
        <Suspense>
            <OriginalClerkProvider appearance={isDarkMode ? {baseTheme: [dark]}: undefined}>
                {children}
            </OriginalClerkProvider>
        </Suspense>
    )
}
