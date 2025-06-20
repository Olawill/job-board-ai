import { SignedIn } from "@clerk/nextjs"
import { Suspense } from "react"


export const SignedInStatus = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense>
            <SignedIn>
                {children}
            </SignedIn>
        </Suspense>
    )
}
