import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ItemPage from './pages/item'
import ItensPage from './pages/itens'

const App = () => {
	return(
		<BrowserRouter>
			<Routes>
				<Route path="/itens" element={<ItensPage/>} />
				<Route path="/itens/:id" element={<ItemPage/>} />
			</Routes>
		</BrowserRouter>
	)
}

export default App