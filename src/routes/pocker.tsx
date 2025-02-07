import { createFileRoute } from '@tanstack/react-router'
import WelcomeBonus from '../components/Pockert'

export const Route = createFileRoute('/pocker')({
  component: () => <div>
    <WelcomeBonus/>
  </div>
})