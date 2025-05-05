import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      const itemExists = state.cart.find(item => item._id === payload._id)
      if (itemExists) {
        itemExists.quantity += payload.quantity || 1
      } else {
        state.cart.push({ ...payload, quantity: payload.quantity || 1 })
      }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    removeItemFromCart: (state, { payload }) => {
      state.cart = state.cart.filter(item => item._id !== payload)
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    clearCart: state => {
      state.cart = []
      localStorage.setItem('cart', '[]')
    },
  },
})

export const { addToCart, removeItemFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
