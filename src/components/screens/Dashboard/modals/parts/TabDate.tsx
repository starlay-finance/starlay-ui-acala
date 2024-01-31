import { purple } from 'src/styles/colors'
import { fontWeightHeavy } from 'src/styles/font'
import { breakpoint } from 'src/styles/mixins'
import styled, { css } from 'styled-components'
import { TabFC } from './Tab'

export const TabDate = styled<TabFC>(
  ({ tabs, contents, activeTab, onChangeActiveTab, className }) => {
    return (
      <Tabs className={className}>
        {tabs.map((tab) => {
          const { label, disabled } = contents[tab as keyof typeof contents]
          return (
            <TabButton
              key={tab}
              isActive={activeTab === tab}
              onClick={() => onChangeActiveTab(tab)}
              disabled={disabled}
            >
              <span>{label}</span>
            </TabButton>
          )
        })}
      </Tabs>
    )
  },
)``

export const TabButton = styled.button<{ isActive: boolean }>`
  position: relative;
  font-size: 14px;
  font-weight: ${fontWeightHeavy};
  text-align: center;
  ${({ isActive }) =>
    isActive &&
    css`
      color: ${purple};
      @media ${breakpoint.xl} {
        background-color: #0f0f0f;
        border-radius: 4px;
        padding: 2px 0px;
      }
    `}
`
const Tabs = styled.div`
  display: flex;
  ${TabButton} {
    flex: 1;
  }
`
