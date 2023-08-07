// third party libraries
import { PulseLoader } from 'react-spinners'

// icons
import tinderWhiteLogo from '../assets/icons/tinderWhiteLogo.png'

export const LoadingComponent = () => {
    return (
        <div className='max-w-[500px] mx-auto flex flex-col items-center justify-center min-h-[100vh] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-electric-pink via-pastel-red to-fiery-rose    '>
            <div className='flex items-center gap-x-2'>
                <img src={tinderWhiteLogo} alt="tinder logo" className='w-[2.5rem] h-[2.5rem]'/>
                <h1 className="text-4xl font-bold text-white">tinder</h1>
            </div>
            <PulseLoader color="white" 
            size={10}
            margin={4}
            className='mt-4' />
           
        </div>
    )
}