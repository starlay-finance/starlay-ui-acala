import { t } from '@lingui/macro'
import { VFC } from 'react'
import {
  AssetTd,
  MarketTable,
  TableContainer,
} from 'src/components/compositions/Markets/MarketTable'
import { asStyled } from 'src/components/hoc/asStyled'
import {
  PercentageChange,
  PercentageChangeProps,
} from 'src/components/parts/Number/PercentageChange'
import { useMarketData } from 'src/hooks/useMarketData'
import { AssetMarketData } from 'src/types/models'
import { symbolSorter } from 'src/utils/market'
import { BN_HUNDRED, BN_ONE, formatPct, formatUSDShort } from 'src/utils/number'
import styled from 'styled-components'

const DETAILS_COLUMNS = [
  { id: 'asset', name: t`Asset`, widthRatio: 4 },
  { id: 'totalDeposited', name: t`Total Deposited`, widthRatio: 2 },
  { id: 'depositAPY', name: t`APY_Deposit`, widthRatio: 2 },
  { id: 'depositAPR', name: t`Deposit Reward APR`, widthRatio: 3 },
  { id: 'totalBorrowed', name: t`Total Borrowed`, widthRatio: 2 },
  { id: 'borrowAPY', name: t`APY_Borrow`, widthRatio: 2 },
  { id: 'borrowAPR', name: t`Borrow Reward APR`, widthRatio: 3 },
]

export const Details = asStyled(({ className }) => {
  const { data: marketData } = useMarketData()
  const markets = (marketData?.assets || [])
    .filter((each) => each.isActive)
    .sort(symbolSorter)
  return (
    <DetailsSection className={className}>
      <TableContainer>
        <MarketTable
          caption={t`Markets`}
          columns={DETAILS_COLUMNS}
          rows={markets.map(detailsRow)}
        />
      </TableContainer>
    </DetailsSection>
  )
})``

const detailsRow = (asset: AssetMarketData) => {
  const {
    symbol,
    icon,
    name,
    liquidityInUSD,
    depositAPY,
    depositIncentiveAPR,
    borrowUnsupported,
    totalBorrowedInUSD,
    variableBorrowAPY,
    variableBorrowIncentiveAPR,
  } = asset
  const depositedInUSD = liquidityInUSD.plus(totalBorrowedInUSD)
  return {
    id: symbol,
    data: {
      asset: <AssetTd icon={icon} name={name} />,
      totalDeposited: (
        <ValueWithPercentageChange
          value={formatUSDShort(depositedInUSD)}
          current={depositedInUSD}
          // TODO replace mock
          previous={BN_HUNDRED}
        />
      ),
      depositAPY: (
        <ValueWithPercentageChange
          value={formatPct(depositAPY)}
          current={depositAPY}
          // TODO replace mock
          previous={BN_ONE}
        />
      ),
      depositAPR: (
        <ValueWithPercentageChange
          value={formatPct(depositIncentiveAPR)}
          current={depositIncentiveAPR}
          // TODO replace mock
          previous={BN_ONE}
        />
      ),
      totalBorrowed: borrowUnsupported ? (
        'Coming soon'
      ) : (
        <ValueWithPercentageChange
          value={formatUSDShort(totalBorrowedInUSD)}
          current={totalBorrowedInUSD}
          // TODO replace mock
          previous={BN_HUNDRED.pow(BN_HUNDRED)}
        />
      ),
      borrowAPY: borrowUnsupported ? (
        '-'
      ) : (
        <ValueWithPercentageChange
          value={formatPct(variableBorrowAPY)}
          current={variableBorrowAPY}
          // TODO replace mock
          previous={BN_ONE}
        />
      ),
      borrowAPR: borrowUnsupported ? (
        '-'
      ) : (
        <ValueWithPercentageChange
          value={formatPct(variableBorrowIncentiveAPR)}
          current={variableBorrowIncentiveAPR}
          // TODO replace mock
          previous={variableBorrowIncentiveAPR}
        />
      ),
    },
  }
}

const ValueWithPercentageChange: VFC<
  { value: string } & PercentageChangeProps
> = ({ value, ...props }) => {
  return (
    <ValuesTd>
      {value}
      <PercentageChange {...props} />
    </ValuesTd>
  )
}
const ValuesTd = styled.div`
  display: flex;
  flex-direction: column;
`

const DetailsSection = styled.section``
