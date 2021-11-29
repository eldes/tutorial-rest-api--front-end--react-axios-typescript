import { FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Item from '../models/item'
import itensService from '../services/itens'

const ItemPage: FunctionComponent = () => {
	const { id } = useParams()

	enum Estado {
		Lendo,
		ErroLer,
		Lido,
	}

	const [estado, setEstado] = useState(Estado.Lendo)
	const [item, setItem] = useState<Item>()

	useEffect(() => {
		if (id) {
			itensService.ler(
				+id,
				item => {
					setItem(item)
					setEstado(Estado.Lido)
				},
				() => setEstado(Estado.ErroLer)
			)
		}
	}, [id, Estado.Lido, Estado.ErroLer])

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
					<h1>{item?.nome}</h1>
					<p>{item?.descricao}</p>
					<div>
						<button>Editar</button>
					</div>
				</>
			}
		</>
	)
}

export default ItemPage