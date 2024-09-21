//funcao que entra na url e pega os dados retornando uma promessa
const listaClientes = () => {
    return fetch(`http://localhost:3001/itens`).then(resposta => {
        return resposta.json()
    })
}

const criarItem = (nomeDoItem, idDoItem, refinamento, precoCompra, qtd, precoVenda) => {
    return fetch(`http://localhost:3001/item/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
        },
        body: JSON.stringify({
            nomeDoItem: nomeDoItem,
            idDoItem: idDoItem,
            refinamento: refinamento,
            precoCompra: precoCompra,
            qtd: qtd,
            precoVenda: precoVenda
        })
    })
        .then(resposta => {
            return resposta.body
        })
}

const removerItem = (idDoItem) => {
    return fetch(`http://localhost:3001/item/${idDoItem}`, {
        method: 'DELETE'
    })
}

export const clienteService = {
    listaClientes,
    criarItem,
    removerItem
}