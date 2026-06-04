async function carregarHistorico()
{
    const resposta =
        await fetch('/historico');

    const dados =
        await resposta.json();

    let tabela =
        document.getElementById(
            "historicoTabela"
        );

    tabela.innerHTML = "";

    dados.forEach(item => {

        tabela.innerHTML += `
            <tr>
                <td>${item.datahora}</td>
                <td>${item.tipo}</td>
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
            </tr>
        `;
    });
}

function exportarHistoricoPDF()
{
    window.location =
        '/exportar-historico-pdf';
}

carregarHistorico();