import { Chain } from '@wagmi/core'
 
export const dfcrcChain = {
  id: 1007845588,
  name: 'DFCRC Network',
  network: 'dfcrc',
  nativeCurrency: {
    decimals: 18,
    name: 'eAUD',
    symbol: 'eAUD',
  },
  rpcUrls: {
    public: { http: ['https://a0jq79osep-a0yjwjns56-rpc.au0-aws.kaleido.io'] },
    default: { http: ['https://a0jq79osep-a0yjwjns56-rpc.au0-aws.kaleido.io'] },
  },
} as const satisfies Chain