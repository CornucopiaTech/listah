import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div> Hello  World</div>
    </div>
  )
}
