import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ItensPage from './pages/itens'

const App = () => {
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/itens" element={<ItensPage/>} />
			</Routes>
		</BrowserRouter>
	)
}

export default App