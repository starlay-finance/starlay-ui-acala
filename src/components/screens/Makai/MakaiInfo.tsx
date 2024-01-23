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
      <InfoTitle>Leveraged DOT Staking on Starlay</InfoTitle>
      <InfoContent>Enhance your staking rewards by utilizing liquid staking tokens such as LDOT and DOT as collateral. Leverage these assets against DOT on Starlay, capitalizing on the platform&apos;s robust features to maximize your staking efficiency and returns.</InfoContent>
      <InfoLink><Link href="https://asynmatrix.notion.site/LSTs-and-leveraged-staking-strategies-cacf1d3683f54cfa93158f4953926fed">{t`Learn more`}</Link></InfoLink>
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
