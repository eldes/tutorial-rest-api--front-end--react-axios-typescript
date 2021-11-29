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

	atualizar: (item: Item, sucesso: () => void, falha: () => void) => {
		axios.put(`http://localhost:4000/api/itens/${item.id}`, item)
		.then(res => (res.status === 204) ? sucesso() : falha())
		.catch(error => falha())
	},

	remover: (id: string, sucesso: () => void, falha: () => void) => {
		axios.delete(`http://localhost:4000/api/itens/${id}`)
		.then(res => (res.status === 204) ? sucesso() : falha())
		.catch(error => falha())
	},

}

export default itensService