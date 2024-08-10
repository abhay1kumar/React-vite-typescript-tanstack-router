import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/services/')({
  component: () => <div>Hello /services/!</div>
})