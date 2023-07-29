// third party libraries
import TinderCard from "react-tinder-card"

// hooks
import { useEffect, useState } from "react"

export const TinderCards = ({data}) => {

     // when visibleCard is set to true, don't apply the hidden className, otherwise apply it
    const [ visibleCard, setVisibleCard ] = useState(true)
    const [ currentIndex, setCurrentIndex ] = useState(data.length - 1)
    const [ lastIndex, setLastIndex ] = useState(data.length)
    console.log(currentIndex)

    const [ cardsThatLeft, setCardsThatLeft ] = useState([]) 

    // when card leaves screen, add it to the array
    const cardLeavesScreen = (name, index) => {
        console.log(name, ' and index', index,  ' has left the screen')
        setCardsThatLeft([...cardsThatLeft, index])
      
    }

    // when a card leaves the screen, add it to the cardsThatLeft array
    // if one of the map indexes are inside the cardsThatLeft array, make it hidden
    useEffect(() => {
        console.log(cardsThatLeft, 'cards that left')
    }, [cardsThatLeft])

    
    return (
        <>
            {/* tinder cards container */}
            <div className="h-[90vh] flex justify-center items-center ">
                
          
                {data.map((image, index) => {
                    return (
                        
                       <TinderCard
                       key={image.name}
                       className={cardsThatLeft.includes(index) ? `hidden` : `absolute pressable`}
                       onCardLeftScreen={() => cardLeavesScreen(image.name, index)}>
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