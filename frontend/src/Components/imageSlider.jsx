import { useState } from "react"
import '../Css/imageSlider.css'

export default function ImageSlider(props){
    const images = props.images
    const [currentIndex, setCurrentIndex] = useState(0)

    return(
        <div className="image-slider">
            <div className="image-slider-main">
                <img className="image-slider-main-image" src={images[currentIndex]} alt="" />
            </div>
            <div className="image-slider-thumbnails">
                {
                    images?.map((image, index) => {
                        return(
                            <img 
                                key={index} 
                                className={`image-slider-thumbnail ${index === currentIndex ? 'active' : ''}`} 
                                src={image} 
                                onClick={() =>{
                                    setCurrentIndex(index)
                            }}/>
                        )
                    })
                }
            </div>
        </div>
    )
}