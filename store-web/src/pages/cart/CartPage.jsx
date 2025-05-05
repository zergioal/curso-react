import { useCartStore } from '../../hooks'

export const CartPage = () => {
  const { items, removeItemFromCart, clearCartItems } = useCartStore()

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="container mt-4">
        <h3 className="text-center">Tu carrito está vacío 🛒</h3>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Carrito de Compras</h2>
      <div className="row">
        {items.map(({ _id, name, img, price, quantity }) => (
          <div className="col-md-4 mb-3" key={_id}>
            <div className="card h-100">
              <img
                src={img || 'https://placehold.co/286x180'}
                className="card-img-top"
                style={{ height: '180px', objectFit: 'cover' }}
                alt={name}
              />
              <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text">Cantidad: {quantity}</p>
                <p className="card-text">Precio: {price} Bs.</p>
                <p className="card-text">Subtotal: {price * quantity} Bs.</p>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeItemFromCart(_id)}>
                  <i className="fa-solid fa-trash"></i> Quitar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <h4>Total: {total.toFixed(2)} Bs.</h4>
        <div>
          <button className="btn btn-danger me-2" onClick={clearCartItems}>
            Vaciar carrito
          </button>
          <button className="btn btn-success">Finalizar compra</button>
        </div>
      </div>
    </div>
  )
}
