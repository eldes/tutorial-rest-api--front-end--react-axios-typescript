import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Item from '../models/item'
import itensService from '../services/itens'

const ItensPage: FunctionComponent = () => {

	enum Estado {
		Lendo,
		ErroLer,
		Lido,
		Criar,
		Salvando,
		ErroCriar,
		Criado,
	}

	const [estado, setEstado] = useState(Estado.Lendo)
	const [itens, setItens] = useState<Item[]>([])
	const [nome, setNome] = useState('')
	const [descricao, setDescricao] = useState('')

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

	const handleNovoClick = () => {
		setNome('')
		setDescricao('')
		setEstado(Estado.Criar)
	}

	const handleCancelarClick = () => setEstado(Estado.Lido)
	
	const handleSalvarClick = () => {
		setEstado(Estado.Salvando)
		itensService.criar({
				nome: nome,
				descricao: descricao
			},
			item => {
				itens.push(item)
				setEstado(Estado.Criado)
			},
			() => setEstado(Estado.ErroCriar)
		)
	}

	const handleNomeChange = (event: ChangeEvent<HTMLInputElement>) => setNome(event.currentTarget.value)

	const handleDescricaoChange = (event: ChangeEvent<HTMLTextAreaElement>) => setDescricao(event.currentTarget.value)

	return (
		<>
			{
				(estado === Estado.Lendo) && <p>Carregando...</p>
			}

			{
				(estado === Estado.ErroLer) && <p>ERRO ao tentar carregar.</p>
			}

			{
				((estado === Estado.Lido) || (estado === Estado.Criar) || (estado === Estado.Criado)) &&
				<>
					<h1>Itens</h1>
					<ul>
					{
						itens.map(item => <li key={item.id}><Link to={`/itens/${item.id}`}>{item.nome}</Link></li>)
					}
					</ul>
				</>
			}

			{
				(estado === Estado.Criado) && <p>SUCESSO em criar.</p>
			}

			{
				((estado === Estado.Lido) || (estado === Estado.Criado)) &&
				<button onClick={handleNovoClick}>Novo</button>
			}

			{
				((estado === Estado.Criar) || (estado === Estado.ErroCriar)) &&
				<form>
					<div>
						<label>
							Nome:
							<input value={nome} onChange={handleNomeChange} />
						</label>
					</div>
					<div>
						<label>
							Descrição:
							<textarea onChange={handleDescricaoChange} value={descricao} />
						</label>
					</div>
					<div>
					<button onClick={handleSalvarClick}>Salvar</button>
						<button onClick={handleCancelarClick}>Cancelar</button>
					</div>
				</form>
			}

			{
				(estado === Estado.Salvando) && <p>Salvando...</p>
			}

			{
				(estado === Estado.ErroCriar) && <p>ERRO ao tentar criar.</p>
			}
		</>
	)
}

export default ItensPage