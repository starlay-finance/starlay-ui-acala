import {
  BigNumber
} from '@starlay-finance/math-utils'
import { useSearchParams } from 'next/navigation'
import Router from 'next/router'
import { useEffect, useState } from 'react'
import { AppMenu } from 'src/components/compositions/AppMenu'
import { AppBackground } from 'src/components/parts/Background'
import { AppFooter } from 'src/components/parts/Footer'
import { AppHeader } from 'src/components/parts/Header/AppHeader'
import { ASSET_ADDRESSES } from 'src/constants/assets'
import { useLeverager } from 'src/hooks/contracts/useLeverager'
import { useMarketData } from 'src/hooks/useMarketData'
import { useNetworkType } from 'src/hooks/useNetwork'
import { useTracking } from 'src/hooks/useTracking'
import { fontWeightHeavy } from 'src/styles/font'
import { breakpoint, contentMaxWidthCssVar } from 'src/styles/mixins'
import { EthereumAddress } from 'src/types/web3'
import { APP } from 'src/utils/routes'
import styled from 'styled-components'
import { Leverager } from './Leverager'

export const Create = () => {
  const { data } = useNetworkType()
  const [isMenuOpen, setMenuOpen] = useState(false)
  const searchParams = useSearchParams()

  const assetSymbol = searchParams.get('asset')
  const collateralAssetSymbol = searchParams.get('collateralAsset')
  const { data: marketData } = useMarketData()
  const { assets, marketReferenceCurrencyPriceInUSD } = marketData || {}

  const asset = assets?.find((each) => each.symbol === assetSymbol)
  const collateralAsset = assets?.find(
    (each) => each.symbol === collateralAssetSymbol,
  )

  const {
    leverageDot,
    leverageDotFromPosition,
    leverageLdot,
    leverageLdotFromPosition,
    getStatusAfterLeverageDotTransaction,
    getStatusAfterLeverageDotFromPositionTransaction,
    getStatusAfterLeverageLdotTransaction,
    getStatusAfterLeverageLdotFromPositionTransaction,
    getLTV,
    getLt,
    getExchangeRateLDOT2DOT,
    getExchangeRateDOT2LDOT,
    closeLeverageDOT,
  } = useLeverager()

  const { withTracking } = useTracking()

  const leverageDotWithTracking = withTracking<{
    asset: EthereumAddress
    amount: BigNumber
    leverage: BigNumber
  }>('leverageDot', leverageDot)

  const leverageDotFromPositionWithTracking = withTracking<{
    asset: EthereumAddress
    amount: BigNumber
    leverage: BigNumber
  }>('leverageDotFromPosition', leverageDotFromPosition)

  const leverageLdotWithTracking = withTracking<{
    ldotAddress: EthereumAddress
    asset: EthereumAddress
    amount: BigNumber
    leverage: BigNumber
  }>('leverageDot', leverageLdot)

  const leverageLdotFromPositionWithTracking = withTracking<{
    ldotAddress: EthereumAddress
    asset: EthereumAddress
    amount: BigNumber
    leverage: BigNumber
  }>('leverageDotFromPosition', leverageLdotFromPosition)

  useEffect(() => {
    if (data !== 'EVM') Router.replace(APP)
  }, [data])

  if (asset === undefined || collateralAsset === undefined || marketReferenceCurrencyPriceInUSD === undefined) return (<></>)
  return (
    <>
      <AppHeader openMenu={() => setMenuOpen(true)} />
      <Main>
        <AppBackground />
        <Content>
          <Leverager
            asset={asset}
            collateralAsset={collateralAsset}
            marketReferenceCurrencyPriceInUSD={marketReferenceCurrencyPriceInUSD}
            leverageDot={(amount, leverage) =>
              leverageDotWithTracking({
                amount,
                asset: asset.underlyingAsset as EthereumAddress,
                leverage,
              })
            }
            leverageDotFromPosition={(amount, leverage) =>
              leverageDotFromPositionWithTracking({
                amount,
                asset: asset.underlyingAsset as EthereumAddress,
                leverage,
              })
            }
            getStatusAfterLeverageDotTransaction={(amount, leverage) =>
              getStatusAfterLeverageDotTransaction({
                amount,
                asset: asset.underlyingAsset as EthereumAddress,
                leverage,
              })
            }
            getStatusAfterLeverageDotFromPositionTransaction={(
              amount,
              leverage,
            ) =>
              getStatusAfterLeverageDotFromPositionTransaction({
                amount,
                asset: asset.underlyingAsset as EthereumAddress,
                leverage,
              })
            }
            leverageLdot={(amount, leverage) =>
              leverageLdotWithTracking({
                amount,
                asset: asset.underlyingAsset as EthereumAddress,
                ldotAddress: collateralAsset?.underlyingAsset as EthereumAddress,
                leverage,
              })
            }
            leverageLdotFromPosition={(amount, leverage) =>
              leverageLdotFromPositionWithTracking({
                amount,
                asset: asset.underlyingAsset as EthereumAddress,
                ldotAddress: collateralAsset?.underlyingAsset as EthereumAddress,
                leverage,
              })
            }
            getStatusAfterLeverageLdotTransaction={(amount, leverage) =>
              getStatusAfterLeverageLdotTransaction({
                amount,
                asset: asset.underlyingAsset as EthereumAddress,
                ldotAddress: collateralAsset?.underlyingAsset as EthereumAddress,
                leverage,
              })
            }
            getStatusAfterLeverageLdotFromPositionTransaction={(
              amount,
              leverage,
            ) =>
              getStatusAfterLeverageLdotFromPositionTransaction({
                amount,
                asset: asset.underlyingAsset as EthereumAddress,
                ldotAddress: collateralAsset?.underlyingAsset as EthereumAddress,
                leverage,
              })
            }
            getLTV={() =>
              getLTV({
                asset: collateralAsset?.underlyingAsset as EthereumAddress,
              })
            }
            getLt={() =>
              getLt({
                asset: collateralAsset?.underlyingAsset as EthereumAddress,
              })
            }
            getExchangeRateDOT2LDOT={() => getExchangeRateDOT2LDOT()}
            getExchangeRateLDOT2DOT={() => getExchangeRateLDOT2DOT()}
            closeLeverageDOT={() =>
              closeLeverageDOT({
                dotAddress: ASSET_ADDRESSES[asset.symbol] as EthereumAddress,
                ldotAddress:
                  collateralAsset?.underlyingAsset as EthereumAddress,
              })
            }
          />
        </Content>
        <AppMenu isOpen={isMenuOpen} close={() => setMenuOpen(false)} />
      </Main>
      <AppFooter />
    </>
  )
}

const Content = styled.div``

const Main = styled.main`
  width: 100%;
  max-width: var(${contentMaxWidthCssVar});
  margin: 0 auto;
  padding: 0 24px 64px;
  h2 {
    font-size: 20px;
    font-weight: ${fontWeightHeavy};
  }
  ${Content} {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    column-gap: 24px;
  }
  @media ${breakpoint.xl} {
    ${Content} {
      margin-top: 80px;
    }
  }
`
