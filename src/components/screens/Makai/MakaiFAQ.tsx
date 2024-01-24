// @ts-nocheck
import Faq from "react-faq-component";
import { asStyled } from 'src/components/hoc/asStyled';
import { fontWeightHeavy } from "src/styles/font";
import styled from 'styled-components';

const data = {
  title: "",
  rows: [
    {
      title: "What is leveraged staking?",
      content: `Leveraged staking is a strategy to enhance the yield from DOT staking by using liquid staking tokens such as LDOT and DOT as collateral. This strategy leverages these tokens against DOT, which typically has a relatively low borrowing APY, through lending protocols on Starlay.`,
    },
    {
      title: "What are liquid staking tokens?",
      content:
        "Liquid Staking Tokens (LST) are tokens issued by staking protocols and services, representing staked assets. For Starlay, these include tokens like LDOT, which represent staked DOT. These tokens accumulate staking rewards, enabling users to utilize their staked assets without sacrificing liquidity, essential for various leveraged staking strategies.",
    },
    {
      title: "Are there fees for creating or exiting these positions?",
      content: `There are minimal fees involved in initiating (binding) the leveraged staking position, with no fees for maintaining the position. A nominal fee of 0.09% is applied to the amounts involved in these leveraging transactions.`,
    },
    {
      title: "How can I manage or exit these positions once created?",
      content: "To exit a leveraged staking position, you simply need to repay the borrowed assets and withdraw your liquid staking tokens (LST), such as LDOT.",
    },
    {
      title: "What are the risks with leveraged staking?",
      content: "Leveraged staking involves several risks, including the risk of liquidation, potential deviations in the value of liquid staking tokens compared to DOT, and fluctuations in DOT borrowing rates within the protocol.",
    },
  ],
};
const styles = {
  bgColor: 'transparent',
  titleTextColor: "white",
  rowTitleColor: "white",
  rowContentColor: 'grey',
  arrowColor: "white",
  rowContentPaddingBottom: "16px",
};

export const MakaiFAQ = asStyled(({ className }) => {
  return (
    <MakaiInfoSection className={className}>
      <InfoTitle>Frequently Asked Questions</InfoTitle>

      <Faq data={data} styles={styles} />
    </MakaiInfoSection>
  )
})``

const MakaiInfoSection = styled.section`
  border-radius: 8px;
  backdrop-filter: blur(8px) brightness(1.08);
  background-color: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  padding: 34px;
  margin-top: 28px;
`

const InfoTitle = styled.p`
  font-size: 30px;
  padding-bottom: 20px;
  font-weight: ${fontWeightHeavy};
`
