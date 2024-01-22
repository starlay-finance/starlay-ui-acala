import { BigNumber } from '@starlay-finance/math-utils'
import { FC } from 'react'

import { requireSupportedChain } from 'src/components/hoc/requireSupportedChain'
import { DefaultModalContent } from 'src/components/parts/Modal/base'
import { ItemLabelPair } from 'src/components/parts/Modal/parts'
import { LEVERAGEABLE_COLLATERAL_ASSET_SYMBOLS } from 'src/constants/assets'
import { useLeverager } from 'src/hooks/contracts/useLeverager'
import { useMarketData } from 'src/hooks/useMarketData'
import { ModalContentProps, useModalDialog } from 'src/hooks/useModal'
import { useTracking } from 'src/hooks/useTracking'
import { EthereumAddress } from 'src/types/web3'
import { LeveragerModalBody, LeveragerModalBodyProps } from './Body'

export const Leverager: FC<
  ModalContentProps<
    Omit<
      Omit<
        Omit<
          Omit<
            Omit<
              Omit<LeveragerModalBodyProps, 'startLeverager'>,
              'getStatusAfterLeverageDotTransaction'
            >,
            'getLTV'
          >,
          'getExchangeRateDOT2LDOT'
        >,
        'startLeveragerDotFromPosition'
      >,
      'getStatusAfterLeverageDotFromPositionTransaction'
    >>
> = ({ close, ...props }) => {
  const { data: marketData } = useMarketData()
  const { asset } = props
  const { assets } = marketData || {}
  const collateralAsset = assets?.find(
    (each) =>
      each.symbol === LEVERAGEABLE_COLLATERAL_ASSET_SYMBOLS[asset.symbol],
  )
  const {
    leverageLdot,
    leverageDotFromPosition,
    getStatusAfterLeverageDotTransaction,
    getStatusAfterLeverageDotFromPositionTransaction,
    getLTV,
    getExchangeRateDOT2LDOT,
  } = useLeverager()
  const { withTracking } = useTracking()

  const leverageWithTracking = withTracking<{
    asset: EthereumAddress
    amount: BigNumber
    borrowAmount: BigNumber
  }>('leverageLdot', leverageLdot)

  const leverageDotFromPositionWithTracking = withTracking<{
    asset: EthereumAddress
    amount: BigNumber
    borrowAmount: BigNumber
  }>('leverageDotFromPosition', leverageDotFromPosition)

  return (
    <DefaultModalContent
      headerNode={<ItemLabelPair label={`Leverager ${asset.symbol}/LDOT`} />}
      bodyNode={
        <LeveragerModalBody
          {...props}
          startLeverager={(amount, leverage) =>
            leverageWithTracking({
              amount,
              asset: asset.underlyingAsset as EthereumAddress,
              borrowAmount: amount.multipliedBy(leverage),
            })
          }
          startLeveragerDotFromPosition={(amount, leverage) =>
            leverageDotFromPositionWithTracking({
              amount,
              asset: asset.underlyingAsset as EthereumAddress,
              borrowAmount: amount.multipliedBy(leverage),
            })
          }
          getStatusAfterLeverageDotTransaction={(amount, leverage) =>
            getStatusAfterLeverageDotTransaction({
              amount,
              asset: asset.underlyingAsset as EthereumAddress,
              borrowAmount: amount.multipliedBy(leverage),
            })
          }
          getStatusAfterLeverageDotFromPositionTransaction={(amount, leverage) =>
            getStatusAfterLeverageDotFromPositionTransaction({
              amount,
              asset: asset.underlyingAsset as EthereumAddress,
              borrowAmount: amount.multipliedBy(leverage),
            })
          }
          getLTV={() =>
            getLTV({
              asset: collateralAsset?.underlyingAsset as EthereumAddress,
            })
          }
          getExchangeRateDOT2LDOT={() => getExchangeRateDOT2LDOT()}
        />
      }
      closeModal={close}
    />
  )
}

export const useLeverageModal = () =>
  useModalDialog(requireSupportedChain(Leverager))
