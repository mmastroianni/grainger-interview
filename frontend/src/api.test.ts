import { afterEach, describe, expect, it, vi } from 'vitest'
import { createProduct, listProducts } from './api'

function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), { status }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('listProducts', () => {
  it('returns the products from GET /api/products', async () => {
    const fetchMock = mockFetch(200, [{ id: 1, name: 'P1' }])

    await expect(listProducts()).resolves.toEqual([{ id: 1, name: 'P1' }])
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/products', undefined)
  })

  it('throws when the response is not ok', async () => {
    mockFetch(500, {})

    await expect(listProducts()).rejects.toThrow('status 500')
  })
})

describe('createProduct', () => {
  it('POSTs the name as JSON and returns the created product', async () => {
    const fetchMock = mockFetch(201, { id: 2, name: 'P2' })

    await expect(createProduct('P2')).resolves.toEqual({ id: 2, name: 'P2' })
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/products',
      expect.objectContaining({ method: 'POST', body: '{"name":"P2"}' }),
    )
  })

  it('throws when the backend rejects the request', async () => {
    mockFetch(400, {})

    await expect(createProduct('')).rejects.toThrow('status 400')
  })
})
