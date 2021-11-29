import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Item from '../models/item'
import itensService from '../services/itens'

const ItemPage: FunctionComponent = () => {
	const { id } = useParams()

	enum Estado {
		Lendo,
		ErroLer,
		Lido,
		Editando,
		Salvando,
		ErroSalvar,
		Salvo,
	}

	const [estado, setEstado] = useState(Estado.Lendo)
	const [item, setItem] = useState<Item>()
	const [novoNome, setNovoNome] = useState('')
	const [novaDescricao, setNovaDescricao] = useState('')

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

	const handleEditarClick = () => {
		setNovoNome(item!.nome)
		setNovaDescricao(item!.descricao)
		setEstado(Estado.Editando)
	}

	const handleNomeChange = (event: ChangeEvent<HTMLInputElement>) => setNovoNome(event.currentTarget.value)

	const handleDescricaoChange = (event: ChangeEvent<HTMLTextAreaElement>) => setNovaDescricao(event.currentTarget.value)

	const handleSalvarClick = () => {

		setEstado(Estado.Salvando)
	
		if (id) {
			const novoItem = {
				id: +id,
				nome: novoNome,
				descricao: novaDescricao
			}
		
			itensService.atualizar(
				novoItem,
				() => {
					setItem(novoItem)
					setEstado(Estado.Salvo)
				},
				() => setEstado(Estado.ErroSalvar)
			)
		} else {
			setEstado(Estado.ErroSalvar)
		}
		
	}
	
	const handleCancelarClick = () => setEstado(Estado.Lido)

	return (
		<>
			{
				(estado === Estado.Lendo) && <p>Carregando...</p>
			}
	
			{
				(estado === Estado.ErroLer) && <p>ERRO ao tentar carregar.</p>
			}

			{
				(estado === Estado.Salvando) && <p>Salvando...</p>
			}

			{
				(estado === Estado.Salvo) && <p>SUCESSO em salvar!</p>
			}

			{
				(estado === Estado.ErroSalvar) && <p>ERRO ao tentar salvar.</p>
			}
				
			{
				((estado === Estado.Lido) || (estado === Estado.Salvo)) &&
				<>
					<h1>{item?.nome}</h1>
					<p>{item?.descricao}</p>
					<div>
					<button onClick={handleEditarClick}>Editar</button>
					</div>
				</>
			}

			{
				((estado === Estado.Editando) || (estado === Estado.ErroSalvar)) &&
				<form>
					<div>
						<label>
							Nome:
							<input value={novoNome} onChange={handleNomeChange} />
						</label>
					</div>
					<div>
						<label>
							Descrição:
							<textarea onChange={handleDescricaoChange} value={novaDescricao} />
						</label>
					</div>
					<div>
					<button onClick={handleSalvarClick}>Salvar</button>
					<button onClick={handleCancelarClick}>Cancelar</button>
					</div>
				</form>
			}
		</>
	)
}

export default ItemPage