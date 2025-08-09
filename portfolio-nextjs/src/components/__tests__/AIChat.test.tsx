import { AIChat } from '@/components/organisms/AIChat'

// Mock all dependencies to avoid complex interactions
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/components/molecules/ChatMessage', () => ({
  ChatMessageComponent: () => <div>Mock ChatMessage</div>,
}))

jest.mock('@/components/molecules/ChatInput', () => ({
  ChatInput: () => <div>Mock ChatInput</div>,
}))

jest.mock('@/components/atoms/Button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}))

jest.mock('@/components/atoms/Typography', () => ({
  Typography: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('../../data/projects', () => ({
  projects: [],
}))

describe('AIChat Component', () => {
  it('can be imported without errors', () => {
    expect(AIChat).toBeDefined()
    expect(typeof AIChat).toBe('function')
  })

  it('has correct display name', () => {
    expect(AIChat.name).toBe('AIChat')
  })
})