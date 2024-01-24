import { t } from '@lingui/macro'
import {
  BigNumber,
  normalizeBN,
  valueToBigNumber,
} from '@starlay-finance/math-utils'
import debounce from 'debounce'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { IconArrowBottom } from 'src/assets/svgs'
import { SimpleCtaButton } from 'src/components/parts/Cta'
import { ShimmerPlaceholder } from 'src/components/parts/Loading'
import { AssetLabel } from 'src/components/parts/Modal/parts'
import { RatioSliderControl } from 'src/components/parts/Modal/parts/RatioControl'
import { TooltipMessage } from 'src/components/parts/ToolTip'
import { useLdotApy } from 'src/hooks/useLdotApy'
import {
  blue, darkGray, darkRed,
  lightYellow,
  offWhite, primary, purple,
  trueWhite
} from 'src/styles/colors'
import { fontWeightBold, fontWeightHeavy, fontWeightSemiBold } from 'src/styles/font'
import { breakpoint } from 'src/styles/mixins'
import { AssetMarketData } from 'src/types/models'
import {
  LeveragerEstimationParam,
  estimateLeverager,
} from 'src/utils/estimationHelper'
import {
  BN_ZERO,
  formatAmt,
  formatUSD,
  formattedToBigNumber,
} from 'src/utils/number'
import styled, { css } from 'styled-components'
import {
  Action,
  AmountInput,
  Balance,
  Control,
} from '../../../Dashboard/modals/parts'

export type LeveragerModalBodyProps = Omit<
  LeveragerEstimationParam,
  'amount'
> & {
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
  max?: boolean
  collateralAsset?: AssetMarketData
}

export const LeveragerModalBody: FC<LeveragerModalBodyProps> = ({
  startLeverager,
  startLeveragerDotFromPosition,
  closeLeverageDOT,
  getStatusAfterLeverageDotTransaction,
  getStatusAfterLeverageDotFromPositionTransaction,
  getLTV,
  getLt,
  getExchangeRateLDOT2DOT,
  getExchangeRateDOT2LDOT,
  max,
  ...estimationParams
}) => {
  const { asset, userAssetBalance, collateralAsset } = estimationParams
  const { symbol, displaySymbol, variableBorrowAPY } = asset
  const { inWallet, deposited } = userAssetBalance
  const { apy } = useLdotApy()
  const [supplyAmount, setSupplyAmount] = useState('')
  const [isAssetDropDownOpen, setIsAssetDropDownOpen] = useState(false)
  const [isPosition, setIsPosition] = useState(false)
  const assetDropDownContainerRef = useRef(null)
  const [leverage, setLeverage] = useState<BigNumber>(valueToBigNumber('1.1'))
  const [totalCollateralAfterTx, setTotalCollateralAfterTx] = useState('')
  const [totalDebtAfterTx, setTotalDebtAfterTx] = useState('')
  const [healthFactorAfterTx, setHealthFactorAfterTx] = useState('')
  const [maxLeverage, setMaxLeverage] = useState<number>()
  const [exchangeRateDOT2LDOT, setExchangeRateDOT2LDOT] = useState<string>('')
  const [exchangeRateLDOT2DOT, setExchangeRateLDOT2DOT] = useState<string>('')
  const [liquidationThreshold, setLiquidationThreshold] = useState<string>('')
  const [isCloseLoading, setIsCloseLoading] = useState(false)
  const [isLeverageLoading, setIsLeverageLoading] = useState(false)

  const estimation = estimateLeverager({
    amount: formattedToBigNumber(supplyAmount),
    asset,
    userAssetBalance,
    leverage,
    isPosition,
  })

  const netApy = useMemo(() => {
    const netApy =
      leverage.toNumber() *
      (apy -
        variableBorrowAPY.toNumber() +
        (collateralAsset?.depositAPY || BN_ZERO).toNumber()) *
      100
    return netApy
  }, [leverage, apy, variableBorrowAPY, collateralAsset])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ltv, exchangeRateDOT2LDOT, lt, exchangeRateLDOT2DOT] = await Promise.all([
          getLTV(),
          getExchangeRateDOT2LDOT(),
          getLt(),
          getExchangeRateLDOT2DOT()
        ])
        setMaxLeverage(10000 / (10000 - Number(ltv)) - 0.1)
        setExchangeRateDOT2LDOT(exchangeRateDOT2LDOT)
        setExchangeRateLDOT2DOT(exchangeRateLDOT2DOT)
        setLiquidationThreshold(lt)
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
          setHealthFactorAfterTx(result.healthFactorAfterTx)
        } else {
          const result = await getStatusAfterLeverageDotTransaction(
            formattedToBigNumber(supplyAmount) || BN_ZERO,
            leverage,
          )
          setTotalCollateralAfterTx(result.totalCollateralAfterTx)
          setTotalDebtAfterTx(result.totalDebtAfterTx)
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

  return (
    <WrapperDiv>
      <InfoDiv>
        <Description>
          <p>{t`Exchange your DOT for lDOT to maximize staking returns by leveraging additional lDOT against your original DOT holdings.`}</p>
          <br />
        </Description>
        <Description>
          <p>{t`This approach aims to boost your staking rewards but comes with its own set of considerations.`}</p>
          <p>{t`1. Be mindful that the borrowing rate for DOT on Starlay fluctuates, and it might not always be favorable compared to the rewards from staking.`}</p>
          <p>{t`2. The exchange rate between lDOT and DOT is not constant, meaning that a decrease in the lDOT/DOT ratio could lead to potential risks or losses when you decide to withdraw your investment.`}</p>
          <p>{t`3. There’s an inherent risk of liquidation with such positions.`}</p>
          <br />
          <p>{t`Stay informed about the specific liquidation thresholds for lDOT/DOT on the Starlay platform, usually visible in a prominent section of the user interface.`}</p>
          <br />
        </Description>
        <FlowInfo>
          <FlowDescription>
            <p>{t`Flash borrow ${Number(
              formattedToBigNumber(supplyAmount)?.multipliedBy(leverage) ||
              BN_ZERO,
            ).toFixed(2)} DOT with flashloan`}</p>
          </FlowDescription>
          <FlowDescription>
            <p>{t`Wrap ${Number(
              formattedToBigNumber(supplyAmount)?.multipliedBy(leverage) ||
              BN_ZERO,
            ).toFixed(2)} DOT into ${Number(
              formattedToBigNumber(supplyAmount)
                ?.multipliedBy(leverage)
                .multipliedBy(
                  normalizeBN(valueToBigNumber(exchangeRateDOT2LDOT), 18),
                ) || BN_ZERO,
            ).toFixed(2)} LDOT`}</p>
          </FlowDescription>
          <FlowDescription>
            <p>{t`Deposit exchanged LDOT into lending pool`}</p>
          </FlowDescription>
          {isPosition && (
            <FlowDescription>
              <p>{t`Withdraw ${Number(
                formattedToBigNumber(supplyAmount) || BN_ZERO,
              ).toFixed(2)} DOT from lending pool`}</p>
            </FlowDescription>
          )}

          <FlowDescription>
            <p>{t`Borrow ${Number(
              formattedToBigNumber(supplyAmount)?.multipliedBy(
                leverage.minus(valueToBigNumber(1)),
              ) || BN_ZERO,
            ).toFixed(2)} DOT from lending pool`}</p>
          </FlowDescription>
          <FlowDescription>
            <p>{t`Pay flashloan ${Number(
              formattedToBigNumber(supplyAmount)?.multipliedBy(leverage) ||
              BN_ZERO,
            ).toFixed(2)} DOT`}</p>
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
                label={`${asset.symbol}${isPosition ? '(position)' : ''}`}
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
              <AssetLabel asset={asset} label={asset.symbol} />
            </DropDownDiv>
            <DropDownDiv
              as="div"
              onClick={handleDotPositionClick}
              $isActive={isPosition}
            >
              <AssetLabel asset={asset} label={`${asset.symbol}(position)`} />
            </DropDownDiv>
          </AssetDropDown>
        </AssetDropDownDiv>
        <SupplyDiv style={{ marginTop: '24px' }}>
          <InfoTitle>Supply:</InfoTitle>
          <AmountInput
            value={supplyAmount}
            onChange={setSupplyAmount}
            setMaxValue={() => setSupplyAmount(formatAmt(estimation.maxAmount))}
            significantDigits={asset.decimals}
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
            label={t`Deposited ${symbol}`}
            balance={deposited}
            symbol={displaySymbol || symbol}
          />
        ) : (
          <Balance
            label={t`Wallet Balance`}
            balance={inWallet}
            symbol={displaySymbol || symbol}
          />
        )}

        {!estimation.unavailableReason &&
          !!totalCollateralAfterTx &&
          !!totalDebtAfterTx &&
          !!healthFactorAfterTx && (
            <>
              <StatusDiv>
                <p>{t`Final state after recipe:`}</p>
              </StatusDiv>
              <StatusInfo>
                <ResultDiv>
                  <span>{t`Collateral:`}</span>
                  <span>
                    {formatUSD(
                      normalizeBN(valueToBigNumber(totalCollateralAfterTx), 18),
                      { decimalPlaces: 2 },
                    )}
                  </span>
                </ResultDiv>
                <ResultDiv>
                  <span>{t`Debt:`}</span>
                  <span>
                    {formatUSD(
                      normalizeBN(valueToBigNumber(totalDebtAfterTx), 18),
                      { decimalPlaces: 2 },
                    )}
                  </span>
                </ResultDiv>
                <ResultDiv>
                  <span>{t`Health Factor:`}</span>
                  <span>
                    {formatAmt(
                      normalizeBN(valueToBigNumber(healthFactorAfterTx), 18),
                      { decimalPlaces: 2 },
                    )}
                  </span>
                </ResultDiv>
                <ResultDiv>
                  <span>{t`Net APY:`}</span>
                  <span>
                    {formatAmt(valueToBigNumber(netApy) || BN_ZERO, {
                      symbol: '%',
                      decimalPlaces: 2,
                    })}
                  </span>
                </ResultDiv>
              </StatusInfo>
              {Number(
                formatAmt(
                  normalizeBN(valueToBigNumber(healthFactorAfterTx), 18),
                  { decimalPlaces: 2 },
                ),
              ) < 1 && (
                  <WarningDiv>
                    <p>Below liquidation threshold.</p>
                  </WarningDiv>
                )
              }
              <DetailsDiv>
                <DetailDiv>
                  <span>
                    <TooltipMessage message="The ratio between LDOT and DOT at which your position would fall below the liquidation threshold." />
                    Liquidation price:
                  </span>
                  <span>
                    {
                      (Number(leverage
                        .minus(valueToBigNumber(1))
                        .dividedBy(
                          leverage.multipliedBy(normalizeBN(valueToBigNumber(exchangeRateDOT2LDOT), 18)))
                        || BN_ZERO) * 10000 / Number(liquidationThreshold)).toFixed(2)
                    } DOT/LDOT
                  </span>
                </DetailDiv>
                <DetailDiv>
                  <span>
                    <TooltipMessage message="The current ratio between LDOT and DOT." />
                    Current price:
                  </span>
                  <span>{formatAmt(
                    normalizeBN(valueToBigNumber(exchangeRateLDOT2DOT), 18),
                    { decimalPlaces: 2 },
                  )} DOT/LDOT</span>
                </DetailDiv>
                <DetailDiv>
                  <span>
                    <TooltipMessage message="The percentage deviation from LDOT to DOT price ratio that would need to happen for your position to be liquidated." />
                    Off-peg % to liquidation:
                  </span>
                  <span>{((1 - ((Number(leverage
                    .minus(valueToBigNumber(1))
                    .dividedBy(
                      leverage.multipliedBy(normalizeBN(valueToBigNumber(exchangeRateDOT2LDOT), 18)))
                    || BN_ZERO) * 10000 / Number(liquidationThreshold)) / Number(formatAmt(
                      normalizeBN(valueToBigNumber(exchangeRateLDOT2DOT), 18),
                      { decimalPlaces: 2 },
                    )))) * 100).toFixed(2)} %</span>
                </DetailDiv>
              </DetailsDiv>
            </>
          )}
        <ActionButton
          onClick={
            isPosition
              ? debounce(
                async () => {
                  setIsLeverageLoading(true)
                  await startLeveragerDotFromPosition(
                    formattedToBigNumber(supplyAmount) || BN_ZERO,
                    leverage,
                  )
                  setIsLeverageLoading(false)
                },
                2000,
                { immediate: true },
              )
              : debounce(
                async () => {
                  setIsLeverageLoading(true)
                  await startLeverager(
                    formattedToBigNumber(supplyAmount) || BN_ZERO,
                    leverage,
                  )
                  setIsLeverageLoading(false)
                },
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
            async () => {
              setIsCloseLoading(true)
              await closeLeverageDOT()
              setIsCloseLoading(false)
            },
            2000,
            { immediate: true },
          )}
        >
          {t`Close Leverager`}
        </ActionButton>
      </ActionDiv>
    </WrapperDiv>
  )
}

const Description = styled.div`
  p {
    font-size: 14px;
    line-height: 1.5;
    color: ${offWhite};
  }
`
const StatusDiv = styled.div`
  margin-top: 24px;
  p {
    font-size: 18px;
    font-weight: ${fontWeightHeavy};
    color: ${offWhite};
  }
`

const WrapperDiv = styled.div`
  display: flex;
  flex-direction: column-reverse;
  /* padding: 24px 18px; */
  ${SimpleCtaButton} {
    margin-top: 16px;
  }
  ${Balance} {
    margin-top: 24px;
  }
  ${SimpleCtaButton} {
    text-transform: uppercase;
    :enabled {
      cursor: pointer;
    }
  }
  ${Action} {
    padding: 24px 32px;
    font-size: 14px;
  }
  ${AmountInput} {
    input {
      width: 150px !important;
      font-size: 20px !important;
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
    /* padding-top: 48px; */
    ${Action} {
      padding: 32px;
      font-size: 18px;
    }
    ${Balance} {
      margin-top: 24px;
    }
    ${SimpleCtaButton} {
      margin-top: 16px;
    }
    ${AmountInput} {
      input {
        width: 100px !important;
        font-size: 20px !important;
      }
    }
  }
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
  padding-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
`

const StatusInfo = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  row-gap: 12px;
  background-color: rgba(255, 255, 255, 0.027);
  margin-top: 24px;
  padding: 16px;
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
    font-size: 14px;
    font-weight: ${fontWeightBold};
    color: ${offWhite};
  }
  background-color: rgba(255, 255, 255, 0.027);
  padding: 4px 4px;
  margin-bottom: 8px;
  border-radius: 8px;
`

const InfoTitle = styled.p`
  font-size: 18px;
`

const InfoDiv = styled.div`
  width: 100%;
  padding: 24px 18px;
  @media ${breakpoint.xl} {
    width: 55%;
  }
`

const ActionDiv = styled.div`
  width: 100%;
  background-color: #131313;
  padding: 24px 18px;
  @media ${breakpoint.xl} {
    width: 45%;
  }
`

const ResultDiv = styled.div`
  display: flex;
  justify-content: space-between;
  span:last-child {
    color: ${offWhite};
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
    height: 40px;
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

const DetailDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > span:first-child {
    display: flex;
  }
  > span:last-child {
    color: ${primary}a3;
  }
  ${TooltipMessage} {
    width: 280px;
  }
`
