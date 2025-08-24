
interface NavbarProps {
    signIn: () => void;
    signOut: () => void;
    isLoggedIn: boolean;
}

export function Navbar({ isLoggedIn, signIn, signOut }: NavbarProps) {
    return (
        <div className='ui:p-1'>
            <nav className='ui:flex ui:justify-between ui:items-center ui:bg-gray-900 ui:text-white ui:p-4'>
                <div>
                    <a href='#' className='ui:text-2xl ui:font-bold'>
                        PayTM
                    </a>
                </div>
                <div className='ui:flex ui:items-center'>
                    {!isLoggedIn && (
                        <>
                            <button className='ui:bg-blue-500 ui:text-white ui:px-4 ui:py-2 ui:rounded-md'
                                onClick={signIn}>
                                Sign In
                            </button>
                        </>
                    )}
                    {isLoggedIn && (
                        <button className='ui:bg-blue-500 ui:text-white ui:px-4 ui:py-2 ui:rounded-md'
                            onClick={signOut}>
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        </div>
    );
}