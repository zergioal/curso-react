import Swal from 'sweetalert2'
import { format } from 'date-fns'
import { useAuthStore, useProductStore } from '../../hooks'
import { useCartStore } from '../../hooks'
import { useUiStore } from '../../hooks'

export const ProductCard = ({
  _id,
  name = '',
  expiration_date = new Date(),
  stock = 0,
  price = 0,
  tags = [],
  img = '',
}) => {
  const { user } = useAuthStore()
  const { setActiveProduct, startDeletingProduct } = useProductStore()
  const { openProductModal } = useUiStore()

  const handleEdit = () => {
    setActiveProduct({
      _id,
      name,
      expiration_date,
      stock,
      price,
      tags,
      img,
    })
    openProductModal()
  }

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás por eliminar el producto: "${name}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(result => {
      if (result.isConfirmed) {
        startDeletingProduct(_id) // Asegúrate que _id viene en props
        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success')
      }
    })
  }

  const { addItemToCart } = useCartStore()

  const handleAddToCart = () => {
    const product = {
      _id,
      name,
      price,
      img,
    }
    addItemToCart({ ...product, quantity: 1 })
    Swal.fire({
      icon: 'success',
      title: 'Producto añadido al carrito',
      text: name,
      timer: 1200,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
    })
  }

  ;<button className="btn btn-primary" onClick={handleAddToCart}>
    Añadir al carrito
  </button>

  return (
    <div
      className="card shadow-sm border-0"
      style={{ width: '18rem', borderRadius: '10px' }}>
      <img
        src={img || 'https://placehold.co/286x180?text=Sin+imagen'}
        className="card-img-top"
        alt="Product"
        style={{
          height: '180px',
          objectFit: 'cover',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
      />

      <div className="card-body">
        <h5 className="card-title text-center">{name}</h5>
        <p className="card-text text-center mb-1">
          <strong>Precio:</strong> {price} Bs
        </p>
        <p className="card-text text-center mb-1">
          <strong>Stock:</strong> {stock} unidades
        </p>
        <p
          className="card-text text-center mb-2 text-muted"
          style={{ fontSize: '0.9em' }}>
          <i className="fa-regular fa-calendar-days"></i> Expira:{' '}
          {format(expiration_date, 'dd MMM yyyy')}
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-1 mb-2">
          {tags.map(value => (
            <span key={value} className="badge bg-secondary">
              {value}
            </span>
          ))}
        </div>

        <div className="d-flex justify-content-center gap-2">
          {!user?.rol?.includes('admin') && (
            <button
              className="btn btn-sm btn-success"
              onClick={handleAddToCart}>
              <i className="fa-solid fa-cart-plus"></i> Agregar al carrito
            </button>
          )}
        </div>

        {user?.rol?.includes('admin') && (
          <div className="d-flex justify-content-between mt-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={handleEdit}>
              <i className="fa-solid fa-pen-to-square"></i> Editar
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}>
              <i className="fa-solid fa-trash"></i> Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
