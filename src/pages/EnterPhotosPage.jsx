// react hooks
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// components
import { NextButtonComponent } from "../components/NextButtonComponent"

// contexts
import { UserInfoContext } from '../context/UserInfoContext'

// firestore
import { auth } from "../config/firebase"



export const EnterPhotosPage = () => {

    const navigate = useNavigate()
    const { userInfo, setUserInfo } = useContext(UserInfoContext)
    const [ images, setImages ] = useState([])
    const [ selectedImage, setSelectedImage ] = useState({})
    const [ previewImages, setPreviewImages ] = useState({

    })
    

    const handleUserInfoChange = (event) => {
        // setUserInfo({
        //     ...userInfo,
        //     [event.target.name]: event.target.value,
        // })
        setSelectedImage(event.target.files[0])
        setImages([...images, selectedImage])
        setPreviewImages({
            ...previewImages,
            [event.target.name]: event.target.files[0]
        })
        

        
        
    
    }
   useEffect(() => {
    console.log('images', images)
    let removeDuplicateImages = []
    if (images.length > 1){

        images.forEach((image) => {
            if(!removeDuplicateImages.includes(image)) {
                console.log('there is a duplicate')
                removeDuplicateImages.push(image)
                setImages(removeDuplicateImages)
            }
        })
    }

   }, [images])
    const nextPage = () => {
        navigate('/enterAge')
    }

    return (
        <>
            {/* container */}
            <div className="flex h-screen justify-center items-center px-4">
                {/* What's your first name section? */}
                    <div className='min-h-[50%] flex flex-col justify-between w-full'>

                        <div>
                            <h1 className="text-4xl font-bold">Enter Photos?</h1>
                            <input type='file' name='photoOne' required onChange={handleUserInfoChange}/>
                            <input type='file' name='photoTwo' required onChange={handleUserInfoChange}/>
                            <input type='file' name='photoThree' required onChange={handleUserInfoChange}/>
   
                            
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