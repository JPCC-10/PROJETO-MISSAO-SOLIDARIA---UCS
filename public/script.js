async function carregarEstoque(){

    const resposta =
    await fetch('/estoque');

    const dados =
    await resposta.json();

    let tabela =
    document.getElementById(
        "estoqueTabela"
    );

    tabela.innerHTML = "";

    dados.forEach(item => {

        tabela.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
            </tr>
        `;
    });

}


async function entrada(){

    let nome =
    document.getElementById(
        "entradaNome"
    ).value;

    let quantidade =
    parseInt(
        document.getElementById(
            "entradaQtd"
        ).value
    );

    await fetch('/entrada',{

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({
            nome,
            quantidade
        })

    });

    carregarEstoque();
}


async function saida(){

    let nome =
    document.getElementById(
        "saidaNome"
    ).value;

    let quantidade =
    parseInt(
        document.getElementById(
            "saidaQtd"
        ).value
    );

    const resposta =
    await fetch('/saida',{

        method:'POST',

        headers:{
            'Content-Type':'application/json'
        },

        body:JSON.stringify({
            nome,
            quantidade
        })

    });

    if(!resposta.ok){

        const erro =
        await resposta.json();

        alert(erro.erro);

        return;
    }

    carregarEstoque();
}

carregarEstoque();