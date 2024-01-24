import { LeveragerLdot } from '@starlay-finance/contract-helpers'
import { EthereumAddress } from 'src/types/web3'
import { StaticRPCProviderEVM } from '../static-rpc-provider'

export const leveragerContract = (
  { provider }: StaticRPCProviderEVM,
  leveragerAddress: EthereumAddress,
  walletBalanceProviderAddress: EthereumAddress,
) => new LeveragerLdot(provider, leveragerAddress, walletBalanceProviderAddress)
