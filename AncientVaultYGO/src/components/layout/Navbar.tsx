import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
        <header className='fixed top-0 z-50 h-16 w-full bg-gray-300 backdrop-blur border-2 border-orange-500'>
            <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
                <span className='font-bold tracking-wide'>
                    AncientVault YGO
                </span>

                <div className='flex gap-2'>
                    <Link to="/login">
                        <Button variant="ghost">Iniciar sesión</Button>
                    </Link>

                    <Link to="/register">
                        <Button className='bg-orange-500 text-black hover:bg-orange-300'>
                            Crear cuenta
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
