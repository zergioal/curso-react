import { useState, useEffect, useMemo } from 'react'

export const useForm = (initialForm = {}, formValidations = {}) => {
  const [formValues, setFormValues] = useState(initialForm)
  const [formValidation, setFormValidation] = useState({})

  useEffect(() => {
    createValidators()
  }, [formValues])

  const onInputChange = ({ target }) => {
    const { name, value } = target
    setFormValues({
      ...formValues,
      [name]: value,
    })
  }

  const onResetForm = () => {
    setFormValues(initialForm)
  }

  const createValidators = () => {
    const formCheckedValues = {}

    for (const field of Object.keys(formValidations)) {
      const validations = formValidations[field]
      if (Array.isArray(validations[0])) {
        formCheckedValues[`${field}Valid`] = validations
          .map(([fn, msg]) => (fn(formValues[field]) ? null : msg))
          .filter(Boolean)
      } else {
        const [fn, msg] = validations
        formCheckedValues[`${field}Valid`] = fn(formValues[field]) ? null : msg
      }
    }

    setFormValidation(formCheckedValues)
  }

  const isFormValid = useMemo(() => {
    for (const value of Object.values(formValidation)) {
      if (Array.isArray(value) && value.length > 0) return false
      if (value !== null && typeof value === 'string') return false
    }
    return true
  }, [formValidation])

  return {
    ...formValues,
    formValues,
    onInputChange,
    onResetForm,
    isFormValid,
    ...formValidation,

    // 👇 Exporta esta función para poder usarla como setFormState
    setFormState: setFormValues,
  }
}
