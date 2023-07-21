
// logos
import logo from '../assets/icons/logo.svg'

// icons
import { BsFillPersonFill } from 'react-icons/bs'


export const NavbarComponent = () =>{
    return (
        <div className='flex items-center justify-center gap-x-5 fixed bottom-0'>
            <button>

                <img src={logo} className='w-[2rem] h-[2rem]'/>
            </button>
            <button>

                <BsFillPersonFill size={"2rem"}/>
            </button>
        </div>
    )
} 