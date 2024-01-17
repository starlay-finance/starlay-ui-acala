import { t } from '@lingui/macro'
import { Link } from 'src/components/elements/Link'
import { asStyled } from 'src/components/hoc/asStyled'
import {
  fontWeightHeavy
} from 'src/styles/font'
import styled from 'styled-components'

export const MakaiInfo = asStyled(({ className }) => {
  return (
    <MakaiInfoSection className={className}>
      <InfoTitle>Leveraged LDOT Staking</InfoTitle>
      <InfoContent>Receive increased staking rewards by using liquid staking tokens such as stETH, rETH and cbETH as collateral and leveraging them against ETH through Compound, Aave or Morpho.</InfoContent>
      <InfoLink><Link href="https://apps.acala.network/swap">{t`Learn more`}</Link></InfoLink>
    </MakaiInfoSection>
  )
})``

const MakaiInfoSection = styled.section`
  border-radius: 8px;
  backdrop-filter: blur(8px) brightness(1.08);
  background-color: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  padding: 34px;
  margin-bottom: 28px;
`

const InfoTitle = styled.p`
  font-size: 24px;
  padding-bottom: 20px;
  font-weight: ${fontWeightHeavy};
`
const InfoContent = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #808080;
`

const InfoLink = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
`
