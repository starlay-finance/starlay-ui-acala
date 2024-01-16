import { t } from '@lingui/macro'
import { BigNumber, valueToBigNumber } from '@starlay-finance/math-utils'
import debounce from 'debounce'
import { FC, useState } from 'react'
import { SimpleCtaButton } from 'src/components/parts/Cta'
import { AssetLabel } from 'src/components/parts/Modal/parts'
import { RatioSliderControl } from 'src/components/parts/Modal/parts/RatioControl'
import { blue, darkRed, lightYellow } from 'src/styles/colors'
import { breakpoint } from 'src/styles/mixins'
import { LeveragerEstimationParam, estimateLeverager } from 'src/utils/estimationHelper'
import {
  BN_ZERO,
  formatAmt,
  formattedToBigNumber
} from 'src/utils/number'
import styled from 'styled-components'
import {
  Action,
  AmountInput,
  Balance,
  Control
} from '../../../Dashboard/modals/parts'

export type LeveragerModalBodyProps = Omit<LeveragerEstimationParam, 'amount'> & {
  startLeverager: (amount: BigNumber, leverage: BigNumber) => Promise<any>
  max?: boolean
}

export const LeveragerModalBody: FC<LeveragerModalBodyProps> = ({
  startLeverager,
  max,
  ...estimationParams
}) => {
  const {
    asset,
    userAssetBalance,
  } = estimationParams
  const { symbol, displaySymbol } = asset
  const { inWallet } = userAssetBalance
  const [supplyAmount, setSupplyAmount] = useState('')

  const maxLeverage = valueToBigNumber('10')
  const [leverage, setLeverage] = useState<BigNumber>(valueToBigNumber('3'))

  const estimation = estimateLeverager({
    amount: formattedToBigNumber(supplyAmount),
    asset,
    userAssetBalance,
    leverage,
  })

  return (
    <WrapperDiv>
      <InfoDiv>
        <Description>
          <p>{t`Use Starlay to operate your DOT and lDOT in a novel way: Exchange your DOT for Starlay’s lDOT to maximize staking returns by leveraging additional lDOT against your original DOT holdings.`}</p>
          <br />
        </Description>
        <Description>
          <p>{t`This innovative approach aims to boost your staking rewards but comes with its own set of considerations. Firstly, be mindful that the borrowing rate for DOT on Starlay fluctuates, and it might not always be favorable compared to the rewards from staking. Secondly, the exchange rate between lDOT and DOT is not constant, meaning that a decrease in the lDOT/DOT ratio could lead to potential risks or losses when you decide to withdraw your investment. Lastly, there’s an inherent risk of liquidation with such positions. Stay informed about the specific liquidation thresholds for lDOT/DOT on the Starlay platform, usually visible in a prominent section of the user interface.`}</p>
          <br />
        </Description>
        <FlowInfo>
          <FlowDescription>
            <p>{t`Flash borrow ${Number(formattedToBigNumber(supplyAmount) || BN_ZERO) * Number(leverage)} DOT with flashloan`}</p>
          </FlowDescription>
          <FlowDescription>
            <p>{t`Wrap ${Number(formattedToBigNumber(supplyAmount) || BN_ZERO) * Number(leverage)} dot into DOT`}</p>
          </FlowDescription>
          <FlowDescription>
            <p>{t`Deposit exchanged LDOT into lending pool`}</p>
          </FlowDescription>
          <FlowDescription>
            <p>{t`Borrow ${Number(formattedToBigNumber(supplyAmount) || BN_ZERO) * (Number(leverage) - 1)} DOT from lending pool`}</p>
          </FlowDescription>
          <FlowDescription>
            <p>{t`Pay flashloan ${Number(formattedToBigNumber(supplyAmount) || BN_ZERO) * Number(leverage)} DOT`}</p>
          </FlowDescription>
        </FlowInfo>
      </InfoDiv>
      <ActionDiv>
        <SupplyDiv>
          <InfoTitle>Asset:</InfoTitle>
          <AssetLabel asset={asset} label={asset.symbol} />
        </SupplyDiv>
        <SupplyDiv style={{ marginTop: '24px' }}>
          <InfoTitle>Supply:</InfoTitle>
          <AmountInput
            value={supplyAmount}
            onChange={setSupplyAmount}
            setMaxValue={() => setSupplyAmount(formatAmt(estimation.maxAmount))}
            significantDigits={asset.decimals}
          />
        </SupplyDiv>
        <RatioSliderControl
          label={t`Leverage`}
          options={RATIO_LIST.concat({ value: maxLeverage.toNumber() })}
          setValue={setLeverage}
          current={leverage}
          max={maxLeverage}
          sliderColors={[blue, lightYellow, darkRed]}
          customLabel={t`Leverage`}
        />

        <SimpleCtaButton
          onClick={debounce(() => startLeverager(formattedToBigNumber(supplyAmount) || BN_ZERO, leverage), 2000, { immediate: true })}
          disabled={!!estimation.unavailableReason}
        >
          {estimation.unavailableReason || t`Start leverager`}
        </SimpleCtaButton>
        <Balance
          label={t`Wallet Balance`}
          balance={inWallet}
          symbol={displaySymbol || symbol}
        />
      </ActionDiv>
    </WrapperDiv>
  )
}

const RATIO_LIST = [{ value: 2 }, { value: 4 }]

const Description = styled.p`
  line-height: 1.5;
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
    ${SimpleCtaButton},
    ${Balance} {
      margin-top: 32px;
    }
  }
  @media ${breakpoint.xl} {
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

const FlowInfo = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0f0f0f;
  padding-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
`

const FlowDescription = styled.p`
  line-height: 1.5;
  background-color: rgba(255, 255, 255, 0.027);
  padding: 4px 4px;
  margin-bottom: 8px;
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
