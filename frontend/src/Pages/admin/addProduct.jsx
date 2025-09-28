import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload"
import axios from "axios";
import "../../Css/addProduct.css"

export default function AddProductPage(){
    const [productId, setProductId] = useState('')
    const [name, setName] = useState('')
    const [altNames, setAltNames] = useState('')
    const [description, setDescription] = useState('')
    const [images, setImages] = useState([])
    const [labelledPrice, setLabelledPrice] = useState('')
    const [price, setPrice] = useState('')
    const [expDate, setExpDate] = useState('')
    const [weight, setWeight] = useState('')
    const [unit, setUnit] = useState('kg')
    const [isAvailable, setIsAvailable] = useState(true)
    const navigate = useNavigate()

    async function AddProduct(e) {
        e.preventDefault();
        const token = localStorage.getItem("token")

        if(token == null){
            toast.error("Please login first")
            return
        }

        if(images.length <= 0){
            toast.error("Please select at least one image")
            return
        }

        const promisesArray = []
        for (let i = 0; i < images.length; i++) {
            promisesArray.push(MediaUpload(images[i]))
        }

        try {
            const imageUrls = await Promise.all(promisesArray)
            console.log(imageUrls)

            const altNamesArray = altNames.split(",")

            const product = {
                productId : productId,
                name : name,
                altNames : altNamesArray,
                description : description,
                images : imageUrls,
                labelledPrice : Number(labelledPrice),
                price : Number(price),
                expDate : expDate,
                weight : Number(weight),
                unit : unit,
                isAvailable : isAvailable
            }

            await axios.post(`http://localhost:8070/api/products`, product, {
                headers : {
                    "Authorization" : "Bearer " + token
                }
            }).then((res) => {
                toast.success("Product added successfully")
                navigate("admin/products")
            })
        }catch(e){
            toast.error(e.response?.data?.message || "An error occured")
        }
    }

    return(
        <div className="add-product-container">
            <form onSubmit={AddProduct} className="add-product-form">
                <input
                    type="text"
                    placeholder="Product ID"
                    className="form-input"
                    value={productId}
                    onChange={(e) => {
                        setProductId(e.target.value)
                    }} />
                <input
                    type="text" 
                    placeholder="Name" 
                    className="form-input" 
                    value={name} 
                    onChange={(e) =>
                        setName(e.target.value)}
                    required
                />
                <input
                    type="text" 
                    placeholder="Alt Names (comma-separated)"
                    className="form-input" 
                    value={altNames}
                    onChange={(e) =>
                        setAltNames(e.target.value)}
                />
                <textarea
                    placeholder="Description" 
                    className="form-textarea" 
                    value={description} 
                    onChange={(e) =>
                        setDescription(e.target.value)} 
                />
                <input
                    type="file" 
                    multiple
                    className="form-file-input" 
                    onChange={(e) =>
                        setImages(e.target.files)}
                    required 
                />
                <input
                    type="number" 
                    placeholder="Labelled Price" 
                    className="form-input" 
                    value={labelledPrice} 
                    onChange={(e) =>
                        setLabelledPrice(Number(e.target.value))}
                    required 
                />
                <input
                    type="number" 
                    placeholder="Price" 
                    className="form-input" 
                    value={price} 
                    onChange={(e) =>
                        setPrice(Number(e.target.value))} 
                />
                <input
                    type="date" 
                    placeholder="Expiration Date" 
                    className="form-input" 
                    value={expDate}
                    onChange={(e) =>
                        setExpDate(e.target.value)} 
                    required 
                />
                <input
                    type="number" 
                    placeholder="Weight" 
                    className="form-input" 
                    value={weight}
                    onChange={(e) =>
                        setWeight(Number(e.target.value))} 
                    required 
                />
                <select
                    className="form-select"
                    value={unit}
                    onChange={(e) =>
                        setUnit(e.target.value)}
                    required>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                </select>

                <div className="availability-container">
                    <label
                        htmlFor="isAvailable" 
                        className="availability-label">
                            Availability:
                    </label>
                    <select
                        id="isAvailable"
                        className="form-select"
                        value={isAvailable}
                        onChange={(e) => {
                            setIsAvailable(e.target.value === "true")
                        }}>
                            <option value="true">Available</option>
                            <option value="false">Not Available</option>
                    </select>
                </div>
                <div className="button-container">
                        <Link to="/admin/products" className="btn btn-cancel">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="btn btn-submit">
                                Add Product
                        </button>
                </div>                      
            </form>
        </div>
    )

}