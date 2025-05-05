import { configureStore } from '@reduxjs/toolkit'

// Reducers
import { productSlice } from './product/productSlice'
import { uiSlice } from './ui/uiSlice'
import { authSlice } from './auth/authSlice'
import cartReducer from './cart/cartSlice'

// Exports individuales (acciones)
export * from './product/productSlice'
export * from './ui/uiSlice'
export * from './auth/authSlice'
export * from './cart/cartSlice'

// Store
export const store = configureStore({
  reducer: {
    product: productSlice.reducer,
    ui: uiSlice.reducer,
    auth: authSlice.reducer,
    cart: cartReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
