// third party libraries
import TinderCard from "react-tinder-card"

export const TinderCards = ({data}) => {

    return (
        <>
            {/* tinder cards container */}
            <div className="h-[90vh] flex justify-center items-center ">
                
          
                {data.map((image, index) => {
                    return (
                        
                       <TinderCard
                       key={image.name}
                       className="swipe absolute ">
                         <div style={{ backgroundImage: 'url(' + image.url + ')' }} className='relative h-96 w-96 shadow-xl rounded-lg bg-cover bg-center'>
                            <h3>{image.name}</h3>
                        </div>
                       </TinderCard>
                    )
                })}
            </div>
        </>
    )
}