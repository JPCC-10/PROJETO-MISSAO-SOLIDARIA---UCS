async function retirarItem()
{
    let nome =
        document.getElementById("nome").value;

    let quantidade =
        parseInt(
            document.getElementById("quantidade").value
        );

    const resposta =
        await fetch('/saida',
    {
        method:'POST',

        headers:
        {
            'Content-Type':'application/json'
        },

        body:JSON.stringify(
        {
            nome,
            quantidade
        })
    });

    if(!resposta.ok)
    {
        alert("Erro ao retirar item");
        return;
    }

    alert("Item retirado!");
}