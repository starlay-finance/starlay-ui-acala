import { valueToBigNumber } from '@starlay-finance/math-utils'
import dayjs from 'dayjs'
import { VFC } from 'react'
import { AppBackground } from 'src/components/parts/Background'
import { AppFooter } from 'src/components/parts/Footer'
import { AppHeader } from 'src/components/parts/Header/AppHeader'
import { contentMaxWidthCssVar } from 'src/styles/mixins'
import { BN_ONE, BN_ZERO } from 'src/utils/number'
import styled from 'styled-components'
import { KeyVisual } from './KeyVisual'
import { ProjectInformation } from './ProjectInformation'
import { Sale } from './Sale'
import { Statistics } from './Statistics'
import { Bid, LaunchPadData, PriceChartData, Status } from './types'

export type { LaunchPadData }

const judgeStatus = (sale: LaunchPadData['sale']): Status => {
  const now = dayjs()
  // if (now.isBefore(sale.start)) return 'Upcoming'
  // if (now.isAfter(sale.end)) return 'Ended'
  return 'Open'
}
const mockBid: Bid = {
  amount: valueToBigNumber(1000),
  // cancelable: true,
  limitPrice: valueToBigNumber(0.41),
}

export const LaunchPad: VFC<{ data: LaunchPadData }> = ({ data }) => {
  const status = judgeStatus(data.sale)
  const market = {
    currentPriceInUSD: valueToBigNumber(0.41),
    bottomPriceInUSD: valueToBigNumber(0.31),
    raisedAmountInUSD: BN_ONE.times(999999999999999),
    numOfBids: BN_ONE.times(999999999),
  } // TODO
  const currentEstimatedPrice = BN_ZERO // TODO
  const priceChartData = mockPriceChartData // TODO
  const bid = mockBid //TODO
  return (
    <>
      <AppHeader />
      <Main>
        <AppBackground />
        {status === 'Upcoming' ? (
          <KeyVisual
            src={data.keyVisual}
            alt={`${data.token.symbol} token sale`}
          />
        ) : (
          <Statistics
            token={data.token}
            market={market}
            priceChartData={priceChartData}
            limitPrice={bid?.limitPrice}
          />
        )}
        <Content>
          <ProjectInformation information={data.information} />
          <Sale
            token={data.token}
            information={data.sale}
            status={status}
            currentEstimatedPrice={currentEstimatedPrice}
            bid={bid}
          />
        </Content>
      </Main>
      <AppFooter />
    </>
  )
}

const Content = styled.div`
  position: relative;
  display: flex;
  column-gap: 80px;
`

const Main = styled.main`
  width: 100%;
  max-width: var(${contentMaxWidthCssVar});
  margin: 88px auto 0;
  padding-bottom: 320px;
  ${Content} {
    margin-top: 64px;
  }
  ${ProjectInformation} {
    flex: 1;
  }
`

const mockPriceChartData: PriceChartData[] = [
  { priceInUSD: 0, bottomPriceInUSD: 0, timestamp: 1652141000 },
  { priceInUSD: 0.01, bottomPriceInUSD: 0, timestamp: 1652141100 },
  { priceInUSD: 0.05, bottomPriceInUSD: 0.01, timestamp: 1652141200 },
  { priceInUSD: 0.1, bottomPriceInUSD: 0.01, timestamp: 1652141300 },
  { priceInUSD: 0.11, bottomPriceInUSD: 0.01, timestamp: 1652141400 },
  { priceInUSD: 0.13, bottomPriceInUSD: 0.01, timestamp: 1652142000 },
  { priceInUSD: 0.28, bottomPriceInUSD: 0.14, timestamp: 1652143000 },
  { priceInUSD: 0.31, bottomPriceInUSD: 0.21, timestamp: 1652144000 },
  { priceInUSD: 0.35, bottomPriceInUSD: 0.21, timestamp: 1652145000 },
  { priceInUSD: 0.41, bottomPriceInUSD: 0.31, timestamp: 1652146000 },
]
