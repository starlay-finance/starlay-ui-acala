import { BigNumber } from '@starlay-finance/math-utils'
import { useCallback } from 'react'
import { getMarketConfigEVM, getNetworkConfigEVM } from 'src/libs/config'
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
    provider && ['leveragerLdot', provider.chainId],
    () => {
      const { LEVERAGER_LDOT } = getMarketConfigEVM(provider!.chainId).addresses
      const { walletBalanceProvider } = getNetworkConfigEVM(
        provider!.chainId,
      ).addresses
      if (!LEVERAGER_LDOT) return undefined
      return leveragerContract(provider!, LEVERAGER_LDOT, walletBalanceProvider)
    },
  )

  const { handleTx } = useTxHandler()

  const leverageDot = useCallback(
    async (param: {
      leverage: BigNumber
      amount: BigNumber
      asset: EthereumAddress
    }) => {
      console.log('leverage dot')
      if (!leveragerLdot || !account || !signer)
        throw new Error('Unexpected state')
      return handleTx(
        await leveragerLdot.leverageDot({
          user: account,
          dotAddress: param.asset,
          leverage: param.leverage.toString(),
          repayAmountInDot: param.amount.toString(),
        }),
        signer,
      )
    },
    [account, handleTx, leveragerLdot, signer],
  )
  const leverageDotFromPosition = useCallback(
    async (param: {
      leverage: BigNumber
      amount: BigNumber
      asset: EthereumAddress
    }) => {
      console.log('leverageDotFromPosition')

      if (!leveragerLdot || !account || !signer)
        throw new Error('Unexpected state')
      return handleTx(
        await leveragerLdot.leverageDotFromPosition({
          user: account,
          dotAddress: param.asset,
          leverage: param.leverage.toString(),
          supplyAmountInDot: param.amount.toString(),
        }),
        signer,
      )
    },
    [account, handleTx, leveragerLdot, signer],
  )

  const leverageLdot = useCallback(
    async (param: {
      leverage: BigNumber
      amount: BigNumber
      asset: EthereumAddress
      ldotAddress: EthereumAddress
    }) => {
      console.log('leverageLdot')

      if (!leveragerLdot || !account || !signer)
        throw new Error('Unexpected state')
      return handleTx(
        await leveragerLdot.leverageLdot({
          user: account,
          dotAddress: param.asset,
          ldotAddress: param.ldotAddress,
          leverage: param.leverage.toString(),
          repayAmountInLdot: param.amount.toString(),
        }),
        signer,
      )
    },
    [account, handleTx, leveragerLdot, signer],
  )
  const leverageLdotFromPosition = useCallback(
    async (param: {
      leverage: BigNumber
      amount: BigNumber
      asset: EthereumAddress
      ldotAddress: EthereumAddress
    }) => {
      console.log('leverageLdotFromPosition')

      if (!leveragerLdot || !account || !signer)
        throw new Error('Unexpected state')
      return handleTx(
        await leveragerLdot.leverageLdotFromPosition({
          user: account,
          dotAddress: param.asset,
          ldotAddress: param.ldotAddress,
          leverage: param.leverage.toString(),
          supplyAmountInLdot: param.amount.toString(),
        }),
        signer,
      )
    },
    [account, handleTx, leveragerLdot, signer],
  )
  const closeLeverageDOT = useCallback(
    async (param: {
      dotAddress: EthereumAddress
      ldotAddress: EthereumAddress
    }) => {
      if (!leveragerLdot || !account || !signer)
        throw new Error('Unexpected state')
      return handleTx(
        await leveragerLdot.closeLeverageDOT({
          user: account,
          dotAddress: param.dotAddress,
          ldotAddress: param.ldotAddress,
        }),
        signer,
      )
    },
    [account, handleTx, leveragerLdot, signer],
  )

  const getStatusAfterLeverageDotTransaction = useCallback(
    async (param: {
      leverage: BigNumber
      amount: BigNumber
      asset: EthereumAddress
    }) => {
      if (!leveragerLdot || !account)
        return {
          totalCollateralAfterTx: '0',
          totalDebtAfterTx: '0',
          healthFactorAfterTx: '0',
        }
      const {
        totalCollateralAfterTx,
        totalDebtAfterTx,
        totalCollateralInDotAfterTx,
        totalDebtInDotAfterTx,
        healthFactorAfterTx,
      } = await leveragerLdot.getStatusAfterLeverageDotTransaction({
        user: account,
        dotAddress: param.asset,
        leverage: param.leverage.toString(),
        repayAmountInDot: param.amount.toString(),
      })
      return {
        totalCollateralAfterTx,
        totalDebtAfterTx,
        totalCollateralInDotAfterTx,
        totalDebtInDotAfterTx,
        healthFactorAfterTx,
      }
    },
    [account, leveragerLdot],
  )
  const getStatusAfterLeverageDotFromPositionTransaction = useCallback(
    async (param: {
      leverage: BigNumber
      amount: BigNumber
      asset: EthereumAddress
    }) => {
      if (!leveragerLdot || !account)
        return {
          totalCollateralAfterTx: '0',
          totalDebtAfterTx: '0',
          healthFactorAfterTx: '0',
        }
      const {
        totalCollateralAfterTx,
        totalDebtAfterTx,
        totalCollateralInDotAfterTx,
        totalDebtInDotAfterTx,
        healthFactorAfterTx,
      } = await leveragerLdot.getStatusAfterLeverageDotFromPositionTransaction({
        user: account,
        dotAddress: param.asset,
        leverage: param.leverage.toString(),
        supplyAmountInDot: param.amount.toString(),
      })
      return {
        totalCollateralAfterTx,
        totalDebtAfterTx,
        totalCollateralInDotAfterTx,
        totalDebtInDotAfterTx,
        healthFactorAfterTx,
      }
    },
    [account, leveragerLdot],
  )

  const getStatusAfterLeverageLdotTransaction = useCallback(
    async (param: {
      leverage: BigNumber
      amount: BigNumber
      asset: EthereumAddress
      ldotAddress: EthereumAddress
    }) => {
      if (!leveragerLdot || !account)
        return {
          totalCollateralAfterTx: '0',
          totalDebtAfterTx: '0',
          healthFactorAfterTx: '0',
        }
      const {
        totalCollateralAfterTx,
        totalDebtAfterTx,
        totalCollateralInDotAfterTx,
        totalDebtInDotAfterTx,
        healthFactorAfterTx,
      } = await leveragerLdot.getStatusAfterLeverageLdotTransaction({
        user: account,
        dotAddress: param.asset,
        ldotAddress: param.ldotAddress,
        leverage: param.leverage.toString(),
        repayAmountInLdot: param.amount.toString(),
      })
      return {
        totalCollateralAfterTx,
        totalDebtAfterTx,
        totalCollateralInDotAfterTx,
        totalDebtInDotAfterTx,
        healthFactorAfterTx,
      }
    },
    [account, leveragerLdot],
  )
  const getStatusAfterLeverageLdotFromPositionTransaction = useCallback(
    async (param: {
      leverage: BigNumber
      amount: BigNumber
      asset: EthereumAddress
      ldotAddress: EthereumAddress
    }) => {
      if (!leveragerLdot || !account)
        return {
          totalCollateralAfterTx: '0',
          totalDebtAfterTx: '0',
          healthFactorAfterTx: '0',
        }
      const {
        totalCollateralAfterTx,
        totalDebtAfterTx,
        totalCollateralInDotAfterTx,
        totalDebtInDotAfterTx,
        healthFactorAfterTx,
      } = await leveragerLdot.getStatusAfterLeverageLdotFromPositionTransaction(
        {
          user: account,
          dotAddress: param.asset,
          ldotAddress: param.ldotAddress,
          leverage: param.leverage.toString(),
          supplyAmountInLdot: param.amount.toString(),
        },
      )
      return {
        totalCollateralAfterTx,
        totalDebtAfterTx,
        totalCollateralInDotAfterTx,
        totalDebtInDotAfterTx,
        healthFactorAfterTx,
      }
    },
    [account, leveragerLdot],
  )

  const getLTV = useCallback(
    async (param: { asset: EthereumAddress }) => {
      if (!leveragerLdot) {
        return '0'
      }
      const ltv = await leveragerLdot.ltv(param.asset)
      return ltv
    },
    [leveragerLdot],
  )

  const getLt = useCallback(
    async (param: { asset: EthereumAddress }) => {
      if (!leveragerLdot) {
        return '0'
      }
      const lt = await leveragerLdot.lt(param.asset)
      return lt
    },
    [leveragerLdot],
  )

  const getExchangeRateDOT2LDOT = useCallback(async () => {
    if (!leveragerLdot) {
      return '0'
    }
    const exchangeRateDOT2LDOT = await leveragerLdot.getExchangeRateDOT2LDOT()
    return exchangeRateDOT2LDOT
  }, [leveragerLdot])

  const getExchangeRateLDOT2DOT = useCallback(async () => {
    if (!leveragerLdot) {
      return '0'
    }
    const exchangeRateLDOT2DOT = await leveragerLdot.getExchangeRateLDOT2DOT()
    return exchangeRateLDOT2DOT
  }, [leveragerLdot])

  return {
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
    getExchangeRateDOT2LDOT,
    getExchangeRateLDOT2DOT,
    closeLeverageDOT,
  }
}
