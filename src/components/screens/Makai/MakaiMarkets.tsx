import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { asStyled } from 'src/components/hoc/asStyled'
import { useWalletModal } from 'src/components/parts/Modal/WalletModal'
import {
  LEVERAGEABLE_ASSET_SYMBOLS,
  LEVERAGEABLE_COLLATERAL_ASSET_SYMBOLS,
} from 'src/constants/assets'
import { useMarketData } from 'src/hooks/useMarketData'
import { useUserData } from 'src/hooks/useUserData'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { breakpoint } from 'src/styles/mixins'
import { AssetSymbol } from 'src/types/models'
import { symbolSorter } from 'src/utils/market'
import { LEVERAGE } from 'src/utils/routes'
import styled from 'styled-components'
import { LeveragerCard } from './LeveragerCard'

export const MakaiMarkets = asStyled(({ className }) => {
  const router = useRouter()
  const { data: marketData } = useMarketData()
  const { data: userData } = useUserData()
  const { data: balances } = useWalletBalance()
  const { open: openWalletModal } = useWalletModal()

  const { assets } = marketData || {}
  const markets = (assets || [])
    .filter((each) => each.isActive)
    .filter((each) => LEVERAGEABLE_ASSET_SYMBOLS.includes(each.symbol))
    .sort(symbolSorter)

  const collateralAsset = useCallback((symbol: AssetSymbol) => {
    return assets?.find(
      (each) =>
        each.symbol ===
        LEVERAGEABLE_COLLATERAL_ASSET_SYMBOLS[symbol],
    )
  }, [assets])

  return (
    <MakaiMarketsSection className={className}>
      <Section className={className}>
        {markets.map((asset) => (
          <LeveragerCard
            key={asset.symbol}
            asset={asset}
            collateralAsset={collateralAsset(asset.symbol)}
            balance={balances[asset.symbol]}
            onClick={
              userData
                ? (e: any) => {
                  e.preventDefault()
                  router.push(
                    `/app/evm/${LEVERAGE}/create?asset=${asset.symbol
                    }&collateralAsset=${collateralAsset(asset.symbol)?.symbol
                    }`,
                  )
                }
                : openWalletModal
            }
          />
        ))}
      </Section>
    </MakaiMarketsSection>
  )
})``

const MakaiMarketsSection = styled.section``

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  @media ${breakpoint.xl} {
    grid-template-columns: repeat(4, 1fr);
  }
`
