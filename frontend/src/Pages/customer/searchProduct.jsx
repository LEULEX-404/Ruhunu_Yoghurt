import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../Components/productCard";
import "../../Css/searchProduct.css"

export default function SearchProductPage(){
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [query, setQuery] = useState("")

    return(
        <div className="product-search-page">
            <input
                type="text"
                placeholder="Search Product"
                className="search-product"
                value={query}
                onChange={async (e) => {
                    setQuery(e.target.value)
                    setIsLoading(true)
                    if(e.target.value.length == 0){
                        setProducts([])
                        setIsLoading(false)
                        return
                    }

                    try{
                        const response = await axios.get(`http://localhost:8070/api/products/search/` + e.target.value)
                        setProducts(response.data)
                    }catch(error){
                        toast.error("error fetching products")
                        console.log(error)
                    }finally {
                        setIsLoading(false)
                    }
                }} />

            <div className="product-search-results">
                {
                    query.length == 0 ? (
                        <h1 className="search-message">Please Enter a search query</h1>
                    ) : (
                        <>
                            {
                                isLoading ? (
                                   <p className="loading-messaage">Loading....</p>
                                ) : (
                                    <>
                                        {
                                            products.map((p) => {
                                                return <ProductCard key={p.productId} product = {p}/>
                                            })
                                        }
                                    </>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
}