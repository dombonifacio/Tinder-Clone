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
    const [ rating, setRating ] = useState(0)
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
                description: content,
                rating: rating
            }
            await addDoc(reviewsColRef, {...reviewFields})
        } catch(error){
            console.log('error adding', error)
        }

    }

    const handleContentChange = (event) => {
        setContent(event.target.value)
    }
    
  
    console.log('rating', rating)

    return (
        <div>
            <textarea className="w-full border border-red-500" 
            maxLength={200}
            rows={5}
            onChange={handleContentChange}
            value={content}
            placeholder="Enter Review . . . Max 200 characters">

            </textarea>
            <p>Please select your age:</p>
            <div className="flex gap-x-4">

                <input type="radio" id="rating1" name="rating" value="1.0" onChange={(event) => setRating(event.target.value)}/>
                <label for="rating1">1</label>
                <input type="radio" id="rating2" name="rating" value="2.0" onChange={(event) => setRating(event.target.value)}/>
                <label for="rating2">2</label>
                <input type="radio" id="rating3" name="rating" value="3.0" onChange={(event) => setRating(event.target.value)}/>
                <label for="rating3">3</label>
                <input type="radio" id="rating4" name="rating" value="4.0" onChange={(event) => setRating(event.target.value)}/>
                <label for="rating4">4</label>
                <input type="radio" id="rating5" name="rating" value="5.0" onChange={(event) => setRating(event.target.value)}/>
                <label for="rating5">5</label>
            </div>
            <button onClick={addReview}> adding a review</button>
            <NavbarComponent />
        </div>
    )
}