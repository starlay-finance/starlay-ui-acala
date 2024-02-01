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

const queryForExchangeRate = gql`
  query dailySummaries($offset: Int!) {
    dailySummaries(offset: $offset, orderBy: TIMESTAMP_ASC) {
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

export const useLdotExchangeRate = () => {
  const { data: firstData, isLoading: isFirstDataLoading } = useSWR<{
    dailySummaries: {
      nodes: {
        exchangeRate: string
        timestamp: string
      }[]
    }
  }>('ldotExchangeRateFirst', () =>
    request(
      GRAPH_API_ACALA_LIQUID_STAKING,
      gql`
        query dailySummaries {
          dailySummaries(offset: 0, orderBy: TIMESTAMP_ASC) {
            nodes {
              exchangeRate
              timestamp
            }
          }
        }
      `,
    ),
  )
  const { data: secondData, isLoading: isSecondDataLoading } = useSWR<{
    dailySummaries: {
      nodes: {
        exchangeRate: string
        timestamp: string
      }[]
    }
  }>('ldotExchangeRateSecond', () =>
    request(
      GRAPH_API_ACALA_LIQUID_STAKING,
      gql`
        query dailySummaries {
          dailySummaries(offset: 100, orderBy: TIMESTAMP_ASC) {
            nodes {
              exchangeRate
              timestamp
            }
          }
        }
      `,
    ),
  )
  const { data: thirdData, isLoading: isThirdDataLoading } = useSWR<{
    dailySummaries: {
      nodes: {
        exchangeRate: string
        timestamp: string
      }[]
    }
  }>('ldotExchangeRateThird', () =>
    request(
      GRAPH_API_ACALA_LIQUID_STAKING,
      gql`
        query dailySummaries {
          dailySummaries(offset: 200, orderBy: TIMESTAMP_ASC) {
            nodes {
              exchangeRate
              timestamp
            }
          }
        }
      `,
    ),
  )
  const { data: forthData, isLoading: isForthLoading } = useSWR<{
    dailySummaries: {
      nodes: {
        exchangeRate: string
        timestamp: string
      }[]
    }
  }>('ldotExchangeRateForth', () =>
    request(
      GRAPH_API_ACALA_LIQUID_STAKING,
      gql`
        query dailySummaries {
          dailySummaries(offset: 300, orderBy: TIMESTAMP_ASC) {
            nodes {
              exchangeRate
              timestamp
            }
          }
        }
      `,
    ),
  )
  const { data: fifthData, isLoading: isFifthLoading } = useSWR<{
    dailySummaries: {
      nodes: {
        exchangeRate: string
        timestamp: string
      }[]
    }
  }>('ldotExchangeRateFifth', () =>
    request(
      GRAPH_API_ACALA_LIQUID_STAKING,
      gql`
        query dailySummaries {
          dailySummaries(offset: 400, orderBy: TIMESTAMP_ASC) {
            nodes {
              exchangeRate
              timestamp
            }
          }
        }
      `,
    ),
  )

  if (
    isFirstDataLoading ||
    isSecondDataLoading ||
    isThirdDataLoading ||
    isForthLoading ||
    isFifthLoading ||
    !firstData ||
    !secondData ||
    !thirdData ||
    !forthData ||
    !fifthData
  )
    return {
      exchangeRates: [],
      isLoading: true,
    }

  const exchangeRates = firstData.dailySummaries.nodes
    .concat(secondData.dailySummaries.nodes)
    .concat(thirdData.dailySummaries.nodes)
    .concat(forthData.dailySummaries.nodes)
    .concat(fifthData.dailySummaries.nodes)

  const isLoading =
    isFirstDataLoading ||
    isSecondDataLoading ||
    isThirdDataLoading ||
    isForthLoading ||
    isFifthLoading

  return { exchangeRates, isLoading }
}
