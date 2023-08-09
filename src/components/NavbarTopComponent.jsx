// icons
import logo from '../assets/icons/logo.svg'
import { AiTwotoneSetting } from 'react-icons/ai' 

// react
import { useContext, useState } from 'react'
// contexts
import { ShowSettingsContext } from '../context/ShowSettingsContext'
import { useNavigate } from 'react-router-dom'
export const NavbarTopComponent = () => {
    const { showSettings, setShowSettings } = useContext(ShowSettingsContext)
    const navigate = useNavigate()
    const handleNavigateHomePage = () => {
        navigate('/')
    }
    return (
        <div className='max-w-[500px] px-5 py-2 sm:px-0 flex justify-between items-center'>
            <div>
                
                <button className='flex' onClick={handleNavigateHomePage}>

                    <img src={logo} className='w-[2rem] h-[2rem]'/>
                    <p className="text-2xl font-bold bg-gradient-to-t from-electric-pink to-fiery-rose text-transparent bg-clip-text">tinder</p>
                </button>
            </div>
            <div>
                <button onClick={() => setShowSettings((prevState) => !prevState)}>
                    <AiTwotoneSetting color='grey' size={"1.8rem"}/>
                </button>
            </div>           
        </div>
    )
}