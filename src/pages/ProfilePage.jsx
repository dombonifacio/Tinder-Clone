// components
import { NavbarComponent } from "../components/NavbarComponent"

// icons
import logo from '../assets/icons/logo.svg'
import { IoIosSettings } from 'react-icons/io'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// third party libraries
import { signOut } from "firebase/auth"

import { auth } from "../config/firebase"


export const ProfilePage = () => {

    const [settingsShown, setSettingsShown] = useState(false)
    console.log('auth user', auth)
    const navigate = useNavigate()
    
    return (
        <>
           {!settingsShown ? (
                 <div className="p-4 flex flex-col gap-y-16">
               
                 <div className="flex items-center justify-between">
                     {/* tinder logo */}
                     <div className="flex">
 
                         <img src={logo} className='w-[2rem] h-[2rem]'/>
                         <h1 className="text-2xl font-bold bg-gradient-to-t from-electric-pink to-fiery-rose text-transparent bg-clip-text">tinder</h1>
                     </div>
                     {/* settings button */}
                     <button onClick={() => setSettingsShown(prevState => !prevState)}>
 
                         <IoIosSettings size={"2rem"}/>
                     </button>
                 </div>
 
                 {/* profile section */}
                 <div className="flex justify-center">
                     <p>
                         Name, 
                     </p>
                     <p> Age</p>
                 </div>
                     
         
 
                 <div className="flex justify-center">
 
                     <NavbarComponent />
                 </div>
                 
             </div>
           ) 
        :
            (
                
                <>
                    <h1>Settings is shown.</h1>
                    <button onClick={() => setSettingsShown(prevState => !prevState)}>
 
                         <IoIosSettings size={"2rem"}/>
                    </button>
                    <button onClick={handleLogout}>
                        <div className="text-red">
                            Log out
                        </div>
                    </button>
                </>
            )
        }
        </>
    )
}