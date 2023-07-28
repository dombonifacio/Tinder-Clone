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
    const [ selectedImageObj, setSelectedImageObj ] = useState(null)
    const [ selectedImage, setSelectedImage ] = useState(null)
    const [ previewImages, setPreviewImages ] = useState({})
    const [ preview, setPreview ] = useState({})
    const [ eventName, setEventName ] = useState(null)
    


    const handleUserInfoChange = (event) => {
        // setUserInfo({
        //     ...userInfo,
        //     [event.target.name]: event.target.value,
        // })
        setEventName(event.target.name)
        setSelectedImageObj({
          fileName: event.target.files[0].name,
          id: crypto.randomUUID()
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
            
            setImages([...images, selectedImageObj])
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview({
                    ...preview,
                    [eventName]: reader.result
                })
            }
            reader.readAsDataURL(selectedImage)

        } 
        else if (selectedImageObj && images.length > 0 && eventName){
            const isDuplicate = images.some((image) => image.fileName === selectedImageObj.fileName)
            console.log(isDuplicate, 'is duplicate')
             
            if (!isDuplicate){
                console.log('it is not a duplicate')
                 const reader = new FileReader()
                reader.onloadend = () => {
                    setPreview({
                    ...preview,
                    [eventName]: reader.result
                })
                }
                reader.readAsDataURL(selectedImage)
                setImages([...images, selectedImageObj])
            } else{
                console.log('it is a duplicate')
            }
        } else {
            setPreview(null)
            setSelectedImageObj(null)
        }
        
        
    }, [selectedImageObj, eventName, selectedImage])

    // useEffect(() => {
       
    //    console.log('images users', images)
       
    // }, [images]);   
    useEffect(() => {
        if (preview){
            console.log('preview image', preview)
        }
    }, [preview])
    const nextPage = () => {
        navigate('/enterAge')
    }

    

    // Preview Images
    

    return (
        <>
            <div className='flex'>

                {images.map((image, index) => {
                    return (
                        <div key={index}>
                            {image.fileName}
                        </div>
                    )
                })}
            </div>

            <div className='flex'>
                <div className='border border-red-500 w-24 h-24'>{ preview && <img src={preview.photoOne} />}</div>
                <div className='border border-red-500 w-24 h-24'>{ preview && <img src={preview.photoTwo} />}</div>
                <div className='border border-red-500 w-24 h-24'>{ preview && <img src={preview.photoThree} />}</div>
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