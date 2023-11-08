import { useState } from 'preact/hooks';
import { TopBar, Footer, ActionBar, InfoDrawer } from './components';
import './app.css';

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TopBar />
      <ActionBar />
      <InfoDrawer />
      <Footer />
    </>
  )
}
