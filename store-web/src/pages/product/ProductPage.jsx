import { useEffect, useState } from 'react'
import { Navbar, FabAddNew, ProductModal, ProductCard } from '../../components'
import { useProductStore } from '../../hooks'

export const ProductPage = () => {
  const { products, startLoadingProducts, setActiveProduct } = useProductStore()

  useEffect(() => {
    startLoadingProducts()
  }, [])

  return (
    <>
      <Navbar />

      <section className="container">
        <h1 className="text-center">Store app</h1>

        <article className="d-flex gap-2 mt-4 flex-wrap justify-content-center">
          {products.map(
            ({ _id, name, expiration_date, price, stock, tags, img }) => (
              <ProductCard
                key={_id}
                name={name}
                expiration_date={expiration_date}
                price={price}
                stock={stock}
                tags={tags}
                img={img}
                onEdit={() =>
                  setActiveProduct({
                    _id,
                    name,
                    expiration_date,
                    price,
                    stock,
                    tags,
                    img,
                  })
                }
              />
            ),
          )}
        </article>
      </section>

      <ProductModal />
      <FabAddNew />
    </>
  )
}
