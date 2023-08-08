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
import { collection, addDoc, doc, setDoc } from "firebase/firestore"
import { auth } from "../config/firebase"

import { NavbarComponent } from "../components/NavbarBotComponent"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { UserExistContext } from "../context/UserExistContext"
import { UserSignedUpContext } from "../context/UserSignedUpContext"



export const EnterInterestsPage = () => {

    const uid = auth.currentUser?.uid
    // collection ref to users when creating a new user
    const usersDocRef = doc(db, "users", uid)

    const [interestAmount, setInterestAmount] = useState(0)

    const [userInterest, setUserInterestList] = useState([])
    const [interestList, setInterestList] = useState(interestsData.interests)
    const [toggle, setToggle] = useState(false)
    const { userInfo, setUserInfo } = useContext(UserInfoContext)
    const { userExists, setUserExists } = useContext(UserExistContext)
    const [ profile, setProfile ] = useLocalStorage('profile', null)


    const navigate = useNavigate()
    const handleCheckedInterest = (event) => {
        const selectedInterest = {
            name: event.target.name,
            id: event.target.id,
            isChecked: event.target.checked
        }
        
        // only allow user to check if interest amount is less than 5
        if(event.target.checked && !userInterest.some((interest) => interest.id === selectedInterest.id)){
            if (interestAmount < 5) {
                // get the selected interest id from the interestList and see if it matches with the selectedInterest id
                const afterChecking = interestList.map((interest) => {
                    if (interest.name === event.target.name){
                        interest.isChecked = !interest.isChecked
                   
                    }
    
                    return interest
                })
                setInterestList(afterChecking)
               
                setInterestAmount((prevState) => prevState + 1)
                setUserInterestList((prevList) => [...prevList, selectedInterest])
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
                }

                return interest
            })
            setInterestList(afterChecking)

        }
    }
    
//  try {
//             // only get the name
//             const destructuredInterestList = userInterest.map(({ name }) => name)
//             // setUserInfo({...userInfo, interests: destructuredInterestList})
//             // setProfile({...userInfo, interests: destructuredInterestList})
//             setUserSignedUp(false)
//             await setDoc(usersDocRef, {
//                 ...userInfo,
//                 interests: destructuredInterestList
//             })
            
//             setTimeout(() => {
//               navigate('/')
         
//             }, 2000)
            
//         } catch (error) {
//             console.log(error, 'error message')
//         }

    const handleNavigate = () => {
      const destructuredInterestList = userInterest.map(({ name }) => name)
      setUserInfo({
        ...userInfo,
        interests: destructuredInterestList
      })
      setTimeout(() => {

        navigate('/enterPhotos')
      }, 2000)
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
      } else if (interestAmount < 5){
        setToggle(false)
      }
    };

    useEffect(() => {
      setUserExists(false)
    }, [])
    

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
                  onClick={handleNavigate}
                >
                  Next
                </button>
                
              </div>
            </div>
            
          
          </div>
          <NavbarComponent />


         
         
        </>
      );
}