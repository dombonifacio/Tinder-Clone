// react hooks
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// components
import { NextButtonComponent } from "../components/NextButtonComponent"

// contexts
import { UserInfoContext } from '../context/UserInfoContext'

// firestore
import { auth } from "../config/firebase"

// third party libraries
import axios from 'axios'


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
    
    const handleUserInfoChange = (event) => {
        const formData = new FormData();
        formData.append("upload_preset", "lgeq7wmm");
        formData.append("file", event.target.files[0]);
        axios
        .post("https://api.cloudinary.com/v1_1/dpj2su9ea/upload", formData)
        .then((response) => {
            console.log("result of axios cloudinary", response.data.url);
            setImagesUrl(response.data.url);
        })
        .catch((error) => {
            console.log("error has occurred", error);
        });
        setEventName(event.target.name)
        setSelectedImageObj({
            fileName: event.target.files[0].name,
            id: crypto.randomUUID(),
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
    useEffect(() => {
        if (selectedImageObj && images.length === 0 && eventName){
            if (imageUrl){

                const updatedImageObj = {
                    ...selectedImageObj,
                    url: imageUrl
                }
                setImages([...images, updatedImageObj])
            }
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
            if (!isDuplicate){
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
                if (imageUrl){

                    const updatedImageObj = {
                        ...selectedImageObj,
                        url: imageUrl
                    }
                    setImages([...images, updatedImageObj])
                }
            } 
            else {
                console.log('it is a duplicate')
            }
        } else {
            setPreview(null)
            setSelectedImageObj(null)
        }

        if (eventName && images){
             console.log('images.eventName', images[eventName])
             console.log('event name', eventName)
            console.log('selected image', selectedImageObj)
        }
    }, [selectedImageObj, eventName, selectedImage, imageUrl])

    useEffect(() => {
        if (images){
            console.log('images array', images)
        }
    }, [images])

    const nextPage = () => {
        navigate('/enterAge')
    }
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
    return (
        <>
            

           <div className='flex'>
            <div className='border border-red-500 w-24 h-24'>
                {preview?.photoOne ? <img src={preview.photoOne?.url} alt="Preview" /> : <h1>no image</h1>}
                {preview?.photoOne && <button className='bg-blue-500' onClick={handleDeleteImage} id={preview.photoOne?.id}>Delete photo One</button>}
            </div>
            <div className='border border-red-500 w-24 h-24'>
                {preview?.photoTwo ? <img src={preview.photoTwo?.url} alt="Preview" /> : <h1>no image</h1>}
                {preview?.photoTwo && <button className='bg-purple-500' onClick={handleDeleteImage} id={preview.photoTwo?.id}>Delete photo Two</button>}
            </div>
            <div className='border border-red-500 w-24 h-24'>
                {preview?.photoThree ? <img src={preview.photoThree?.url} alt="Preview" /> : <h1>no image</h1>}
                {preview?.photoThree && <button className='bg-green-500' onClick={handleDeleteImage} id={preview.photoThree?.id}>Delete photo Three</button>}
            </div>
        </div>
          
  
            {/* container */}
            <div className="flex h-screen justify-center items-center px-4">
                <div className='min-h-[50%] flex flex-col justify-between w-full'>
                    <div>
                        <h1 className="text-4xl font-bold">Enter Photos?</h1>
                        <input type='file' accept='image/*' name='photoOne' required onChange={handleUserInfoChange}/>
                        <input type='file' accept='image/*' name='photoTwo' required onChange={handleUserInfoChange}/>
                        <input type='file' accept='image/*' name='photoThree' required onChange={handleUserInfoChange}/>
                    </div>

                    {/* Next Button */}
                    <div className="mt-8">
                        <NextButtonComponent onClick={nextPage}/>
                    </div>
                </div>
            </div>
        </>
    )
}

// use the Cloudinary function to get an api for a specific image