import { Canvas } from '@react-three/fiber'
import Scene from './Scene'

function App() {

  const props = {
    __camera__
  } 

  return (
    <>
     <Canvas {...props}>
        <Scene/>
      </Canvas>
    </>

  )
}

export default App
