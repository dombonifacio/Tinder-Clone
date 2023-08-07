export const LoginButtonComponent = ({message, icon, onClick}) => {
    return (
        <>
            <button className="text-center justify-center gap-x-2 bg-white text-fiery-rose rounded-full font-bold py-3 px-4 w-full flex items-center hover:bg-rose-600 hover:text-white" onClick={onClick}>
           

                {icon}
                {message}
                

            </button>
        </>
    )
}