import { createSlice } from '@reduxjs/toolkit' // Immer library
import { addDays } from 'date-fns'

const tempProduct = {
  _id: new Date().getTime(),
  name: 'Leche Entera',
  product_date: new Date(),
  expiration_date: addDays(new Date(), 20),
  stock: 120,
  price: 7,
  tags: ['bebida', 'natural', 'refrigerada'],
}

export const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    activeProduct: null,
  },
  reducers: {
    onSetActiveProduct: (state, { payload }) => {
      state.activeProduct = payload
    },
    onAddNewProduct: (state, { payload }) => {
      state.products.push(payload)
      state.activeProduct = null
    },
    onLoadProducts: (state, { payload = [] }) => {
      const ids = new Set(state.products.map(prod => prod._id))
      payload.forEach(prod => {
        if (!ids.has(prod._id)) {
          state.products.push(prod)
        }
      })
    },
    onDeleteProduct: (state, { payload }) => {
      state.products = state.products.filter(product => product._id !== payload)
    },
  },
})

export const {
  onSetActiveProduct,
  onAddNewProduct,
  onLoadProducts,
  onDeleteProduct,
} = productSlice.actions
