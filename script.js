/* =========================================================
   ITABUS - JavaScript
   ========================================================= */

/* =========================
   DADOS
========================= */

const linhasPadrao = [
    {
        id: 1,
        nome: "LINHA 001",
        descricao: "Vila Rio Branco",
        pontos: [
            { nome: "Terminal Central", principal: true },
            { nome: "Rodoviária", principal: false },
            { nome: "Hospital Itapetininga", principal: true },
            { nome: "Vila Rio Branco", principal: true }
        ],
        horarios: [
            ["07:00", "07:20", "07:40"],
            ["08:00", "08:20", "08:40"],
            ["09:00", "09:20", "09:40"]
        ]
    },
    {
        id: 2,
        nome: "LINHA 002",
        descricao: "Centro - Jardim Colombo",
        pontos: [
            { nome: "Terminal", principal: true },
            { nome: "Centro", principal: false },
            { nome: "Jardim Colombo", principal: true }
        ],
        horarios: [
            ["07:10", "07:40"],
            ["08:10", "08:40"],
            ["09:10", "09:40"]
        ]
    },
    {
        id: 3,
        nome: "LINHA 003",
        descricao: "Bairro - Centro",
        pontos: [
            { nome: "Bairro Alvorada", principal: true },
            { nome: "Centro", principal: true }
        ],
        horarios: [
            ["07:00", "07:30"],
            ["08:00", "08:30"]
        ]
    }
];

function temaEscuro() {
    document.body.classList.toggle("tema-escuro");

    const escuro =
        document.body.classList.contains("tema-escuro");

    localStorage.setItem(
        "itabusTemaEscuro",
        escuro ? "true" : "false"
    );
}

function carregarLocal(chave, padrao) {
    try {
        const valor = localStorage.getItem(chave);
        return valor ? JSON.parse(valor) : padrao;
    } catch (erro) {
        console.warn("Não foi possível ler", chave, erro);
        return padrao;
    }
}

let linhas = carregarLocal("itabusLinhas", linhasPadrao);
let favoritos = carregarLocal("itabusFavoritos", []);
let informacoes = carregarLocal("itabusInformacoes", []);
let notificacoes = carregarLocal("itabusNotificacoes", []);
let solicitacoesNotificacao = carregarLocal("itabusSolicitacoes", []);

let tamanhoFonte = 16;
let campoMapaSelecionado = null;
let tipoAcesso = null;
let tabelasPorDia = {};

function salvarLocal(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

/* =========================
   NAVEGAÇÃO
========================= */

function abrirTela(id, botao) {

    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });

    const tela = document.getElementById(id);

    if (!tela) return;

    tela.classList.add("ativa");

    document.querySelectorAll(".nav-btn").forEach(b => {
        b.classList.remove("ativo");
    });

    if (botao) {
        botao.classList.add("ativo");
    }

    if (id === "linhas") {
        renderizarLinhas();
    }

    if (id === "favoritos") {
        renderizarFavoritos();
    }

    if (id === "colaborativo") {
        carregarLinhasColaborativo();
        renderizarComunidade();
    }

    if (id === "confirmacoes") {
        renderizarPendentes();
    }

    if (id === "notificacoesRestritas") {
        if (tipoAcesso) {
            mostrarAcessoRestrito();
        }

        renderizarSolicitacoes();
    }
}

/* =========================
   LINHAS E ROTAS
========================= */

function renderizarLinhas() {

    const lista = document.getElementById("listaLinhas");

    if (!lista) return;

    lista.innerHTML = "";

    if (!linhas.length) {
        lista.innerHTML = "<p>Nenhuma linha cadastrada.</p>";
        return;
    }

    linhas.forEach((linha, index) => {

        const botao = document.createElement("button");

        botao.className = "linha-card";

        botao.innerHTML = `
            <strong>${linha.nome}</strong>
            <span>${linha.descricao}</span>
        `;

        botao.onclick = () => mostrarLinha(index);

        lista.appendChild(botao);
    });

    mostrarLinha(0);
}

function obterHorariosDaLinha(linha) {

    if (Array.isArray(linha.horarios) && linha.horarios.length) {
        return linha.horarios;
    }

    if (
        linha.horariosPorDia &&
        typeof linha.horariosPorDia === "object"
    ) {

        const primeiraTabela =
            Object.values(linha.horariosPorDia)[0];

        return Array.isArray(primeiraTabela)
            ? primeiraTabela
            : [];
    }

    return [];
}

function mostrarLinha(index) {

    const linha = linhas[index];

    const detalhes =
        document.getElementById("detalhesLinha");

    if (!linha || !detalhes) return;

    const principais =
        (linha.pontos || []).filter(p => p.principal);

    const favorito =
        favoritos.includes(linha.id);

    const horarios =
        obterHorariosDaLinha(linha);

    const cabecalho =
        principais
            .map(p => `<th>${p.nome}</th>`)
            .join("");

    const corpo =
        horarios.map(horario => {

            return `
                <tr>
                    ${principais.map((_, i) => `
                        <td>${horario[i] || "--:--"}</td>
                    `).join("")}
                </tr>
            `;

        }).join("");

    const rota =
        (linha.pontos || [])
            .map(p => p.nome)
            .join(" > ");

    detalhes.innerHTML = `

        <h2>
            ${linha.nome} - ${linha.descricao}
        </h2>

        <br>

        <button
            class="btn-favorito ${favorito ? "ativo" : ""}"
            onclick="favoritarLinha(${linha.id})"
        >

            ${favorito
                ? "★ Favoritada"
                : "☆ Favoritar linha"}

        </button>

        <br><br>

        <div class="mapa">

            <div class="rota-linha"></div>

            <div class="ponto-mapa ponto-a"></div>

            <div class="ponto-mapa ponto-b"></div>

            <div class="ponto-mapa ponto-c"></div>

            <div class="onibus-marker">
                ÔNIBUS
            </div>

        </div>

        <div class="rota-completa">

            <strong>
                Rota completa:
            </strong>

            <br>

            ${rota || "Nenhum ponto cadastrado."}

        </div>

        <h3>
            Horários dos pontos principais
        </h3>

        <br>

        <div class="tabela-container">

            <table>

                <thead>

                    <tr>
                        ${cabecalho}
                    </tr>

                </thead>

                <tbody>

                    ${
                        corpo ||
                        `
                        <tr>
                            <td colspan="${Math.max(principais.length, 1)}">
                                Nenhum horário cadastrado.
                            </td>
                        </tr>
                        `
                    }

                </tbody>

            </table>

        </div>
    `;
}

function favoritarLinha(id) {

    if (favoritos.includes(id)) {

        favoritos =
            favoritos.filter(f => f !== id);

    } else {

        favoritos.push(id);
    }

    salvarLocal(
        "itabusFavoritos",
        favoritos
    );

    renderizarLinhas();
}

function renderizarFavoritos() {

    const container =
        document.getElementById("listaFavoritos");

    if (!container) return;

    const favoritas =
        linhas.filter(
            linha => favoritos.includes(linha.id)
        );

    if (!favoritas.length) {

        container.innerHTML =
            "Nenhuma linha favoritada.";

        return;
    }

    container.innerHTML =
        favoritas.map(linha => `

            <div class="rota-completa">

                <strong>
                    ${linha.nome}
                </strong>

                <br>

                ${linha.descricao}

            </div>

        `).join("");
}

/* =========================
   CÁLCULO DE ROTA
========================= */

function usarLocalAtual() {

    if (!navigator.geolocation) {

        alert(
            "Seu navegador não suporta localização."
        );

        return;
    }

    navigator.geolocation.getCurrentPosition(

        function () {

            const origem =
                document.getElementById("origem");

            if (origem) {
                origem.value =
                    "Localização atual selecionada";
            }

        },

        function () {

            alert(
                "Não foi possível obter sua localização."
            );

        }

    );
}

function calcularRota() {

    const origem =
        document.getElementById("origem")?.value.trim();

    const destino =
        document.getElementById("destino")?.value.trim();

    const partida =
        document.getElementById("horarioPartida")?.value;

    const chegada =
        document.getElementById("horarioChegada")?.value;

    if (!origem || !destino) {

        alert(
            "Informe origem e destino."
        );

        return;
    }

    if (!partida && !chegada) {

        alert(
            "Informe pelo menos um horário."
        );

        return;
    }

    let horarioPartidaFinal =
        partida;

    let horarioChegadaFinal =
        chegada;

    if (partida && !chegada) {

        horarioChegadaFinal =
            somarMinutos(
                partida,
                40
            );
    }

    if (chegada && !partida) {

        horarioPartidaFinal =
            somarMinutos(
                chegada,
                -40
            );
    }

    document.getElementById(
        "partidaResultado"
    ).textContent =
        horarioPartidaFinal;

    document.getElementById(
        "chegadaResultado"
    ).textContent =
        horarioChegadaFinal;

    document.getElementById(
        "resultadoRota"
    ).style.display =
        "block";

    const linhaResultado =
        document.getElementById(
            "linhaResultado"
        );

    if (
        linhaResultado &&
        linhas.length
    ) {

        linhaResultado.textContent =
            linhas[0].nome;
    }
}

function somarMinutos(hora, minutos) {

    if (
        !hora ||
        !hora.includes(":")
    ) {

        return hora;
    }

    const partes =
        hora.split(":").map(Number);

    const h = partes[0];
    const m = partes[1];

    let total =
        h * 60 +
        m +
        minutos;

    total =
        ((total % 1440) + 1440) % 1440;

    const horas =
        Math.floor(total / 60)
            .toString()
            .padStart(2, "0");

    const minutosFinais =
        (total % 60)
            .toString()
            .padStart(2, "0");

    return horas + ":" + minutosFinais;
}

/* =========================
   MAPA
========================= */

function abrirMapaSelecao() {

    const modal =
        document.getElementById(
            "modalMapa"
        );

    if (modal) {
        modal.classList.add("abrir");
    }
}

function fecharMapa() {

    const modal =
        document.getElementById(
            "modalMapa"
        );

    if (modal) {
        modal.classList.remove("abrir");
    }
}

function selecionarPontoMapa(event) {

    const mapa =
        document.getElementById(
            "mapaSelecao"
        );

    const ponto =
        document.getElementById(
            "pontoSelecionado"
        );

    if (!mapa || !ponto) return;

    const rect =
        mapa.getBoundingClientRect();

    const x =
        event.clientX -
        rect.left;

    const y =
        event.clientY -
        rect.top;

    ponto.style.display =
        "block";

    ponto.style.left =
        (x - 10) + "px";

    ponto.style.top =
        (y - 10) + "px";

    campoMapaSelecionado =
        "Local selecionado no mapa";

    const texto =
        document.getElementById(
            "textoMapa"
        );

    if (texto) {
        texto.textContent =
            "Local selecionado.";
    }
}

function confirmarPontoMapa() {

    if (!campoMapaSelecionado) {

        alert(
            "Selecione um ponto no mapa."
        );

        return;
    }

    const origem =
        document.getElementById(
            "origem"
        );

    if (origem) {
        origem.value =
            campoMapaSelecionado;
    }

    fecharMapa();
}

/* =========================
   SISTEMA COLABORATIVO
========================= */

function carregarLinhasColaborativo() {

    const select =
        document.getElementById(
            "colabLinha"
        );

    if (!select) return;

    select.innerHTML =
        linhas.map(
            linha => `
                <option value="${linha.id}">
                    ${linha.nome}
                </option>
            `
        ).join("");
}

function enviarColaboracao() {

    const linha =
        document.getElementById(
            "colabLinha"
        )?.value;

    const horario =
        document.getElementById(
            "colabHorario"
        )?.value;

    const status =
        document.getElementById(
            "colabStatus"
        )?.value;

    if (!horario) {

        alert(
            "Informe o horário."
        );

        return;
    }

    informacoes.push({

        id: Date.now(),

        linha: linha,

        horario: horario,

        status: status,

        confirmada: false,

        confirmadaPor: ""

    });

    salvarLocal(
        "itabusInformacoes",
        informacoes
    );

    alert(
        "Informação enviada e aguardando confirmação de um administrador ou motorista."
    );

    renderizarComunidade();

    renderizarPendentes();
}

function renderizarComunidade() {

    const container =
        document.getElementById(
            "informacoesComunidade"
        );

    if (!container) return;

    container.innerHTML =
        linhas.map(linha => {

            const infos =
                informacoes.filter(
                    info =>
                        String(info.linha) ===
                        String(linha.id) &&
                        info.confirmada
                );

            return `

                <div class="notificacao">

                    <h3>
                        ${linha.nome}
                    </h3>

                    ${
                        infos.length

                        ?

                        infos
                            .map(info => `
                                <p>
                                    ${info.horario || "--:--"}
                                    -
                                    ${info.status}
                                </p>
                            `)
                            .join("")

                        :

                        "<p>Sem informações confirmadas.</p>"
                    }

                </div>

            `;

        }).join("");
}

function renderizarPendentes() {

    const el =
        document.getElementById(
            "listaPendentes"
        );

    if (!el) return;

    const pendentes =
        informacoes.filter(
            info => !info.confirmada
        );

    if (!pendentes.length) {

        el.innerHTML =
            "<p>Nenhuma informação pendente.</p>";

        return;
    }

    el.innerHTML =
        pendentes.map(info => {

            const linha =
                linhas.find(
                    x =>
                        String(x.id) ===
                        String(info.linha)
                );

            return `

                <div class="notificacao">

                    <h3>
                        ${linha
                            ? linha.nome
                            : "Linha"}
                    </h3>

                    <p>
                        ${info.horario || "--:--"}
                        -
                        ${info.status || "Sem informação"}
                    </p>

                    ${
                        tipoAcesso

                        ?

                        `
                        <button
                            class="btn-principal"
                            onclick="confirmarInformacao(${info.id})"
                        >
                            CONFIRMAR
                        </button>
                        `

                        :

                        `
                        <p>
                            Acesso restrito necessário
                            para confirmar.
                        </p>
                        `
                    }

                </div>

            `;

        }).join("");
}

function confirmarInformacao(id) {

    if (!tipoAcesso) {

        alert(
            "Faça login como administrador ou motorista para confirmar informações."
        );

        return;
    }

    const info =
        informacoes.find(
            x => x.id === id
        );

    if (!info) return;

    info.confirmada =
        true;

    info.confirmadaPor =
        tipoAcesso;

    salvarLocal(
        "itabusInformacoes",
        informacoes
    );

    renderizarPendentes();

    renderizarComunidade();

    alert(
        "Informação confirmada e publicada para os usuários."
    );
}

/* =========================
   ADMIN - PONTOS
========================= */

function adicionarCampoPonto() {

    const container =
        document.getElementById(
            "pontosAdmin"
        );

    if (!container) return;

    const div =
        document.createElement(
            "div"
        );

    div.className =
        "ponto-admin";

    div.innerHTML = `

        <input
            class="nomePonto"
            placeholder="Nome do ponto"
        >

        <label class="checkbox-principal">

            <input
                type="checkbox"
                class="pontoPrincipal"
            >

            Ponto principal

        </label>

    `;

    container.appendChild(div);
}

function atualizarTabelaPontos() {

    const corpo =
        document.getElementById(
            "corpoPontosPrincipais"
        );

    if (!corpo) return;

    const nomes =
        document.querySelectorAll(
            ".nomePonto"
        );

    const principais =
        document.querySelectorAll(
            ".pontoPrincipal"
        );

    corpo.innerHTML = "";

    nomes.forEach(
        (ponto, index) => {

            if (!ponto.value.trim()) {
                return;
            }

            corpo.innerHTML += `

                <tr>

                    <td>
                        ${ponto.value}
                    </td>

                    <td>
                        ${
                            principais[index].checked
                                ? "Sim"
                                : "Não"
                        }
                    </td>

                </tr>

            `;

        }
    );
}

function obterPontosPrincipaisAdmin() {

    const nomes =
        document.querySelectorAll(
            ".nomePonto"
        );

    const principais =
        document.querySelectorAll(
            ".pontoPrincipal"
        );

    const pontos = [];

    nomes.forEach(
        (ponto, i) => {

            if (
                ponto.value.trim() &&
                principais[i]?.checked
            ) {

                pontos.push(
                    ponto.value.trim()
                );

            }

        }
    );

    return pontos;
}

/* =========================
   TABELAS DE HORÁRIOS
========================= */

function gerarTabelaHorarios() {

    const pontosPrincipais =
        obterPontosPrincipaisAdmin();

    if (!pontosPrincipais.length) {

        alert(
            "Selecione pelo menos um ponto principal."
        );

        return;
    }

    const cabecalho =
        document.getElementById(
            "cabecalhoHorariosAdmin"
        );

    const tabela =
        document.getElementById(
            "tabelaHorariosAdmin"
        );

    if (!cabecalho || !tabela) {
        return;
    }

    cabecalho.innerHTML =
        `<tr>${
            pontosPrincipais
                .map(
                    p => `<th>${p}</th>`
                )
                .join("")
        }</tr>`;

    tabela.innerHTML = "";

    adicionarHorarios();
}

function adicionarHorarios(valores = []) {

    const colunas =
        document.querySelectorAll(
            "#cabecalhoHorariosAdmin th"
        );

    const tabela =
        document.getElementById(
            "tabelaHorariosAdmin"
        );

    if (!colunas.length || !tabela) {

        alert(
            "Primeiro crie a tabela."
        );

        return;
    }

    const tr =
        document.createElement(
            "tr"
        );

    for (
        let i = 0;
        i < colunas.length;
        i++
    ) {

        const td =
            document.createElement(
                "td"
            );

        const input =
            document.createElement(
                "input"
            );

        input.type =
            "time";

        input.value =
            valores[i] || "";

        if (i === 0) {

            input.addEventListener(
                "change",
                () =>
                    preencherSequencia(
                        tr
                    )
            );

        }

        td.appendChild(input);

        tr.appendChild(td);
    }

    tabela.appendChild(tr);

    if (
        valores.length &&
        valores[0]
    ) {

        preencherSequencia(
            tr,
            true
        );
    }
}

function preencherSequencia(
    tr,
    forcar = false
) {

    const linhasTabela =
        document.querySelectorAll(
            "#tabelaHorariosAdmin tr"
        );

    if (!linhasTabela.length) {
        return;
    }

    const primeiraLinha =
        linhasTabela[0];

    const base =
        primeiraLinha.querySelectorAll(
            "input[type='time']"
        );

    const atual =
        tr.querySelectorAll(
            "input[type='time']"
        );

    if (
        !base[0]?.value ||
        !atual[0]?.value
    ) {

        return;
    }

    const inicioBase =
        converterMinutos(
            base[0].value
        );

    const inicioAtual =
        converterMinutos(
            atual[0].value
        );

    for (
        let i = 1;
        i < base.length;
        i++
    ) {

        if (
            base[i].value &&
            (
                forcar ||
                !atual[i].value
            )
        ) {

            const diferenca =
                converterMinutos(
                    base[i].value
                ) -
                inicioBase;

            atual[i].value =
                converterHora(
                    inicioAtual +
                    diferenca
                );
        }
    }
}

function novaTabelaDia() {

    const dia =
        document.getElementById(
            "diaSemana"
        )?.value;

    if (!dia) return;

    document.getElementById(
        "cabecalhoHorariosAdmin"
    ).innerHTML = "";

    document.getElementById(
        "tabelaHorariosAdmin"
    ).innerHTML = "";

    delete tabelasPorDia[dia];

    gerarTabelaHorarios();
}

function carregarTabelaDia() {

    const dia =
        document.getElementById(
            "diaSemana"
        )?.value;

    const pontosPrincipais =
        obterPontosPrincipaisAdmin();

    const cabecalho =
        document.getElementById(
            "cabecalhoHorariosAdmin"
        );

    const tabela =
        document.getElementById(
            "tabelaHorariosAdmin"
        );

    if (!cabecalho || !tabela) {
        return;
    }

    if (!pontosPrincipais.length) {

        cabecalho.innerHTML = "";

        tabela.innerHTML = "";

        return;
    }

    cabecalho.innerHTML =
        `<tr>${
            pontosPrincipais
                .map(
                    p =>
                        `<th>${p}</th>`
                )
                .join("")
        }</tr>`;

    tabela.innerHTML = "";

    const dados =
        tabelasPorDia[dia] || [];

    if (dados.length) {

        dados.forEach(
            h => adicionarHorarios(h)
        );

    } else {

        adicionarHorarios();

    }
}

function converterMinutos(hora) {

    const partes =
        hora.split(":").map(Number);

    return (
        partes[0] * 60 +
        partes[1]
    );
}

function converterHora(minutos) {

    minutos =
        (
            (
                minutos % 1440
            ) +
            1440
        ) % 1440;

    const h =
        Math.floor(
            minutos / 60
        )
        .toString()
        .padStart(2, "0");

    const m =
        (
            minutos % 60
        )
        .toString()
        .padStart(2, "0");

    return h + ":" + m;
}

function salvarTabelaDia() {

    const dia =
        document.getElementById(
            "diaSemana"
        )?.value;

    const linhasTabela =
        document.querySelectorAll(
            "#tabelaHorariosAdmin tr"
        );

    const horarios = [];

    linhasTabela.forEach(
        tr => {

            const valores =
                Array.from(
                    tr.querySelectorAll(
                        "input[type='time']"
                    )
                ).map(
                    input =>
                        input.value
                );

            if (
                valores.some(Boolean)
            ) {

                horarios.push(
                    valores
                );
            }

        }
    );

    if (!horarios.length) {

        alert(
            "Adicione pelo menos um horário."
        );

        return;
    }

    tabelasPorDia[dia] =
        horarios;

    atualizarResumoTabelasDias();

    alert(
        "Tabela de " +
        dia +
        " salva."
    );
}

function atualizarResumoTabelasDias() {

    const el =
        document.getElementById(
            "tabelasDias"
        );

    if (!el) return;

    el.innerHTML =
        Object.keys(
            tabelasPorDia
        ).map(
            dia => `

                <div class="rota-completa">

                    <strong>
                        ${dia}
                    </strong>:

                    ${tabelasPorDia[dia].length}

                    sequência(s) de horários

                </div>

            `
        ).join("");
}

/* =========================
   SALVAR NOVA LINHA
========================= */

function salvarNovaLinha() {

    if (tipoAcesso !== "admin") {

        alert(
            "Apenas administradores podem editar rotas."
        );

        return;
    }

    const nome =
        document.getElementById(
            "adminNomeLinha"
        )?.value.trim();

    const descricao =
        document.getElementById(
            "adminDescricaoLinha"
        )?.value.trim();

    if (!nome || !descricao) {

        alert(
            "Preencha o nome e a descrição."
        );

        return;
    }

    const nomes =
        document.querySelectorAll(
            ".nomePonto"
        );

    const principais =
        document.querySelectorAll(
            ".pontoPrincipal"
        );

    const pontos = [];

    nomes.forEach(
        (ponto, i) => {

            if (ponto.value.trim()) {

                pontos.push({

                    nome:
                        ponto.value.trim(),

                    principal:
                        Boolean(
                            principais[i]?.checked
                        )

                });

            }

        }
    );

    if (!pontos.length) {

        alert(
            "Adicione pelo menos um ponto."
        );

        return;
    }

    if (
        !Object.keys(
            tabelasPorDia
        ).length
    ) {

        salvarTabelaDia();
    }

    const diasDisponiveis =
        Object.keys(
            tabelasPorDia
        );

    if (!diasDisponiveis.length) {

        alert(
            "Salve pelo menos uma tabela de horários."
        );

        return;
    }

    const primeiraTabela =
        tabelasPorDia[
            diasDisponiveis[0]
        ] || [];

    const novaLinha = {

        id: Date.now(),

        nome: nome,

        descricao: descricao,

        pontos: pontos,

        horarios:
            primeiraTabela,

        horariosPorDia:
            {
                ...tabelasPorDia
            }
    };

    linhas.push(
        novaLinha
    );

    salvarLocal(
        "itabusLinhas",
        linhas
    );

    alert(
        "Linha adicionada com sucesso!"
    );

    renderizarLinhas();

    carregarLinhasColaborativo();

    carregarLinhasNotificacao();

    document.getElementById(
        "adminNomeLinha"
    ).value = "";

    document.getElementById(
        "adminDescricaoLinha"
    ).value = "";

    document.getElementById(
        "pontosAdmin"
    ).innerHTML = `

        <div class="ponto-admin">

            <input
                class="nomePonto"
                placeholder="Nome do ponto"
            >

            <label
                class="checkbox-principal"
            >

                <input
                    type="checkbox"
                    class="pontoPrincipal"
                >

                Ponto principal

            </label>

        </div>

    `;

    document.getElementById(
        "cabecalhoHorariosAdmin"
    ).innerHTML = "";

    document.getElementById(
        "tabelaHorariosAdmin"
    ).innerHTML = "";

    tabelasPorDia = {};

    atualizarResumoTabelasDias();
}

function atualizarRotas() {

    if (tipoAcesso !== "admin") {
        return;
    }

    renderizarLinhas();

    alert(
        "Rotas atualizadas."
    );
}

/* =========================================================
   LOGIN
========================================================= */

function abrirLogin() {

    const modal =
        document.getElementById(
            "modalLogin"
        );

    if (modal) {
        modal.classList.add(
            "abrir"
        );
    }

    const usuario =
        document.getElementById(
            "usuarioAdmin"
        );

    const senha =
        document.getElementById(
            "senhaAdmin"
        );

    if (usuario) {
        usuario.value = "";
    }

    if (senha) {
        senha.value = "";
    }

    setTimeout(
        () => usuario?.focus(),
        50
    );
}

function fecharLogin() {

    document.getElementById(
        "modalLogin"
    )?.classList.remove(
        "abrir"
    );
}

/* =========================================================
   LOGIN DO ADMIN E DO MOTORISTA
========================================================= */

function fazerLogin() {

    const tipo =
        document.getElementById(
            "tipoUsuario"
        )?.value;

    const usuario =
        (
            document.getElementById(
                "usuarioAdmin"
            )?.value || ""
        )
        .trim()
        .toLowerCase();

    const senha =
        (
            document.getElementById(
                "senhaAdmin"
            )?.value || ""
        )
        .trim();

    const credenciais = {

        admin: {

            usuario: "admin",

            senha: "1234"

        },

        motorista: {

            usuario: "motorista",

            senha: "1234"

        }

    };

    const credencial =
        credenciais[tipo];

    if (
        !credencial ||
        usuario !== credencial.usuario ||
        senha !== credencial.senha
    ) {

        if (
            tipo ===
            "motorista"
        ) {

            alert(
                "Login de motorista inválido.\n\nUse:\nUsuário: motorista\nSenha: 1234"
            );

        } else {

            alert(
                "Usuário ou senha incorretos.\n\nAdministrador:\nUsuário: admin\nSenha: 1234"
            );

        }

        return false;
    }

    tipoAcesso =
        tipo;

    fecharLogin();

    mostrarAcessoRestrito();

    if (
        tipoAcesso ===
        "admin"
    ) {

        alert(
            "Modo administrador ativado!"
        );

    } else {

        alert(
            "Modo motorista ativado!"
        );

    }

    return true;
}

/* =========================================================
   CONTROLE DE ACESSO
========================================================= */

function mostrarAcessoRestrito() {

    document
        .querySelectorAll(".nav-admin")
        .forEach(
            botao => {
                botao.style.display =
                    "none";
            }
        );

    const sair =
        document.getElementById(
            "botaoSairRestrito"
        );

    if (sair) {

        sair.style.display =
            "block";

    }

    const navAdmin =
        document.getElementById(
            "navAdmin"
        );

    const navConfirmar =
        document.getElementById(
            "navConfirmar"
        );

    const navNotificacoes =
        document.getElementById(
            "navNotificacoes"
        );

    const areaAdmin =
        document.getElementById(
            "areaNotificacaoAdmin"
        );

    const areaMotorista =
        document.getElementById(
            "areaMotorista"
        );

    /* =========================
       ADMINISTRADOR
    ========================= */

    if (
        tipoAcesso ===
        "admin"
    ) {

        if (navAdmin) {

            navAdmin.style.display =
                "block";

        }

        if (navConfirmar) {

            navConfirmar.style.display =
                "block";

        }

        if (navNotificacoes) {

            navNotificacoes.style.display =
                "block";

        }

        if (areaAdmin) {

            areaAdmin.style.display =
                "block";

        }

        if (areaMotorista) {

            areaMotorista.style.display =
                "none";

        }

        carregarLinhasNotificacao();
    }

    /* =========================
       MOTORISTA
    ========================= */

    if (
        tipoAcesso ===
        "motorista"
    ) {

        /* Motorista NÃO edita rotas */

        if (navAdmin) {

            navAdmin.style.display =
                "none";

        }

        /* Motorista confirma informações */

        if (navConfirmar) {

            navConfirmar.style.display =
                "block";

        }

        /* Motorista solicita notificações */

        if (navNotificacoes) {

            navNotificacoes.style.display =
                "block";

        }

        if (areaAdmin) {

            areaAdmin.style.display =
                "none";

        }

        if (areaMotorista) {

            areaMotorista.style.display =
                "block";

        }
    }

    renderizarPendentes();

    renderizarSolicitacoes();

    renderizarNotificacoesAdmin();
}

function sairModoRestrito() {

    tipoAcesso =
        null;

    document
        .querySelectorAll(
            ".nav-admin"
        )
        .forEach(
            botao => {
                botao.style.display =
                    "none";
            }
        );

    const sair =
        document.getElementById(
            "botaoSairRestrito"
        );

    if (sair) {

        sair.style.display =
            "none";

    }

    const areaAdmin =
        document.getElementById(
            "areaNotificacaoAdmin"
        );

    const areaMotorista =
        document.getElementById(
            "areaMotorista"
        );

    if (areaAdmin) {

        areaAdmin.style.display =
            "none";

    }

    if (areaMotorista) {

        areaMotorista.style.display =
            "none";

    }

    const inicio =
        document.querySelector(
            "nav .nav-btn"
        );

    abrirTela(
        "inicio",
        inicio
    );

    alert(
        "Acesso restrito encerrado."
    );
}

function sairModoAdmin() {

    sairModoRestrito();
}

/* =========================================================
   NOTIFICAÇÕES
========================================================= */

function atualizarDestinoNotificacao() {

    const destino =
        document.getElementById(
            "destinoNotificacao"
        )?.value;

    const wrap =
        document.getElementById(
            "linhaNotificacaoWrap"
        );

    if (wrap) {

        wrap.style.display =
            destino === "linha"
                ? "block"
                : "none";

    }

    if (
        destino ===
        "linha"
    ) {

        carregarLinhasNotificacao();

    }
}

function carregarLinhasNotificacao() {

    const select =
        document.getElementById(
            "linhaNotificacao"
        );

    if (!select) return;

    select.innerHTML =
        linhas.map(
            linha => `

                <option
                    value="${linha.id}"
                >
                    ${linha.nome}
                </option>

            `
        ).join("");
}

function usarSugestaoNotificacao(texto) {

    const campo =
        document.getElementById(
            "textoNotificacao"
        );

    if (campo) {

        campo.value =
            texto;

    }
}

function publicarNotificacao() {

    if (
        tipoAcesso !==
        "admin"
    ) {

        alert(
            "Apenas administradores podem publicar notificações."
        );

        return;
    }

    const texto =
        document.getElementById(
            "textoNotificacao"
        )?.value.trim();

    if (!texto) {

        alert(
            "Digite ou selecione uma notificação."
        );

        return;
    }

    const destino =
        document.getElementById(
            "destinoNotificacao"
        )?.value ||
        "geral";

    const linhaId =
        destino === "linha"

            ?

            document.getElementById(
                "linhaNotificacao"
            )?.value || null

            :

            null;

    notificacoes.push({

        texto: texto,

        data: Date.now(),

        destino: destino,

        linhaId: linhaId

    });

    salvarLocal(
        "itabusNotificacoes",
        notificacoes
    );

    document.getElementById(
        "textoNotificacao"
    ).value = "";

    renderizarNotificacoesInicio();

    renderizarNotificacoesAdmin();

    alert(
        "Notificação publicada com sucesso."
    );
}

function renderizarNotificacoesAdmin() {

    const el =
        document.getElementById(
            "listaNotificacoesAdmin"
        );

    if (!el) return;

    const lista =
        [...notificacoes]
            .sort(
                (a, b) =>
                    (b.data || 0) -
                    (a.data || 0)
            );

    el.innerHTML =
        lista.length

        ?

        lista.map(
            n => {

                const linha =
                    n.linhaId

                        ?

                        linhas.find(
                            l =>
                                String(l.id) ===
                                String(n.linhaId)
                        )

                        :

                        null;

                const destino =
                    n.destino === "linha"

                        ?

                        (
                            linha
                                ? linha.nome
                                : "Linha específica"
                        )

                        :

                        "Todas as linhas";

                return `

                    <div class="notificacao">

                        <p>
                            <strong>
                                ${destino}
                            </strong>
                        </p>

                        <p>
                            ${n.texto}
                        </p>

                        <button
                            class="btn-secundario"
                            onclick="excluirNotificacao(${n.data})"
                        >
                            Excluir notificação
                        </button>

                    </div>

                `;
            }
        ).join("")

        :

        "<p>Nenhuma notificação publicada.</p>";
}

function excluirNotificacao(id) {

    if (
        tipoAcesso !==
        "admin"
    ) {

        alert(
            "Apenas administradores podem excluir notificações."
        );

        return;
    }

    const existe =
        notificacoes.some(
            n =>
                n.data === id
        );

    if (!existe) return;

    const confirmar =
        confirm(
            "Deseja excluir esta notificação?"
        );

    if (!confirmar) return;

    notificacoes =
        notificacoes.filter(
            n =>
                n.data !== id
        );

    salvarLocal(
        "itabusNotificacoes",
        notificacoes
    );

    renderizarNotificacoesInicio();

    renderizarNotificacoesAdmin();
}

/* =========================================================
   SOLICITAÇÃO DO MOTORISTA
========================================================= */

function solicitarNotificacao() {

    if (
        tipoAcesso !==
        "motorista"
    ) {

        alert(
            "Apenas motoristas podem enviar solicitações por esta área."
        );

        return;
    }

    const campo =
        document.getElementById(
            "solicitacaoMotorista"
        );

    const texto =
        campo?.value.trim();

    if (!texto) {

        alert(
            "Descreva a notificação solicitada."
        );

        return;
    }

    solicitacoesNotificacao.push({

        id: Date.now(),

        texto: texto,

        confirmada: false

    });

    salvarLocal(
        "itabusSolicitacoes",
        solicitacoesNotificacao
    );

    campo.value = "";

    renderizarSolicitacoes();

    alert(
        "Solicitação enviada para confirmação do administrador."
    );
}

function renderizarSolicitacoes() {

    const el =
        document.getElementById(
            "listaSolicitacoes"
        );

    if (!el) return;

    const pendentes =
        solicitacoesNotificacao.filter(
            s =>
                !s.confirmada
        );

    if (!pendentes.length) {

        el.innerHTML =
            "<p>Nenhuma solicitação pendente.</p>";

        return;
    }

    el.innerHTML =
        pendentes.map(
            s => `

                <div class="notificacao">

                    <p>
                        ${s.texto}
                    </p>

                    ${
                        tipoAcesso ===
                        "admin"

                        ?

                        `
                        <button
                            class="btn-principal"
                            onclick="confirmarSolicitacao(${s.id})"
                        >
                            CONFIRMAR
                        </button>
                        `

                        :

                        `
                        <small>
                            Aguardando confirmação do administrador.
                        </small>
                        `
                    }

                </div>

            `
        ).join("");
}

function confirmarSolicitacao(id) {

    if (
        tipoAcesso !==
        "admin"
    ) {

        alert(
            "Apenas administradores podem confirmar solicitações."
        );

        return;
    }

    const solicitacao =
        solicitacoesNotificacao.find(
            s =>
                s.id === id
        );

    if (!solicitacao) return;

    solicitacao.confirmada =
        true;

    salvarLocal(
        "itabusSolicitacoes",
        solicitacoesNotificacao
    );

    renderizarSolicitacoes();

    alert(
        "Solicitação confirmada."
    );
}

function renderizarNotificacoesInicio() {

    const container =
        document.getElementById(
            "notificacoesAdminInicio"
        );

    if (!container) return;

    if (!notificacoes.length) {

        container.innerHTML = "";

        return;
    }

    const recentes =
        [...notificacoes]
            .sort(
                (a, b) =>
                    (b.data || 0) -
                    (a.data || 0)
            );

    container.innerHTML =
        recentes.map(
            n => {

                const linha =
                    n.linhaId

                        ?

                        linhas.find(
                            l =>
                                String(l.id) ===
                                String(n.linhaId)
                        )

                        :

                        null;

                const destino =
                    n.destino === "linha"

                        ?

                        (
                            linha
                                ? linha.nome
                                : "Linha específica"
                        )

                        :

                        "Todas as linhas";

                const data =
                    n.data

                        ?

                        new Date(
                            n.data
                        ).toLocaleString(
                            "pt-BR"
                        )

                        :

                        "";

                return `

                    <div class="notificacao">

                        <h3>
                            Notificação do sistema
                        </h3>

                        <p>
                            <strong>
                                ${destino}
                            </strong>
                        </p>

                        <p>
                            ${n.texto}
                        </p>

                        ${
                            data

                                ?

                                `
                                <small>
                                    Publicada em ${data}
                                </small>
                                `

                                :

                                ""
                        }

                    </div>

                `;
            }
        ).join("");
}

/* =========================
   ACESSIBILIDADE
========================= */

function alterarFonte(valor) {

    tamanhoFonte += valor;

    if (tamanhoFonte < 13) {
        tamanhoFonte = 13;
    }

    if (tamanhoFonte > 24) {
        tamanhoFonte = 24;
    }

    document.body.style.fontSize =
        tamanhoFonte + "px";
}

function altoContraste() {

    document.body.classList.toggle(
        "alto-contraste"
    );
}

function lerPagina() {

    if (
        !(
            "speechSynthesis"
            in window
        )
    ) {

        alert(
            "Seu navegador não suporta leitura de tela."
        );

        return;
    }

    window.speechSynthesis.cancel();

    const ativa =
        document.querySelector(
            ".tela.ativa"
        );

    const texto =
        ativa?.innerText ||
        document.body.innerText;

    const fala =
        new SpeechSynthesisUtterance(
            texto
        );

    fala.lang =
        "pt-BR";

    window.speechSynthesis.speak(
        fala
    );
}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderizarLinhas();

        carregarLinhasColaborativo();

        renderizarComunidade();

        renderizarNotificacoesInicio();

        renderizarNotificacoesAdmin();

        atualizarResumoTabelasDias();

        const senha =
            document.getElementById(
                "senhaAdmin"
            );

        const usuario =
            document.getElementById(
                "usuarioAdmin"
            );

        if (senha) {

            senha.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        fazerLogin();
                    }
                }
            );
        }

        if (usuario) {

            usuario.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        fazerLogin();
                    }
                }
            );
        }

    }
);