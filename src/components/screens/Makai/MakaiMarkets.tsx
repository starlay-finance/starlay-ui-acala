import { asStyled } from 'src/components/hoc/asStyled'
import { useWalletModal } from 'src/components/parts/Modal/WalletModal'
import { LEVERAGEABLE_ASSET_SYMBOLS } from 'src/constants/assets'
import { useMarketData } from 'src/hooks/useMarketData'
import { useUserData } from 'src/hooks/useUserData'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { symbolSorter } from 'src/utils/market'
import styled from 'styled-components'
import { LeveragerCard } from './LeveragerCard'
import { useLeverageModal } from './modals/LeverageModal'

export const MakaiMarkets = asStyled(({ className }) => {
  const { data: marketData } = useMarketData()
  const { data: userData } = useUserData()
  const { data: balances } = useWalletBalance()
  const { open: openWalletModal } = useWalletModal()
  const { open: openLeveragerModal } = useLeverageModal()
  const {
    assets,
  } = marketData || {}
  const markets = (assets || [])
    .filter((each) => each.isActive)
    .filter((each) => LEVERAGEABLE_ASSET_SYMBOLS.includes(each.symbol))
    .sort(symbolSorter)

  return (
    <MakaiMarketsSection className={className}>
      <Section className={className}>
        {
          markets.map((asset) => (
            <LeveragerCard
              key={asset.symbol}
              icon={asset.icon}
              collateralIcon={asset.symbol === 'DOT' && assets?.find((each) => each.symbol === 'LDOT')?.icon}
              symbol={asset.symbol || asset.displaySymbol}
              collateralSymbol={asset.symbol === 'DOT' ? 'LDOT' : ''}
              balance={balances[asset.symbol]}
              onClick={userData
                ? () =>
                  openLeveragerModal({
                    asset,
                    userAssetBalance: {
                      ...userData.balanceByAsset[asset.symbol],
                      inWallet: balances[asset.symbol],
                    },
                  })
                : openWalletModal}
            />
          ))
        }

        <EmptyDiv />
        <EmptyDiv />
        <EmptyDiv />
      </Section>
    </MakaiMarketsSection>
  )
})``

const MakaiMarketsSection = styled.section``

const Section = styled.section`
  display: flex;
  column-gap: 24px;
  > * {
    flex: 1;
  }
`

const EmptyDiv = styled.div``
