import { useState } from "react"
import toast from "react-hot-toast"
import { Link, useLocation, useNavigate } from "react-router-dom"
import MediaUpload from "../../utils/mediaUpload"
import axios from "axios"
import "../../Css/editProduct.css"

export default function EditProductPage() {

    const location = useLocation()
    const [productId, setProductId] = useState(location.state.productId)
    const [name, setName] = useState(location.state.name)
    const [altNames, setAltNames] = useState(location.state.altNames.join(","))
    const [description, setDescription] = useState(location.state.description)
    const [images, setImages] = useState([])
    const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice)
    const [price, setPrice] = useState(location.state.price)
    const [expDate, setExpDate] = useState(location.state.expDate)
    const [weight, setWeight] = useState(location.state.weight)
    const [unit, setUnit] = useState(location.state.unit)
    const [isAvailable, setIsAvailable] = useState(location.state.isAvailable)
    const navigate = useNavigate()

    async function updateProduct(error) {
        const token = localStorage.getItem("token")

        if (token == null) {
            toast.error("Please login first")
            return
        }

        let imageUrls = location.state.images

        const promisesArray = []

        for (let i = 0; i < images.length; i++) {
            promisesArray[i] = MediaUpload(images[i])
        }

        try {
            if (images.length > 0) {
                imageUrls = await Promise.all(promisesArray)
            }

            console.log(imageUrls)

            const altNamesArray = altNames.split(",")

            const product = {
                productId: productId,
                name: name,
                altNames: altNamesArray,
                description: description,
                images: imageUrls,
                labelledPrice: labelledPrice,
                price: price,
                expDate: expDate,
                weight: weight,
                unit: unit,
                isAvailable: isAvailable
            }

            axios.put(`http://localhost:8070/api/products` + productId, product, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then((res) => {
                toast.success("Product updated successfully")
                navigate("/admin/products")
            })
        } catch (e) {
            toast.error(e.response.data.message)
        }

    }

    return (
        <div className="edit-product-container">
            <h1 className="edit-product-title">Edit Product</h1>
            <input
                type="text"
                disabled
                placeholder="Product ID"
                className="form-input disabled-input"
                value={productId}
                onChange={(e) => {
                    setProductId(e.target.value)
                }}
            />
            <input
                type="text"
                placeholder="Name"
                className="form-input"
                value={name}
                onChange={(e) => {
                    setName(e.target.value)
                }}
            />
            <input
                type="text"
                placeholder="AltNames"
                className="form-input"
                value={altNames}
                onChange={(e) => {
                    setAltNames(e.target.value)
                }}
            />
            <input
                type="text"
                placeholder="Description"
                className="form-input"
                value={description}
                onChange={(e) => {
                    setDescription(e.target.value)
                }}
            />
            <input
                type="file"
                placeholder="Images"
                className="form-input file-input"
                onChange={(e) => {
                    setImages(e.target.files)
                }}
            />
            <input
                type="Number"
                placeholder="Labelled Price"
                className="form-input"
                value={labelledPrice}
                onChange={(e) => {
                    setLabelledPrice(e.target.value)
                }}
            />
            <input
                type="Number"
                placeholder="price"
                className="form-input"
                value={price}
                onChange={(e) => {
                    setPrice(e.target.value)
                }}
            />
            <input
                type="date"
                placeholder="Expiration Date"
                className="form-input"
                value={expDate}
                onChange={(e) => {
                    setExpDate(e.target.value)
                }}
            />
            <input
                type="Number"
                placeholder="Weight"
                className="form-input"
                value={weight}
                onChange={(e) => {
                    setWeight(e.target.value)
                }}
            />
            <select
                className="form-select"
                value={unit}
                onChange={(e) => {
                    setUnit(e.target.value)
                }}
            >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
            </select>
            <div className="form-group">
                <label
                    htmlFor="isAvailable"
                    className="form-label">
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
            <div className="form-actions">
                <Link to="/admin/products" className="">Cancel</Link>
                <button
                    className="btn submit-btn"
                    onClick={updateProduct}>
                        Update Product
                    </button>
            </div>
        </div>
    )
}