import { useParams } from "react-router-dom"
import { NavbarComponent } from "../components/NavbarComponent"

// firebase
import { auth, db } from "../config/firebase"
import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"

export const DetailsPage = () => {
    // the user being viewed
    const {id} = useParams()
    const [ receivedReviews, setReceivedReviews ] = useState([])

    useEffect(() => {
        const getReviews = async () => { 
            try {
                const reviewsColRef = collection(db, "reviews")
                const query = onSnapshot(reviewsColRef, (doc) => {
                    const tempReceivedReviews = []
                    doc.docs.forEach((reviewDoc) => {
                        const readableDocData = reviewDoc.data()
                        if (readableDocData.reviewedFor === id){
                            tempReceivedReviews.push(readableDocData)
                        }
                    })
                    setReceivedReviews(tempReceivedReviews)
                })
            } catch (error) {
                console.log('error', error)
            }
        }
        
       
        getReviews()
        
    }, [])

    useEffect(() => {
        if (receivedReviews) {
            console.log('reviews', receivedReviews)
        }
    }, [receivedReviews])

   

    return (
        <div>
            Details Page user profile
            <p>{id}</p>
            {receivedReviews?.map((review) => <p>{review.description}</p>)}
            <NavbarComponent />
            
        </div>
    )
}