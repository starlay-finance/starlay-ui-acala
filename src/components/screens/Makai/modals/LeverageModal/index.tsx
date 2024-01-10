import { FC } from 'react'
import { requireSupportedChain } from 'src/components/hoc/requireSupportedChain'
import { DefaultModalContent } from 'src/components/parts/Modal/base'
import { AssetLabel } from 'src/components/parts/Modal/parts'
import { useLeverager } from 'src/hooks/contracts/useLeverager'
import { ModalContentProps, useModalDialog } from 'src/hooks/useModal'
import { useTracking } from 'src/hooks/useTracking'
import { EthereumAddress } from 'src/types/web3'
import {
  loopingLeverageToLtv,
  significantLoopingCount,
} from 'src/utils/calculator'
import { LeveragerModalBody, LeveragerModalBodyProps } from './Body'

export const Leverager: FC<
  ModalContentProps<Omit<LeveragerModalBodyProps, 'startLeverager'>>
> = ({ close, ...props }) => {
  const { leverage } = useLeverager()
  const { withTracking } = useTracking()
  const { asset } = props

  const loopWithTracking = withTracking('leverage', leverage)

  return (
    <DefaultModalContent
      headerNode={<AssetLabel asset={asset} />}
      bodyNode={
        <LeveragerModalBody
          {...props}
          startLeverager={(amount, leverage) =>
            loopWithTracking({
              // repayAmount: amount,
              // borrowAmount: amount.multipliedBy(leverage),
              amount,
              asset: asset.underlyingAsset as EthereumAddress,
              debtToken: asset.vdTokenAddress as EthereumAddress,
              borrowRatio: loopingLeverageToLtv(leverage),
              loopCount: significantLoopingCount(leverage),
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
