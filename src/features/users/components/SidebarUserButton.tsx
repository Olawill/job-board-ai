import { auth } from '@clerk/nextjs/server'
import { Suspense } from 'react'
import { SidebarUserButtonClient } from './_SidebarUserButtonClient'

export const SidebarUserButton = () => {
    return (
        <Suspense>
            <SidebarUserSuspense />     
        </Suspense>
    )
}

const SidebarUserSuspense = async () => {
    const {userId} = await auth()
    
    return <SidebarUserButtonClient user={{id: userId as string, email: "test@example.com", name: "Test Tester", imageUrl: ""}} />
}
