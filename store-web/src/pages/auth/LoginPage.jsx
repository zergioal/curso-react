import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

import { useForm } from '../../hooks/useForm'

import './LoginPage.css'
import { useAuthStore } from '../../hooks'

const loginFormValues = {
  email: '',
  password: '',
}

const loginValidations = {
  email: [
    value => value.includes('@') && value.includes('.'),
    'El correo debe tener "@" y un "."',
  ],
  password: [
    value => value.length >= 6, // 1 letra (1 Mayuscula, 1 Minúscula), 1 numero, 1 caracter especial
    'El password debe de tener más de 6 letras',
  ],
}

const registerValidations = {
  fullName: [value => value.trim().length > 0, 'El nombre es obligatorio'],
  email: [
    value => value.includes('@') && value.includes('.'),
    'El correo debe tener "@" y un "."',
  ],
  password: [
    value =>
      value.length >= 6 &&
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])/.test(value),
    'La contraseña debe tener al menos 1 mayúscula, 1 minúscula y un número o símbolo',
  ],
  passwordRepeat: [
    value => value === registerFormValues.password,
    'Las contraseñas no coinciden',
  ],
}

const registerFormValues = {
  fullName: '',
  email: '',
  password: '',
  passwordRepeat: '',
}

const isPasswordStrong = password =>
  /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])/.test(password)

function LoginPage() {
  // Custom Hooks

  // TODO: PRUEBA FINAL, Método Register
  const { errorMessage, startLogin, startRegister } = useAuthStore()

  const {
    email: loginEmail,
    password: loginPassword,
    formValues: formLogin,
    onInputChange: onLoginInputChange,

    isFormValid,
    emailValid,
    passwordValid,
  } = useForm(loginFormValues, loginValidations)
  const {
    fullName: registerFullName,
    email: registerEmail,
    password: registerPassword,
    passwordRepeat: registerPasswordRepeat,

    fullNameValid,
    emailValid: registerEmailValid,
    passwordValid: registerPasswordValid,
    passwordRepeatValid,

    isFormValid: isRegisterFormValid,
    formValues: formRegister,
    onInputChange: onRegisterInputChange,
  } = useForm(registerFormValues, registerValidations)

  // Estados Locales
  const [formSubmittedLogin, setFormSubmittedLogin] = useState(false)
  const [formSubmittedRegister, setFormSubmittedRegister] = useState(false)

  const loginSubmit = event => {
    event.preventDefault()
    setFormSubmittedLogin(true)
    setFormSubmittedRegister(false)

    if (!isFormValid) return

    // Thunk HTTP API
    startLogin(formLogin)
  }

  const registerSubmit = event => {
    event.preventDefault()
    setFormSubmittedRegister(true)
    setFormSubmittedLogin(false)
    /* Validaciones básicas */
    if (!isPasswordStrong(registerPassword)) {
      return Swal.fire(
        'Error',
        'La contraseña debe tener al menos una mayúscula, una minúscula y un número o símbolo',
        'error',
      )
    }

    if (registerPassword !== registerPasswordRepeat) {
      return Swal.fire('Error', 'Las contraseñas no coinciden', 'error')
    }

    if (
      !registerFullName.trim() ||
      !registerEmail.trim() ||
      registerPassword.length < 6
    ) {
      return Swal.fire('Error', 'Rellena todos los campos', 'error')
    }
    console.log('Datos enviados al backend:', {
      fullName: registerFullName,
      email: registerEmail,
      password: registerPassword,
    })
    /* Thunk HTTP API para registrar */
    startRegister({
      fullName: registerFullName,
      email: registerEmail,
      password: registerPassword,
    })
  }

  useEffect(() => {
    if (errorMessage !== undefined) {
      Swal.fire('Error en la autenticación', errorMessage, 'error')
    }
  }, [errorMessage])

  const isRegisterValid =
    registerFullName.trim().length > 0 &&
    registerEmail.trim().length > 0 &&
    registerPassword.length >= 6 &&
    registerPassword === registerPasswordRepeat &&
    isPasswordStrong(registerPassword)

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-6 login-form-1">
          <h3>Ingreso</h3>
          <form onSubmit={loginSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Correo"
                name="email"
                value={loginEmail}
                onChange={onLoginInputChange}
                autoComplete="off"
                spellCheck="false"
              />
              {!!emailValid && formSubmittedLogin && (
                <div>
                  <span>{emailValid}</span>
                </div>
              )}
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                name="password"
                value={loginPassword}
                onChange={onLoginInputChange}
                autoComplete="off"
                spellCheck="false"
              />
              {!!passwordValid && formSubmittedLogin && (
                <div>
                  <span>{passwordValid}</span>
                </div>
              )}
            </div>
            <div className="d-grid gap-2">
              <button
                type="submit"
                className={`btnSubmit ${!isFormValid && formSubmittedLogin ? 'btn-disabled' : ''}`}
                disabled={!isFormValid && formSubmittedLogin}>
                Login
              </button>
            </div>
          </form>
        </div>

        <div className="col-md-6 login-form-2">
          <h3>Registro</h3>
          <form onSubmit={registerSubmit}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre"
                name="fullName"
                value={registerFullName}
                onChange={onRegisterInputChange}
                autoComplete="off"
                spellCheck="false"
              />
              {!!fullNameValid && formSubmittedRegister && (
                <div>
                  <span className="text-danger">{fullNameValid}</span>
                </div>
              )}
            </div>

            <div className="form-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Correo"
                name="email"
                value={registerEmail}
                onChange={onRegisterInputChange}
                autoComplete="off"
                spellCheck="false"
              />
              {!!registerEmailValid && formSubmittedRegister && (
                <div>
                  <span className="text-danger">{registerEmailValid}</span>
                </div>
              )}
            </div>

            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                name="password"
                value={registerPassword}
                onChange={onRegisterInputChange}
                autoComplete="off"
                spellCheck="false"
              />
              {!!registerPasswordValid && formSubmittedRegister && (
                <div>
                  <span className="text-danger">{registerPasswordValid}</span>
                </div>
              )}
            </div>

            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Repita la contraseña"
                name="passwordRepeat"
                value={registerPasswordRepeat}
                onChange={onRegisterInputChange}
                autoComplete="off"
                spellCheck="false"
              />
              {!!passwordRepeatValid && formSubmittedRegister && (
                <div>
                  <span className="text-danger">{passwordRepeatValid}</span>
                </div>
              )}
            </div>

            <div className="d-grid gap-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Crear cuenta"
                disabled={!isRegisterFormValid && formSubmittedRegister}
                onClick={() => setFormSubmittedRegister(true)}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
