// from react
import { useState } from "react"
import { useParams } from "react-router-dom"

// firebase backend
import { auth, db } from "../config/firebase"
import { addDoc, collection } from "firebase/firestore"
import { NavbarComponent } from "../components/NavbarComponent"


export const AddReviewPage = () => {
    const {id} = useParams()
    const [ user, setUser ] = useState({})
    const [ content, setContent ] = useState("")
    const currentUser = auth.currentUser

    // get the user who's being reviewed

    const addReview = async () => {
        // TODO: Adding a doc
        // * 1. Get reviews collection reference
        // * 2. Doc ID will be random
        // * 3. Fields will be: reviewedBy: (current user id), reviewedFor: (params id), content: (string)
        // * 4. addDoc will be used
        // TODO: Fetching Reviews

        try {

            const reviewsColRef = collection(db, "reviews")
            const reviewFields = {
                reviewedBy: currentUser.uid,
                reviewedFor: id,
                description: content
            }
            await addDoc(reviewsColRef, {...reviewFields})
        } catch(error){
            console.log('error adding', error)
        }

    }

    const handleContentChange = (event) => {
        setContent(event.target.value)
    }
    console.log('content', content)


    return (
        <div>
            <textarea className="w-full border border-red-500" 
            maxLength={200}
            rows={5}
            onChange={handleContentChange}
            value={content}
            placeholder="Enter Review . . . Max 200 characters">

            </textarea>
            <button onClick={addReview}> adding a review</button>
            <NavbarComponent />
        </div>
    )
}