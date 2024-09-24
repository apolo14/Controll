const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const BASE_URL_ITENS = 'https://www.historyreborn.net/?module=item&action=view&id=';
const IdDoItem = '27262'

const items = [
    { url: BASE_URL_ITENS + IdDoItem, valorMedio: 60000, nome: 'Carta Atria' }
];


async function processarItens() {
    for (const item of items) {
        await scrapeItem(item);
    }
}

async function scrapeItem(item) {
    const { url, valorMedio } = item;

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        console.log(`\nAnalisando item na URL: ${url}`);
        console.log(`Valor médio definido para este item: ${formatWithCommas(valorMedio)}c`);

        // Extraindo diretamente as linhas da tabela usando o Puppeteer
        const vendas = await page.evaluate(() => {
            const linhas = Array.from(document.querySelectorAll('#nova-sale-table tbody tr'));
            return linhas.map((linha) => {
                const loja = linha.querySelector('td').innerText.trim();
                const valorStr = linha.querySelectorAll('td')[3]?.innerText.trim(); // Valor do item, com verificação de segurança
                return { loja, valorStr };
            });
        });

        // Extraindo a imagem contida no div.novacard-box
        const imageUrl = await page.evaluate(() => {
            const imgElement = document.querySelector('div.novacard-box img');
            return imgElement ? imgElement.src : null; // Retorna a URL da imagem ou null se não for encontrada
        });

        // Verifica se há vendas disponíveis
        if (vendas.length === 0) {
            console.log("Nenhuma venda encontrada.");
        } else {
            // Processa cada venda
            for (const venda of vendas) {
                if (!venda.valorStr || isNaN(convertAbbreviatedValue(venda.valorStr))) {
                    console.log(`Loja: ${venda.loja} - Valor inválido: ${venda.valorStr}`);
                } else {
                    const valor = convertAbbreviatedValue(venda.valorStr); // Converte o valor formatado

                    // Verifica se o valor é menor que o valor médio
                    if (valor < valorMedio) {
                        console.log(`Loja: ${venda.loja} - Valor: ${formatWithCommas(valor)}c (abaixo do valor médio de ${formatWithCommas(valorMedio)}c)`);
                        // Enviar notificação para o Discord com um atraso entre requisições
                        await sendDiscordNotification(item, venda.loja, formatWithCommas(valor), imageUrl);
                        await delay(2000); // Adiciona um atraso de 2 segundos entre cada notificação
                    } else {
                        console.log(`Loja: ${venda.loja} - Valor: ${formatWithCommas(valor)}c (acima do valor médio)`);
                    }
                }
            }
        }

        await browser.close();
    } catch (error) {
        console.error(`Erro ao acessar a URL: ${url}`, error.message);
    }
}

export const scrapperService = {
    processarItens
}