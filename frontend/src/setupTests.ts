import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest has no globals by default, so Testing Library cannot unmount between tests on its own.
afterEach(cleanup)
