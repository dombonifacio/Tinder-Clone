import { auth, googleProvider, facebookProvider, db } from "../config/firebase"
// methods that allows you to sign in
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"

// react routes dom
import { useNavigate } from "react-router-dom"
//hooks
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useEffect, useState } from "react"
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore"

export const LoginPage = () => {

    const [user, setUser] = useLocalStorage("user", null)
    const [userInfo, setUserInfo] = useState({})
    const usersCollectionRef = collection(db, "users")
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

            setUser(response.user)
           
            navigate('/')
        }).catch((error) => {
            console.log(error, 'error')
        })
    }

    const signInWithFacebook = () => {
        signInWithPopup(auth, facebookProvider).then((response) => {
            setUser(response.user)
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
            setUser(response.user)
            console.log('user successfully logged in')
            navigate('/')
        
        }).catch((error) => {
            console.log('error signing in', error)
        })
    }

    // check to see if the current user exists in the users doc, if not, navigate them to the enter name page
    const [users, setUsers] = useState([])
    useEffect(() => {
     
        const checkIfUserExists = onAuthStateChanged(auth, (user) => {
            if (user){
                const userDocRef = doc(usersCollectionRef, user.uid)
                getDoc(userDocRef).then((doc) => {
                    if (doc.exists()){
                        console.log('doc exists')
                        navigate('/')
                    } else {
                        console.log('doc doesn\'t exists')
                        navigate('/enterName')
                    }
                }).catch((error) => {
                    console.log('error', error)
                })
            }
        })
        return () => {
            // Unsubscribe from the listener when the component unmounts
            checkIfUserExists();
        };
        
    }, [])
    



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