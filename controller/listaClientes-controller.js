import { clienteService } from "../service/cliente-service.js";
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