import { useDispatch, useSelector } from 'react-redux'
import {
  onAddNewProduct,
  onSetActiveProduct,
  onLoadProducts,
  onDeleteProduct,
} from '../store'
import { productApi } from '../api'
import { useAuthStore } from './useAuthStore'

export const useProductStore = () => {
  const dispatch = useDispatch()
  const { products, activeProduct } = useSelector(state => state.product)
  const { user } = useAuthStore() // 👈 obtenemos el user con _id

  const setActiveProduct = product => {
    dispatch(onSetActiveProduct(product))
  }

  const startSavingProduct = async productData => {
    try {
      console.log('📤 Enviando al backend:', productData)

      if (productData._id) {
        // PATCH para actualizar producto existente
        const { _id, ...rest } = productData
        await productApi.patch(`/products/${_id}`, rest)
      } else {
        // POST para crear nuevo producto
        await productApi.post('/products', productData)
      }

      await startLoadingProducts() // refrescar lista
    } catch (error) {
      console.error(
        '❌ Error al guardar producto:',
        error.response?.data || error.message,
      )
      throw error // para que el modal lo capture si es necesario
    }
  }

  const startLoadingProducts = async () => {
    try {
      const { data } = await productApi.get('/products')
      console.log('📦 Productos del backend:', data)
      dispatch(onLoadProducts(data))
    } catch (error) {
      console.log('❌ Error cargando productos:', error)
    }
  }

  const startDeletingProduct = async id => {
    try {
      await productApi.delete(`/products/${id}`)
      dispatch(onDeleteProduct(id))
    } catch (error) {
      console.error('❌ Error eliminando el producto:', error)
    }
  }

  return {
    products,
    activeProduct,
    setActiveProduct,
    startSavingProduct,
    startLoadingProducts,
    startDeletingProduct,
  }
}
