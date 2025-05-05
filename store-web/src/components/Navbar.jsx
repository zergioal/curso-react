import { useAuthStore } from '../hooks'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  const { startLogout, user } = useAuthStore()

  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
      <span className="navbar-brand">
        <i className="fas fa-user-alt"></i>
        &nbsp; {user.fullName}
      </span>

      <button className="btn btn-outline-danger" onClick={startLogout}>
        <i className="fas fa-sign-out-alt"></i>
        &nbsp;
        <span>Salir</span>
      </button>

      {user?.rol !== 'admin' && (
        <Link to="/cart" className="btn btn-outline-primary">
          <i className="fa-solid fa-cart-shopping"></i> Ver Carrito
        </Link>
      )}
    </div>
  )
}
