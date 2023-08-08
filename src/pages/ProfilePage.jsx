// components
import { NavbarComponent } from "../components/NavbarBotComponent"
import { SwipedByUsersComponent } from "../components/SwipedByUsersComponent"
// icons
import logo from '../assets/icons/logo.svg'
import { IoIosSettings } from 'react-icons/io'
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

// third party libraries
import { signOut } from "firebase/auth"
import { auth, db } from "../config/firebase"
import { getDoc, doc, collection, onSnapshot, query, where, getDocs } from "firebase/firestore"




export const ProfilePage = () => {

    const [ settingsShown, setSettingsShown ] = useState(false)
    const [ profile, setProfile ] = useState({})
    const [ swipedByUsers, setSwipedByUsers ] = useState([])
    const [ swipedUsers, setSwipedUsers ] = useState(null)
    const [ addReviewShown, setAddReviewShown ] = useState(false)
    const currentUserId = auth.currentUser?.uid
    
    
    const getUsers = async () => {
        try {
          const swipesColRef = collection(db, "swipes")
          const docsFromSwipesCol = await getDocs(swipesColRef)
          const currentUserSwipesRef = await getDoc(doc(swipesColRef, currentUserId))
          if (currentUserSwipesRef.exists) {
            const readableCurrentUserDoc = currentUserSwipesRef.data()
            console.log(readableCurrentUserDoc,' readable')
            const currentUserSwipedRightColRef = collection(db, "swipes", readableCurrentUserDoc.id, "swipedRight")
            const getSnapshot = onSnapshot(currentUserSwipedRightColRef, (snapshot) => {
              const swipedUsersTemp = []
              snapshot.docs.forEach((user) => {
                swipedUsersTemp.push(user.data())
              })
              setSwipedUsers(swipedUsersTemp)

            })
            console.log('user exists')
          }

          // * * For getting the users who swiped right or up on the current user
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

    const handleReview = (user) => {
      console.log(user.id, 'is clicked')
    }

    useEffect(() => {
        getUsers()
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
                 {profile?.name}, {profile?.age}
                 
 
                 {/* profile section */}
                 <div className="flex justify-center">
                     <p>
                         Name, 
                     </p>
                     <p> Age</p>
                    
                 </div>
      
                <div>
                  Swiped By
                 {swipedByUsers?.map((user) => {
                    return (
                      <div>
                        {user.name}
                       
                      </div>
                    )
                  })}
                </div>
                {/* Users that you swiped */}
                <div>
                  Users I Swiped
                  {swipedUsers?.map((user, index) => {
                    return (
                      <div className="flex gap-x-10" key={user.id}>
                        <p>{user.name}</p>
                        
                        <Link to={`/review/${user.id}`} >
                          Add review
                        </Link>
                    
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-center">

                    <NavbarComponent />
                </div>
                 
             </div>
           ) 
        :
            (
                <>
                
                  <button onClick={() => setAddReviewShown(prevState => !prevState)}>

                        <IoIosSettings size={"2rem"}/>
                  </button>
                    
                </>
            )
        }
        </>
    )
}