// third party libraries
import { PulseLoader } from 'react-spinners'



//components
import { WhiteLogoComponent } from './WhiteLogoComponent'

export const LoadingComponent = () => {
    return (
        <div className='max-w-[500px] w-screen mx-auto flex flex-col items-center justify-center min-h-[100vh] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-electric-pink via-pastel-red to-fiery-rose    '>
            <WhiteLogoComponent />
            <PulseLoader color="white" 
            size={10}
            margin={4}
            className='mt-4' />
           
        </div>
    )
}