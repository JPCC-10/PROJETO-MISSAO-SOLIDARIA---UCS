async function adicionarItem()
{
    let nome =
        document.getElementById("nome").value;

    let quantidade =
        parseInt(
            document.getElementById("quantidade").value
        );

    await fetch('/entrada',
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

    alert("Item adicionado!");
}