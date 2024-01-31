import { t } from '@lingui/macro'
import {
  BigNumber,
  normalize,
  normalizeBN,
  valueToBigNumber,
} from '@starlay-finance/math-utils'
import debounce from 'debounce'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import {
  Area,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { IconArrowBottom, IconArrowLeft } from 'src/assets/svgs'
import { SimpleCtaButton } from 'src/components/parts/Cta'
import {
  ShimmerPlaceholder,
} from 'src/components/parts/Loading'
import { AssetLabel } from 'src/components/parts/Modal/parts'
import { RatioSliderControl } from 'src/components/parts/Modal/parts/RatioControl'
import { TooltipMessage } from 'src/components/parts/ToolTip'
import { useLdotApy, useLdotExchangeRate } from 'src/hooks/useLdotApy'
import { useSwitchChainIfUnsupported } from 'src/hooks/useUnsupportedChainAlert'
import { useUserData } from 'src/hooks/useUserData'
import { useWalletBalance } from 'src/hooks/useWalletBalance'
import {
  blue,
  darkGray,
  darkRed,
  lightYellow,
  offWhite,
  purple,
  trueWhite,
} from 'src/styles/colors'
import {
  fontWeightBold,
  fontWeightHeavy,
  fontWeightSemiBold,
} from 'src/styles/font'
import { breakpoint } from 'src/styles/mixins'
import { AssetMarketData } from 'src/types/models'
import { estimateLeverager } from 'src/utils/estimationHelper'
import {
  BN_ZERO,
  formatAmt,
  formatUSD,
  formattedToBigNumber
} from 'src/utils/number'
import { APP, MAKAI } from 'src/utils/routes'
import styled, { css } from 'styled-components'
import {
  Action,
  AmountInput,
  Balance,
  Control,
  Tab,
  TabDate,
  TabFC,
} from '../../Dashboard/modals/parts'

const TABS = ['leverage', 'mystats'] as const
type TabType = typeof TABS[number]
const ActionTab: TabFC = Tab

const TABS_DATE_RANGE = [
  'onemonth',
  'threemonth',
  'sixmonth',
  'oneyear',
  'max',
] as const
type TabDateRangeType = typeof TABS_DATE_RANGE[number]
const ActionDateRangeTab: TabFC = TabDate

export type LeveragerProps = {
  asset: AssetMarketData
  collateralAsset: AssetMarketData
  marketReferenceCurrencyPriceInUSD: BigNumber
  startLeverager: (amount: BigNumber, leverage: BigNumber) => Promise<any>
  startLeveragerDotFromPosition: (
    amount: BigNumber,
    leverage: BigNumber,
  ) => Promise<any>
  closeLeverageDOT: () => Promise<any>
  getStatusAfterLeverageDotTransaction: (
    amount: BigNumber,
    leverage: BigNumber,
  ) => Promise<any>
  getStatusAfterLeverageDotFromPositionTransaction: (
    amount: BigNumber,
    leverage: BigNumber,
  ) => Promise<any>
  getLTV: () => Promise<string>
  getLt: () => Promise<string>
  getExchangeRateDOT2LDOT: () => Promise<string>
  getExchangeRateLDOT2DOT: () => Promise<string>
}

export const Leverager: FC<LeveragerProps> = ({
  asset,
  collateralAsset,
  marketReferenceCurrencyPriceInUSD,
  startLeverager,
  startLeveragerDotFromPosition,
  closeLeverageDOT,
  getStatusAfterLeverageDotTransaction,
  getStatusAfterLeverageDotFromPositionTransaction,
  getLTV,
  getLt,
  getExchangeRateLDOT2DOT,
  getExchangeRateDOT2LDOT,
}) => {
  const router = useRouter()
  const { switchChainIfUnsupported } = useSwitchChainIfUnsupported()

  const { apy } = useLdotApy()
  const { data: balances } = useWalletBalance()
  const { data: userData } = useUserData()

  const [isAssetDropDownOpen, setIsAssetDropDownOpen] = useState(false)
  const [isPosition, setIsPosition] = useState(false)
  const assetDropDownContainerRef = useRef(null)

  const [supplyAmount, setSupplyAmount] = useState('')
  const [leverage, setLeverage] = useState<BigNumber>(valueToBigNumber('1.1'))
  const [totalCollateralAfterTx, setTotalCollateralAfterTx] = useState('')
  const [totalDebtAfterTx, setTotalDebtAfterTx] = useState('')
  const [totalCollateralInDotAfterTx, setTotalCollateralInDotAfterTx] =
    useState('')
  const [totalDebtInDotAfterTx, setTotalDebtInDotAfterTx] = useState('')
  const [healthFactorAfterTx, setHealthFactorAfterTx] = useState('')
  const [maxLeverage, setMaxLeverage] = useState<number>()
  const [exchangeRateDOT2LDOT, setExchangeRateDOT2LDOT] = useState<string>('')
  const [exchangeRateLDOT2DOT, setExchangeRateLDOT2DOT] = useState<string>('')
  const [liquidationThreshold, setLiquidationThreshold] = useState<string>('')

  const [isCloseLoading, setIsCloseLoading] = useState(false)
  const [isLeverageLoading, setIsLeverageLoading] = useState(false)

  const [activeTab, setActiveTab] = useState<TabType>('leverage')
  const [activeDateRangeTab, setActiveDateRangeTab] =
    useState<TabDateRangeType>('onemonth')
  const { exchangeRates } = useLdotExchangeRate()

  const estimation = userData
    ? estimateLeverager({
      amount: formattedToBigNumber(supplyAmount),
      asset,
      userAssetBalance: {
        ...userData.balanceByAsset[collateralAsset.symbol],
        inWallet: balances[asset.symbol],
      },
      leverage,
      isPosition,
    })
    : {
      unavailableReason: t`Enter amount`,
      maxAmount: balances[asset.symbol],
    }

  const netApy = useMemo(() => {
    const netApy =
      leverage.toNumber() *
      (apy -
        (asset?.variableBorrowAPY || BN_ZERO).toNumber() +
        (collateralAsset?.depositAPY || BN_ZERO).toNumber()) *
      100
    return netApy
  }, [leverage, apy, asset?.variableBorrowAPY, collateralAsset?.depositAPY])

  const totalStakedInCollateral = useMemo(() => {
    const totalStakedInCollateral =
      userData?.balanceByAsset[collateralAsset?.symbol].deposited || BN_ZERO
    return totalStakedInCollateral
  }, [userData?.balanceByAsset, collateralAsset?.symbol])

  const totalBorrowedInAsset = useMemo(() => {
    const totalStakedInCollateral =
      userData?.balanceByAsset[asset?.symbol].borrowed || BN_ZERO
    return totalStakedInCollateral
  }, [userData?.balanceByAsset, asset?.symbol])

  const totalStakedInAsset = useMemo(() => {
    const totalStakedInAsset = (
      userData?.balanceByAsset[collateralAsset?.symbol].deposited || BN_ZERO
    ).multipliedBy(normalizeBN(valueToBigNumber(exchangeRateLDOT2DOT), 18))
    return totalStakedInAsset
  }, [userData?.balanceByAsset, collateralAsset?.symbol, exchangeRateLDOT2DOT])

  const totalStakedPriceInAsset = useMemo(() => {
    const totalStakedPriceInAsset = totalStakedInAsset
      .multipliedBy(asset?.priceInMarketReferenceCurrency)
      .multipliedBy(marketReferenceCurrencyPriceInUSD)
    return totalStakedPriceInAsset
  }, [
    asset?.priceInMarketReferenceCurrency,
    marketReferenceCurrencyPriceInUSD,
    totalStakedInAsset,
  ])

  const statsApy = useMemo(() => {
    const statsApy =
      (1 / (1 - totalBorrowedInAsset.toNumber() / totalStakedInAsset.toNumber())) *
      (apy -
        (asset?.variableBorrowAPY || BN_ZERO).toNumber() +
        (collateralAsset?.depositAPY || BN_ZERO).toNumber()) *
      100
    return statsApy
  }, [apy, asset?.variableBorrowAPY, collateralAsset?.depositAPY, totalBorrowedInAsset, totalStakedInAsset])

  const yieldInCollateral = useMemo(() => {
    const yieldInCollateral = (totalStakedInCollateral.toNumber() * apy) / 12
    return yieldInCollateral
  }, [totalStakedInCollateral, apy])

  const yieldInAsset = useMemo(() => {
    const yieldInAsset = (totalStakedInAsset.toNumber() * apy) / 12
    return yieldInAsset
  }, [totalStakedInAsset, apy])

  const yieldPriceInAsset = useMemo(() => {
    const yieldPriceInAsset = (totalStakedPriceInAsset.toNumber() * apy) / 12
    return yieldPriceInAsset
  }, [totalStakedPriceInAsset, apy])

  const yoy = useMemo(() => {
    const yoyApy =
      leverage.toNumber() *
      (apy - (asset?.variableBorrowAPY || BN_ZERO).toNumber())
    const collateralAmount = normalizeBN(
      valueToBigNumber(totalCollateralInDotAfterTx),
      10,
    ).toNumber()
    const debtAmount = normalizeBN(
      valueToBigNumber(totalDebtInDotAfterTx),
      10,
    ).toNumber()
    const yoy = ((collateralAmount - debtAmount) * yoyApy).toFixed(2)
    return yoy
  }, [
    leverage,
    apy,
    asset?.variableBorrowAPY,
    totalCollateralInDotAfterTx,
    totalDebtInDotAfterTx,
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ltv, lt, exchangeRateDOT2LDOT, exchangeRateLDOT2DOT] =
          await Promise.all([
            getLTV(),
            getLt(),
            getExchangeRateDOT2LDOT(),
            getExchangeRateLDOT2DOT(),
          ])
        setMaxLeverage(10000 / (10000 - Number(ltv)) - 0.1)
        setLiquidationThreshold(lt)
        setExchangeRateDOT2LDOT(exchangeRateDOT2LDOT)
        setExchangeRateLDOT2DOT(exchangeRateLDOT2DOT)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [getExchangeRateDOT2LDOT, getExchangeRateLDOT2DOT, getLTV, getLt])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isPosition) {
          const result = await getStatusAfterLeverageDotFromPositionTransaction(
            formattedToBigNumber(supplyAmount) || BN_ZERO,
            leverage,
          )
          setTotalCollateralAfterTx(result.totalCollateralAfterTx)
          setTotalDebtAfterTx(result.totalDebtAfterTx)
          setTotalCollateralInDotAfterTx(result.totalCollateralInDotAfterTx)
          setTotalDebtInDotAfterTx(result.totalDebtInDotAfterTx)
          setHealthFactorAfterTx(result.healthFactorAfterTx)
        } else {
          const result = await getStatusAfterLeverageDotTransaction(
            formattedToBigNumber(supplyAmount) || BN_ZERO,
            leverage,
          )
          setTotalCollateralAfterTx(result.totalCollateralAfterTx)
          setTotalDebtAfterTx(result.totalDebtAfterTx)
          setTotalCollateralInDotAfterTx(result.totalCollateralInDotAfterTx)
          setTotalDebtInDotAfterTx(result.totalDebtInDotAfterTx)
          setHealthFactorAfterTx(result.healthFactorAfterTx)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    if (!estimation.unavailableReason) fetchData()
  }, [
    estimation.unavailableReason,
    getStatusAfterLeverageDotFromPositionTransaction,
    getStatusAfterLeverageDotTransaction,
    isPosition,
    leverage,
    supplyAmount,
  ])

  const handleDotClick = () => {
    setIsAssetDropDownOpen(false)
    setIsPosition(false)
  }

  const handleDotPositionClick = () => {
    setIsPosition(true)
    setIsAssetDropDownOpen(false)
  }

  const liquidationPrice = useMemo(() => {
    if (!exchangeRateDOT2LDOT) return 0
    return (
      ((
        leverage
          .minus(valueToBigNumber(1))
          .dividedBy(
            leverage.multipliedBy(
              normalizeBN(valueToBigNumber(exchangeRateDOT2LDOT), 18),
            ),
          ) || BN_ZERO
      ).toNumber() *
        10000) /
      Number(liquidationThreshold)
    )
  }, [exchangeRateDOT2LDOT, leverage, liquidationThreshold])

  const liquidationStatsPrice = useMemo(() => {
    if (!exchangeRateDOT2LDOT) return 0
    const leverageStats = (1 / (1 - totalBorrowedInAsset.toNumber() / totalStakedInAsset.toNumber()))
    const liquidationStatsPrice = ((leverageStats - 1) / (leverageStats * normalizeBN(valueToBigNumber(exchangeRateDOT2LDOT), 18).toNumber())) * 10000 / Number(liquidationThreshold)
    return liquidationStatsPrice
  }, [exchangeRateDOT2LDOT, liquidationThreshold, totalBorrowedInAsset, totalStakedInAsset])

  const currentPrice = useMemo(() => {
    if (!exchangeRateLDOT2DOT) return 0
    return normalizeBN(valueToBigNumber(exchangeRateLDOT2DOT), 18).toNumber()
  }, [exchangeRateLDOT2DOT])

  const offPeg = useMemo(() => {
    if (currentPrice === 0) return 0
    return ((1 - liquidationPrice / currentPrice) * 100).toFixed(2)
  }, [currentPrice, liquidationPrice])

  const exchangeRatesCharts = useMemo(() => {
    const slicedExchangeRates =
      activeDateRangeTab === 'onemonth'
        ? exchangeRates.slice(-30)
        : activeDateRangeTab === 'threemonth'
          ? exchangeRates.slice(-100)
          : activeDateRangeTab === 'sixmonth'
            ? exchangeRates.slice(-180)
            : activeDateRangeTab === 'oneyear'
              ? exchangeRates.slice(-365)
              : exchangeRates.slice()
    return slicedExchangeRates.map((item) => {
      return {
        exchangeRate: Number(normalize(item.exchangeRate, 10)).toFixed(6),
        liquidationPrice: liquidationStatsPrice.toFixed(6),
        timestamp: item.timestamp.split('T')[0],
      }
    })
  }, [activeDateRangeTab, exchangeRates, liquidationStatsPrice])

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: any
    payload: any
    label: any
  }) => {
    if (active && payload && payload.length) {
      return (
        <TooltipDiv className="custom-tooltip">
          <DateInfo className="label">{`Date : ${label}`}</DateInfo>
          <ExchangeRateInfo className="intro">{`Exchange Rate : ${payload[0].value}`}</ExchangeRateInfo>
          <LiquidationPriceInfo className="intro">{`Liquidation Price : ${payload[1].value}`}</LiquidationPriceInfo>
        </TooltipDiv>
      )
    }

    return null
  }
  const renderLineChart = (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={exchangeRatesCharts}>
        <defs>
          <linearGradient id="colorExchangeRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          name="LDOT Exchange Rate"
          dataKey="exchangeRate"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorExchangeRate)"
        />
        <Area
          name="Liquidation Price"
          dataKey="liquidationPrice"
          stroke="#a02d1e"
          fillOpacity={0}
          fill="#a02d1e"
        />
        <XAxis dataKey="timestamp" />
        <YAxis type="number" domain={['auto', 'auto']} />
        <Tooltip
          content={
            <CustomTooltip
              active={undefined}
              payload={undefined}
              label={undefined}
            />
          }
        />
        <Legend />
      </ComposedChart>
    </ResponsiveContainer>
  )
  const handleBack = (e: any) => {
    e.preventDefault()
    router.push(APP + MAKAI)
  }
  if (asset === undefined) return <></>
  return (
    <>
      <BackButtonDiv onClick={handleBack}>
        <IconArrowLeft />
        <BackButton>{t`GO BACK`}</BackButton>
      </BackButtonDiv>
      <PageDiv>
        <ActionTabDiv>
          <ActionTab
            tabs={TABS}
            contents={{
              leverage: { label: t`Leverage` },
              mystats: { label: t`My Stats` },
            }}
            activeTab={activeTab}
            onChangeActiveTab={setActiveTab}
          />
        </ActionTabDiv>
        {activeTab === 'leverage' ? (
          <WrapperDiv>
            <InfoDiv>
              <Description>
                <p>{t`Exchange your ${asset?.symbol} for ${collateralAsset?.symbol} to maximize staking returns by leveraging additional ${collateralAsset?.symbol} against your original ${asset?.symbol} holdings.`}</p>
                <br />
              </Description>
              <Description>
                <p>{t`This approach aims to boost your staking rewards but comes with its own set of considerations.`}</p>
                <p>{t`1. Be mindful that the borrowing rate for ${asset?.symbol} on Starlay fluctuates, and it might not always be favorable compared to the rewards from staking.`}</p>
                <p>{t`2. The exchange rate between ${collateralAsset?.symbol} and ${asset?.symbol} is not constant, meaning that a decrease in the ${collateralAsset?.symbol}/${asset?.symbol} ratio could lead to potential risks or losses when you decide to withdraw your investment.`}</p>
                <p>{t`3. There’s an inherent risk of liquidation with such positions.`}</p>
                <br />
                <p>{t`Stay informed about the specific liquidation thresholds for ${collateralAsset?.symbol}/${asset?.symbol} on the Starlay platform, usually visible in a prominent section of the user interface.`}</p>
                <br />
              </Description>
              <FlowInfo>
                <FlowDescription>
                  <p>{t`Flash borrow ${(
                    formattedToBigNumber(supplyAmount) || BN_ZERO
                  )
                    .multipliedBy(leverage)
                    .toNumber()
                    .toFixed(2)} ${asset?.symbol} with flashloan`}</p>
                </FlowDescription>
                <FlowDescription>
                  <p>{t`Wrap ${(formattedToBigNumber(supplyAmount) || BN_ZERO)
                    .multipliedBy(leverage)
                    .toNumber()
                    .toFixed(2)} ${asset?.symbol} into ${(
                      formattedToBigNumber(supplyAmount) || BN_ZERO
                    )
                      .multipliedBy(leverage)
                      .multipliedBy(
                        normalizeBN(valueToBigNumber(exchangeRateDOT2LDOT), 18),
                      )
                      .toNumber()
                      .toFixed(2)} ${collateralAsset?.symbol}`}</p>
                </FlowDescription>
                <FlowDescription>
                  <p>{t`Deposit exchanged ${collateralAsset?.symbol} into lending pool`}</p>
                </FlowDescription>
                {isPosition && (
                  <FlowDescription>
                    <p>{t`Withdraw ${(
                      formattedToBigNumber(supplyAmount) || BN_ZERO
                    )
                      .toNumber()
                      .toFixed(2)} ${asset?.symbol} from lending pool`}</p>
                  </FlowDescription>
                )}

                <FlowDescription>
                  <p>{t`Borrow ${(formattedToBigNumber(supplyAmount) || BN_ZERO)
                    .multipliedBy(leverage.minus(valueToBigNumber(1)))
                    .toNumber()
                    .toFixed(2)} DOT from lending pool`}</p>
                </FlowDescription>
                <FlowDescription>
                  <p>{t`Pay flashloan ${(
                    formattedToBigNumber(supplyAmount) || BN_ZERO
                  )
                    .multipliedBy(leverage)
                    .toNumber()
                    .toFixed(2)} DOT`}</p>
                </FlowDescription>
              </FlowInfo>
            </InfoDiv>
            <ActionDiv>
              <AssetDropDownDiv>
                <SupplyDiv>
                  <InfoTitle>Asset:</InfoTitle>
                  <AssetDiv
                    onClick={() => setIsAssetDropDownOpen(!isAssetDropDownOpen)}
                  >
                    <AssetLabel
                      asset={asset}
                      label={`${asset?.symbol}${isPosition ? '(position)' : ''
                        }`}
                    />
                    <IconArrowBottom />
                  </AssetDiv>
                </SupplyDiv>
                <AssetDropDown
                  $isOpen={isAssetDropDownOpen}
                  ref={assetDropDownContainerRef}
                >
                  <DropDownDiv
                    as="div"
                    onClick={handleDotClick}
                    $isActive={!isPosition}
                  >
                    <AssetLabel asset={asset} label={asset?.symbol} />
                  </DropDownDiv>
                  <DropDownDiv
                    as="div"
                    onClick={handleDotPositionClick}
                    $isActive={isPosition}
                  >
                    <AssetLabel
                      asset={asset}
                      label={`${asset?.symbol}(position)`}
                    />
                  </DropDownDiv>
                </AssetDropDown>
              </AssetDropDownDiv>
              <SupplyDiv style={{ marginTop: '24px' }}>
                <InfoTitle>Supply:</InfoTitle>
                <AmountInput
                  value={supplyAmount}
                  onChange={setSupplyAmount}
                  setMaxValue={() =>
                    setSupplyAmount(formatAmt(estimation.maxAmount))
                  }
                  significantDigits={asset?.decimals}
                />
              </SupplyDiv>
              {maxLeverage ? (
                <RatioSliderControl
                  setValue={setLeverage}
                  current={leverage}
                  max={valueToBigNumber((maxLeverage || 1).toString())}
                  sliderColors={[blue, lightYellow, darkRed]}
                  customLabel={t`Leverage`}
                />
              ) : (
                <ShimmerPlaceholder />
              )}
              {isPosition ? (
                <Balance
                  label={t`Deposited ${asset.symbol}`}
                  balance={valueToBigNumber(
                    userData?.balanceByAsset[asset?.symbol].deposited ||
                    BN_ZERO.toNumber().toFixed(2),
                  )}
                  symbol={asset.symbol}
                />
              ) : (
                <Balance
                  label={t`Wallet Balance`}
                  balance={valueToBigNumber(
                    balances[asset.symbol].toNumber().toFixed(2),
                  )}
                  symbol={asset.symbol}
                />
              )}

              {!estimation.unavailableReason &&
                !!totalCollateralAfterTx &&
                !!totalDebtAfterTx &&
                !!healthFactorAfterTx && (
                  <>
                    <StatusDiv>{t`Final state after recipe:`}</StatusDiv>
                    <StatusInfo>
                      <DetailDiv>
                        <span>
                          <TooltipMessage
                            message={`The dollar-based value of the ${collateralAsset?.symbol} being deposited.`}
                          />
                          {t`Collateral:`}
                        </span>
                        <span>
                          {formatUSD(
                            normalizeBN(
                              valueToBigNumber(totalCollateralAfterTx),
                              18,
                            ) || BN_ZERO,
                            { decimalPlaces: 2 },
                          )}
                        </span>
                      </DetailDiv>
                      <DetailDiv>
                        <span>
                          <TooltipMessage
                            message={`The dollar-based value of the ${asset?.symbol} being borrowed.`}
                          />
                          {t`Debt:`}
                        </span>
                        <span>
                          {formatUSD(
                            normalizeBN(
                              valueToBigNumber(totalDebtAfterTx),
                              18,
                            ) || BN_ZERO,
                            { decimalPlaces: 2 },
                          )}
                        </span>
                      </DetailDiv>
                      <DetailDiv>
                        <span>
                          <TooltipMessage message="Triggers liquidation. If it falls below 1, the position becomes subject to liquidation." />
                          {t`Health Factor:`}
                        </span>
                        <span>
                          {formatAmt(
                            normalizeBN(
                              valueToBigNumber(healthFactorAfterTx),
                              18,
                            ) || BN_ZERO,
                            { decimalPlaces: 2 },
                          )}
                        </span>
                      </DetailDiv>
                      <DetailDiv>
                        <span>
                          <TooltipMessage message="The net APY of your position, based on the current staking rewards of the selected LST and borrow conditions." />
                          {t`Net APY:`}
                        </span>
                        <span>
                          {formatAmt(valueToBigNumber(netApy) || BN_ZERO, {
                            symbol: '%',
                            decimalPlaces: 2,
                          })}
                        </span>
                      </DetailDiv>
                      <DetailDiv>
                        <span>
                          <TooltipMessage
                            message={`The expected yearly return of this position based on the current conditions of ${asset?.symbol} borrow rate and staking rewards from ${collateralAsset?.symbol}.`}
                          />
                          {t`YoY Return:`}
                        </span>
                        <span>
                          {yoy} {asset?.symbol}
                        </span>
                      </DetailDiv>
                    </StatusInfo>
                    {healthFactorAfterTx &&
                      normalizeBN(
                        valueToBigNumber(healthFactorAfterTx),
                        18,
                      ).toNumber() < 1 && (
                        <WarningDiv>
                          <p>Below liquidation threshold.</p>
                        </WarningDiv>
                      )}
                    <StatusDiv>{t`Liquidation Info:`}</StatusDiv>
                    <DetailsDiv>
                      <DetailDiv>
                        <span>
                          <TooltipMessage
                            message={`The ratio between ${collateralAsset?.symbol} and ${asset?.symbol} at which your position would fall below the liquidation threshold.`}
                          />
                          Liquidation price:
                        </span>
                        <span>
                          {liquidationPrice.toFixed(2)} {asset?.symbol}/
                          {collateralAsset?.symbol}
                        </span>
                      </DetailDiv>
                      <DetailDiv>
                        <span>
                          <TooltipMessage
                            message={`The current ratio between ${collateralAsset?.symbol} and ${asset?.symbol}.`}
                          />
                          Current price:
                        </span>
                        <span>
                          {currentPrice.toFixed(2)} {asset?.symbol}/
                          {collateralAsset?.symbol}
                        </span>
                      </DetailDiv>
                      <DetailDiv>
                        <span>
                          <TooltipMessage
                            message={`The percentage deviation from ${collateralAsset?.symbol} to ${asset?.symbol} price ratio that would need to happen for your position to be liquidated.`}
                          />
                          Off-peg % to liquidation:
                        </span>
                        <span>{offPeg} %</span>
                      </DetailDiv>
                    </DetailsDiv>
                  </>
                )}
              <ActionButton
                onClick={
                  isPosition
                    ? debounce(
                      switchChainIfUnsupported(async () => {
                        setIsLeverageLoading(true)
                        await startLeveragerDotFromPosition(
                          formattedToBigNumber(supplyAmount) || BN_ZERO,
                          leverage,
                        )
                        setIsLeverageLoading(false)
                      }),
                      2000,
                      { immediate: true },
                    )
                    : debounce(
                      switchChainIfUnsupported(async () => {
                        setIsLeverageLoading(true)
                        await startLeverager(
                          formattedToBigNumber(supplyAmount) || BN_ZERO,
                          leverage,
                        )
                        setIsLeverageLoading(false)
                      }),
                      2000,
                      { immediate: true },
                    )
                }
                disabled={!!estimation.unavailableReason || isLeverageLoading}
              >
                {estimation.unavailableReason || t`Start leverager`}
              </ActionButton>
              <ActionButton
                disabled={isCloseLoading}
                onClick={debounce(
                  switchChainIfUnsupported(async () => {
                    setIsCloseLoading(true)
                    await closeLeverageDOT()
                    setIsCloseLoading(false)
                  }),
                  2000,
                  { immediate: true },
                )}
              >
                {t`Close Leverager`}
              </ActionButton>
            </ActionDiv>
          </WrapperDiv>
        ) : (
          <>
            <StatusSection>
              {/* <StatusTitle>{t`My Stats`}</StatusTitle> */}
              <InfoSection>
                {totalBorrowedInAsset.toNumber() ? (
                  <>
                    <DetailInfo>
                      <DetailInfoTitle>{t`Total Staked`}</DetailInfoTitle>
                      <DetailInfoContent>
                        {exchangeRateLDOT2DOT && (
                          formatAmt(totalStakedInCollateral, {
                            symbol: collateralAsset?.symbol,
                            shorteningThreshold: 6,
                          })
                        )}
                      </DetailInfoContent>
                      <DetailInfoContent>
                        {exchangeRateLDOT2DOT && (
                          `≈ ${formatAmt(totalStakedInAsset, {
                            symbol: asset.symbol,
                            shorteningThreshold: 6,
                          })}`
                        )}
                      </DetailInfoContent>
                      <DetailInfoContent>
                        {exchangeRateLDOT2DOT && (
                          `≈US ${formatUSD(totalStakedPriceInAsset)}`
                        )}
                      </DetailInfoContent>
                    </DetailInfo>
                    <DetailInfo>
                      <DetailInfoTitle>{t`Est. Yield/Month*`}</DetailInfoTitle>
                      <DetailInfoContent>
                        {exchangeRateLDOT2DOT && (
                          formatAmt(valueToBigNumber(yieldInCollateral), {
                            symbol: collateralAsset?.symbol,
                            shorteningThreshold: 6,
                          })
                        )}
                      </DetailInfoContent>
                      <DetailInfoContent>
                        {exchangeRateLDOT2DOT && (
                          `≈ ${formatAmt(valueToBigNumber(yieldInAsset), {
                            symbol: asset.symbol,
                            shorteningThreshold: 6,
                          })}`
                        )}
                      </DetailInfoContent>
                      <DetailInfoContent>
                        {exchangeRateLDOT2DOT && (
                          `≈US ${formatUSD(valueToBigNumber(yieldPriceInAsset))}`
                        )}
                      </DetailInfoContent>
                    </DetailInfo>
                    <DetailInfo>
                      <DetailInfoTitle>{t`APY`}</DetailInfoTitle>
                      <DetailInfoContent>
                        ≈{' '}
                        {formatAmt(valueToBigNumber(statsApy) || BN_ZERO, {
                          symbol: '%',
                          decimalPlaces: 2,
                        })}
                      </DetailInfoContent>
                    </DetailInfo>
                  </>
                ) : (
                  <WarningInfo>No Leveraged Tokens</WarningInfo>
                )}
              </InfoSection>
            </StatusSection>
            <ChartDiv>
              <ActionTabDateRangeDiv>
                <ActionDateRangeTab
                  tabs={TABS_DATE_RANGE}
                  contents={{
                    onemonth: { label: t`1m` },
                    threemonth: { label: t`3m` },
                    sixmonth: { label: t`6m` },
                    oneyear: { label: t`1y` },
                    max: { label: t`max` },
                  }}
                  activeTab={activeDateRangeTab}
                  onChangeActiveTab={setActiveDateRangeTab}
                />
              </ActionTabDateRangeDiv>
              {renderLineChart}
            </ChartDiv>
          </>
        )}
      </PageDiv>
    </>
  )
}

const Description = styled.div`
  p {
    font-size: 16px;
    line-height: 1.5;
    color: ${offWhite};
  }
`
const StatusDiv = styled.p`
  margin-top: 16px;
  font-size: 18px;
  font-weight: ${fontWeightHeavy};
  color: ${offWhite};
`

const WrapperDiv = styled.div`
  display: flex;
  flex-direction: column-reverse;
  ${Balance} {
    margin-top: 16px;
    font-size: 18px;
  }
  ${SimpleCtaButton} {
    margin-top: 16px;
    text-transform: uppercase;
    :enabled {
      cursor: pointer;
    }
  }
  ${Action} {
    padding: 24px 32px;
    font-size: 16px;
  }
  ${AmountInput} {
    input {
      width: 150px !important;
      font-size: 18px !important;
      font-weight: bold !important;
    }
  }
  ${Control} {
    position: absolute;
    top: 52%;
    transform: translateY(-50%);
    right: 0px;
  }
  @media ${breakpoint.xl} {
    flex-direction: row;
    ${Action} {
      padding: 32px;
      font-size: 18px;
    }
  }
`
const PageDiv = styled.div`
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(8px) brightness(1.08);
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 16px 24px;
`
const BackButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100px;
  backdrop-filter: blur(8px) brightness(1.08);
  cursor: pointer;
  margin-bottom: 18px;
`

const SupplyDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const AssetDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  column-gap: 16px;
  cursor: pointer;
`

const FlowInfo = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: #0f0f0f;
  padding: 8px 8px 0px 8px;
`

const StatusInfo = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  row-gap: 8px;
  background-color: rgba(255, 255, 255, 0.027);
  margin-top: 16px;
  padding: 8px;
  font-size: 16px;
  font-weight: ${fontWeightSemiBold};
`

const WarningDiv = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: rgba(107, 32, 32, 0.945);
  margin-top: 24px;
  padding: 16px;
  p {
    color: ${offWhite};
  }
`

const FlowDescription = styled.div`
  p {
    line-height: 1.5;
    font-size: 16px;
    font-weight: ${fontWeightBold};
    color: ${offWhite};
  }
  background-color: rgba(255, 255, 255, 0.027);
  padding: 4px 12px;
  margin-bottom: 8px;
  border-radius: 4px;
`

const InfoTitle = styled.p`
  font-size: 18px;
`

const InfoDiv = styled.div`
  width: 100%;
  padding: 24px 24px 0px 0px;
  @media ${breakpoint.xl} {
    flex: 1;
  }
`

const ActionDiv = styled.div`
  width: 100%;
  padding: 24px 0px 0px 24px;
  @media ${breakpoint.xl} {
    flex: 1;
  }
`

const AssetDropDown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  z-index: 10;
  top: 100%;
  right: 0;
  margin-top: 8px;
  border-radius: 4px;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  background-color: #181818;
  ${({ $isOpen }) =>
    $isOpen &&
    css`
      visibility: visible;
      opacity: 1;
    `}
`
const AssetDropDownDiv = styled.div`
  position: relative;
`

const DropDownDiv = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  white-space: nowrap;
  line-height: 1;
  transition: color 0.15s ease-in;
  cursor: pointer;
  :hover {
    color: ${purple};
  }
  :disabled {
    color: ${trueWhite}80;
  }
  ${({ $isActive }) =>
    $isActive &&
    css`
      background-color: #222222;
    `}
`

const ActionButton = styled(SimpleCtaButton)`
  height: 40px;
  @media ${breakpoint.xl} {
    font-size: 16px;
  }
`

const BackButton = styled.button`
  height: 40px;
  text-transform: uppercase;
  font-style: italic;
  background-color: transparent;
  font-weight: ${fontWeightHeavy};
  @media ${breakpoint.xl} {
    font-size: 18px;
  }
`

const DetailsDiv = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  margin-top: 16px;
  padding: 16px 0;
  border-top: 1px solid ${darkGray}7a;
  border-bottom: 1px solid ${darkGray}7a;
  font-size: 16px;
  font-weight: ${fontWeightSemiBold};
`

const DetailDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > span:first-child {
    display: flex;
  }
  > span:last-child {
    color: ${offWhite};
  }
  ${TooltipMessage} {
    width: 280px;
    background-color: #0f0f0f;
  }
`
const InfoSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`
const DetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const DetailInfoTitle = styled.p`
  font-size: 18px;
  font-weight: ${fontWeightSemiBold};
  padding-bottom: 12px;
`

const WarningInfo = styled.p`
  font-size: 20px;
  font-weight: ${fontWeightSemiBold};
`

const DetailInfoContent = styled.p`
  font-size: 16px;
  font-weight: ${fontWeightSemiBold};
  padding-bottom: 8px;
`

const StatusSection = styled.section`
  padding: 24px 0px;
  margin: 24px 0px;
  background-color: #0f0f0f;
  border-radius: 8px;
`

const StatusTitle = styled.p`
  font-size: 24px;
  padding-bottom: 18px;
  font-weight: ${fontWeightHeavy};
  text-align: center;
`

const TooltipDiv = styled.div`
  padding: 8px;
  background-color: #222222;
  box-shadow: 10px 5px 5px #131313;
  border-radius: 4px;
`

const ActionTabDiv = styled.div`
  ${Tab} {
    width: 100%;
    @media ${breakpoint.xl} {
      width: 300px;
    }
  }
`
const ActionTabDateRangeDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  ${TabDate} {
    width: 200px;
    margin-bottom: 24px;
    background-color: #272727;
    padding: 4px;
    border-radius: 4px;
  }
`

const ChartDiv = styled.div`
  background-color: #0f0f0f;
  border-radius: 8px;
  margin: 24px 0px;
  padding: 24px 24px 24px 0px;
`
const ExchangeRateInfo = styled.p`
  color: #82ca9d;
`
const LiquidationPriceInfo = styled.p`
  color: #a02d1e;
`
const DateInfo = styled.p`
  margin-bottom: 8px;
`
