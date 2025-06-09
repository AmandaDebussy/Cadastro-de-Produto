# Mini CRUD de Produtos

Este é um mini projeto CRUD desenvolvido com foco em aprendizado, que simula o cadastro de itens com seus respectivos valores e imagens.  
Ele foi construído utilizando as tecnologias:

- **Node.js** : ambiente de execução JavaScript no back-end  
- **Express** : framework para criação de rotas e servidores  
- **MySQL** : banco de dados relacional para armazenamento das informações  
- **Handlebars** : motor de template para renderizar páginas HTML dinamicamente
- **Bootstrap5** : Utilizado para estilização e responsividade da interface  
- **Multer** — biblioteca usada para lidar com uploads de arquivos (imagens dos produtos)

## Funcionalidades

- Cadastro de produtos com nome, valor e imagem
- Listagem dos produtos cadastrados
- Remoção de produtos (inclusive da imagem associada)
- Busca de produtos por nome (filtro)
- Upload de imagens com tratamento e salvamento local
- Integração com banco de dados MySQL

## Estrutura

- **Back-end**: feito com Node.js e Express
- **Views**: renderizadas com Handlebars
- **Banco de dados**: tabela `produtos` com os campos `codigo`, `nome`, `valor` e `image`
- **Upload**: as imagens são salvas na pasta local `/uploads`

## Observações

- As informações sensíveis, como as credenciais do banco de dados, foram protegidas utilizando a biblioteca `dotenv` e o arquivo `.env`, que não está incluso no repositório.
- O projeto não tem o objetivo de ser implantado em produção, mas sim de servir como exercício prático e educacional.

---
