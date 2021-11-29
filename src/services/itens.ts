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

	criar: (item: Item, sucesso: (item: Item) => void, falha: () => void) => {
		axios.post(`http://localhost:4000/api/itens`, item)
		.then(res => {
			if (res.status === 201) {
				const itemUrl = `http://localhost:4000/api${res.headers.location}`
				axios.get<Item>(itemUrl)
					.then(res => (res.status === 200) ? sucesso(res.data) : falha())
					.catch(error => falha())
			} else {
				falha()
			}
		})
		.catch(error => falha())
	},

}

export default itensService