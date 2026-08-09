"use client"

import { createORPCClient } from '@orpc/client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import type { ContractRouterClient } from '@orpc/contract'
import { contract } from '@repo/contract'

type Client = ContractRouterClient<typeof contract>

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`
  }
  return '/api'
}

const link = new OpenAPILink(contract, {
  url: getBaseUrl(),
  headers: () => ({
    'Content-Type': 'application/json',
  }),
  fetch: async (request, init) => {
    return fetch(request, {
      ...init,
      credentials: 'include',
    })
  },
})

export const orpcClient = createORPCClient<Client>(link)