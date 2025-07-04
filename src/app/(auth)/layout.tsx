

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            {children}
        </div>
    )
}

export default AuthLayout
