import tinderWhiteLogo from '../assets/icons/tinderWhiteLogo.png'

export const WhiteLogoComponent = () => {
    return (
        <div className='flex items-center gap-x-1'>
        <img src={tinderWhiteLogo} alt="tinder logo" className='w-[2.5rem] h-[2.5rem]'/>
        <h1 className="text-4xl font-bold text-white">tinder</h1>
        </div>
    )
}