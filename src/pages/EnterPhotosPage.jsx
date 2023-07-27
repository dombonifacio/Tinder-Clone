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
    const [ selectedImage, setSelectedImage ] = useState(null)
    const [ previewImages, setPreviewImages ] = useState({

    })
    

    // 1. Add selected image to the images
    // 2. Set the selected image as a preview
    // 3. If the selected item is a duplicate in the array, do not set that as the preview image
    // 4. Do not add the duplicate into the array, just add the first
    const handleUserInfoChange = (event) => {
        // setUserInfo({
        //     ...userInfo,
        //     [event.target.name]: event.target.value,
        // })
        setSelectedImage({
          fileName: event.target.files[0].name,
          id: crypto.randomUUID()
        })
        
        setPreviewImages({
            ...previewImages,
            [event.target.name]: event.target.files[0]
        })
    }
    
    useEffect(() => {
        if (selectedImage && images.length === 0){
            
            setImages([...images, selectedImage])

        } else if (selectedImage && images.length > 0){
            const isDuplicate = images.some((image) => image.fileName === selectedImage.fileName)
            console.log(isDuplicate, 'is duplicate')
            if (!isDuplicate){
                console.log('it is not a duplicate')
                setImages([...images, selectedImage])
            } else{
                console.log('it is a duplicate')
            }
        }
      
        
    }, [selectedImage])

    useEffect(() => {
       // whenever there are changes in the images state and image state is higher than 1,
       // make sure to check each image in the images arr if it matches with selectedImage file name
       // returns a boolean

       console.log('images users', images)
       
        
      }, [images]);   
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