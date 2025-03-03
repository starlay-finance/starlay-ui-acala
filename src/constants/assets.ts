import _ from 'lodash'
import { SymbolAca, SymbolDot, SymbolLdot, SymbolUsdc } from 'src/assets/images'
import { Asset, AssetSymbol } from 'src/types/models'

export const LISTED_ASSET_SYMBOLS = ['ACA', 'LDOT', 'USDC', 'DOT'] as const
export const LEVERAGEABLE_ASSET_SYMBOLS = ['DOT']
export const LEVERAGEABLE_COLLATERAL_ASSET_SYMBOLS: {
  [
    key: typeof LEVERAGEABLE_ASSET_SYMBOLS[number]
  ]: typeof LISTED_ASSET_SYMBOLS[number]
} = { DOT: 'LDOT' }

export const ASSET_ADDRESSES: {
  [key: typeof LEVERAGEABLE_ASSET_SYMBOLS[number]]: string
} = {
  DOT: '0x0000000000000000000100000000000000000002',
}

export const SYMBOL_ORDER: Record<AssetSymbol, number> =
  LISTED_ASSET_SYMBOLS.reduce(
    (res, symbol, idx) => ({
      ...res,
      [symbol]: idx,
    }),
    {},
  ) as Record<AssetSymbol, number>

export const ASSETS_DICT: { [key in AssetSymbol]: Asset } = {
  ACA: {
    symbol: 'ACA',
    name: 'Acala',
    icon: SymbolAca,
  },
  LDOT: {
    symbol: 'LDOT',
    name: 'Liquid DOT',
    icon: SymbolLdot,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: SymbolUsdc,
  },
  DOT: {
    symbol: 'DOT',
    name: 'Polkadot',
    icon: SymbolDot,
  },
} as const

export const ASSETS_BY_ADDRESS_DICT: Partial<Record<string, Asset>> = {
  '0x07DF96D1341A7d16Ba1AD431E2c847d978BC2bCe': {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: SymbolUsdc,
  },
} as const

export const ASSETS: Asset[] = Object.values(_.omit(ASSETS_DICT, 'ACA'))
