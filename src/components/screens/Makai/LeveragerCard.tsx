import { t } from '@lingui/macro'
import { BigNumber } from '@starlay-finance/math-utils'
import { StaticImageData } from 'next/image'
import { FC, ReactNode } from 'react'
import { Image } from 'src/components/elements/Image'
import { asStyled } from 'src/components/hoc/asStyled'
import { TooltipMessage } from 'src/components/parts/ToolTip'
import { darkGray, primary, purple } from 'src/styles/colors'
import {
  fontWeightMedium,
  fontWeightSemiBold
} from 'src/styles/font'
import { AssetSymbol } from 'src/types/models'
import {
  BN_ZERO,
  formatAmt,
} from 'src/utils/number'
import styled from 'styled-components'

type CardProps = {
  icon: StaticImageData
  collateralIcon: StaticImageData
  symbol: AssetSymbol
  collateralSymbol: string
  balance: BigNumber
  onClick: VoidFunction
}

export const LeveragerCard = asStyled<CardProps>(({ icon, collateralIcon, collateralSymbol, balance, symbol, onClick, className }) => {
  return (
    <LeveragerCardComponent
      icon={icon}
      symbol={symbol}
      collateralSymbol={collateralSymbol}
      collateralIcon={collateralIcon}
      className={className}
      maxApy={
        {
          label: t`Max APY:`,
          value: `+14.16%`,
          tooltip: t`Estimated APY at maximum available leverage`,
        }
      }
      details={[
        {
          label: t`Wallet Balance`,
          value: formatAmt(balance || BN_ZERO, { symbol, decimalPlaces: 2 }),
        },
        {
          label: t`Position`,
          value: `${collateralSymbol}/${symbol}`,
          tooltip: t`Combination of assets used (collateral/debt)`,
        },
        {
          label: t`Max Leverage`,
          value: '10X',
          tooltip: t`Maximum possible leverage for this combination of assets.`,
        },
      ]}
      actions={[
        {
          label: t`Create`,
          onClick: onClick,
        },
      ]}
    />
  )
})``

type LeveragerCardProps = {
  icon: StaticImageData
  collateralIcon: StaticImageData
  symbol: AssetSymbol
  collateralSymbol: string
  details?: {
    label: string
    value: string
    tooltip?: ReactNode
  }[]
  maxApy?: {
    label: string
    value: string
    tooltip?: ReactNode
  }
  actions: {
    label: string
    onClick: VoidFunction
  }[]
}
const LeveragerCardComponent = styled<FC<LeveragerCardProps & { className?: string }>>(
  ({ icon, collateralIcon, symbol, collateralSymbol, actions, maxApy, details, className }) => {
    return (
      <LeveragerCardDiv className={className}>
        <PairDiv>
          <Image src={icon} alt={symbol} width={48} height={48} />
          <Image src={collateralIcon} alt={collateralSymbol} width={52} height={48} style={{ marginLeft: "-8px" }} />
        </PairDiv>
        {maxApy && (
          <MaxApyDiv>
            <span>
              {maxApy.tooltip && <TooltipMessage message={maxApy.tooltip} />}
              {maxApy.label}
            </span>
            <span>{maxApy.value}</span>
          </MaxApyDiv>
        )}
        {details && (
          <DetailsDiv>
            {details.map(({ label, value, tooltip }) => (
              <DetailDiv key={label}>
                <span>
                  {label}
                  {tooltip && <TooltipMessage message={tooltip} />}
                </span>
                <span>{value}</span>
              </DetailDiv>
            ))}
          </DetailsDiv>
        )}
        <ActionsDiv>
          {actions.map(({ label, onClick }) => (
            <Button
              key={label}
              onClick={onClick}
            >
              {label}
            </Button>
          ))}
        </ActionsDiv>
      </LeveragerCardDiv>
    )
  },
)``

const ActionsDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 16px;
`

const DetailDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > span:first-child {
    display: flex;
    column-gap: 4px;
  }
  > span:last-child {
    color: ${primary}a3;
  }
  ${TooltipMessage} {
    width: 240px;
  }
`

const DetailsDiv = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  margin-top: 24px;
  padding: 16px 0;
  border-top: 1px solid ${darkGray}7a;
  border-bottom: 1px solid ${darkGray}7a;

  font-size: 14px;
  font-weight: ${fontWeightSemiBold};
`
const MaxApyDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: ${fontWeightSemiBold};
  margin-top: 24px;
  > span:first-child {
    display: flex;
    column-gap: 4px;
  }
  > span:last-child {
    padding-left: 8px;
    color: ${primary}a3;
  }
  ${TooltipMessage} {
    width: 240px;
  }
`

const Button = styled.button`
  padding: 16px;
  width: 100%;
  border-radius: 4px;
  background-color: ${darkGray};
  backdrop-filter: blur(16px) brightness(1.08);
  text-align: center;
  transition: all 0.2s ease-in;
  :enabled:hover {
    background-color: ${purple};
  }
  :disabled {
    background-color: rgba(255, 255, 255, 0.08);
    opacity: 0.32;
  }
`
const LeveragerCardDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 420px;
  padding: 32px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px) brightness(1.08);
  p:first-child {
    font-size: 18px;
    font-weight: ${fontWeightMedium};
  }
  ${ActionsDiv} {
    margin-top: auto;
  }
`

const PairDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
