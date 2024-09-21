const listaMoedas = () => {
    return fetch(`http://localhost:3001/moeda`).then(resposta => {
        return resposta.json()
    })
}

export const moedaService = {
    listaMoedas
}