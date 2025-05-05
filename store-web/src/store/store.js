import { configureStore } from '@reduxjs/toolkit'
import { productSlice, uiSlice, authSlice } from './'

import cartReducer from './cart/cartSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    product: productSlice.reducer,
    ui: uiSlice.reducer,
    cart: cartReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
