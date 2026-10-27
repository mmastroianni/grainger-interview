import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import * as api from './api'

vi.mock('./api')

const listProducts = vi.mocked(api.listProducts)
const createProduct = vi.mocked(api.createProduct)

beforeEach(() => {
  vi.resetAllMocks()
})

describe('product list', () => {
  it('shows existing products in the order returned', async () => {
    listProducts.mockResolvedValue([
      { id: 1, name: 'P1' },
      { id: 2, name: 'P2' },
    ])

    render(<App />)

    const items = await screen.findAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual(['P1', 'P2'])
  })

  it('shows an empty state when there are no products', async () => {
    listProducts.mockResolvedValue([])

    render(<App />)

    expect(await screen.findByText('No products yet.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('shows an error when the backend cannot be reached', async () => {
    listProducts.mockRejectedValue(new Error('network down'))

    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load products')
  })
})

describe('create product form', () => {
  it('adds the new product to the list and clears the field', async () => {
    listProducts.mockResolvedValue([])
    createProduct.mockResolvedValue({ id: 1, name: 'P1' })
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('No products yet.')

    await user.type(screen.getByLabelText('Name'), 'P1')
    await user.click(screen.getByRole('button', { name: 'Add product' }))

    expect(await screen.findByText('P1')).toBeInTheDocument()
    expect(createProduct).toHaveBeenCalledWith('P1')
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })

  it('does not create a product when the name is blank', async () => {
    listProducts.mockResolvedValue([])
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('No products yet.')

    await user.type(screen.getByLabelText('Name'), '   ')
    await user.click(screen.getByRole('button', { name: 'Add product' }))

    expect(screen.getByRole('alert')).toHaveTextContent('A name is required.')
    expect(createProduct).not.toHaveBeenCalled()
  })

  it('shows an error and keeps the name when creating fails', async () => {
    listProducts.mockResolvedValue([])
    createProduct.mockRejectedValue(new Error('status 500'))
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('No products yet.')

    await user.type(screen.getByLabelText('Name'), 'P1')
    await user.click(screen.getByRole('button', { name: 'Add product' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not create the product')
    expect(screen.getByLabelText('Name')).toHaveValue('P1')
  })
})
