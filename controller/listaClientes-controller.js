import { clienteService } from "../service/cliente-service.js";
import { moedaService } from "../service/moeda-service.js"
import { scrapperService } from "../service/scrapper.js";


const criarNovaLinha = (nome, email, idDoItem) => {
    const linhaNovoCliente = document.createElement('tr');
    const conteudo = `
    <td class="td" data-td>${nome}</td>
    <td>${email}</td>
    <td>${idDoItem}</td>
    <td>
    <ul class="tabela__botoes-controle">
    <li><a href="../telas/edita_cliente.html" class="botao-simples botao-simples--editar">Editar</a></li>
    <li><button class="botao-simples botao-simples--excluir" type="button">Excluir</button></li>
    </ul>
    </td>
    `
    linhaNovoCliente.innerHTML = conteudo;
    linhaNovoCliente.dataset.idDoItem = idDoItem; 

    return linhaNovoCliente;
};

const tabela = document.querySelector('[data-tabela]')

tabela.addEventListener('click', (evento) =>{
    let botao_deletar = evento.target.className === 'botao-simples botao-simples--excluir';
    if(botao_deletar){
        const linha_item = evento.target.closest('[data-id-do-item]')
        let id = linha_item.dataset.idDoItem
        clienteService.removerItem(id).then(() => {
            linha_item.remove()
        })
    }
 });

//esta funcao pega os dados da promessa em loop e aplica no front pelo foreach
clienteService.listaClientes().then(data => {
    data.forEach(elemento => {
        tabela.appendChild(criarNovaLinha(elemento.nomeDoItem, elemento.precoCompra, elemento.idDoItem))
    })
})



// ----------------------------------------------------------------------//
// ------------- inicio criacao de cards de itens (moedas)---------------//
//-----------------------------------------------------------------------//
const card = document.querySelector('[data-card]')
const criarLinhaCard = (nome, idMoeda, img, qtd, precoCompra, dataDaCompra) => {

    const linhaNovaMoeda = document.createElement('div');
    linhaNovaMoeda.classList.add('col');

    const conteudo = `
                    <div class="card">
                        <img src="${img}" class="card-img-top" alt="imagem do item">
                        <div class="card-item-body">
                            <h5 class="card-title">${nome}</h5>
                            <p class="card-text">aqui vai os calculos mais pra frente.<br/>
                            Data da compra: ${dataDaCompra}
                            Quantidade: ${qtd}</p>
                        </div>
                        <div class="mb-5 d-flex justify-content-around">
                            <h3>${precoCompra} rops</h3>
                            <button class="btn btn-primary">Atualizar</button>
                        </div>
                    </div>
    `
    linhaNovaMoeda.innerHTML = conteudo;
    linhaNovaMoeda.dataset.idMoeda = idMoeda;
    return linhaNovaMoeda;
};

moedaService.listaMoedas().then(data => {
    data.forEach(elemento => {
        card.appendChild(criarLinhaCard(elemento.nome, elemento.idMoeda, elemento.img, elemento.qtd, elemento.precoCompra, elemento.dataDaCompra))
    })
})


// ----------------------------------------------------------------------//
// ------------- inicio Scrapping itens site ----------------------------//
//-----------------------------------------------------------------------//

scrapperService.processarItens()