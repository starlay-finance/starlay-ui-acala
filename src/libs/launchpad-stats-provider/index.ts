import { valueToBigNumber } from '@starlay-finance/math-utils'
import { GraphQLClient } from 'graphql-request'
import { Bid, Market } from 'src/components/screens/Launchpad/types'
import { BN_ZERO } from 'src/utils/number'
import { ChainId, getNetworkConfig } from '../config'
import { getSdk } from './__generated__/graphql'

const graphqlClient = (endpoint: string, apiKey?: string) =>
  getSdk(
    new GraphQLClient(endpoint, {
      headers: apiKey ? { 'x-api-key': apiKey } : {},
    }),
  )

export const getCurrentStats = async (
  chainId: ChainId,
  id: string,
): Promise<
  Omit<Market, 'currentPriceInUSD' | 'bottomPriceInUSD'> | undefined
> => {
  const { launchpadDataProvider } = getNetworkConfig(chainId)
  if (!launchpadDataProvider) return undefined
  const client = graphqlClient(
    launchpadDataProvider.endpoint,
    launchpadDataProvider.apiKey,
  )
  const { projectStatistic } = await client.GetCurrentData({ id })
  if (!projectStatistic)
    return {
      raisedAmountInUSD: BN_ZERO,
      boostedRaisedAmountInUSD: BN_ZERO,
      numOfBids: BN_ZERO,
    }
  return {
    raisedAmountInUSD: valueToBigNumber(projectStatistic.totalAmount),
    boostedRaisedAmountInUSD: valueToBigNumber(
      projectStatistic.totalMultiplied,
    ),
    numOfBids: valueToBigNumber(projectStatistic.numOfBidders),
  }
}

export const getBid = async (
  chainId: ChainId,
  projectId: string,
  account: string,
): Promise<Bid | undefined> => {
  const { launchpadDataProvider } = getNetworkConfig(chainId)
  if (!launchpadDataProvider) return undefined
  const client = graphqlClient(
    launchpadDataProvider.endpoint,
    launchpadDataProvider.apiKey,
  )
  const { bid } = await client.GetBid({
    id: `${projectId}:${account}`,
  })
  if (!bid) return undefined
  const limitPrice = valueToBigNumber(bid.cap)
  return {
    amount: valueToBigNumber(bid.amount),
    limitPrice: limitPrice.isZero() ? undefined : limitPrice,
    cancelable: bid.cancellable,
  }
}
