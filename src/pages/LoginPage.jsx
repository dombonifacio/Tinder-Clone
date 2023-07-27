import { auth, googleProvider, facebookProvider, db } from "../config/firebase"
// methods that allows you to sign in
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"

// react routes dom
import { useNavigate } from "react-router-dom"
//hooks
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useEffect, useState, useContext } from "react"
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore"

// contexts
import { UserExistContext } from "../context/UserExistContext"
import { UserSignedUpContext } from "../context/UserSignedUpContext"
import { UserLoggedInContext } from "../context/UserLoggedInContext"

export const LoginPage = () => {

    const [value, setValue] = useLocalStorage("user", null)
    const [userInfo, setUserInfo] = useState({})
    const usersCollectionRef = collection(db, "users")
    const { userExists, setUserExists } = useContext(UserExistContext)
    const { userSignedUp, setUserSignedUp } = useContext(UserSignedUpContext)
    const { userIsLoggedIn, setUserIsLoggedIn } = useContext(UserLoggedInContext)
    const navigate = useNavigate()

    const handleUserInfo = (event) => {
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        })
    }

    const signInWithGoogle = () => {
        // signinWithPop method takes in two parameters: auth and the provider (the third party email login)
        signInWithPopup(auth, googleProvider).then((response) => {

            setValue(response.user)
           
            navigate('/')
        }).catch((error) => {
            console.log(error, 'error')
        })
    }

    const signInWithFacebook = () => {
        signInWithPopup(auth, facebookProvider).then((response) => {
            setValue(response.user)
            console.log(response, 'auth facebook')
            setTimeout(() => {
                navigate('/enterName')
            }, 2000)
        }).catch((error) => {
            console.log(error, 'error')
        })
    }

    const handleSignup = () => {
        navigate('/signup')
    }

    const handleSignInWithEmailAndPass = () => {
        signInWithEmailAndPassword(auth, userInfo.email, userInfo.password).then((response) => {
            setValue(response.user)
            navigate('/')
        
        }).catch((error) => {
            console.log('error signing in', error)
        })
    }

    useEffect(() => {
        if (value){
            setUserIsLoggedIn(true)
        }
    }, [value])

    

    // check to see if the current user exists in the users doc, if not, navigate them to the enter name page

    // useEffect(() => {
    //     const checkIfUserExists = onAuthStateChanged(auth, (person) => {
    //         console.log('setting setUesr to object')

    //         if (value){
    //             const userDocRef = doc(usersCollectionRef, person.uid)
    //             getDoc(userDocRef).then((doc) => {
    //                 if (doc.exists()){
    //                     setUserSignedUp(false)
    //                     setUserExists(true)
    //                     console.log('from the login page. doc exists. user true')
    //                     setTimeout(() => {
    //                         navigate('/')
    //                     }, 2000)
    //                     console.log(value,' user is on login page local storage')
    //                 } else {
    //                     setUserExists(false)
    //                     console.log('doc doesn\'t exists')
    //                     setTimeout(() => {
    //                         navigate('/enterName')
    //                     }, 2000)
    //                 }
    //             }).catch((error) => {
    //                 console.log('error', error)
    //             })
    //         }
    //         else {

    //             console.log(auth, 'user is not here from the login page. onauthstatechanged useeffecct')
    //         }
    //     })
    //     return () => {
    //         // Unsubscribe from the listener when the component unmounts
    //         checkIfUserExists();
    //     };
        
    // }, [value])


   



    return (
        <>
            <h1>Login Page</h1>
            <input type="text" name="email" placeholder="Enter your email" required value={userInfo.email} onChange={handleUserInfo}/>
            <input type="password" name="password" placeholder="Enter your password" required value={userInfo.password} onChange={handleUserInfo}/>
            <button className="bg-blue-400" onClick={handleSignInWithEmailAndPass}>
                Log In
            </button>
            <div>
                <button onClick={signInWithGoogle}>Sign in with Google</button>
                
            </div>
            <div>
                <button onClick={signInWithFacebook}>Sign in with Facebook</button>
            </div>
            <button onClick={handleSignup}>
                Don't have an account? Sign up here
            </button>
        </>
    )
}