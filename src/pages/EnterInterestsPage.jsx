// hooks
import { useNavigate } from "react-router-dom"
import { useState } from "react"

// components
import { NextButtonComponent } from "../components/NextButtonComponent"
// interest list
import interestsData from '../interests.json'

export const EnterInterestsPage = () => {

    const [interestAmount, setInterestAmount] = useState(0)
    const [userInterest, setUserInterestList] = useState([])
  
    const handleCheckedInterest = (event) => {
        const selectedInterest = {
            name: event.target.name,
            id: event.target.id
        }
        console.log(selectedInterest, 'selected interetst')
        if(event.target.checked && !userInterest.some((interest) => interest.id === selectedInterest.id)){
           
            setUserInterestList((prevList) => [...prevList, selectedInterest])
        } else {
            // only get the ones that does not match with the selected interest (current checked interest) to remove unchecked elements
            setUserInterestList((prevList) => prevList.filter((interest) => interest.id !== selectedInterest.id));

        }
    }
    console.log(userInterest, 'array user interest')
    const navigate = useNavigate()
    const [interestList] = useState(interestsData.interests)

    const nextPage = () => {
        navigate('/')
    }
    return (
        <>
       <div>
      
        <h1 className="font-bold text-4xl">Choose up to 5 interests</h1>
        <ul className="flex flex-col">
            {interestList.map((interest) => (
            <li key={interest.id}>
                <input type="checkbox" id={interest.id} name={interest.name}  onChange={handleCheckedInterest}/>
                <label for={interest.id}>{interest.name}</label>
         
            </li>
            ))}
        </ul>
               
        </div>
        

        <NextButtonComponent onClick={nextPage}/>

        </>
    )
}