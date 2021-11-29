import axios from 'axios'
import Item from '../models/item'

const itensService = {

	lerTodos: (sucesso: (itens: Item[]) => void, falha: () => void) => {
		axios.get<Item[]>('http://localhost:4000/api/itens')
		.then(res => sucesso(res.data))
		.catch(() => falha())
	},

	ler: (id: number, sucesso: (item: Item) => void, falha: () => void) => {
		axios.get<Item>(`http://localhost:4000/api/itens/${id}`)
		.then(res => (res.status === 200) ? sucesso(res.data) : falha())
		.catch(error => falha())
	},

}

export default itensService