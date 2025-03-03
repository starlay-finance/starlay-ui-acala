import Router from 'next/router'
import { useEffect, useState } from 'react'
import { AppMenu } from 'src/components/compositions/AppMenu'
import { AppBackground } from 'src/components/parts/Background'
import { AppFooter } from 'src/components/parts/Footer'
import { AppHeader } from 'src/components/parts/Header/AppHeader'
import { useNetworkType } from 'src/hooks/useNetwork'
import { fontWeightHeavy } from 'src/styles/font'
import { breakpoint, contentMaxWidthCssVar } from 'src/styles/mixins'
import { APP } from 'src/utils/routes'
import styled from 'styled-components'
import { MakaiInfo } from './MakaiInfo'
import { MakaiMarkets } from './MakaiMarkets'

export const Makai = () => {
  const { data } = useNetworkType()
  const [isMenuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (data !== 'EVM') Router.replace(APP)
  }, [data])
  return (
    <>
      <AppHeader openMenu={() => setMenuOpen(true)} />
      <Main>
        <AppBackground />
        <Content>
          <MakaiInfo />
          <MakaiMarkets />
          {/* <MakaiFAQ /> */}
        </Content>
        <AppMenu isOpen={isMenuOpen} close={() => setMenuOpen(false)} />
      </Main>
      <AppFooter />
    </>
  )
}

const Content = styled.div``

const Main = styled.main`
  width: 100%;
  max-width: var(${contentMaxWidthCssVar});
  margin: 0 auto;
  padding: 0 24px 64px;
  h2 {
    font-size: 20px;
    font-weight: ${fontWeightHeavy};
  }
  ${Content} {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    column-gap: 24px;
    ${MakaiMarkets} {
      flex: 1;
    }
  }
  @media ${breakpoint.xl} {
    ${Content} {
      margin-top: 80px;
    }
  }
`
