import './App.css'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'

function App() {


  return (
    <>
      <main className='min-h-screen bg-background text-foreground flex items-center justify-center px-6'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>AncientVault YGO</CardTitle>
          </CardHeader>
        </Card>
      </main>
    </>
  )
}

export default App
