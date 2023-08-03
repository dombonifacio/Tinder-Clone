// components
import { NavbarComponent } from "../components/NavbarComponent"
import { SwipedByUsersComponent } from "../components/SwipedByUsersComponent"
// icons
import logo from '../assets/icons/logo.svg'
import { IoIosSettings } from 'react-icons/io'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// third party libraries
import { signOut } from "firebase/auth"
import { auth, db } from "../config/firebase"
import { getDoc, doc, collection, onSnapshot, query, where, getDocs } from "firebase/firestore"



export const ProfilePage = () => {

    const [settingsShown, setSettingsShown] = useState(false)
    const [ profile, setProfile ] = useState({})
    const [ swipedByUsers, setSwipedByUsers ] = useState([])
    const currentUserId = auth.currentUser?.uid

    // Get current user's profile
    const navigate = useNavigate()

    const getUsersWhoSwipedRight = async () => {
        try {
          const swipesColRef = collection(db, "swipes")
          const docsFromSwipesCol = await getDocs(swipesColRef)
      
          const tempSwipedByUsers = []
          for (const swipesDoc of docsFromSwipesCol.docs) {
            if (swipesDoc.exists()) { 
              const swipedRightSubColRef = collection(db, "swipes", swipesDoc.id, "swipedRight")
                
      
              const userWhoSwiped = swipesDoc.data()
      
              const docsFromSwipedRightSubCol = await getDocs(swipedRightSubColRef)
              docsFromSwipedRightSubCol.forEach((swipedRightDoc) => {
                if (swipedRightDoc.id === currentUserId) {
                  console.log("user is swiped by", userWhoSwiped.name)
                  tempSwipedByUsers.push(userWhoSwiped)
                }
              });
            }
          }
      
          setSwipedByUsers(tempSwipedByUsers)
        } catch (error) {
          console.log("error catching data", error)
        }
      };

    useEffect(() => {
        getUsersWhoSwipedRight()
      }, [])

    useEffect(() => {
        if (swipedByUsers) {
            console.log('this user is liked by', swipedByUsers)
        }
    }, [swipedByUsers])
    return (
        <>
           {!settingsShown ? (
                 <div className="p-4 flex flex-col gap-y-16">
               
                 <div className="flex items-center justify-between">
                     {/* tinder logo */}
                     <div className="flex">
 
                         <img src={logo} className='w-[2rem] h-[2rem]'/>
                         <h1 className="text-2xl font-bold bg-gradient-to-t from-electric-pink to-fiery-rose text-transparent bg-clip-text">tinder</h1>
                     </div>
                     {/* settings button */}
                     <button onClick={() => setSettingsShown(prevState => !prevState)}>
 
                         <IoIosSettings size={"2rem"}/>
                     </button>
                 </div>
                 {profile?.name}, {profile?.age}
                 
 
                 {/* profile section */}
                 <div className="flex justify-center">
                     <p>
                         Name, 
                     </p>
                     <p> Age</p>
                    
                 </div>
                 <SwipedByUsersComponent />
                     
                 {swipedByUsers?.map((user) => {
                        return (
                            <div>{user.name}</div>
                        )
                })}
 
                 <div className="flex justify-center">
 
                     <NavbarComponent />
                 </div>
                 
             </div>
           ) 
        :
            (
                <>
                    <h1>Settings is shown.</h1>
                    <button onClick={() => setSettingsShown(prevState => !prevState)}>
 
                         <IoIosSettings size={"2rem"}/>
                    </button>
                    
                </>
            )
        }
        </>
    )
}