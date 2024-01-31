import { ACALA_TOKEN_PRICES_API } from 'src/constants/endpoints'
import useSWR from 'swr'

const fetcher = () => fetch(ACALA_TOKEN_PRICES_API).then((res) => res.json())

export const useTokensPrice = () => {
  const { data, isLoading } = useSWR('tokenPrices', fetcher)

  if (isLoading || !data)
    return {
      tokenPrices: {},
      isLoading,
    }
  const tokensPrice = data.result.data
  return {
    tokensPrice,
    isLoading,
  }
}
