import { clienteService } from "../service/cliente-service.js"

const formulario = document.querySelector('[data-form]')


formulario.addEventListener('submit', (evento) => {
    evento.preventDefault()
   const nomeDoItem = evento.target.querySelector('[data-nomeDoItem]').value
   const idDoItem = evento.target.querySelector('[data-idDoItem]').value
   const refinamento = evento.target.querySelector('[data-refinamento]').value
   const precoCompra = evento.target.querySelector('[data-precoCompra]').value
   const qtd = evento.target.querySelector('[data-qtd]').value
   const precoVenda = evento.target.querySelector('[data-precoVenda]').value

   clienteService.criarItem(nomeDoItem, idDoItem, refinamento, precoCompra, qtd, precoVenda)
    .then(() => {
        window.location.href = '../telas/cadastro_concluido.html'
    })
})