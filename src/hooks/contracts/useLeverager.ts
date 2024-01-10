import { InterestRate } from '@starlay-finance/contract-helpers'
import { BigNumber } from '@starlay-finance/math-utils'
import { getMarketConfigEVM } from 'src/libs/config'
import { leveragerContract } from 'src/libs/leverager'
import { EthereumAddress } from 'src/types/web3'
import useSWRImmutable from 'swr/immutable'
import { useEVMWallet } from '../useEVMWallet'
import { useStaticRPCProviderEVM } from '../useStaticRPCProviderEVM'
import { useTxHandler } from './txHandler'

export const useLeverager = () => {
  const { data: provider } = useStaticRPCProviderEVM()
  const { account, signer } = useEVMWallet()
  const { data: leverager } = useSWRImmutable(
    provider && ['leverager', provider.chainId],
    () => {
      const { LEVERAGER } = getMarketConfigEVM(provider!.chainId).addresses
      if (!LEVERAGER) return undefined
      return leveragerContract(provider!, LEVERAGER)
    },
  )

  const { handleTx } = useTxHandler()

  const leverage = async (param: {
    amount: BigNumber
    asset: EthereumAddress
    debtToken: EthereumAddress
    borrowRatio: BigNumber
    loopCount: number
  }) => {
    if (!leverager || !account || !signer) throw new Error('Unexpected state')
    return handleTx(
      await leverager.loop({
        user: account,
        reserve: param.asset,
        amount: param.amount.toString(),
        debtToken: param.debtToken,
        interestRateMode: InterestRate.Variable,
        borrowRatio: param.borrowRatio.toFixed(4, BigNumber.ROUND_FLOOR),
        loopCount: param.loopCount.toFixed(0),
      }),
      signer,
    )
  }

  return {
    leverage,
  }
}
