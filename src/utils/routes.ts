import { NetworkType } from 'src/libs/config'
import { SorryReason } from 'src/types/page'

export const DEVELOPERS = 'https://docs.starlay.finance/development/repository'
export const DOCS = 'https://docs.starlay.finance'
export const DOCS_RISK = 'https://docs.starlay.finance/asset/risk-parameters'
export const DOCS_MAKAI = 'https://docs.starlay.finance/function/makai'
export const DOCS_LAUNCHPAD = 'https://docs.starlay.finance/function/launchpad'
export const DOCS_VELAY = 'https://docs.starlay.finance/function/lock-vote'
export const DOCS_VELAY_TERMS =
  'https://docs.starlay.finance/function/lock-vote#terminology'
export const DOCS_VELAY_CLAIM =
  'https://docs.starlay.finance/function/lock-vote#terminology'
export const DISCORD = 'https://discord.gg/M4NjBJZ94b'
export const GITHUB = 'https://github.com/starlay-finance'
export const MEDIA_KIT = 'https://github.com/starlay-finance/media-kit'
export const TWITTER = 'https://twitter.com/starlay_fi'
export const MEDIUM = 'http://medium.com/@starlay_fi'

export const ARTHSWAP_SWAP_URL = 'https://app.arthswap.org/#/swap'

export const TOP = '/'
export const APP_ROOT = ''
export const APP = '/app/evm'
export const MARKETS = '/markets'
export const LEVERAGE = '/leveraged-staking'
export const LAY_VELAY = '/lay'
export const LAUNCHPAD = '/launchpad'
export const SWAP = ARTHSWAP_SWAP_URL
export const GOVERNANCE = 'https://forum.starlay.finance/'
export const SNAPSHOT = 'https://snapshot.org/#/starlay.eth'
export const BUG_BOUNTY = ''
export const SUPPORT = DISCORD
export const EVM_PREFIX = '/evm'
export const POLKADOT_PREFIX = '/wasm'
export const POLKADOT_APP = '/app/wasm'
export const POLKADOT_MARKETS = '/app/wasm/markets'

export const evmOnly = (path: string, network: NetworkType | undefined) =>
  network === 'EVM' ? `${APP}${path}` : undefined

export const byNetwork = (path: string, network: NetworkType) => {
  const prefix = network === 'Polkadot' ? POLKADOT_APP : APP
  return `${prefix}${path}`
}

export const matchPath = (pathname: string, path: string) =>
  new RegExp(`(${APP}|${POLKADOT_APP})${path}$`).test(pathname)

export const POLKADOT_SUPPORTED_PAGES = [APP, MARKETS]

export const toLaunchpad = (token: string, network: NetworkType | undefined) =>
  evmOnly(`${LAUNCHPAD}/${token}`, network)
export const toMakaiLoop = (symbol: string, network: NetworkType | undefined) =>
  evmOnly(`${LEVERAGE}?asset=${symbol}`, network)

export const SORRY = '/sorry'
export const sorryFor = (reason: SorryReason) => `${SORRY}?reason=${reason}`

const MOBILE_NOT_SUPPORTED_PATHS = [
  POLKADOT_APP,
  POLKADOT_MARKETS,
  LAY_VELAY,
  LAUNCHPAD,
]

export const isMobileSupported = (path: string) =>
  !MOBILE_NOT_SUPPORTED_PATHS.includes(path)

export const GAS_GUIDE_URL =
  'https://metamask.zendesk.com/hc/en-us/articles/4404600179227-User-Guide-Gas'

export const METAMASK_EXT_URL =
  'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn'
export const POLKADOT_JS_EXT_URL =
  'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'
