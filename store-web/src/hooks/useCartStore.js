import { useDispatch, useSelector } from 'react-redux'
import {
  addToCart,
  removeItemFromCart as removeFromCartAction,
  clearCart,
} from '../store'

export const useCartStore = () => {
  const dispatch = useDispatch()
  const { cart: items } = useSelector(state => state.cart)

  const addItemToCart = product => dispatch(addToCart(product))
  const removeItemFromCart = id => dispatch(removeFromCartAction(id))
  const clearCartItems = () => dispatch(clearCart())

  return {
    items,
    addItemToCart,
    removeItemFromCart,
    clearCartItems,
  }
}
