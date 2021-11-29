import axios from 'axios'
import Item from '../models/item'

const itensService = {

	lerTodos: (sucesso: (itens: Item[]) => void, falha: () => void) => {
		axios.get<Item[]>('http://localhost:4000/api/itens')
		.then(res => sucesso(res.data))
		.catch(() => falha())
	},

}

export default itensService