// hooks
import { useNavigate } from "react-router-dom"
import { useState, useContext, useEffect } from "react"

// contexts
import { UserInfoContext } from "../context/UserInfoContext"

// components
import { NextButtonComponent } from "../components/NextButtonComponent"
import { DangerButton } from "../components/DangerButton"
// interest list
import interestsData from '../interests.json'

// firebase/firestore
import { db } from "../config/firebase"
import { collection, addDoc } from "firebase/firestore"


export const EnterInterestsPage = () => {

    // collection ref to users when creating a new user
    const usersCollectionRef = collection(db, "users")

    const [interestAmount, setInterestAmount] = useState(0)

    const [userInterest, setUserInterestList] = useState([])
    const [interestList, setInterestList] = useState(interestsData.interests)
    const [toggle, setToggle] = useState(false)
    const { userInfo, setUserInfo } = useContext(UserInfoContext)

    
    const handleCheckedInterest = (event) => {
        const selectedInterest = {
            name: event.target.name,
            id: event.target.id,
            isChecked: event.target.checked
        }
        
       
        
        

        // only allow user to check if interest amount is less than 5 or equal to 5
        if(event.target.checked && !userInterest.some((interest) => interest.id === selectedInterest.id)){
            if (interestAmount < 5) {

                
                // get the selected interest id from the interestList and see if it matches with the selectedInterest id
                const afterChecking = interestList.map((interest) => {
                    if (interest.name === event.target.name){
                        interest.isChecked = !interest.isChecked
                        // console.log(interestList, 'interest list after checking')
                        // console.log('selected interst id ', event.target.id, 'interest list id', interest.id)
                       
                    }
    
                    return interest
                })
                setInterestList(afterChecking)
               
                setInterestAmount((prevState) => prevState + 1)
                setUserInterestList((prevList) => [...prevList, selectedInterest])
                 // change the JSON array to checked when event is clicked to checked
                

            } else {
              
              
                // interest amount is 5 or higher, make the other interests that have isChecked set to false, be disabled
                
            }
                
            
        } else {
            // only get the ones that does not match with the selected interest (current checked interest) to remove unchecked elements
            setUserInterestList((prevList) => prevList.filter((interest) => interest.id !== selectedInterest.id));
            setInterestAmount((prevState) => prevState - 1)

            // interest amount is 5 or higher, make the other interests that have isChecked set to false, be disabled
            // get the selected interest id from the interestList and see if it matches with the selectedInterest id
            const afterChecking = interestList.map((interest) => {
                if (interest.name === event.target.name){
                    interest.isChecked = !interest.isChecked
                    // console.log(interestList, 'interest list after checking')
                    // console.log('selected interst id ', event.target.id, 'interest list id', interest.id)
                    console.log(interestList, ' interest list')
                }

                return interest
            })
            setInterestList(afterChecking)



        }
    }
    
    const handleCreateUser = async () => {
        try {
           
            await addDoc(usersCollectionRef, {
                ...userInfo,
                interests: userInterest
                
            })
        } catch (error) {
            console.log(error, 'error message')
        }
    }

    const handleToggleButton = () => {
      setToggle((prevState) => !prevState);
    };


    const handleTest = () => {
      if (interestAmount >= 5) {
        setToggle(true);
        // Hide the div containing the DangerButton after 2 seconds
        setTimeout(() => {
          setToggle(false);
        }, 3000);
      } else {
        setToggle(false);
      }
    };

    

    console.log(interestAmount, 'interest amount')
  
   
   
    return (
        <>
        {/* alert */}
        
        <div className={toggle ? "px-4" : "hidden"}>

         <DangerButton onClick={handleToggleButton}/>
        </div>
          <div className="flex items-center justify-center px-4 my-4">
            <div className="flex flex-col w-full gap-y-10">
              <div>
                <h1 className="font-bold text-4xl mb-4">Choose up to 5 interests</h1>
                <ul className={`flex flex-wrap gap-y-6 gap-x-2`}>
                  {interestList.map((interest) => (
                    <li key={interest.id} className="">
                      <input
                        type="checkbox"
                        id={interest.id}
                        name={interest.name}
                        onChange={handleCheckedInterest}
                        disabled={!interest.isChecked && interestAmount >= 5}
                  
                       
                       
                      />
                      <label htmlFor={interest.id} className={`py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 text-center`}  onClick={handleTest}>{interest.name}</label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <button
                  className="bg-gradient-to-t from-electric-pink to-fiery-rose rounded-full hover:from-pink-700 hover:to-rose-500 text-white text-center font-bold py-3 px-4 w-full"
                  onClick={handleCreateUser}
                >
                  Create User
                </button>
                
              </div>
            </div>
            
          
          </div>


         
         
        </>
      );
}