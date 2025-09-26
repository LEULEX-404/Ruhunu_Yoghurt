import Payment from "../../models/Pathum/payment.js"
import Product from "../../models/Pathum/product.js"

export async function addPayment(req, res) {

    if(req.user == null){
        res.status(403).json({
            message : "Please login and try again"
        })
        return
    }

    const paymentInfo = req.body

    if(paymentInfo.name == null){
        paymentInfo.name = req.user.name
    }

    let paymentId = "RYS00001"

    const lastPayment = await Payment.find().sort({date : -1}).limit(1)

    if(lastPayment.length > 0){
        const lastPaymentId = lastPayment[0].paymentId

        const lastPaymentNumberString = lastPaymentId.replace("RYS", "")
        const lastPaymentNumber = parseInt(lastPaymentNumberString)
        const newPaymentNumber = lastPaymentNumber + 1;
        const newPaymentNumberString = String(newPaymentNumber).padStart(5, '0')
        paymentId = "RYS" + newPaymentNumberString
    }

    try {
        console.log("Payment Info:", paymentInfo);
        console.log("User:", req.user);
        let total = 0;
        const products = []

        for (let i = 0; i < paymentInfo.products.length; i++) {
            const item = await Product.findOne({productId : paymentInfo.products[i].productId})

            if(item == null){
                res.status(404).json({
                    message : "Product with productId " + paymentInfo.products[i].productId + "not found"
                })
                return
            }

            if(item.isAvailable == false){
                res.status(404).json({
                    message : "Product with productId " + paymentInfo.products[i].productId + " is not available right now"
                })
                return
            }

            products[i] = {
                productInfo : {
                    productId : item.productId,
                    name : item.name,
                    labelledPrice : item.labelledPrice,
                    price : item.price
                },
                quantity : paymentInfo.products[i].qty
            }
            //change logic
            // if(item.labelledPrice > item.price){
            //     total += (item.price * paymentInfo.products[i].qty) 
            // } else {
            //     total += (item.labelledPrice * paymentInfo.products[i].qty) 
            // }

            let unitPrice;
            if(item.price && item.price > 0 && item.labelledPrice > item.price){
                unitPrice = item.price
            }else{
                unitPrice = item.labelledPrice
            }
            total += unitPrice * paymentInfo.products[i].qty
                     
        }

        const payment = new Payment({
            paymentId : paymentId,
            name : paymentInfo.name,
            products : products,
            email : req.user.email,
            address : paymentInfo.address,
            phone : paymentInfo.phone,
            total : total,
            paymentMode : paymentInfo.paymentMode,
            cardNumber : paymentInfo.cardNumber,
            cardcvv : paymentInfo.cardcvv,
            coupon : paymentInfo.coupon
        })

        const createPayment = await payment.save()
        res.json({
            message : "Payment created successfully",
            paymentId : createPayment.paymentId
        })
        
    } catch (err) {
        console.error("Payment Error:", err);
        res.status(500).json({
            message : "Failed to create payment",
            error : err
            
        })
    }
}