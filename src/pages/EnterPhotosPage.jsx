// react hooks
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// components
import { NextButtonComponent } from "../components/NextButtonComponent"

// contexts
import { UserInfoContext } from '../context/UserInfoContext'

// firestore
import { db } from "../config/firebase"
import { auth } from '../config/firebase'
import { collection, addDoc, doc, setDoc } from "firebase/firestore"

// third party libraries
import axios from 'axios'
import { UserSignedUpContext } from '../context/UserSignedUpContext'
import { BsCamera } from 'react-icons/bs'

export const EnterPhotosPage = () => {

    const navigate = useNavigate()
    const { userInfo, setUserInfo } = useContext(UserInfoContext)
    const [ images, setImages ] = useState([])
    const [ selectedImageObj, setSelectedImageObj ] = useState(null)
    const [ selectedImage, setSelectedImage ] = useState(null)
    const [ previewImages, setPreviewImages ] = useState({})
    const [ preview, setPreview ] = useState({})
    const [ eventName, setEventName ] = useState(null)
    const [ imageUrl, setImagesUrl ] = useState("")
    const { userSignedUp, setUserSignedUp } = useContext(UserSignedUpContext)
    const uid = auth.currentUser?.uid

    const handleUserInfoChange = (event) => {
       
        setEventName(event.target.name)
        setSelectedImageObj({
            fileName: event.target.files[0].name,
            id: crypto.randomUUID(),
            file: event.target.files[0]
        })
        setSelectedImage({
            ...selectedImageObj,
            [event.target.name]: [event.target.files[0]]
        })
        const file = event.target.files[0]
        if (file && file.type.substr(0,5) === "image"){

            setSelectedImage(event.target.files[0])
        } else {
            setSelectedImage(null)
        }
        setPreviewImages({
            ...previewImages,
            [event.target.name]: event.target.files[0].name
        })
    }

    const handleAddSubcollection = () => {
        const swipesSubcollectionRef = collection(db, "users", uid, "swipes")

    }

    useEffect(() => {
        if (selectedImageObj && images.length === 0 && eventName){
            uploadToCloudinary(selectedImageObj, (imageUrl, updatedImageObj) => {
                setImagesUrl(imageUrl);
                setSelectedImageObj(updatedImageObj);
                setImages([...images, updatedImageObj]);
            })
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview((prevPreview) => ({
                    ...prevPreview,
                    [eventName]: {
                        url: reader.result,
                        id: selectedImageObj.id
                    }
                }));
            }
            reader.readAsDataURL(selectedImage)
        } 
        else if (selectedImageObj && images.length > 0 && eventName){
            
            const isDuplicate = images.some((image) => image.fileName === selectedImageObj.fileName)
             // if any of the eventName's file name in the image array matches the selectedImageObj
            if (!isDuplicate)
            {
                console.log('it is not a duplicate')
                
                 const reader = new FileReader()
                reader.onloadend = () => {
                    setPreview((prevPreview) => ({
                        ...prevPreview,
                        [eventName]: {
                            url: reader.result,
                            id: selectedImageObj.id
                        }
                    }));
                }
                reader.readAsDataURL(selectedImage)
                uploadToCloudinary(selectedImageObj, (imageUrl, updatedImageObj) => {
                    setImagesUrl(imageUrl);
                    setSelectedImageObj(updatedImageObj);
                    setImages([...images, updatedImageObj]);
                })
               
            } 
            else {
                console.log('it is a duplicate')
            }
        } 
        else {
            setPreview(null)
            setSelectedImageObj(null)
        }
    }, [selectedImageObj, eventName, selectedImage])
    useEffect(() => {
        if (images){
            console.log('images inside the photos image', images)
            const getImageUrl = images.map((image) => { return image.url })
            console.log('image url', getImageUrl)
            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                images: getImageUrl
            }));
        }
    }, [images])
    
    const uploadToCloudinary = (imageSelected, updateStates) => {
        const formData = new FormData();
        formData.append("upload_preset", "lgeq7wmm");
        formData.append("file", imageSelected.file);
        axios
          .post("https://api.cloudinary.com/v1_1/dpj2su9ea/upload", formData)
          .then((response) => {
            const imageUrl = response.data.url;
            const updatedImageObj = {
              ...imageSelected,
              url: imageUrl,
            };
            updateStates(imageUrl, updatedImageObj);
          })
          .catch((error) => {
            console.log("error", error);
          });
      };

    
    const handleDeleteImage = (event) => {
        // only get the ones that doesn't match with the  event target id
        if (images){

            const deleteTargetImage = images.filter((image) => image.id !== event.target.id)
            const deleteEventName = event.target.name
            const isMatchingImage = images.some((image) => image.id === event.target.id)
            if (isMatchingImage){
                console.log('it matches')
                setPreview({...preview, [eventName]: null })
                if (images.length === 1){
                    setPreview(null)
                 
                }

            } else {
                console.log('doesnt match')
            }
            setImages(deleteTargetImage)
           
        }
   
    }
   
    console.log('preview images', preview)
    const handleCreateUser = async () => {
        try {
            if (images.length > 0){

                setUserSignedUp(false)
                const usersDocRef = doc(db, "users", uid)
                await setDoc(usersDocRef, {...userInfo} )
                setTimeout(() => {
                    navigate('/')
                
                }, 2000)
            } else {
                console.log('there need to be at least 1 image')
            }
        } catch(error) {
            console.log('error creating user', error)
        }
    }

    return (
        <>
            

           

            
  
            {/* container */}
            <div className="flex h-screen justify-center items-center px-4">
                <div className='min-h-[50%] flex flex-col justify-between w-full'>
                    <div>
                        <h1 className="text-4xl font-bold">Add your recent pics</h1>
                        <p className="mt-3 text-slate-500">Having a photo makes your profile stand out.</p>
                      
                      <div className="flex">

                        <input type='file' accept='image/*' name='photoOne' required onChange={handleUserInfoChange}></input>
                        <input type='file' accept='image/*' name='photoTwo' required onChange={handleUserInfoChange}/>
                        <input type='file' accept='image/*' name='photoThree' required onChange={handleUserInfoChange}/>
                      </div>
                    </div>
                    {/* preview images */}
                <div className='flex gap-x-2'>
                    <div className='border border-gray-500 w-32 h-44'>
              
                        {preview?.photoOne ? <img src={preview.photoOne.url} alt="Preview" /> : ""}
                        {preview?.photoOne && <button className='bg-blue-500' onClick={handleDeleteImage} id={preview.photoOne?.id}>Delete photo One</button>}
                    </div>
                    <div className='border border-gray-500 w-32 h-44'>
                        {preview?.photoTwo ? <img src={preview.photoTwo?.url} alt="Preview" /> : ""}
                        {preview?.photoTwo && <button className='bg-purple-500' onClick={handleDeleteImage} id={preview.photoTwo?.id}>Delete photo Two</button>}
                    </div>
                    <div className='border border-gray-500 w-32 h-44'>
                        {preview?.photoThree ? <img src={preview.photoThree?.url} alt="Preview" /> :""}
                        {preview?.photoThree && <button className='bg-green-500' onClick={handleDeleteImage} id={preview.photoThree?.id}>Delete photo Three</button>}
                    </div>
                </div>
                {/* end of preview images */}

                    {/* Next Button */}
                    <button
                        className="bg-gradient-to-t mt-12 from-electric-pink to-fiery-rose rounded-full hover:from-pink-700 hover:to-rose-500 text-white text-center font-bold py-3 px-4 w-full"
                        onClick={handleCreateUser}
                        >
                        Create User
                    </button>
                </div>
            </div>
        </>
    )
}

// use the Cloudinary function to get an api for a specific image