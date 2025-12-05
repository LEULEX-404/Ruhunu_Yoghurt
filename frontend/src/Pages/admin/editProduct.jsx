import { useState } from "react"
import toast from "react-hot-toast"
import { Link, useLocation, useNavigate } from "react-router-dom"
import MediaUpload from "../../utils/mediaUpload"
import axios from "axios"
import "../../Css/editProduct.css"

export default function EditProductPage() {

    function formDateForInput(dateString){
        if(!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0]
    }

    const location = useLocation()
    const [productId, setProductId] = useState(location.state.productId)
    const [name, setName] = useState(location.state.name)
    const [altNames, setAltNames] = useState(location.state.altNames.join(","))
    const [description, setDescription] = useState(location.state.description)
    const [images, setImages] = useState([])
    const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice)
    const [price, setPrice] = useState(location.state.price)
    const [expDate, setExpDate] = useState(formDateForInput(location.state.expDate))
    const [weight, setWeight] = useState(location.state.weight)
    const [unit, setUnit] = useState(location.state.unit)
    const [quantity, setQuantity] = useState(location.state.quantity)
    const [isAvailable, setIsAvailable] = useState(location.state.isAvailable)
    const navigate = useNavigate()

    async function updateProduct() {
        const token = localStorage.getItem("token")
        if (!token) return toast.error("Please login first")

        if(Number(weight) <= 0 || Number(weight) > 20){
            toast.error("Product weight must be greater than 0 and less than 20kg")
            return
        }

        const today = new Date()
        const selectedDate = new Date(expDate)
        if(
            selectedDate.getFullYear() === today.getFullYear() &&
            selectedDate.getMonth() === today.getMonth() && 
            selectedDate.getDate() === today.getDate()
        ){
            toast.error("Already Expired!")
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

            const altNamesArray = altNames.split(",")

            const product = {
                productId: productId,
                name: name,
                altNames: altNamesArray,
                description: description,
                images: imageUrls,
                labelledPrice: labelledPrice,
                price: price,
                expDate: new Date(expDate).toISOString(),
                weight: Number(weight),
                unit: unit,
                quantity: quantity,
                isAvailable: isAvailable
            }

            await axios.put(`http://localhost:8070/api/products/` + productId, product, {
                headers: { "Authorization": "Bearer " + token }
            })
            toast.success("Product updated successfully")
            navigate("/admin/products")

        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to update product")
        }
    }

    return (
        <div className="edit-product-container">
            <h1 className="edit-product-title">Edit Product</h1>

            <div className="form-group">
                <label htmlFor="productId">Product ID</label>
                <input
                    id="productId"
                    type="text"
                    disabled
                    className="form-input disabled-input"
                    value={productId}
                />
            </div>

            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="altNames">Alt Names (comma separated)</label>
                <input
                    id="altNames"
                    type="text"
                    className="form-input"
                    value={altNames}
                    onChange={(e) => setAltNames(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                    id="description"
                    type="text"
                    className="form-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="images">Images</label>
                <input
                    id="images"
                    type="file"
                    multiple
                    className="form-input file-input"
                    onChange={(e) => setImages(e.target.files)}
                />
            </div>

            <div className="form-row">
                <div className="form-group half-width">
                    <label htmlFor="labelledPrice">Labelled Price</label>
                    <input
                        id="labelledPrice"
                        type="number"
                        className="form-input"
                        value={labelledPrice}
                        onChange={(e) => setLabelledPrice(e.target.value)}
                    />
                </div>
                <div className="form-group half-width">
                    <label htmlFor="price">Price</label>
                    <input
                        id="price"
                        type="number"
                        className="form-input"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group half-width">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        id="quantity"
                        type="number"
                        className="form-input"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group half-width">
                    <label htmlFor="expDate">Expiration Date</label>
                    <input
                        id="expDate"
                        type="date"
                        className="form-input"
                        value={expDate}
                        onChange={(e) => setExpDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group half-width">
                    <label htmlFor="weight">Weight</label>
                    <input
                        id="weight"
                        type="number"
                        className="form-input"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                <div className="form-group half-width">
                    <label htmlFor="unit">Unit</label>
                    <select
                        id="unit"
                        className="form-select"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                    >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="l">l</option>
                        <option value="ml">ml</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="isAvailable">Availability</label>
                <select
                    id="isAvailable"
                    className="form-select"
                    value={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.value === "true")}
                >
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                </select>
            </div>

            <div className="form-actions">
                <Link to="/admin/products" className="cancel-btn">Cancel</Link>
                <button className="btn submit-btn" onClick={updateProduct}>
                    Update Product
                </button>
            </div>
        </div>
    )
}
