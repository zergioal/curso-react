import { useUiStore, useAuthStore } from '../../hooks'

export const FabAddNew = () => {
  const { openProductModal } = useUiStore()
  const { user } = useAuthStore()

  // Solo admins pueden ver el botón
  if (!user?.rol?.includes('admin')) return null

  return (
    <button className="btn btn-primary fab" onClick={openProductModal}>
      <i className="fas fa-plus"></i>
    </button>
  )
}
