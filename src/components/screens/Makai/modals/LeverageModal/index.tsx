import { BigNumber } from '@starlay-finance/math-utils'
import { FC } from 'react'

import { requireSupportedChain } from 'src/components/hoc/requireSupportedChain'
import { DefaultModalContent } from 'src/components/parts/Modal/base'
import { AssetLabel } from 'src/components/parts/Modal/parts'
import { useLeverager } from 'src/hooks/contracts/useLeverager'
import { ModalContentProps, useModalDialog } from 'src/hooks/useModal'
import { useTracking } from 'src/hooks/useTracking'
import { EthereumAddress } from 'src/types/web3'
import { LeveragerModalBody, LeveragerModalBodyProps } from './Body'

export const Leverager: FC<
  ModalContentProps<Omit<LeveragerModalBodyProps, 'startLeverager'>>
> = ({ close, ...props }) => {
  const { leverageLdot } = useLeverager()
  const { withTracking } = useTracking()
  const { asset } = props

  const loopWithTracking = withTracking<{
    asset: EthereumAddress
    amount: BigNumber
    borrowAmount: BigNumber;
  }>('leverageLdot', leverageLdot)

  return (
    <DefaultModalContent
      headerNode={<AssetLabel asset={asset} />}
      bodyNode={
        <LeveragerModalBody
          {...props}
          startLeverager={(amount, leverage) =>
            loopWithTracking({
              amount,
              asset: asset.underlyingAsset as EthereumAddress,
              borrowAmount: amount.multipliedBy(leverage),
            })
          }
        />
      }
      closeModal={close}
    />
  )
}

export const useLeverageModal = () =>
  useModalDialog(requireSupportedChain(Leverager))
