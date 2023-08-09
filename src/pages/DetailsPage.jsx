import { Link, useParams, useNavigate } from "react-router-dom"
import { NavbarComponent } from "../components/NavbarBotComponent"

// firebase
import { auth, db } from "../config/firebase"
import { collection, onSnapshot, getDoc, doc } from "firebase/firestore"
import { useEffect, useState } from "react"

// components
import { SettingsComponent } from "../components/SettingsComponent"
import { NavbarTopComponent } from "../components/NavbarTopComponent"
import { LoadingComponent } from "../components/LoadingComponent"

// icons
import { BsGenderMale } from 'react-icons/bs'
import { BsGenderFemale } from 'react-icons/bs'
import { VscHome } from 'react-icons/vsc'
import { ReviewsComponent } from "../components/ReviewsComponent"

export const DetailsPage = () => {
    // the user being viewed
    const {id} = useParams()
    const [ receivedReviews, setReceivedReviews ] = useState([])
    const [ viewedUser, setViewedUser ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ showSettings, setShowSettings ] = useState(false)
    const [ totalReviews, setTotalReviews ] = useState(0)


        
        const getReviews = async () => { 
            try {
                setLoading(true)

                const reviewsColRef = collection(db, "reviews")
                const query = onSnapshot(reviewsColRef, (doc) => {
                    const tempReceivedReviews = []
                    let tempTotalReviews = 0
                    doc.docs.forEach((reviewDoc) => {
                        const readableDocData = reviewDoc.data()
                        if (readableDocData.reviewedFor === id){
                            tempReceivedReviews.push(readableDocData)
                            tempTotalReviews += 1
                        }
                    })
                    setReceivedReviews(tempReceivedReviews)
                    setTotalReviews(tempTotalReviews)
                })
            } catch (error) {
                console.log('error', error)
            } finally {
                setLoading(false)
            }
        }
        console.log('reviews', receivedReviews)

        const getUser = async () => {
            try {
                setLoading(true)
                const usersColRef = collection(db, "users")
                const getViewedUser = await getDoc(doc(usersColRef, id))
                const readableViewedUserData = getViewedUser.data()
                setViewedUser(readableViewedUserData)
            } catch(error) {
                console.log('error fetching data', error)
            } finally {
                setLoading(false)
            }
        }
        
        
    
    useEffect(() => {
       return () => {
        getReviews()
        getUser()
       }
    }, [])

   console.log(viewedUser, 'user here')

    return (
        <div className="">
             <div className={`${viewedUser ? `max-w-[500px]  flex flex-col justify-between items-center mx-auto` : `h-screen max-w-[500px]  flex flex-col justify-between items-center mx-auto` } `}>

                {loading ? (
                    <LoadingComponent />
                ) : (
                    <>
                    <div>

                        <NavbarTopComponent />
                        <div className="flex flex-col ">

                            {viewedUser && (
                                <>
                                    <div className="relative">
                                        <div className="absolute bg-gradient-to-t from-black rounded-b-2xl top-0 bottom-0 left-0 w-full h-full flex items-end justify-end">
                                            <Link to={'/'} className="text-white bg-opacity-50 left-0 p-4 ">
                                                Back 
                                            </Link>
                                        </div>
                                        {viewedUser.images?.length > 0 && (
                                            <img src={viewedUser?.images[0]} className="w-[500px] max-w-[90vw] h-[65vh] mx-auto rounded-2xl object-cover object-center" />
                                        )}
                                    </div>
                                    <div className="flex flex-col px-4 mt-4 gap-y-1">
                                        <div className="flex items-end  gap-x-2">
        
                                            <h1 className="text-4xl font-bold text-slate-900 ">{viewedUser.name?.charAt(0).toUpperCase() + viewedUser.name?.slice(1)}</h1>
                                            <h1 className="text-2xl">{viewedUser?.age}</h1>
                                        </div>
                                        <div className="flex items-center gap-x-2">
                                            {viewedUser?.gender === "Male" ? <BsGenderMale size={"1rem"} color="##334155"/> : <BsGenderFemale size={"1rem"} color="#334155"/>}
                                            <h1 className="text-slate-800">{viewedUser?.gender}</h1>
                                        </div>
                                        <div className="flex items-center gap-x-2">
        
                                            <VscHome size={"1rem"} color="##334155"/>
                                            <h1 className="text-slate-800">Lives in </h1>
        
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-2 mt-1">
                                            {viewedUser.interests?.map((interest) => (
                                                <div className="px-2 py-1 border border-slate-500 rounded-full">
                                                    <p className="text-slate-500 text-sm">{interest}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {/* About Me */}
                                        <div className="mt-3">
                                            <h1 className="text-4xl font-bold text-slate-900 ">Bio</h1>
                                            laskdmflksmff
                                        </div>
                                        <hr />
                                    </div>
                                </>
                            )}
                         
                            <ReviewsComponent data={receivedReviews} totalReviews={totalReviews}/>
                           
                        
                        </div>
                    </div>
                   
                    {viewedUser ? (
                        <div className="mt-4">

                            <NavbarComponent />
                        </div>
                    ) : <NavbarComponent />}
                    
                    </>
                )}
            </div>
        </div>
    )
}