import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createProduct, listProducts } from './api'
import type { Product } from './api'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    listProducts()
      .then(setProducts)
      .catch(() => setLoadError('Could not load products. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (name.trim() === '') {
      setFormError('A name is required.')
      return
    }
    try {
      const created = await createProduct(name.trim())
      setProducts((current) => [...current, created])
      setName('')
      setFormError(null)
    } catch {
      setFormError('Could not create the product. Please try again.')
    }
  }

  return (
    <main>
      <h1>Products</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <button type="submit">Add product</button>
        {formError && <p role="alert">{formError}</p>}
      </form>

      {loading && <p>Loading…</p>}
      {loadError && <p role="alert">{loadError}</p>}
      {!loading && !loadError && products.length === 0 && <p>No products yet.</p>}
      {products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
