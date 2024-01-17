import { BigNumber } from '@starlay-finance/math-utils'
import { FC } from 'react'

import { requireSupportedChain } from 'src/components/hoc/requireSupportedChain'
import { DefaultModalContent } from 'src/components/parts/Modal/base'
import { ItemLabelPair } from 'src/components/parts/Modal/parts'
import { useLeverager } from 'src/hooks/contracts/useLeverager'
import { ModalContentProps, useModalDialog } from 'src/hooks/useModal'
import { useTracking } from 'src/hooks/useTracking'
import { EthereumAddress } from 'src/types/web3'
import { LeveragerModalBody, LeveragerModalBodyProps } from './Body'

export const Leverager: FC<
  ModalContentProps<Omit<Omit<LeveragerModalBodyProps, 'startLeverager'>, 'getStatusAfterTransaction'>>
> = ({ close, ...props }) => {
  const { leverageLdot, getStatusAfterTransaction } = useLeverager()
  const { withTracking } = useTracking()
  const { asset } = props

  const leverageWithTracking = withTracking<{
    asset: EthereumAddress
    amount: BigNumber
    borrowAmount: BigNumber;
  }>('leverageLdot', leverageLdot)

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
          getStatusAfterTransaction={(amount, leverage) => getStatusAfterTransaction({
            amount,
            borrowAmount: amount.multipliedBy(leverage),
          })}
        />
      }
      closeModal={close}
    />
  )
}

export const useLeverageModal = () =>
  useModalDialog(requireSupportedChain(Leverager))
