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
import { getDoc, doc, collection, onSnapshot } from "firebase/firestore"



export const ProfilePage = () => {

    const [settingsShown, setSettingsShown] = useState(false)
    const [ profile, setProfile ] = useState({})
    const currentUserId = auth.currentUser?.uid

    // Get current user's profile
    const navigate = useNavigate()

    useEffect(() => {
        const getProfile = async () => {
            const docUserRef = doc(db, "users", currentUserId)
            const docUserData = await getDoc(docUserRef)
            if (docUserData.exists()) {
                setProfile(docUserData.data())
            } else {
                console.log('user does not exist.')
            }
        }

          // TODO
         // 1. Go to the collection of swipes
        const getSwipedByUsers = () => {
            const swipesColRef = collection(db, "swipes")
            const swipesDocsData = onSnapshot(swipesColRef, (doc) => {
                doc.docs.forEach((user) => {
                  
                    const swipedRightSubColRef = collection(db, "swipes", user.id, "swipedRight")
                    const swipedRightDocsData = onSnapshot(swipedRightSubColRef, (doc) => {
                        doc.docs.forEach((user) => {
                            const readableData = user.data()
                            console.log('each users in swiped right', readableData)
                        })
                    })
                })
            })
        }

        return () => {
            getProfile()
            getSwipedByUsers()
        }
    }, [])

  

    
    
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
 
                 {/* profile section */}
                 <div className="flex justify-center">
                     <p>
                         Name, 
                     </p>
                     <p> Age</p>
                 </div>
                 <SwipedByUsersComponent />
                     
         
 
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