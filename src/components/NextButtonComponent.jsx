export const NextButtonComponent = ({onClick}) => {
    return (
        <>
            <button class="bg-gradient-to-t from-electric-pink  to-fiery-rose rounded-full hover:from-pink-700 hover:to-rose-500  text-white font-bold py-3 px-4  w-full" onClick={onClick}>
                Next
            </button>
        </>
    )
}