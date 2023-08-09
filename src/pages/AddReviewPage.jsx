// from react
import { useState } from "react"
import { useParams } from "react-router-dom"

// firebase backend
import { auth, db } from "../config/firebase"
import { addDoc, collection, getDoc, doc } from "firebase/firestore"
import { NavbarComponent } from "../components/NavbarBotComponent"
import { NavbarTopComponent } from "../components/NavbarTopComponent"


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
            const reviewedByRef = collection(db, "users")
            const getReviewedByUser = await getDoc(doc(reviewedByRef, currentUser.uid))
            
            const reviewFields = {
                reviewedBy: getReviewedByUser.data(),
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
        <div className="max-w-[500px] mx-auto h-screen flex flex-col ">
           

            <NavbarTopComponent />
            <div className="flex flex-col justify-center flex-grow px-4 gap-y-4">
                <div className="mb-1">

                    <h1 className="text-4xl font-bold mb-1 text-slate-900 text-center">Leave a rate</h1>
                    <p className="text-slate-600 text-sm text-center">Leaving a rating helps other users gain insights into other people's experiences with this user.</p>
                </div>
                <textarea className="w-full border border-slate-900 rounded-lg p-2" 
                    maxLength={200}
                    rows={5}
                    onChange={handleContentChange}
                    value={content}
                    placeholder="Enter Review . . . Max 200 characters">

                    </textarea>
                   
                    <div className="flex justify-center gap-x-3">

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
                    <button onClick={addReview} className="bg-gradient-to-t from-electric-pink  to-fiery-rose rounded-full hover:from-pink-700 hover:to-rose-500  text-white font-bold py-3 px-4">Add Review</button>
        
            </div>
            <NavbarComponent />
            
        </div>
    )
}