# Tutorial: Conexão de um aplicativo React, em TypeScript, a um servidor REST API, usando Axios

![Foto decorativa](https://miro.medium.com/max/2000/1*RuWuZSZU_5CkenkEKBRBug.png)

Neste tutorial você vai aprender a criar um aplicativo web com React, em linguagem [TypeScript](https://www.TypeScriptlang.org/), e usando Axios para conectar a um servidor REST API.

Originalmente foi escrito para meus alunos das turmas de desenvolvimento web, como conteúdo introdutório à programação front-end. Por esse motivo, partes do código e da lógica de programação foram intencionalmente simplificadas, com finalidade didática.

As instruções apresentadas aqui independem do editor de código ou IDE utilizados, mas para elaborar e testar o código desse tutorial foi utilizado o [Visual Studio Code](https://code.visualstudio.com/).

Os comandos utilizados nesse tutorial são baseados diretamente no [yarn](https://yarnpkg.com/), mas caso você prefira [npm](https://www.npmjs.com/) use:

- ***npm init*** em vez de ***yarn init***
- ***npm install*** *módulo* em vez de ***yarn add*** *módulo*
- ***npm run*** *script* em vez de ***yarn*** *script*
- ***npx*** *comando* em vez de ***yarn*** *comando*

### Requisitos

Para seguir esse tutorial você vai precisar dos seguintes softwares instalados no seu sistema:

- [Node.js](https://nodejs.org/)
- [yarn](https://yarnpkg.com/) (ou npm)
- [Git](https://git-scm.com/)

### Mapa de navegação

O aplicativo web que será desenvolvido irá implementar a interface para as 4 operações básicas de CRUD (***C**reate*,  ***R**ead*, ***U**pdate*, ***D**elete*) sobre uma entidade genérica de dados chamada *Item*.

Cada *Item* possui dois campos obrigatórios, *nome* e *descrição*, e um campo opcional, *id*, que indica se o *Item* já foi cadastrado no sistema, ou seja se já foi gravado na base de dados do servidor.

Assim, a interface vai ter uma página **Itens**, que irá listar todos os *Itens* cadastrados no sistema, e uma outra página **Item**, que irá exibir os detalhes (*nome* e *descrição*) de um *Item* específico.

A partir da página **Itens** será possível criar e cadastrar um novo *Item* no sistema.

E a partir da página **Item** será possível alterar os detalhes ou apagar um *Item* já cadastrado no sistema.

Essa estutura é representada na figura a seguir:

![README-front-end-map](https://miro.medium.com/max/862/1*ILdywlbwPOwe8mvctJPYRQ.png)

*Figura 1 – Mapa de navegação do aplicativo.*

### Servidor

O aplicativo irá se conectar ao servidor e se comunicar via REST API com os seguintes *endpoints*:

- **GET /itens** – retorna um JSON com um array contendo todos os *Itens* cadastrados no sistema.
- **POST /itens** – recebe um JSON com os detalhes de um *Item* para ser cadastrado no sistema.
- **GET /itens/:id** – retorna um JSON com os detalhes de um *Item* específico.
- **UPDATE /itens/:id** – recebe um JSON com os detalhes de um *Item* cadastrado no sistema para ser atualizado.
- **DELETE /itens/:id** – apaga um *Item* do sistema.

Para esse tutorial, iremos considerar **`http://localhost:4000/api/`** como a URL base desses *endpoints*, e a estrutura JSON, como no exemplo abaixo, para a entidade *Item*:

```json
{
	"id": 1,
	"nome": "Item 1",
	"descricao": "Descricao do Item 1."
}
```

Para testar o aplicativo React, a ser desenvolvido neste tutorial, você pode usar o servidor REST API elaborado a partir do [Tutorial: Aplicação REST API com Node, em TypeScript, usando Express e SQLite](https://github.com/eldes/tutorial-rest-api-nodejs-express-sqlite-TypeScript).

------

## 1. Projeto React base

O primeiro passo é criar um projeto React base, com suporte a TypeScript. Ou seja, a partir do terminal de comandos execute:

```sh
yarn create react-app tutorial-rest-api-front-end --template typescript
```

> #### Explicando o comando
>
> Esse comando irá criar uma pasta, chamada ***tutorial-rest-api-front-end***, contendo os arquivos iniciais do projeto React.
>
> Portanto, tenha o cuidado de executar esse comando a partir da pasta onde você gostaria que essa nova subpasta ***tutorial-rest-api-front-end*** seja criada.
>
> Depois de completada a execução do comando, você pode abrir essa nova pasta, ***tutorial-rest-api-front-end***, no seu IDE, como o Visual Studio Code, e executar de lá os demais comandos que veremos a seguir.
>
> Caso queira escolher um nome diferente de "app-react" para seu aplicativo, use apenas letras minúsculas separadas por hífen (podendo conter dígitos no meio).

Vamos testar? Para isso basta executar o script ***start***, a partir do terminal, na pasta do projeto:

```sh
yarn start
```

Uma página deverá ser aberta automaticamente no seu navegador padrão, exibindo uma animação do símbolo do React.

Pronto! Nesse ponto você tem uma versão de um projeto React base funcionando.

### Commit – *Initialize project using Create React App*

Juntamente com o projeto base, o ***create-react-app*** irá criar também um repositório Git local para o controle de versão, e um primeiro *commit* será feito automaticamente.

Se você usa o padrão *GitFlow*, é um bom momento para iniciá-lo no seu repositório.

------

## 2. Roteamento de páginas

Para organizar nosso projeto, vamos criar uma pasta chamada ***pages*** dentro da pasta ***src***.

Essa pasta irá conter todas as páginas do nosso aplicativo web.

### Modelo da página Itens

A primeira página que iremos criar para nosso aplicativo será a ***Itens*** (vide *Figura 1*), que irá listar todos os *Itens* cadastrados no sistema.

Portanto, vamos criar um arquivo chamado ***itens.tsx***, dentro da pasta ***pages***, com o seguinte código:

```tsx
import { FunctionComponent } from 'react'

const ItensPage: FunctionComponent = () => {
	return (
		<>
			<h1>Itens</h1>
		</>
	)
}

export default ItensPage
```

> #### Explicando o código
>
> Cada página do nosso aplicativo será implementada como um componente do React e terá um arquivo (script) próprio, salvo na pasta ***pages***. A função desse componente é basicamente definir o HTML principal da página.
>
> E o modo mais simples de definir um componente é escrevendo uma função TypeScript, que retorna seu código HTML, como por exemplo:
>
> ```tsx
> () => {
> 	return (
> 		<p>Código HTML do componente</p>
> 	)
> }
> ```
>
> Assim, nossa página que lista os itens do sistema, **`ItensPage`**, será uma constante do tipo **`FunctionComponent`**que recebe uma função retornando o HTML da página:
>
> ```tsx
> const ItensPage: FunctionComponent = () => {
> 	return (
> 		<>
> 				<h1>Itens</h1>
> 		</>
> 	)
> }
> ```
>

### Rotas

Para definir qual página será exibida por meio para uma determinada rota especificada na URL, iremos usar o módulo *react-router-dom*.

Para instalar esse módulo, executamos no terminal:

```sh
yarn add react-router-dom
yarn add @types/react-router-dom
```

### Script App

O próximo passo é ajustar o arquivo ***/src/App.tsx***, substituindo o seu conteúdo original pelo seguinte código:

```jsx
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
```

Para testar, abra a URL http://localhost:3000/itens no seu navegador e assim a página ***Itens*** deverá ser exibida.

> #### Explicando o código
>
> Nosso aplicativo segue o padrão de *SPA*, ou *Single Page Application* (aplicação de página única), isto é aplicativos web (web app) compostos de apenas um único documento HTML e que proporcionam uma experiência similar a de um aplicativo mobile ou desktop, sem os recarregamentos comuns dos sites.
>
> O **`BrowserRouter`**, em conjunto com o **`Routes`**, serve para definir qual componente *page* deverá ser exibido para uma determinada rota.
>
> No nosso caso, será exibido o componente **`ItensPages`** , ou seja a página ***Itens***, para a rota ***/itens***.
>

### Commit – *[+] roteamento de páginas*

Nesse ponto do tutorial, vamos registrar essa mudança de configuração no projeto, com um *commit*. Assim execute os seguintes comandos em um terminal:

```sh
git add .
git commit -m "[+] roteamento de páginas"
```

> 💡 É interessante trabalhar com duas instâncias de terminal de comando: uma para executar os scripts do projeto, como o **`yarn dev`**, por exemplo, e outra para executar comandos auxiliares, como as operações do Git.

------

## 3. Conexão ao servidor

### Estados

Num primeiro momento, a página ***Itens*** irá ter três estados:

1. **Lendo:** exibe uma mensagem de progresso enquanto lê a lista de *Itens* a partir do servidor.
2. **Erro Ler:** exibe uma mensagem de erro, caso haja falha ao ler a lista.
3. **Lido:** exibe a lista que foi lida do servidor.

A figura seguinte ilustra o fluxo entre esses estados:

![README-front-end-wireframe-itens-fase-1](https://miro.medium.com/max/1400/1*URr7sr8DxfeQHHPnxcyRgw.png)

*Figura 2 – Wireframe e fluxo inicial entre os estados da página Itens.*

### Elementos da interface

De acordo com esse wireframe (*Figura 2*), vamos definir o HTML completo da página, contendo todos os elementos que podem ser exibidos em cada um daqueles três estados.

Assim, o código do componente **`ItensPage`**, no script ***/src/pages/itens.tsx***, fica como o seguinte:

```tsx
const ItensPage: FunctionComponent = () => {
	return (
		<>
			<p>Carregando...</p>
    
			<p>ERRO ao tentar carregar.</p>
    
			<h1>Itens</h1>
			<ul>
				<li>Item 1</li>
				<li>Item 2</li>
				<li>Item 3</li>
			</ul>
		</>
	)
}
```

### Interface de acordo com o estado da página

E para controlar quais elementos devem aparecer em cada estado da página, vamos criar, logo antes do **`return`** da função do componente, um **`enum`** com valores referentes a cada um dos possíveis três estados:

```tsx
enum Estado {
	Lendo,
	ErroLer,
	Lido,
}
```

E, logo abaixo do**`enum`**, vamos criar um *state*, do tipo **`Estado`**, para definir em qual estado a página se encontra, iniciando com **`Lendo`**:

```tsx
const [estado, setEstado] = useState(Estado.Lendo)
```

Não esquecer de importar a função **`useState`**, no início desse arquivo:

```jsx
import { FunctionComponent, useState } from 'react'
```

A mensagem de progresso, "Carregando...", deverá ser exibida durante leitura da lista de *Itens* vinda do servidor, ou seja, quando o *state* **`estado`** for igual a **`Estado.Lendo`**. Assim, a linha contendo o prágrafo (elemento **`<p>`**) da mensagem de progresso,  será substituída pelo código:

```tsx
{
	(estado === Estado.Lendo) && <p>Carregando...</p>
}
```

> #### Explicando o código:
>
> Nesse contexto, essa construção de código, usando o operador **`&&`**, tem a função de um comando de decisão, ou seja, significa o mesmo que: *SE **`estado`** tiver valor igual a **`Estado.Lendo`**, ENTÃO será retornado um elemento **`p`**, com a mensagem "Carregando..."*.

Do mesmo modo, para o parágrafo com a mensagem de erro, quando houver falha ao se tentar ler a lista de *Itens*:

```tsx
{
	(estado === Estado.ErroLer) && <p>ERRO ao tentar carregar.</p>
}
```

Por fim, o cabeçalho e a lista de *Itens* será exibida apenas no estado **`Lido`**:

```tsx
{
	(estado === Estado.Lido) &&
	<>
		<h1>Itens</h1>
		<ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
     </ul>
	</>
}
```

📄 Nesse ponto, o código completo do script ***/src/pages/itens.tsx*** fica então assim:

```tsx
import { FunctionComponent, useState } from 'react'

const ItensPage: FunctionComponent = () => {

	enum Estado {
		Lendo,
		ErroLer,
		Lido,
	}

	const [estado, setEstado] = useState(Estado.Lendo)

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
						<li>Item 1</li>
						<li>Item 2</li>
						<li>Item 3</li>
					</ul>
				</>
			}
		</>
	)
}

export default ItensPage
```

 Se você testar seu aplicativo nesse momento, em http://localhost:3000/itens, deverá ser exibida a tela com a mensagem "Carregando...".

### Módulo Axios

Por enquanto, a página ***Itens*** está exibindo um conteúdo estático, definido em *hard-coding*. Ou seja, para acrescentar um novo *Item*, ou modificar ou apagar um *Item* existente, é necessário alterar diretamente o código TypeScript da **`ItensPage`**, em ***/src/pages/itens.tsx***.

Mas, no final, o que pretendemos é que o conteúdo dessa página seja dinâmico, exibindo a lista de *Itens* armazenada na base de dados do *back-end*. Assim nosso aplicativo deverá se conectar ao servidor e ler a lista de *Itens* via REST API.

Para efetuar essa conexão iremos utilizar o módulo *Axios*. Para instalar esse módulo no nosso projeto, executaremos no terminal:

```sh
yarn add axios
yarn add @types/axios
```

### Modelo

Ainda para organizar os arquivos do projeto, iremos criar também uma pasta ***models***, dentro da pasta ***src***. Essa pasta deverá conter os modelos de entidades do nosso aplicativo.

Dentro dessa pasta vamos criar um arquivo ***item.ts*** com o seguinte código, refletindo a estrutura de dados da entidade *Item* do nosso *back-end*:

```tsx
type Item = {
	id?: number
	nome: string
	descricao: string
}

export default Item
```

> #### Explicando o código:
>
> O ponto de interrogação, ao lado do campo **`id`**, significa que esse campo é opcional.
>
> Isso porque, quando um *Item* for criado no *front-end*, esse campo só vai ter um valor depois que ele for gravado na base de dados pelo *back-end*.

### Serviço

Vamos criar também uma pasta ***services***, dentro da pasta ***src***, que irá conter os scripts da camada de serviço do aplicativo.

Essa camada é que vai ter a responsabilidade de fazer a conexão com o servidor, efetuando operações sobre as entidades do sistema, por meio dos *endpoints* da REST API.

📄 Para a entidade *Item* vamos então criar um arquivo ***itens.ts***, dentro dessa pasta, com o seguinte código:

```js
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
```

> #### Explicando o código:
>
> A constante **`itensService`** irá reunir todos os métodos que refletem e executam as chamadas da REST API para a entidade *Item*.
>
> Esse primeiro método, **`lerTodos`**, é usado para a chamada que consegue a lista de todos os *Itens* cadastrados no sistema, e possui dois parâmetros que devem ser especificados ao ser usado: **`sucesso`** e **`falha`**.
>
> O primeiro parâmetro, **`sucesso`**, é uma função que será executada quando a chamada ao *endpoint* for completada com sucesso (**`successo: (itens: Item[]) => void`**). Essa função deve aceitar um parâmetro do tipo array de *Itens* (**`itens: Item[]`**) e não retornar nada (**`=> void`**).
>
> O segundo parâmetro, **`falha`**, é uma função que será executada quando a chamada ao *endpoint* falhar (**`falha: () => void`**). Essa função não tem nenhum parâmetro (**`()`**) e não retorna nada (**`=> void`**).
>
> Ao ser chamado, o método **`lerTodos`** irá fazer então a conexão com o *endpoint* ***/itens*** do servidor(**`'http://localhost:4000/api/itens'`**), via método *GET* (**`axios.get`**), para conseguir, como resposta, um array de *Itens* (**`<Item[]>`**):
>
> ```js
> axios.get<Item[]>('http://localhost:4000/api/itens')
> ```
>
> Em caso de sucesso, após terminada a chamada, é executado o callback definido em **`then`**. No nosso caso, usamos o parâmetro do objeto com a resposta do servidor (**`res`**) para então chamar a função **`sucesso`** (**`res => sucesso(res.data)`**). O corpo da resposta da chamada (**`res.data`**) é o array de *Itens* que será passado para essa função.
>
> Em caso de falha, é executado o callback definido em **`catch`**. No nosso caso, simplesmente chamamos a função **`falha`** que foi especificada (**`() => falha()`**).
>

### Página

Agora que já temos o método para conectar ao servidor e conseguir a lista de *Itens* do sistema, vamos então ajustar o código de **`ItensPage`**, no arquivo ***/src/pages/itens.tsx***.

Primeiro vamos criar um novo *state*, **`itens`**, logo abaixo  do *state* **`estado`**,  no código do componente **`ItensPage`**:

```jsx
const [itens, setItens] = useState<Item[]>([])
```

> #### Explicando o código:
>
> O *state* **`itens`** é do tipo array de **`Item`** (**`<Item[]>`**) e tem um array vazio (**`([])`**) como valor inicial. Esse *state* irá conter a lista de *Itens* lida do servidor.
>

Não esquecer de importar o *type* **`Item`**, no início do arquivo:

```jsx
import Item from '../models/item'
```

Em seguida, vamos chamar o método **`lerTodos`**, de **`itensService`**, para então alterar os valores dos *states* **`itens`** e **`estado`**.

Para isso adicionamos o seguinte trecho de código, logo após as definições dos *states*:

```tsx
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
```

> #### Explicando o código:
>
> Qualquer código que possa modificar o valor de algum *state* usado pelo componente deve estar dentro da função **`useEffect`**, para que seja executado somente após a renderização estar disponível na tela.
>
> Como a função **`lerTodos`** pode modificar os valores dos *states* **`itens`** e **`error`**, ela é então chamada dentro do **`useEffect`**.
>
> O *array* com **`Estado.ErroLer`**, **`Estado.Lendo`** e **`Estado.Lido`**, passado como segundo parâmetro do **`useEffect`**, significa que a execução dessa função depende desses valores do *enum* **`Estado`**.

Não esquecer de importar a função **`useEffect`** e o **`itensService`**no início do arquivo:

```jsx
import { FunctionComponent, useEffect, useState } from 'react'
import itensService from '../services/itens'
```

Em seguida usaremos o *state* **`itens`** para exibir a lista de *Itens* dinamicamente, substituindo o código da lista de *Itens* (**`<ul>`**) por:

```tsx
<ul>
{
	itens.map(item => <li key={item.id}>{item.nome}</li>)
}
</ul>
```

> #### Explicando o código:
>
> Sempre que o valor de um *state* muda, o componente onde ele é usado é recarregado, e renderizado novamente, de forma automática.
>
> Assim, quando o *state* **`itens`** muda seu valor, o componente **`ItensPage`** é recarregado, listando o array de *Itens* desse *state*.
>
> Para criar o código HTML da  lista é utilizada a função **`map`**, que percorre todos os elementos do array **`itens`** e retorna um **`<li>`** para cada um.
>
> Quando se usa a função **`map`** para criar uma lista de elementos, devemos usar o atributo especial **`key`** com um valor identifique unicamente cada elemento listado. No nosso caso, usamos a propriedade **`id`** do *Item* (**`key={item.key}`**).

📄 Nesse ponto, o código integral de ***/src/pages/itens.tsx*** fica assim:

```tsx
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
```

Para testar, basta acessar a URL http://localhost:3000/itens no navegador.

Lembrando de iniciar o seu servidor *back-end* para que a página consiga acessar o *endpoint* ***GET /api/itens***.

### Commit – *[+] conexão ao servidor*

Nesse ponto do tutorial, vamos registrar essa mudança de configuração no projeto, com um novo *commit*:

```sh
git add .
git commit -m "[+] conexao ao servidor"
```

------

## 4. Detalhes do Item

Como próximo passo, vamos criar uma página para exibir os detalhes de um *Item* específico cadastrado no sistema.

Para especificar de qual *Item* a página deve mostrar os detalhes, iremos passar o *id* na própria URL. Ou seja, para exibir os detalhes do *Item* com *id* 1, deverá ser chamada a rota ***/itens/1***; para o *Item* com *id* 2, deverá ser chamada a rota ***/itens/2***; e assim por diante.

Desse modo o *id* se torna um parâmetro da rota dessa página, que é então representada como ***/itens/:id***. 

### Estrutura básica do componente

Para iniciar a implementação dessa página, vamos criar um novo arquivo, ***item.tsx***, dentro da pasta ***/src/pages***, com a estrutura básica de componente:

```tsx
import { FunctionComponent } from 'react'

const ItemPage: FunctionComponent = () => {
	return (
		<>Página do Item X</>
	)
}

export default ItemPage
```

### Rota

Para que essa página possa ser acessada, devemos adicionar uma rota para ela, no script ***/src/App.tsx***, logo abaixo do rota para a página ***Itens***.

```tsx
<Route path="/itens/:id" element={<ItemPage/>} />
```

Não esquecer de importar o componente **`ItemPage`** no início do arquivo:

```tsx
import ItemPage from './pages/item'
```

📄 O código completo desse script fica então assim:

```tsx
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
```

Para testar, abra a URL http://localhost:3000/itens/1.

### Id do Item

Mas, em vez de ***X***, queremos que seja exibido o *id* que foi passado na rota. Ou seja, a página deverá exibir "Página do Item 1", caso a URL seja http://localhost:3000/itens/1, "Página do Item 2", caso a URL seja http://localhost:3000/itens/2, e assim por diante.

Desse modo, vamos ajustar o código da página para obter, por meio do *hook* **`useParams()`**, o valor do parâmetro *id* passado na URL. Para isso vamos adicionar a seguinte linha, logo antes do **`return`**:

```tsx
const { id } = useParams()
```

E trocar **`X`** por **`{id}`** no código HTML do componente da página:

```tsx
<>Página do Item {id}</>
```

Lembrando de importar a função **`useParams`** no início do arquivo:

```tsx
import { useParams } from 'react-router-dom'
```

📄 Nesse ponto, o arquivo completo de ***/src/pages/item.tsx*** fica então assim:

```jsx
import { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'

const ItemPage: FunctionComponent = () => {
	const { id } = useParams()

	return (
		<>Página do Item {id}</>
	)
}

export default ItemPage
```

Ao testar novamente, agora a página deverá exibir o *id* que foi passado como parâmetro na URL.

### Link na página Itens

Para completar essa etapa, vamos voltar à página ***Itens*** (***/src/pages/itens.tsx***) e adicionar um link para a página ***Item***.

Assim, vamos substituir o código do item de lista (**`<li>`**) por:

```tsx
<li key={item.id}><Link to={`/itens/${item.id}`}>{item.nome}</Link></li>
```

Não esquecendo de importar o componente **`Link`** no início do arquivo:

```tsx
import { Link } from 'react-router-dom'
```

O código completo da página ***Itens*** fica então assim:

```tsx
import { FunctionComponent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
						itens.map(item => <li key={item.id}><Link to={`/itens/${item.id}`}>{item.nome}</Link></li>)
					}
					</ul>
				</>
			}
		</>
	)
}

export default ItensPage
```

Agora conseguiremos navegar da página ***Itens*** para a página ***Item*** a partir de um clique no nome do respectivo *Item*.

### Estados da página

Num primeiro momento, de acordo com seu funcionamento, a página ***Item*** irá ter três estados:

1. **Lendo:** exibe uma mensagem de progresso enquanto lê os dados do *Item* a partir do servidor.
2. **Erro Ler:** exibe uma menagem de erro caso haja falha ao ler os dados.
3. **Lido:** exibe os dados do *Item*, lidos do servidor.

A figura seguinte ilustra o fluxo entre esses estados:

![README-front-end-wireframe-fase-1](https://miro.medium.com/max/1400/1*od-vVerUSSYXTvJLDM0jwQ.png)

*Figura 3 – Wireframe e fluxo inicial entre os estados da página de detalhes do Item.*

### Elementos da interface

De acordo com o wireframe definido na *Figura 3*, vamos definir o HTML completo da página, contendo todos os elementos que podem ser exibidos em cada um daqueles três estados.

Assim, substituímos o código do **`return`** do componente **`ItemPage`** por:

```tsx
return (
	<>
		<p>Carregando...</p>

		<p>ERRO ao tentar carregar.</p>
			
		<h1>Nome do item {id}</h1>
		<p>Descrição do item {id}</p>
		<div>
			<button>Editar</button>
		</div>
	</>
)
```

### Interface de acordo com o estado da página

E para controlar quais elementos devem aparecer em cada estado da página, vamos criar, logo antes do **`return`**, um *enum* com valores referentes a cada um dos possíveis três estados:

```tsx
enum Estado {
	Lendo,
	ErroLer,
	Lido,
}
```

E, assim como na página ***Itens***, logo abaixo do**`enum`**, vamos criar um *state*, do tipo **`Estado`**, para definir em qual estado a página se encontra, iniciando com **`Lendo`**:

```tsx
const [estado, setEstado] = useState(Estado.Lendo)
```

Não esquecendo de importar o a função **`useState`** no início do arquivo:

```tsx
import { FunctionComponent, useState } from 'react'
```

A mensagem de progresso, "Carregando...", deverá ser exibida durante leitura dos dados do *Item*, vindos do servidor. Ou seja, será exibida quando o *state* **`estado`** for igual a **`Estado.Lendo`**. Assim substituímos o parágafo (**`<p>`**) da mensagem por:

```tsx
{
	(estado === Estado.Lendo) && <p>Carregando...</p>
}
```

Do mesmo modo, para a mensagem de erro ao se tentar ler os dados do *Item*:

```tsx
{
	(estado === Estado.ErroLer) && <p>ERRO ao tentar carregar.</p>
}
```

O nome e a descrição do *Item*, juntamente com o botão ***Editar***, serão exibidos no estado ***Lido***. Assim alteramos essas respectivas linhas para:

```tsx
{
	(estado === Estado.Lido) &&
	<>
		<h1>Nome do item {id}</h1>
		<p>Descrição do item {id}</p>
		<div>
			<button>Editar</button>
		</div>
	</>
}
```

📄 Nesse ponto, o código completo do script ***/src/pages/item.tsx*** fica então assim:

```tsx
import { FunctionComponent, useState } from 'react'
import { useParams } from 'react-router-dom'

const ItemPage: FunctionComponent = () => {
	const { id } = useParams()

	enum Estado {
		Lendo,
		ErroLer,
		Lido,
	}

	const [estado, setEstado] = useState(Estado.Lendo)

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
					<h1>Nome do item {id}</h1>
					<p>Descrição do item {id}</p>
					<div>
						<button>Editar</button>
					</div>
				</>
			}
		</>
	)
}

export default ItemPage
```

### Serviço

O próximo passo é adicionar a operação de leitura dos dados de um *Item* específico a partir do servidor.

Assim, vamos ajustar o código do **`itensService`** para efetuar essa a operação adicionando uma nova função, **`ler`**, logo abaixo da **`lerTodos`**, no arquivo ***/src/services/itens.ts***:

```tsx
ler: (id: number, sucesso: (item: Item) => void, falha: () => void) => {
	axios.get<Item>(`http://localhost:4000/api/itens/${id}`)
	.then(res => (res.status === 200) ? sucesso(res.data) : falha())
	.catch(error => falha())
},
```

📄 O código completo desse script fica então:

```tsx
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
```

### Exibição dos dados lidos

Na sequência, vamos voltar para ajustar o script ***/src/pages/item.tsx***, da página ***Itens***, de modo a chamar a operação **`ler()`** para preencher a página com os dados vindos do servidor.

Para isso vamos criar um *state* **`item`**, logo abaixo do *state* **`estado`**, para armazenar esses dados e, posteriormente, ser usado para gerar o HTML final da página:

```tsx
const [item, setItem] = useState<Item>()
```

Não esquecendo de importar o *type* **`Item`**:

```tsx
import Item from '../models/item'
```

Assim como no script da página que lista todo os *Itens* do sistema, ***/src/pages/itens.tsx***, também vamos colocar o código efetuando a operação **`ler()`** dentro de um **`useEffect()`**. Então, logo em seguida do state **`item`**, vamos adicionaro código:

```tsx
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
```

> #### Explicando do código:
>
> Caso a operação tenha sucesso, os dados serão gravados no state **`item`** (**`setItem(item)`**) e o estado da página será definido como ***Lido*** (**`setEstado(Estado.Lido)`**). Caso contrário o estado da página será definido como ***Erro Ler***.

Não esquecendo de importar a função  **`useEffect`** e o componente **`itensService`**:

```tsx
import { FunctionComponent, useEffect, useState } from 'react'
import itensService from '../services/itens'
```

Para a página exibir os dados lidos, vamos então ajustar o código para mostrar o nome e a descrição do *Item*:

```tsx
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
```

📄 O código completo do script da página ***Item*** fica então:

```tsx
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
```

### Commit – *[+] página item*

Para esse tutorial, nesse ponto, vamos registrar essa mudança de configuração no projeto, com um *commit*:

```sh
git add .
git commit -m "[+] página item"
```

------

## 5. Editar o Item

A partir dessa mesma página, ***Item***, o usuário vai poder alterar os dados (*nome* e *descrição*) do *Item* (vide *Figura 1*).

### Estados da página

Assim, o comportamento dessa página vai ter, agora, mais 4 estados:

- **Editando:** exibe campos de edição permitindo ao usuário alterar os dados do *Item*.
- **Salvando:** exibe uma mensagem de progresso enquanto salva os novos dados do *Item* no servidor.
- **Erro Salvar:** exibe uma mensagem de erro caso haja falha ao salvar os dados.
- **Salvo:** exibe uma mensagem de sucesso em relação ao salvamento dos dados, e permitindo uma nova edição.

Ou seja, 7 estados no total, como a figura seguinte ilustra:

![README-front-end-wireframe-fase-2](https://miro.medium.com/max/1400/1*QJvh6edWSSfIVao0R9qDJA.png)

*Figura 4 – Wireframe e fluxo entre os estados da página de detalhes do Item.*

### Elementos da interface

Como próximo passo, vamos completar o HTML da página com todos os demais elementos que podem ser exibidos em cada um desses novos 4 estados.

Ou seja, logo abaixo do bloco que mostra os dados do *Item*, vamos acrescentar o formulário para o usuário editar esses dados:

```tsx
<form>
	<div>
		<label>
			Nome:
			<input />
		</label>
	</div>
	<div>
		<label>
			Descrição:
			<textarea></textarea>
		</label>
	</div>
	<div>
		<button>Salvar</button>
		<button>Cancelar</button>
	</div>
</form>
```

E, logo abaixo da mensagem de falha ao tentar carregar, vamos acrescentar as mensagens, de progresso, de sucesso e de falha, ao se tentar salvar:

```tsx
<p>Salvando...</p>

<p>SUCESSO em salvar!</p>

<p>ERRO ao tentar salvar.</p>
```

### Interface de acordo com o estado da página

E para controlar quais elementos devem aparecer em cada estado da página, vamos ajustar o *enum* **`Estado`**, acrescentando os novos 4 estados, e ficando assim no final:

```tsx
enum Estado {
	Lendo,
	ErroLer,
	Lido,
	Editando,
	Salvando,
	ErroSalvar,
	Salvo,
}
```

O nome e a descrição do *Item*, juntamente com o botão ***Editar***, serão exibidos tanto no estado ***Lido*** quanto no estado ***Salvo*** (vide Figura 4). Portanto vamos substituir esse bloco de código por:

```tsx
{
	((estado === Estado.Lido) || (estado === Estado.Salvo)) &&
	<div>
		<h1>{item?.nome}</h1>
		<p>{item?.descricao}</p>
		<div>
			<button>Editar</button>
		</div>
	</div>
}
```

O formulário de edição será exibido tanto no estado ***Editando*** quanto no estado ***Erro Salvar***:

```tsx
{
	((estado === Estado.Editando) || (estado === Estado.ErroSalvar)) &&
	<form>
		<div>
			<label>
				Nome:
				<input />
			</label>
		</div>
		<div>
			<label>
				Descrição:
				<textarea></textarea>
			</label>
		</div>
		<div>
			<button>Salvar</button>
			<button>Cancelar</button>
		</div>
	</form>
}
```

A indicação de progresso ao se tentar salvar as alterações será exibida no estado ***Salvando***:

```tsx
{
	(estado === Estado.Salvando) && <p>Salvando...</p>
}
```

E a mensagem de sucesso do salvamento, no estado ***Salvo***:

```tsx
{
	(estado === Estado.Salvo) && <p>SUCESSO em salvar!</p>
}
```

Assim como a mensagem de falha, no estado ***Erro Salvar***:

```tsx
{
	(estado === Estado.ErroSalvar) && <p>ERRO ao tentar salvar.</p>
}
```

📄 Nesse ponto, o código completo do script ***/src/pages/item.tsx*** fica então assim:

```tsx
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
		Editando,
		Salvando,
		ErroSalvar,
		Salvo,
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
						<button>Editar</button>
					</div>
				</>
			}

			{
				((estado === Estado.Editando) || (estado === Estado.ErroSalvar)) &&
				<form>
					<div>
						<label>
							Nome:
							<input />
						</label>
					</div>
					<div>
						<label>
							Descrição:
							<textarea></textarea>
						</label>
					</div>
					<div>
						<button>Salvar</button>
						<button>Cancelar</button>
					</div>
				</form>
			}
		</>
	)
}

export default ItemPage
```

### Edição dos dados

Quando o usuário der um clique no botão ***Editar***, os controles de edição devem ser exibidos juntamente com os botões de ***Salvar*** e ***Cancelar***. 

Depois que digitar os novos valores, existe a alternativa do usuário poder cancelar a alteração. Por essa razão, vamos então preservar os dados originais no state **`item`** e criar dois novos *states* para guardar os novos valores do *nome* e da *descrição* digitados.

Logo abaixo do *state* **`item`** acrescentamos:

```tsx
const [novoNome, setNovoNome] = useState('')
const [novaDescricao, setNovaDescricao] = useState('')
```

O clique no botão ***Editar*** deverá então mudar o estado geral da página para ***Editando*** e copiar os valores atuais do *Item* para esses dois novos estados.

Assim, logo após o **`useEffect()`** vamos adicionar o seguinte código de resposta (*handler*) ao clique no botão ***Editar***:

```tsx
const handleEditarClick = () => {
	setNovoNome(item!.nome)
	setNovaDescricao(item!.descricao)
	setEstado(Estado.Editando)
}
```

E na marcação do próprio botão ***Editar***, vamos adicionar o atributo **`onClick`**:

```tsx
<button onClick={handleEditarClick}>Editar</button>
```

Para completar o recurso de edição, é preciso então sincronizar o valor dos controles do formulário com o valor dos *states*.

Assim, logo abaixo do *handler* de clique no botão ***Editar***, vamos criar dois novos *handlers* como resposta à mudança dos valores preenchidos nesses controles do formulário. O código desses *hanlders* irão atualizar os *states* com o que está sendo digitado pelo usuário:

```tsx
const handleNomeChange = (event: ChangeEvent<HTMLInputElement>) => setNovoNome(event.currentTarget.value)

const handleDescricaoChange = (event: ChangeEvent<HTMLTextAreaElement>) => setNovaDescricao(event.currentTarget.value)
```

Lembrando de importar a *interface* **`ChangeEvent`**no início do arquivo:

```
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react'
```

Vamos também definir esses *handlers* como resposta ao evento de ***Change*** dos controles, adicionando o atributo **`onChange`**, assim como definindo o valor dos controles como sendo o valor nos *states* **`novoNome`** e **`novaDescricao`**:

```tsx
<input value={novoNome} onChange={handleNomeChange} />
```

```tsx
<textarea onChange={handleDescricaoChange} value={novaDescricao} />
```

Para completar, vamos criar também *handlers*, logo abaixo dos anteriores, para responder ao clique nos botões ***Salvar*** e ***Cancelar***, simplesmente, nesse primeiro momento, mudando o *estado* da página:

```tsx
const handleSalvarClick = () => setEstado(Estado.Salvando)
const handleCancelarClick = () => setEstado(Estado.Lido)
```

Precisamos também definir esses *handlers* como resposta ao evento de ***Click*** dos respectivos botões:

```tsx
<button onClick={handleSalvarClick}>Salvar</button>
<button onClick={handleCancelarClick}>Cancelar</button>
```

Nesse ponto você pode testar essa tela no navegador, dando clique no botão ***Editar*** e ***Cancelar***.

### Salvar os dados

Vamos agora adicionar a operação de atualizar os dados de um *Item* específico a partir do servidor.

Assim, vamos adicionar no arquivo ***/src/services/itens.ts***, logo abaixo da função **`ler`**, o código para efetuar essa nova operação:

```tsx
atualizar: (item: Item, sucesso: () => void, falha: () => void) => {
	axios.put(`http://localhost:4000/api/itens/${item.id}`, item)
	.then(res => (res.status === 204) ? sucesso() : falha())
	.catch(error => falha())
},
```

📄 O código completo desse script fica assim:

```tsx
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

}

export default itensService
```

Feito isso, vamos então substituir o código do *handler* de resposta ao clique no botão ***Salvar***, no script da página ***Item***, para chamar essa operação:

```tsx
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
```

📄 O código completo desse script fica então:

```tsx
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
```

### Commit – *[+] editar item*

Para esse tutorial, nesse ponto, vamos registrar essa mudança de configuração no projeto, com um *commit*:

```sh
git add .
git commit -m "[+] editar item"
```

------

## 6. Remover Item

A partir dessa mesma página ***Item***, o usuário vai poder também remover o *Item* do sistema.

### Estados da página

Assim, o comportamento dessa página vai ter, agora, mais 3 novos estados:

- **Removendo:** exibe uma mensagem de progresso enquanto tenta remover o *Item*.
- **Erro Remover:** exibe uma mensagem de erro caso haja falha ao remover o *Item*.
- **Removido:** exibe uma mensagem de sucesso em relação à remoção.

 Ou seja, 10 estados no total, como ilustrado na figura seguinte:

![README-front-end-wireframe-fase-3](https://miro.medium.com/max/1400/1*TmALKlAFTKM7VHhNUSfKtg.png)

*Figura 5 – Wireframe e fluxo entre os estados da página de detalhes do Item.*

### Estados

De acordo com o wireframe definido na *Figura 5* vamos ajustar o código do *enum* **`Estado`**, em ***/src/pages/item.tsx***, acrescentando esses os 3 novos estados que faltam, ficando então assim:

```tsx
enum Estado {
	Lendo,
	ErroLer,
	Lido,
	Editando,
	Salvando,
	ErroSalvar,
	Salvo,
	Removendo,
	ErroRemover,
	Removido,
}
```

### Elementos da interface

Como próximo passo, vamos completar o HTML da página, contendo todos os demais elementos que podem ser exibidos em cada um desses estados.

Ou seja, logo abaixo da mensagem de erro ao tentar salvar, vamos adicionar a mensagem de progresso ao se tentar remover o *Item*:

```tsx
{
	(estado === Estado.Removendo) && <p>Removendo...</p>
}
```

E, logo abaixo dessa, vamos adicionar a mensagem de erro ao tentar remover:

```tsx
{
	(estado === Estado.ErroRemover) && <p>ERRO ao tentar remover.</p>
}
```

E, na sequência, vamos adicionar também a mensagem de sucesso da remoção, juntamente com o botão de ***Voltar***:

```tsx
{
	(estado === Estado.Removido) &&
	<>
		<p>SUCESSO em remover!</p>
		<button>Voltar</button>
	</>
}
```

 Junto ao botão de ***Editar***, vamos acrescentar um novo botão, ***Remover***:

```tsx
<button onClick={handleEditarClick}>Editar</button>
<button>Remover</button>
```

📄 O código completo dessa página, até esse ponto, fica assim então:

```tsx
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
		Removendo,
		ErroRemover,
		Removido,
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
				(estado === Estado.Removendo) && <p>Removendo...</p>
			}

			{
				(estado === Estado.ErroRemover) && <p>ERRO ao tentar remover.</p>
			}

			{
				(estado === Estado.Removido) &&
				<>
					<p>SUCESSO em remover!</p>
					<button>Voltar</button>
				</>
			}
				
			{
				((estado === Estado.Lido) || (estado === Estado.Salvo)) &&
				<>
					<h1>{item?.nome}</h1>
					<p>{item?.descricao}</p>
					<div>
						<button onClick={handleEditarClick}>Editar</button>
						<button>Remover</button>
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
```

### Service

Vamos agora adicionar a operação de remover um *Item* específico a partir do servidor.

Assim, vamos ajustar o código do **`itensService`** para efetuar essa a operação, adicionando, logo abaixo da **`atualizar`**, no arquivo ***/src/services/itens.ts***, a seguinte função:

```tsx
remover: (id: string, sucesso: () => void, falha: () => void) => {
	axios.delete(`http://localhost:4000/api/itens/${id}`)
	.then(res => (res.status === 204) ? sucesso() : falha())
	.catch(error => falha())
},
```

Como nas outras funções desse objeto, essa utiliza o Axios para fazer uma chamada HTTP com método *DELETE* no servidor, realizando assim a operação de remoção de um *Item* no sistema.

O arquivo completo fica então:

```tsx
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
```

### Botão Remover

Voltando à página ***Item***, o clique no botão ***Remover*** deverá mudar o estado geral dessa página para ***Removendo***  e acionar a operação no servidor. Assim, logo antes do *return* da página, acrescentamos o código desse novo *handler*:

```tsx
const handleRemoverClick = () => {
	setEstado(Estado.Removendo)
	if (id) {
		itensService.remover(
		id,
		() => setEstado(Estado.Removido),
		() => setEstado(Estado.ErroRemover)
		)
	} else {
		setEstado(Estado.ErroRemover)
	}
}
```

E na marcação do botão ***Remover***, acrecentamos o atributo **`onClick`**:

```tsx
<button onClick={handleRemoverClick}>Remover</button>
```

### Botão Voltar

Após removido, o botão ***Voltar*** é exibido — um clique nesse botão deverá levar de volta para a tela ***Itens***.

Assim vamos acrecentar, logo após o **`handleRemoverClick`**:

```tsx
const navigate = useNavigate()
const handleVoltarClick = () => navigate('/itens')
```

E na marcação do botão:

```tsx
<button onClick={handleVoltarClick}>Voltar</button>
```

Lembrando de importar a função **`useNavigate`**:

```tsx
import { useNavigate, useParams } from 'react-router-dom'
```

📄 O código completo da página fica então:

```tsx
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
		Removendo,
		ErroRemover,
		Removido,
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

	const handleRemoverClick = () => {
		setEstado(Estado.Removendo)
		if (id) {
			itensService.remover(
			id,
			() => setEstado(Estado.Removido),
			() => setEstado(Estado.ErroRemover)
			)
		} else {
			setEstado(Estado.ErroRemover)
		}
	}

	const navigate = useNavigate()
	const handleVoltarClick = () => navigate('/itens')

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
				(estado === Estado.Removendo) && <p>Removendo...</p>
			}

			{
				(estado === Estado.ErroRemover) && <p>ERRO ao tentar remover.</p>
			}

			{
				(estado === Estado.Removido) &&
				<>
					<p>SUCESSO em remover!</p>
					<button onClick={handleVoltarClick}>Voltar</button>
				</>
			}
				
			{
				((estado === Estado.Lido) || (estado === Estado.Salvo)) &&
				<>
					<h1>{item?.nome}</h1>
					<p>{item?.descricao}</p>
					<div>
						<button onClick={handleEditarClick}>Editar</button>
						<button onClick={handleRemoverClick}>Remover</button>
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
```

### Commit – *[+] remover item*

Para esse tutorial, nesse ponto, vamos registrar essa mudança de configuração no projeto, com um *commit*:

```sh
git add .
git commit -m "[+] remover item"
```

## 7. Criar Item

Para finalizar o conjunto de operações básicas, faltou a operação de criar um novo *Item* no sistema.

Vamos então voltar lá no arquivo da página ***Itens***, ***/src/pages/itens.tsx***, e ajustar o código, acrescentando mais 4 estados:

- **Criar:** exibe o formulário para entrar com os dados do novo *Item*.
- **Salvando:** exibe uma mensagem de progresso enquanto efetua essa operação no servidor.
- **Erro Criar:** exibe uma mensagem de erro caso haja falha na operação.
- **Criado:** exibe uma mensagem de sucesso.

A figura seguinte ilustra o fluxo completo entre os estados dessa página:

![README-front-end-itens-fase-2](https://miro.medium.com/max/1400/1*4dIvPbcxbsu7Vxh-ngZ2Ig.png)

*Figura 6 – Wireframe e fluxo completo entre os estados da página de lista de Itens.*

### Estados

De acordo com o wireframe definido na *Figura 6*, o código do enum **`Estado`** fica então assim:

```tsx
enum Estado {
	Lendo,
	ErroLer,
	Lido,
	Criar,
	Salvando,
	ErroCriar,
	Criado,
}
```

### Elementos da interface

Como próximo passo, vamos completar o HTML da página, adicionando todos os demais elementos que podem ser exibidos em cada um desses estados.

Ou seja, logo abaixo do bloco do estado ***Lido***, vamos adicionar a mensagem de sucesso ao criar o novo *Item* e o botão ***Novo***:

```tsx
{
	(estado === Estado.Criado) && <p>SUCESSO em criar.</p>
}

{
  ((estado === Estado.Lido) || (estado === Estado.Criado)) && <button>Novo</button>
}
```

E logo abaixo, vamos adicionar o código do formulário de cadastro:

```tsx
{
	((estado === Estado.Criar) || (estado === Estado.ErroCriar)) &&
	<form>
		<div>
			<label>
				Nome:
				<input />
			</label>
		</div>
		<div>
			<label>
				Descrição:
				<textarea />
			</label>
		</div>
		<div>
			<button>Salvar</button>
			<button>Cancelar</button>
		</div>
	</form>
}
```

E logo abaixo, vamos adicionar a mensagem de progresso da execução da operação de salvar o novo *Item*:

```tsx
{
	(estado === Estado.Salvando) && <p>Salvando...</p>
}
```

E, na sequência, adicionar a mensagem de erro ao tentar salvar:

```tsx
{
	(estado === Estado.ErroCriar) && <p>ERRO ao tentar criar.</p>
}
```

Vamos também ajustar o bloco da lista de Itens, que deverá ser mostrado também nos estados ***Criar*** e ***Criado***:

```tsx
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
```

### Criação de um novo Item

Para guardar os valores dos campos *nome* e *descrição*, digitados pelo usuário, para o novo *Item* a ser criado, vamos então criar dois novos *states*, logo abaixo do *state* **`itens`**:

```tsx
const [nome, setNome] = useState('')
const [descricao, setDescricao] = useState('')
```

Quando o usuário der um clique no botão ***Novo***, o formulário deve ser exibido juntamente com os botões de ***Salvar*** e ***Cancelar***.

Assim, logo após o bloco do **`useEffect`**,  vamos adicionar o seguinte código de resposta (*handler*) ao clique no botão ***Novo***:

```tsx
const handleNovoClick = () => {
  setNome('')
  setDescricao('')
  setEstado(Estado.Criar)
}
```

E na marcação do próprio botão ***Novo***, vamos adicionar o atributo **`onClick`**:

```tsx
<button onClick={handleNovoClick}>Novo</button>
```

Vamos fazer o mesmo para o botão ***Cancelar***, ou seja adicionar o *handler* de resposta ao clique nesse botão, logo após o *handler* do botão ***Novo***:

```tsx
const handleCancelarClick = () => setEstado(Estado.Lido)
```

E adicionar o atributo **`onClick`** na marcação do botão:

```tsx
<button onClick={handleCancelarClick}>Cancelar</button>
```

E o mesmo, também, para o botão ***Salvar***:

```tsx
const handleSalvarClick = () => setEstado(Estado.Salvando)
```

```tsx
<button onClick={handleSalvarClick}>Salvar</button>
```

Para completar o recurso de criação, é preciso então sincronizar o valor dos controles do formulário com o valor dos *states*.

Assim, logo abaixo do *handler* de clique no botão ***Salvar***, vamos criar dois novos *handlers* como resposta à mudança dos valores preenchidos nesses controles do formulário. O código desses *handlers* irão atualizar os *states* com o que está sendo digitado pelo usuário:

```tsx
const handleNomeChange = (event: ChangeEvent<HTMLInputElement>) => setNome(event.currentTarget.value)

const handleDescricaoChange = (event: ChangeEvent<HTMLTextAreaElement>) => setDescricao(event.currentTarget.value)
```

Não esquecendo de importar a *interface* **`ChangeEvent`**, no início do arquivo:

```tsx
import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react'
```

Vamos também definir esses *handlers* como resposta ao evento de ***Change*** dos controles, adicionando o atributo **`onChange`**, assim como definindo o valor dos controles como sendo dos *states* **`nome`** e **`descricao`**:

```tsx
<input value={nome} onChange={handleNomeChange} />
```

```tsx
<textarea onChange={handleDescricaoChange} value={descricao} />
```



📄 Nesse ponto, o código completo da página fica assim então:

```tsx
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
	const handleSalvarClick = () => setEstado(Estado.Salvando)

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
```

### Service

Vamos agora adicionar a operação de criar um novo *Item* no servidor.

Assim, vamos ajustar o código do **`itensService`** para efetuar essa a operação, adicionando, logo abaixo da **`remover`**, no arquivo ***/src/services/itens.ts***, a seguinte função:

```tsx
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
```

📄 O arquivo completo fica então:

```tsx
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
```

> #### Explicando o código:
>
> Após ser criado, queremos que o novo *Item* seja adicionado na lista de *Itens* da página.
>
> Por esse motivo, esse novo método **`criar`**, irá realizar duas chamadas no servidor: uma para efetuar propriamente a criação do *Item*:
>
> ```tsx
> axios.post(`http://localhost:4000/api/itens`, item)
> ```
>
> e outra para conseguir os dados do *Item* que acabou de ser criado:
>
> ```tsx
> axios.get<Item>(itemUrl)
> ```
>
> A rota usada na segunda chamada é enviada pelo servidor no cabeçalho da primeira chamada:
>
> ```tsx
> const itemUrl = `http://localhost:4000/api${res.headers.location}`
> ```
>
> Ao sucesso da execução dessas duas operações, o método **`criar`** chama a função de *callback*, passando os dados do *Item* (corpo da resposta **`res.data`**) criado como parâmetro:
>
> ```tsx
> sucesso(res.data)
> ```

### Botão Salvar

Voltando ao script da página ***Itens***, o clique no botão ***Salvar*** deverá mudar o estado geral dessa página para ***Salvando***  e acionar a operação no servidor.

Assim, modificamos o código, em ***/src/pages/item.tsx***, do *handler* para incluir a chamada à operação **`criar`** e para adicionar o novo *Item* criado na lista de *Itens* da página:

```tsx
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
```

📄 O código completo da página fica então:

```tsx
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
```

E aqui chegamos ao fim do nosso aplicativo React desse tutorial.

### Commit – *[+] criar item*

Nesse ponto, vamos registrar essa mudança de configuração no projeto, com um *commit*:

```sh
git add .
git commit -m "[+] criar item"
```

Caso queria adicionar esse projeto no GitHub ou BitBucket, crie um novo repositório em um desses servidores e, em seguida, execute os seguinte comandos:

```
git remote add origin {url}
git branch -M main
git push -u origin main
```

Substituindo ***{url}*** pela URL do repositório criado no servidor.

> Você pode encontrar o código completo desse projeto na minha conta do GitHub, em: https://github.com/eldes/tutorial-rest-api--front-end--react-axios-typescript

------

## Conclusão

Nesse ponto temos o projeto completo de um *web app* React, que implementa uma interface para as operações básicas do *CRUD* executadas no servidor via uma REST API.

Lembre que você pode melhorar esse código fazendo *refactoring* e seguindo os conceitos de *Clean Code* e *SOLID*.

------

## Contribuição

Comentários e dúvidas são bem-vindas, tanto aqui quanto no [Medium](https://medium.com/@eldes.com/tutorial-conexão-de-um-aplicativo-react-em-typescript-a-um-servidor-rest-api-usando-axios-1eeadc3ad238).
