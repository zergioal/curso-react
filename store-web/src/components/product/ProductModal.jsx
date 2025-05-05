import { useEffect, useMemo, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import Modal from 'react-modal'
import Swal from 'sweetalert2'
import { es } from 'date-fns/locale'
import { WithContext as ReactTags, SEPARATORS } from 'react-tag-input'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm, useUiStore, useProductStore } from '../../hooks'
import { addDays, differenceInSeconds, subDays } from 'date-fns'

registerLocale('es', es)

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

Modal.setAppElement('#root')

const today = new Date()

const year = today.getFullYear()
const month = today.getMonth()
const day = today.getDate()

const productFormValues = {
  name: '',
  product_date: today,
  expiration_date: addDays(new Date(year, month, day), 30),
  stock: 100,
  price: '',
  tags: '',
  img: '',
}

const productValidations = {
  name: [value => value.length > 2, 'Debe ingresar producto válido'],
  stock: [
    [value => !isNaN(value), 'Debe ingresar un número'],
    [value => +value >= 30, 'Debe ingresar mínimo 30 unidades'],
  ],

  price: [value => +value > 0, 'Debe ingresar precio'],
}

export const ProductModal = () => {
  const { isProductModalOpen, closeProductModal } = useUiStore()
  const { startSavingProduct, activeProduct, setActiveProduct } =
    useProductStore()

  const {
    name,
    product_date,
    expiration_date,
    stock,
    price,
    formValues,
    onInputChange,
    onResetForm,
    setFormState,
    isFormValid,
    nameValid,
    stockValid,
    priceValid,
  } = useForm(productFormValues, productValidations)

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [tags, setTags] = useState([])

  // Cargar datos si se edita producto
  useEffect(() => {
    if (activeProduct) {
      setFormState({
        ...activeProduct,
        _id: activeProduct._id, // 👈 agrega esto si no estaba
        product_date: activeProduct.product_date
          ? new Date(activeProduct.product_date)
          : new Date(),
        expiration_date: activeProduct.expiration_date
          ? new Date(activeProduct.expiration_date)
          : addDays(new Date(), 30),
      })
      setTags(activeProduct.tags?.map(tag => ({ id: tag, text: tag })) || [])
    }
  }, [activeProduct])

  const nameClass = useMemo(
    () => (!formSubmitted ? '' : !nameValid ? '' : 'is-invalid'),
    [formSubmitted, nameValid],
  )
  const stockClass = useMemo(
    () => (!formSubmitted ? '' : !stockValid ? '' : 'is-invalid'),
    [formSubmitted, stockValid],
  )
  const priceClass = useMemo(
    () => (!formSubmitted ? '' : !priceValid ? '' : 'is-invalid'),
    [formSubmitted, priceValid],
  )

  const onDateChange = (value, changing) => {
    onInputChange({ target: { name: changing, value } })
  }

  const onCloseModal = () => {
    closeProductModal()
    onResetForm()
    setFormSubmitted(false)
    setTags([])
    setActiveProduct(null)
  }

  const onSubmit = async event => {
    event.preventDefault()
    setFormSubmitted(true)

    const difference = differenceInSeconds(expiration_date, product_date)

    if (isNaN(difference) || difference < 0) {
      Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error')
      return
    }

    if (!isFormValid) {
      Swal.fire(
        'Formulario inválido',
        'Revisa los campos del formulario',
        'error',
      )
      return
    }

    const data = {
      ...formValues,
      _id: activeProduct?._id, // esto es clave
      tags: tags.map(({ text }) => text),
      stock: Number(formValues.stock),
      price: Number(formValues.price),
    }

    console.log('📤 Enviando al backend:', data)

    if (!data.img || data.img.trim() === '') {
      data.img = 'https://placehold.co/300x200?text=Producto'
    }

    try {
      await startSavingProduct(data)
    } catch (error) {
      console.error('❌ Error al guardar producto:', error)
      Swal.fire('Error al guardar', 'Hubo un problema con el servidor', 'error')
      return
    }

    Swal.fire({
      title: data._id ? 'Producto actualizado' : 'Producto creado',
      text: 'El producto fue guardado correctamente',
      icon: 'success',
      confirmButtonText: 'OK',
    })

    // DONE: Cerrar el modal, resetear estados por defecto
    onCloseModal()
  }

  const handleDelete = index => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const onTagUpdate = (index, newTag) => {
    const updatedTags = [...tags]
    updatedTags.splice(index, 1, newTag)
    setTags(updatedTags)
  }

  const handleAddition = tag => {
    setTags(prevTags => [...prevTags, tag])
  }

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice()
    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)
    setTags(newTags)
  }

  const onClearAll = () => {
    setTags([])
  }

  return (
    <Modal
      isOpen={isProductModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}>
      <h1>{activeProduct ? 'Editar Producto' : 'Nuevo Producto'}</h1>
      <hr />

      <form onSubmit={onSubmit}>
        <div className="form-group mb-2">
          <label>Fecha de compra</label>
          <DatePicker
            minDate={subDays(new Date(), 10)}
            maxDate={new Date()}
            selected={product_date}
            className="form-control"
            onChange={value => onDateChange(value, 'product_date')}
            locale="es"
            timeCaption="Hora"
            dateFormat="Pp"
            showTimeSelect
          />
        </div>

        <div className="form-group mb-2">
          <label>Fecha de expiración</label>
          <DatePicker
            minDate={addDays(new Date(), 10)}
            selected={expiration_date}
            className="form-control"
            onChange={value => onDateChange(value, 'expiration_date')}
            locale="es"
            dateFormat="P"
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Producto</label>
          <input
            type="text"
            className={`form-control ${nameClass}`}
            placeholder="Nombre del producto"
            name="name"
            autoComplete="off"
            value={name}
            onChange={onInputChange}
          />
          {nameValid && formSubmitted && (
            <small className="invalid-feedback">{nameValid}</small>
          )}
        </div>

        <div className="form-group mb-2">
          <label>Stock</label>
          <input
            type="text"
            className={`form-control ${stockClass}`}
            placeholder="Unidades disponibles"
            name="stock"
            autoComplete="off"
            value={stock}
            onChange={onInputChange}
          />
          {formSubmitted &&
            Array.isArray(stockValid) &&
            stockValid.length > 0 &&
            stockValid.map((msgError, index) => (
              <div key={index} className="invalid-feedback d-block">
                {msgError}
              </div>
            ))}
        </div>

        <div className="form-group mb-2">
          <label>Precio</label>
          <input
            type="text"
            className={`form-control ${priceClass}`}
            placeholder="Bs.-"
            name="price"
            value={price}
            onChange={onInputChange}
          />
          {priceValid && formSubmitted && (
            <small className="invalid-feedback">{priceValid}</small>
          )}
        </div>

        <div className="form-group mb-2">
          <label>Características</label>
          <ReactTags
            tags={tags}
            separators={[SEPARATORS.ENTER, SEPARATORS.TAB, SEPARATORS.COMMA]}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            onTagUpdate={onTagUpdate}
            inputFieldPosition="inline"
            editable
            clearAll
            onClearAll={onClearAll}
            maxTags={7}
          />
        </div>

        <div className="form-group mb-2">
          <label htmlFor="img">URL de la imagen</label>
          <input
            type="text"
            className="form-control"
            name="img"
            placeholder="https://..."
            value={formValues.img}
            onChange={onInputChange}
          />
          {formValues.img && (
            <div className="text-center mt-2">
              <img
                src={formValues.img}
                alt="Vista previa"
                style={{
                  width: '100%',
                  maxHeight: '180px',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  )
}
