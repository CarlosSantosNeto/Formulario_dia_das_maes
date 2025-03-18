const cpfInput = document.querySelector('#cpfid');

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // Removedor de caracteres numericos 

   
    if (cpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
   
    let soma = 0;
    let resto;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) {
        return false;
    }

    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}

cpfInput.addEventListener('keypress', (event) => {
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
    let inputLength = cpfInput.value.length;
    if (inputLength === 3 || inputLength === 7) {
        cpfInput.value += '.';
    } else if (inputLength === 11) {
        cpfInput.value += '-';
    }
    if (cpfInput.value.length >= 14) event.preventDefault();
});

cpfInput.addEventListener('blur', () => {
    const cpf = cpfInput.value;

    if (!validarCPF(cpf)) {
        alert('CPF inválido! Por favor, insira um CPF válido.');
        cpfInput.focus();
    }
});


const cnpjInput = document.querySelector('#cnpj');
cnpjInput.addEventListener('keypress', (event) => {
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
    let inputLength = cnpjInput.value.length;
    if (inputLength === 2 || inputLength === 6) {
        cnpjInput.value += '.';
    } else if (inputLength === 10) {
        cnpjInput.value += '/';
    } else if (inputLength === 15) {
        cnpjInput.value += '-';
    }
    if (cnpjInput.value.length >= 18) event.preventDefault();
});

const telefoneInput = document.querySelector('#telefone');
telefoneInput.addEventListener('keypress', (event) => {
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
    let inputLength = telefoneInput.value.length;
    if (inputLength === 0) {
        telefoneInput.value += '(';
    } else if (inputLength === 3) {
        telefoneInput.value += ') ';
    } else if (inputLength === 9) {
        telefoneInput.value += '-';
    }
    if (telefoneInput.value.length >= 14) event.preventDefault();
});

const cepInput = document.querySelector('#cep');
cepInput.addEventListener('keypress', (event) => {
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
    let inputLength = cepInput.value.length;
    if (inputLength === 5) {
        cepInput.value += '-';
    }
    if (cepInput.value.length >= 9) event.preventDefault();
});

const dataNascimentoInput = document.querySelector('#data_nascimento');
dataNascimentoInput.addEventListener('change', () => {
    const data = new Date(dataNascimentoInput.value);
    const ano = data.getFullYear();
    if (ano > 2007) {
        alert('Por favor, é necessário ter pelo menos 18 anos');
        dataNascimentoInput.value = '';
    }
});

const dataCompraInput = document.querySelector('#data_compra');
dataCompraInput.addEventListener('change', () => {
    const dataSelecionada = new Date(dataCompraInput.value);
    const dataInicio = new Date('01-05-2025');
    const dataFim = new Date('31-05-2025');

    // Verifica se a data selecionada está dentro do intervalo de 01/05/2025 a 31/05/2025
    if (dataSelecionada < dataInicio || dataSelecionada > dataFim) {
        alert('Por favor, insira uma data de compra entre 01/05/2025 e 31/05/2025.');
        dataCompraInput.value = ''; // Limpa o campo
    }
});

document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Coletando os dados do formulário
    const cliente = {
        nome: document.querySelector("#nome").value,
        cpf: document.querySelector("#cpfid").value,
        telefone: document.querySelector("#telefone").value,
        email: document.querySelector("#email").value,
        logradouro: document.querySelector("#logradouro").value,
        bairro: document.querySelector("#bairro").value,
        numero: document.querySelector("#numero").value,
        cidade: document.querySelector("#cidade").value,
        estado: document.querySelector("#estado").value,
        cep: document.querySelector("#cep").value,
    };

    const notaFiscal = {
        num_nota: document.querySelector("#num_nota").value,
        cnpj: document.querySelector("#cnpj").value,
        data_compra: document.querySelector("#data_compra").value,
    };

    const pergunta = document.querySelector("#pergunta").value;  // Correção: 'pergunta' ao invés de 'resposta'

    
    console.log("Cliente:", cliente);
    console.log("Nota Fiscal:", notaFiscal);
    console.log("Pergunta:", pergunta);  

    // Enviando os dados para o servidor
    const dados = { cliente, notaFiscal, pergunta };

    try {
        const response = await fetch("http://localhost:3000/salvar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta do servidor: ${response.status}`);
        }

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Erro ao salvar dados:", error);
    }
});
