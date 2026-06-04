async function carregarEstoque()
{
    const resposta =
        await fetch('/estoque');

    const dados =
        await resposta.json();

    let tabela =
        document.getElementById("tabela");

    tabela.innerHTML = "";

    dados.forEach(item =>
    {
        tabela.innerHTML += `
        <tr>
            <td>${item.nome}</td>
            <td>${item.quantidade}</td>
        </tr>
        `;
    });
}

carregarEstoque();

async function resetarEstoque()
{
    const senha = prompt("Digite a senha:");

    if(senha !== "admin123")
    {
        alert("Senha incorreta");
        return;
    }

    const resposta = await fetch('/resetar', {
        method: 'DELETE'
    });

    const dados = await resposta.json();

    console.log(dados);

    await carregarEstoque(); // IMPORTANTE

    alert("Estoque resetado!");
}

function exportarEstoquePDF()
{
    window.location =
        '/exportar-estoque-pdf';
}