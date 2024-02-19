import {addCartItemRequest, addCartItemSuccess} from '../slices/cartSlice';
import axios from 'axios'

export const addCartItem = (id, quantity) => async(dispatch) => {
    try {
        dispatch(addCartItemRequest())
        const {data } = await axios.get(`/api/v1/product/${id}`)
        dispatch(addCartItemSuccess({
            product: data.Product._id,
            name: data.Product.name,
            price: data.Product.price,
            image: data.Product.images[0].filename,
            stock: data.Product.stock,
            quantity
        }))
    } catch (error) {
        
    }
}