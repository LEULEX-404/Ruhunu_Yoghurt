import { useState } from "react";
import "../Css/imageSlider.css";
import { getProductImages, handleProductImageError } from "../utils/productImage";

export default function ImageSlider(props){
    const images = getProductImages(props.product || {
        images: props.images,
        name: props.alt,
        productId: props.productId,
        altNames: props.altNames,
    });
    const [currentIndex, setCurrentIndex] = useState(0);

    return(
        <div className="image-slider">
            <div className="image-slider-main">
                <div className="image-slider-glow" />
                <img
                    className="image-slider-main-image"
                    src={images[currentIndex]}
                    alt={props.alt || "Product"}
                    onError={handleProductImageError}
                />
            </div>
            <div className="image-slider-thumbnails">
                {
                    images?.map((image, index) => {
                        return(
                            <img 
                                key={index} 
                                className={`image-slider-thumbnail ${index === currentIndex ? 'active' : ''}`} 
                                src={image}
                                alt={`${props.alt || "Product"} ${index + 1}`}
                                onError={handleProductImageError}
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
