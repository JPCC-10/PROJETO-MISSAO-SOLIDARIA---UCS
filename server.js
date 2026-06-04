const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');

const db = require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


// ESTOQUE

app.get('/estoque', (req, res) => {

    db.all(
        "SELECT * FROM estoque ORDER BY nome",
        [],
        (err, rows) => {

            if(err)
                return res.status(500).json(err);

            res.json(rows);
        }
    );
});


// HISTÓRICO

app.get('/historico', (req, res) => {

    db.all(
        `
        SELECT *
        FROM historico
        ORDER BY id DESC
        `,
        [],
        (err, rows) => {

            if(err)
                return res.status(500).json(err);

            res.json(rows);
        }
    );
});


// ENTRADA

app.post('/entrada', (req, res) => {

    const { nome, quantidade } = req.body;

    db.get(
        "SELECT * FROM estoque WHERE nome = ?",
        [nome],
        (err, row) => {

            if(row){

                db.run(
                    `
                    UPDATE estoque
                    SET quantidade = quantidade + ?
                    WHERE nome = ?
                    `,
                    [quantidade, nome]
                );

            } else {

                db.run(
                    `
                    INSERT INTO estoque(nome, quantidade)
                    VALUES(?,?)
                    `,
                    [nome, quantidade]
                );
            }

            db.run(
                `
                INSERT INTO historico
                (datahora, tipo, nome, quantidade)
                VALUES(
                    datetime('now','localtime'),
                    'ENTRADA',
                    ?,
                    ?
                )
                `,
                [nome, quantidade]
            );

            res.json({
                sucesso:true
            });
        }
    );
});


// SAÍDA

app.post('/saida', (req, res) => {

    const { nome, quantidade } = req.body;

    db.get(
        "SELECT * FROM estoque WHERE nome = ?",
        [nome],
        (err, row) => {

            if(!row){

                return res.status(400).json({
                    erro:"Item não encontrado"
                });
            }

            if(row.quantidade < quantidade){

                return res.status(400).json({
                    erro:"Quantidade insuficiente"
                });
            }

            db.run(
                `
                UPDATE estoque
                SET quantidade = quantidade - ?
                WHERE nome = ?
                `,
                [quantidade, nome]
            );

            db.run(
                `
                INSERT INTO historico
                (datahora, tipo, nome, quantidade)
                VALUES(
                    datetime('now','localtime'),
                    'SAIDA',
                    ?,
                    ?
                )
                `,
                [nome, quantidade]
            );

            res.json({
                sucesso:true
            });
        }
    );
});


// RESET

app.delete('/resetar', (req, res) => {

    db.run(
        "DELETE FROM estoque",
        function(err){

            if(err)
                return res.status(500).json(err);

            res.json({
                sucesso:true
            });
        }
    );
});


// EXPORTAR ESTOQUE

app.get('/exportar-estoque-pdf', (req, res) => {

    db.all(
        "SELECT * FROM estoque ORDER BY nome",
        [],
        (err, rows) => {

            if(err)
                return res.status(500).json(err);

            const doc = new PDFDocument();

            res.setHeader(
                'Content-Type',
                'application/pdf'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename=estoque.pdf'
            );

            doc.pipe(res);

            doc.fontSize(18);
            doc.text('Relatório de Estoque');

            doc.moveDown();

            rows.forEach(item => {

                doc.text(
                    `${item.nome} - ${item.quantidade}`
                );

            });

            doc.end();
        }
    );
});

// EXPORTAR HISTTÓRICO

app.get('/exportar-historico-pdf', (req, res) => {

    db.all(
        `
        SELECT *
        FROM historico
        ORDER BY id DESC
        `,
        [],
        (err, rows) => {

            if(err)
                return res.status(500).json(err);

            const doc = new PDFDocument();

            res.setHeader(
                'Content-Type',
                'application/pdf'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename=historico.pdf'
            );

            doc.pipe(res);

            doc.fontSize(18);
            doc.text(
                'Histórico de Movimentações'
            );

            doc.moveDown();

            rows.forEach(item => {

                doc.text(
                    `${item.datahora} | ${item.tipo} | ${item.nome} | ${item.quantidade}`
                );

            });

            doc.end();
        }
    );
});

app.listen(3000, () => {

    console.log(
        'Servidor rodando em http://localhost:3000'
    );

});