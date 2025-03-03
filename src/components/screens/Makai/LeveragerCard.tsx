import { t } from '@lingui/macro'
import { BigNumber, valueToBigNumber } from '@starlay-finance/math-utils'
import { StaticImageData } from 'next/image'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { Image } from 'src/components/elements/Image'
import { asStyled } from 'src/components/hoc/asStyled'
import { TooltipMessage } from 'src/components/parts/ToolTip'
import { useLeverager } from 'src/hooks/contracts/useLeverager'
import { useLdotApy } from 'src/hooks/useLdotApy'
import { darkGray, primary, purple } from 'src/styles/colors'
import { fontWeightMedium, fontWeightSemiBold } from 'src/styles/font'
import { AssetMarketData, AssetSymbol } from 'src/types/models'
import { EthereumAddress } from 'src/types/web3'
import { BN_ZERO, formatAmt } from 'src/utils/number'
import styled from 'styled-components'

type CardProps = {
  collateralAsset?: AssetMarketData | undefined
  asset: AssetMarketData
  balance: BigNumber
  onClick: VoidFunction
}

export const LeveragerCard = asStyled<CardProps>(
  ({
    collateralAsset,
    asset,
    balance,
    onClick,
    className,
  }) => {
    const { getLTV } = useLeverager()
    const [maxLeverage, setMaxLeverage] = useState<number>(0)
    const { apy } = useLdotApy()

    const maxApy = useMemo(() => {
      const maxApy =
        (maxLeverage) *
        (apy -
          asset.variableBorrowAPY.toNumber() +
          (collateralAsset?.depositAPY || BN_ZERO).toNumber()) *
        100
      return maxApy
    }, [maxLeverage, apy, asset.variableBorrowAPY, collateralAsset?.depositAPY])

    useEffect(() => {
      const fetchLtv = async () => {
        try {
          const result = await getLTV({
            asset: collateralAsset?.underlyingAsset as EthereumAddress,
          })
          setMaxLeverage(10000 / (10000 - Number(result)) - 0.1)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
      fetchLtv()
    }, [collateralAsset?.underlyingAsset, getLTV])

    return (
      <LeveragerCardComponent
        icon={asset.icon}
        symbol={asset.symbol}
        collateralSymbol={collateralAsset?.symbol!}
        collateralIcon={collateralAsset?.icon!}
        className={className}
        maxApy={{
          label: t`Max APY:`,
          value: maxApy ? formatAmt(valueToBigNumber(maxApy) || BN_ZERO, {
            symbol: '%',
            decimalPlaces: 2,
          }) : "-",
          tooltip: t`Estimated APY at maximum available leverage`,
        }}
        details={[
          {
            label: t`Wallet Balance`,
            value: formatAmt(balance || BN_ZERO, { symbol: asset.symbol, decimalPlaces: 2 }),
          },
          {
            label: t`Position`,
            value: `${collateralAsset?.symbol}/${asset.symbol}`,
            tooltip: t`Combination of assets used (collateral/debt)`,
          },
          {
            label: t`Max Leverage`,
            value: maxLeverage ? `${maxLeverage}X` : '-',
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
  },
)``

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
const LeveragerCardComponent = styled<
  FC<LeveragerCardProps & { className?: string }>
>(
  ({
    icon,
    collateralIcon,
    symbol,
    collateralSymbol,
    actions,
    maxApy,
    details,
    className,
  }) => {
    return (
      <LeveragerCardDiv className={className}>
        <PairDiv>
          <Image src={icon} alt={symbol} width={48} height={48} />
          <Image
            src={collateralIcon}
            alt={collateralSymbol}
            width={52}
            height={48}
            style={{ marginLeft: '-8px' }}
          />
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
            <Button key={label} onClick={onClick}>
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
  flex-direction: row;
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
  background-color: ${purple};
  backdrop-filter: blur(16px) brightness(1.08);
  text-align: center;
  transition: all 0.2s ease-in;
`
const LeveragerCardDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 360px;
  padding: 24px;
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
