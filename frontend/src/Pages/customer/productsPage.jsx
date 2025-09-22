import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../../Components/productCard";
import '../../Css/customerProductsPage.css'

export default function ProductPage(){
    const[products, setProducts] = useState([])
    const[isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if(isLoading){
            axios.get(`http://localhost:8070/api/products`).then((res) => {
                setProducts(res.data)
                setIsLoading(false)
            })
        }
    }, [isLoading])

    if (isLoading) {
        return <div className="loading-message">Loading products...</div>;
    }
    
    return(
        <div className="product-container">
            {
                products.map((product) => {
                    return(
                        <ProductCard key={product.productId} product = {product}/>
                    )
                })
            }
        </div>
    )
}