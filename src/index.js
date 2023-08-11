import { createRoot } from 'react-dom/client'

import './index.css'
import App from './components/App'

const root = createRoot(document.getElementById('root'))
const element = <App />
root.render(element)
