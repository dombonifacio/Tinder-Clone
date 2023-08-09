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
import { NavbarTopComponent } from "../components/NavbarTopComponent"
import { LikesCardComponent } from "../components/LikesCardComponent"




export const ProfilePage = () => {

    const [ settingsShown, setSettingsShown ] = useState(false)
    const [ profile, setProfile ] = useState({})
    const [ swipedByUsers, setSwipedByUsers ] = useState([])
    const [ swipedUsers, setSwipedUsers ] = useState(null)
    const [ addReviewShown, setAddReviewShown ] = useState(false)
    const [ myLikesShown, setMyLikesShown ] = useState(false)
    const [ myAdmirersShown, setMyAdmirersShown ] = useState(false)
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
          {!myAdmirersShown ? (
              <div className=" flex flex-col max-w-[500px] mx-auto h-screen">
                <div className="flex-grow overflow-auto">

                  <div className="flex flex-col">

                    <NavbarTopComponent />
                    {/* The top bar for my likes and people who liked you */}
                    <div className="px-4 flex justify-evenly">
                      <button onClick={() => setMyAdmirersShown((prevState) => !prevState)} className={!myAdmirersShown ? 'font-bold text-slate-900 text-xl' : ''}>My Likes</button>
                      <div className="w-[2px] bg-slate-200"></div>
                      <button onClick={() => setMyAdmirersShown((prevState) => !prevState)} className={myAdmirersShown ? 'font-bold text-slate-900 text-xl' : ''}>My Admirers</button>
                    </div>
                    <div className="h-[2px] mt-2 bg-slate-200"></div>

                    <div className="px-4">
                      <h1 className="text-xl text-center font-semibold text-slate-900 mt-4">Users I Swiped</h1>
                      <p className="text-md text-center text-slate-500 mb-4">Your swipes includes both swiped rights or swiped ups</p>
                      <div className="grid grid-cols-2 gap-2">

                        {swipedUsers?.map((user, index) => {
                          return (
                            <div className="" key={user.id}>
                              
                              <LikesCardComponent user={user}/>
                              {/* <Link to={`/review/${user.id}`} >
                                Add review
                              </Link> */}
                      
                            </div>
                          )
                        })}
                      </div>
                    </div>
            
                  
                  </div>
                
                </div>
                 
                <NavbarComponent />
              </div>
           ) 
        :
        (
          <div className=" flex flex-col max-w-[500px] mx-auto h-screen">
          <div className="flex-grow overflow-auto">

            <div className="flex flex-col">

              <NavbarTopComponent />
              {/* The top bar for my likes and people who liked you */}
              <div className="px-4 flex justify-evenly">
                <button onClick={() => setMyAdmirersShown((prevState) => !prevState)} className={!myAdmirersShown ? 'font-bold text-slate-900 text-xl' : ''}>My Likes</button>
                <div className="w-[2px] bg-slate-200"></div>
                <button onClick={() => setMyAdmirersShown((prevState) => !prevState)} className={myAdmirersShown ? 'font-bold text-slate-900 text-xl' : ''}>My Admirers</button>
              </div>
              <div className="h-[2px] mt-2 bg-slate-200"></div>

              <div className="px-4">
                <h1 className="text-xl text-center font-semibold text-slate-900 mt-4">Users that like me</h1>
                <p className="text-md text-center text-slate-500 mb-4">Their swipes include both swiped rights or swiped ups</p>
               
              </div>
              <div className="px-4 grid grid-cols-2 gap-2">
               
              {swipedByUsers?.map((user) => {
                  return (
                    <div className="" key={user.id}>
                              
                     <LikesCardComponent user={user} />
              
                    </div>
                  )
                })}
              </div>
          
            
            </div>
          
          </div>
           
          <NavbarComponent />
        </div>
        )
            // (
            //     <>
                
            //       <button onClick={() => setAddReviewShown(prevState => !prevState)}>

            //             <IoIosSettings size={"2rem"}/>
            //       </button>
                    
            //     </>
            // )
        }
        </>
    )
}