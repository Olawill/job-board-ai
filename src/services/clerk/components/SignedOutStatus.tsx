import { SignedOut } from "@clerk/nextjs"
import { Suspense } from "react"


export const SignedOutStatus = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense>
            <SignedOut>
                {children}
            </SignedOut>
        </Suspense>
    )
}
