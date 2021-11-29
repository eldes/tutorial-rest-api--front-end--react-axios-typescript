import { FunctionComponent, useEffect, useState } from 'react'
import Item from '../models/item'
import itensService from '../services/itens'

const ItensPage: FunctionComponent = () => {

	enum Estado {
		Lendo,
		ErroLer,
		Lido,
	}

	const [estado, setEstado] = useState(Estado.Lendo)
	const [itens, setItens] = useState<Item[]>([])

	useEffect(() => {
		setEstado(Estado.Lendo)
		itensService.lerTodos(
			itens => {
				setItens(itens)
				setEstado(Estado.Lido)
			},
			() => setEstado(Estado.ErroLer)
		)
	}, [Estado.ErroLer, Estado.Lendo, Estado.Lido])

	return (
		<>
			{
				(estado === Estado.Lendo) && <p>Carregando...</p>
			}

			{
				(estado === Estado.ErroLer) && <p>ERRO ao tentar carregar.</p>
			}

			{
				(estado === Estado.Lido) &&
				<>
					<h1>Itens</h1>
					<ul>
					{
						itens.map(item => <li key={item.id}>{item.nome}</li>)
					}
					</ul>
				</>
			}
		</>
	)
}

export default ItensPage