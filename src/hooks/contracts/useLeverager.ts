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
  const { data: leveragerLdot } = useSWRImmutable(
    provider && ['leverageLdot', provider.chainId],
    () => {
      const { LEVERAGER_LDOT } = getMarketConfigEVM(provider!.chainId).addresses
      if (!LEVERAGER_LDOT) return undefined
      return leveragerContract(provider!, LEVERAGER_LDOT)
    },
  )

  const { handleTx } = useTxHandler()

  const leverageLdot = async (param: {
    borrowAmount: BigNumber
    amount: BigNumber
    asset: EthereumAddress
  }) => {
    if (!leveragerLdot || !account || !signer)
      throw new Error('Unexpected state')
    return handleTx(
      await leveragerLdot.leverageDot({
        user: account,
        token: param.asset,
        borrow_dot_amount: param.borrowAmount.toString(),
        repay_dot_amount: param.amount.toString(),
      }),
      signer,
    )
  }
  const getStatusAfterTransaction = async (param: {
    borrowAmount: BigNumber
    amount: BigNumber
  }) => {
    if (!leveragerLdot || !account) throw new Error('Unexpected state')
    const { totalCollateralAfterTx, totalDebtAfterTx, healthFactorAfterTx } =
      await leveragerLdot.getStatusAfterTransaction(
        account,
        param.borrowAmount.toString(),
        param.amount.toString(),
      )
    return { totalCollateralAfterTx, totalDebtAfterTx, healthFactorAfterTx }
  }

  return {
    leverageLdot,
    getStatusAfterTransaction,
  }
}
