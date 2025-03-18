const express = require("express");
const app = express();
const db = require("./database");
app.use(express.json());
const cors = require('cors');

app.use(cors({
    origin: '*' // permite todas as origens
}));

app.post("/salvar", (req, res) => {
    console.log("Dados recebidos:", req.body);  // Verifique os dados recebidos

    const { cliente, notaFiscal, pergunta } = req.body;

    if (!cliente || !notaFiscal || !pergunta) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    // Inserção do cliente
    const queryCliente = `INSERT INTO clientes (nome, cpf, telefone, email, logradouro, bairro, numero, cidade, estado, cep) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(queryCliente, [
        cliente.nome, cliente.cpf, cliente.telefone, cliente.email,
        cliente.logradouro, cliente.bairro, cliente.numero,
        cliente.cidade, cliente.estado, cliente.cep
    ], function(err) {
        if (err) {
            return res.status(500).json({ message: "Erro ao cadastrar cliente" });
        }

        const clienteId = this.lastID;  // Identificando o cliente

        // Inserção da nota fiscal
        const queryNotaFiscal = `INSERT INTO notas_fiscais (cliente_id, num_nota, cnpj, data_compra) 
                                 VALUES (?, ?, ?, ?)`;

        db.run(queryNotaFiscal, [
            clienteId, notaFiscal.num_nota, notaFiscal.cnpj, notaFiscal.data_compra
        ], function(err) {
            if (err) {
                return res.status(500).json({ message: "Erro ao cadastrar nota fiscal" });
            }

            // Inserção da resposta (pergunta)
            const queryResposta = `INSERT INTO respostas_pergunta_milhoes (cliente_id, resposta) 
                                   VALUES (?, ?)`;

            db.run(queryResposta, [clienteId, pergunta], function(err) {
                if (err) {
                    console.error("Erro ao cadastrar resposta:", err);
                    return res.status(500).json({ message: "Erro ao cadastrar resposta" });
                }

                res.status(200).json({ message: "Cadastro realizado com sucesso!" });
            });
        });
    });
});

// iniciando o servidor local 
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
