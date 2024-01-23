import { asStyled } from 'src/components/hoc/asStyled'
import { useWalletModal } from 'src/components/parts/Modal/WalletModal'
import { LEVERAGEABLE_ASSET_SYMBOLS, LEVERAGEABLE_COLLATERAL_ASSET_SYMBOLS } from 'src/constants/assets'
import { useLeverager } from 'src/hooks/contracts/useLeverager'
import { useMarketData } from 'src/hooks/useMarketData'
import { useUserData } from 'src/hooks/useUserData'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import { breakpoint } from 'src/styles/mixins'
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
  const { closeLeverageDOT } = useLeverager()

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
              borrowApy={asset.variableBorrowAPY}
              collateralAsset={assets?.find((each) => each.symbol === LEVERAGEABLE_COLLATERAL_ASSET_SYMBOLS[asset.symbol])}
              symbol={asset.symbol || asset.displaySymbol}
              balance={balances[asset.symbol]}
              onClick={userData
                ? () =>
                  openLeveragerModal({
                    collateralAsset: assets?.find((each) => each.symbol === LEVERAGEABLE_COLLATERAL_ASSET_SYMBOLS[asset.symbol]),
                    asset,
                    userAssetBalance: {
                      ...userData.balanceByAsset[asset.symbol],
                      inWallet: balances[asset.symbol],
                    },
                    isPosition: false
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
  flex-direction: column;
  column-gap: 24px;
  > * {
    flex: 1;
  }
  @media ${breakpoint.xl} {
    flex-direction: row;

  }
`

const EmptyDiv = styled.div``
