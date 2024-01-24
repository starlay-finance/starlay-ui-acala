import { gql, request } from 'graphql-request'
import { GRAPH_API_ACALA_LIQUID_STAKING } from 'src/constants/endpoints'
import useSWR from 'swr'

const query = gql`
  query dailySummaries {
    dailySummaries(first: 30, orderBy: TIMESTAMP_DESC) {
      nodes {
        exchangeRate
        timestamp
      }
    }
  }
`

export const useLdotApy = () => {
  const { data, isLoading } = useSWR<{
    dailySummaries: {
      nodes: {
        exchangeRate: string
        timestamp: string
      }[]
    }
  }>('ldotApr', () => request(GRAPH_API_ACALA_LIQUID_STAKING, query))

  if (isLoading || !data)
    return {
      apy: 0,
      isLoading,
    }

  const exchangeRates = data.dailySummaries.nodes

  const first = exchangeRates[0]
  const last = exchangeRates[exchangeRates.length - 1]
  const len = exchangeRates.length

  const apr =
    (Number(first.exchangeRate) / Number(last.exchangeRate) - 1) * (365 / len)
  // you can also calculate apy
  const apy = apr + (Number(first.exchangeRate) / Number(last.exchangeRate) - 1)
  return { apy, isLoading }
}
