import { useDispatch, useSelector } from 'react-redux'
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store'
import { productApi } from '../api'

export const useAuthStore = () => {
  // DONE: Uso de nuestro Store
  const { status, user, errorMessage } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  // DONE: Métodos para login
  const startLogin = async ({ email, password }) => {
    dispatch(onChecking())
    try {
      const { data } = await productApi.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('token-init-date', new Date().getTime())
      localStorage.setItem('user', JSON.stringify(data))

      dispatch(
        onLogin({
          _id: data._id,
          fullName: data.fullName,
          rol: data.rol,
          email: data.email,
        }),
      )
    } catch (error) {
      console.error(
        'Error al registrar:',
        error?.response?.data || error.message,
      )
      dispatch(
        onLogout(
          'Error al registrar: ' + (error?.response?.data?.message || ''),
        ),
      )
      setTimeout(() => {
        dispatch(clearErrorMessage())
      }, 1000)
    }
  }

  // TODO: PRUEBA FINAL, Métodos para register

  const startRegister = async ({ fullName, email, password }) => {
    dispatch(onChecking())
    try {
      /* 1. POST al endpoint de registro */
      const { data } = await productApi.post('/auth/register', {
        fullName,
        email,
        password,
      })

      /* 2. Persistir token/usuario en LocalStorage */
      localStorage.setItem('token', data.token)
      localStorage.setItem('token-init-date', new Date().getTime())
      localStorage.setItem('user', JSON.stringify(data))

      /* 3. Cambiar estado global a `authenticated` */
      dispatch(
        onLogin({
          _id: data._id,
          fullName: data.fullName,
          rol: data.rol,
          email: data.email,
        }),
      )
    } catch (error) {
      console.error(error)
      /* 4. Mostrar mensaje del backend o genérico */
      const msg = error.response?.data?.msg || 'Error al registrar'
      dispatch(onLogout(msg))
      setTimeout(() => dispatch(clearErrorMessage()), 500)
    }
  }

  const checkAuthToken = () => {
    const token = localStorage.getItem('token')
    if (!token) return dispatch(onLogout())

    const tokenInitDate = localStorage.getItem('token-init-date')
    const diffTime = new Date().getTime() - tokenInitDate
    const diffMinutes = diffTime / (1000 * 60)
    if (diffMinutes >= 60) {
      localStorage.clear()
      dispatch(onLogout())
    } else {
      const localUser = JSON.parse(localStorage.getItem('user'))
      dispatch(onLogin(localUser))
    }
  }

  // DONE: Logout
  const startLogout = () => {
    localStorage.clear()
    dispatch(onLogout())
  }

  return {
    // DONE: Propiedades
    status,
    user,
    errorMessage,

    // DONE: Métodos
    startLogin,
    startLogout,
    checkAuthToken,

    //TODO: PRUEBA FINAL
    startRegister,
  }
}
