/* =========================================================
   ITABUS - SISTEMA DE TRANSPORTE PÚBLICO INTELIGENTE
   MOTOR JAVASCRIPT PRINCIPAL V3
   ========================================================= */

/* =========================================================
   1. DADOS INICIAIS E PONTOS REAIS DE ITAPETININGA (SP)
   ========================================================= */

const CENTRO_ITAPETININGA = [-23.5898, -48.0535];

// Linhas com paradas reais georreferenciadas nas ruas de Itapetininga
const linhasPadraoItapetininga = [
    {
        id: 1,
        nome: "LINHA 001",
        descricao: "Terminal Central ⇄ Vila Rio Branco (via Hospital Regional)",
        cor: "#2563eb",
        ativa: true,
        pontos: [
            { nome: "Terminal Central", lat: -23.5878, lng: -48.0495, principal: true },
            { nome: "Praça Marechal Deodoro (Peixoto Gomide)", lat: -23.5898, lng: -48.0535, principal: false },
            { nome: "Hospital Regional Dr. Léo Orsi Bernardes", lat: -23.5930, lng: -48.0520, principal: true },
            { nome: "Av. Cinco de Novembro", lat: -23.5960, lng: -48.0570, principal: false },
            { nome: "Vila Rio Branco (Ponto Final)", lat: -23.5995, lng: -48.0620, principal: true }
        ],
        horarios: {
            "Segunda a sexta": [
                "05:30", "06:10", "06:45", "07:15", "07:45", "08:15", "08:50", "09:30",
                "10:15", "11:00", "11:45", "12:30", "13:15", "14:00", "14:45", "15:30",
                "16:15", "17:00", "17:35", "18:10", "18:45", "19:25", "20:30", "21:40", "22:50"
            ],
            "Sábado": [
                "06:00", "07:00", "08:00", "09:15", "10:30", "11:45", "13:00", "14:30",
                "16:00", "17:30", "19:00", "20:30", "22:00"
            ],
            "Domingo / Feriado": [
                "06:30", "08:00", "09:30", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"
            ]
        }
    },
    {
        id: 2,
        nome: "LINHA 002",
        descricao: "Terminal Central ⇄ Jardim Colombo (via Centro)",
        cor: "#059669",
        ativa: true,
        pontos: [
            { nome: "Terminal Central", lat: -23.5878, lng: -48.0495, principal: true },
            { nome: "Rua Campos Salles", lat: -23.5885, lng: -48.0540, principal: false },
            { nome: "Praça dos Três Poderes", lat: -23.5855, lng: -48.0565, principal: false },
            { nome: "Av. Wenceslau Braz", lat: -23.5950, lng: -48.0510, principal: false },
            { nome: "Jardim Colombo (Ponto Final)", lat: -23.6025, lng: -48.0480, principal: true }
        ],
        horarios: {
            "Segunda a sexta": [
                "05:50", "06:30", "07:10", "07:50", "08:35", "09:20", "10:10", "11:00",
                "11:50", "12:40", "13:30", "14:20", "15:10", "16:00", "16:50", "17:35",
                "18:20", "19:10", "20:10", "21:20", "22:40"
            ],
            "Sábado": [
                "06:20", "07:30", "08:45", "10:00", "11:30", "13:00", "14:30", "16:00",
                "17:30", "19:00", "21:00"
            ],
            "Domingo / Feriado": [
                "07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"
            ]
        }
    },
    {
        id: 3,
        nome: "LINHA 003",
        descricao: "Vila Alvorada ⇄ Rodoviária de Itapetininga",
        cor: "#d97706",
        ativa: true,
        pontos: [
            { nome: "Vila Alvorada (Início)", lat: -23.5780, lng: -48.0350, principal: true },
            { nome: "Mercado Municipal", lat: -23.5860, lng: -48.0510, principal: false },
            { nome: "Terminal Central", lat: -23.5878, lng: -48.0495, principal: true },
            { nome: "Rodoviária de Itapetininga", lat: -23.5830, lng: -48.0460, principal: true }
        ],
        horarios: {
            "Segunda a sexta": [
                "06:00", "06:40", "07:20", "08:00", "08:50", "09:40", "10:40", "11:40",
                "12:40", "13:40", "14:40", "15:40", "16:40", "17:25", "18:10", "19:00", "20:30", "22:00"
            ],
            "Sábado": [
                "06:30", "07:45", "09:00", "10:30", "12:00", "14:00", "16:00", "18:00", "20:00"
            ],
            "Domingo / Feriado": [
                "07:30", "09:30", "12:00", "15:00", "18:00", "20:30"
            ]
        }
    },
    {
        id: 4,
        nome: "LINHA 004",
        descricao: "Bairro Chapadinha ⇄ Universidades (FATEC & IFSP)",
        cor: "#7c3aed",
        ativa: true,
        pontos: [
            { nome: "Bairro Chapadinha", lat: -23.6120, lng: -48.0410, principal: true },
            { nome: "Shopping Itapetininga", lat: -23.6050, lng: -48.0440, principal: true },
            { nome: "Terminal Central", lat: -23.5878, lng: -48.0495, principal: true },
            { nome: "Fatec Itapetininga", lat: -23.5750, lng: -48.0580, principal: true },
            { nome: "IFSP - Campus Itapetininga", lat: -23.5710, lng: -48.0610, principal: true }
        ],
        horarios: {
            "Segunda a sexta": [
                "06:15", "06:45", "07:10", "07:40", "08:20", "09:10", "10:20", "11:30",
                "12:20", "13:10", "14:15", "15:30", "16:40", "17:15", "17:50", "18:30",
                "19:15", "20:20", "21:35", "22:45"
            ],
            "Sábado": [
                "07:00", "08:30", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"
            ],
            "Domingo / Feriado": [
                "08:00", "10:30", "13:30", "16:30", "19:30"
            ]
        }
    },
    {
        id: 5,
        nome: "LINHA 005",
        descricao: "Terminal Central ⇄ Vila Mazzei",
        cor: "#dc2626",
        ativa: true,
        pontos: [
            { nome: "Terminal Central", lat: -23.5878, lng: -48.0495, principal: true },
            { nome: "Rua Monsenhor Soares", lat: -23.5880, lng: -48.0550, principal: false },
            { nome: "Praça dos Três Poderes", lat: -23.5855, lng: -48.0565, principal: false },
            { nome: "Vila Mazzei (Ponto Final)", lat: -23.5800, lng: -48.0680, principal: true }
        ],
        horarios: {
            "Segunda a sexta": [
                "06:10", "07:00", "07:45", "08:30", "09:30", "11:00", "12:30", "14:00",
                "15:30", "16:45", "17:35", "18:25", "19:25", "20:45", "22:15"
            ],
            "Sábado": [
                "06:45", "08:15", "10:00", "12:00", "14:00", "16:30", "19:00", "21:30"
            ],
            "Domingo / Feriado": [
                "07:15", "09:45", "12:30", "15:30", "18:30"
            ]
        }
    }
];

const notificacoesOficiaisPadrao = [
    {
        id: 101,
        destino: "geral",
        texto: "Atenção passageiros: Todas as linhas estão operando com tabela normal e acompanhamento por GPS nas vias.",
        data: new Date(Date.now() - 3600000 * 2).toISOString(),
        bannerUrgente: false,
        validadaInicio: true
    },
    {
        id: 102,
        destino: "LINHA 002",
        texto: "Obras viárias na Rua Campos Salles. Linhas 002 e 004 efetuando desvio temporário pela Av. Peixoto Gomide.",
        data: new Date(Date.now() - 3600000 * 4).toISOString(),
        bannerUrgente: true,
        validadaInicio: true
    }
];

const relatosComunidadePadrao = [
    {
        id: 201,
        linha: "LINHA 001",
        status: "Ônibus Quebrado",
        ponto: "Próximo ao Hospital Regional Dr. Léo Orsi Bernardes",
        detalhes: "Ônibus parou na faixa da direita com problema mecânico. Carro reserva já a caminho.",
        horario: "08:15",
        data: new Date(Date.now() - 15 * 60000).toISOString(),
        confirmado: true,
        votosPositivos: 18,
        votosNegativos: 1,
        votadoUsuario: null
    },
    {
        id: 202,
        linha: "LINHA 004",
        status: "Atrasado (+15 min)",
        ponto: "Shopping Itapetininga sentido Universidades",
        detalhes: "Fluxo intenso de veículos e semáforo em manutenção.",
        horario: "08:25",
        data: new Date(Date.now() - 25 * 60000).toISOString(),
        confirmado: true,
        votosPositivos: 12,
        votosNegativos: 2,
        votadoUsuario: null
    },
    {
        id: 203,
        linha: "LINHA 002",
        status: "No Horário / Tranquilo",
        ponto: "Terminal Central",
        detalhes: "Partida pontual, ônibus confortável e com lugares sentados.",
        horario: "08:35",
        data: new Date(Date.now() - 10 * 60000).toISOString(),
        confirmado: true,
        votosPositivos: 6,
        votosNegativos: 0,
        votadoUsuario: null
    }
];

/* =========================================================
   2. ESTADO GLOBAL DO APLICATIVO E PERSISTÊNCIA
   ========================================================= */

function carregarStorage(chave, padrao) {
    try {
        const item = localStorage.getItem(chave);
        return item ? JSON.parse(item) : padrao;
    } catch (e) {
        console.warn(`Erro lendo localStorage ${chave}:`, e);
        return padrao;
    }
}

function salvarStorage(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
    } catch (e) {
        console.error(`Erro salvando localStorage ${chave}:`, e);
    }
}

let linhas = carregarStorage("itabus_linhas_v3", linhasPadraoItapetininga);
let notificacoes = carregarStorage("itabus_notificacoes_v3", notificacoesOficiaisPadrao);
let relatosComunidade = carregarStorage("itabus_relatos_v3", relatosComunidadePadrao);
let favoritos = carregarStorage("itabus_favoritos_v3", [1, 4]);
let favoritosUsuariosStats = carregarStorage("itabus_fav_stats_v3", { "1": 142, "2": 89, "3": 65, "4": 178, "5": 44 });

let sessaoAdmin = sessionStorage.getItem("itabus_admin_logado") === "true";
let admVisaoPassageiroAtiva = carregarStorage("itabus_adm_visao_pass", false); // controla o olho do ADM
let linhaSelecionadaIndex = 0;
let tamanhoFonte = 15;
let campoAlvoMapa = null; // 'origem' ou 'destino'
let modoCalculoHorario = "chegada"; // 'chegada' (vital!) ou 'partida'

/* Instâncias dos Mapas Leaflet */
let mapPrincipal = null;
let mapRota = null;
let mapAdmin = null;

let camadasLinhaPrincipal = [];
let marcadoresOnibus = [];
let animacaoOnibusInterval = null;
let camadaSateliteAtiva = false;
let tilesRuasPrincipal = null;
let tilesSatelitePrincipal = null;

// Cache de geometria de ruas (OSRM)
const cacheGeometriaRuas = {};

// Dados meteorológicos
let dadosClimaAtuais = null;

/* =========================================================
   3. CONTROLE DE NAVEGAÇÃO E VISÃO DO ADM (ÍCONE DE OLHO)
   ========================================================= */

function abrirTela(id, botao) {
    document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
    const tela = document.getElementById(id);
    if (!tela) return;
    tela.classList.add("ativa");

    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("ativo"));
    if (botao) {
        botao.classList.add("ativo");
    }

    if (id === "inicio") {
        renderizarInicio();
    } else if (id === "linhas") {
        renderizarLinhas();
        setTimeout(() => {
            if (mapPrincipal) {
                mapPrincipal.invalidateSize();
                destacarLinhaNoMapa(linhas[linhaSelecionadaIndex]);
            }
        }, 150);
    } else if (id === "calcular") {
        setTimeout(() => {
            if (mapRota) mapRota.invalidateSize();
        }, 150);
    } else if (id === "colaborativo") {
        preencherSelectLinhasColaborativo();
        renderizarComunidade();
    } else if (id === "favoritos") {
        renderizarFavoritos();
    } else if (id === "adminDashboard") {
        if (!verificarPermissaoAdmin()) return;
        renderizarDashboardAdmin();
    } else if (id === "gestao") {
        if (!verificarPermissaoAdmin()) return;
        renderizarGestaoLinhas();
        setTimeout(() => {
            if (mapAdmin) mapAdmin.invalidateSize();
        }, 150);
    } else if (id === "confirmacoes") {
        if (!verificarPermissaoAdmin()) return;
        renderizarModeracaoRelatos();
    } else if (id === "notificacoesRestritas") {
        if (!verificarPermissaoAdmin()) return;
        renderizarNotificacoesAdmin();
    } else if (id === "favoritosUsuarios") {
        if (!verificarPermissaoAdmin()) return;
        renderizarEstatisticasFavoritos();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function verificarPermissaoAdmin() {
    if (!sessaoAdmin) {
        mostrarToast("Acesso restrito a Administradores. Por favor faça login.", "warning");
        abrirLogin();
        return false;
    }
    return true;
}

// Alternar a visão dos menus comuns para o ADM (ícone de olho)
function alternarVisaoPassageiro() {
    admVisaoPassageiroAtiva = !admVisaoPassageiroAtiva;
    salvarStorage("itabus_adm_visao_pass", admVisaoPassageiroAtiva);
    aplicarVisaoMenusADM();

    if (admVisaoPassageiroAtiva) {
        mostrarToast("Menus de passageiro visíveis! (Modo pré-visualização)", "info");
    } else {
        mostrarToast("Menus de passageiro ocultados. Modo ADM focado.", "info");
    }
}

function aplicarVisaoMenusADM() {
    const menuComum = document.getElementById("menuUsuarioComum");
    const iconeOlho = document.getElementById("iconeOlho");
    const labelOlhoBanner = document.getElementById("labelOlhoBanner");

    if (!sessaoAdmin) {
        // Usuário normal: menus comuns SEMPRE visíveis
        if (menuComum) menuComum.style.display = "flex";
        return;
    }

    // ADM logado:
    if (admVisaoPassageiroAtiva) {
        if (menuComum) menuComum.style.display = "flex";
        if (iconeOlho) {
            iconeOlho.className = "fa-solid fa-eye-slash";
        }
        if (labelOlhoBanner) labelOlhoBanner.innerText = "Ocultar Menus Comuns";
    } else {
        if (menuComum) menuComum.style.display = "none";
        if (iconeOlho) {
            iconeOlho.className = "fa-solid fa-eye";
        }
        if (labelOlhoBanner) labelOlhoBanner.innerText = "Ver Menus de Passageiro";
    }
}

/* =========================================================
   4. ROTEAMENTO VIÁRIO PELAS RUAS REAIS (OSRM API)
   ========================================================= */

// Busca o traçado pelas ruas reais de Itapetininga usando a API aberta OSRM
async function obterGeometriaRuas(pontos, linhaId = null) {
    const cacheKey = linhaId ? `linha_${linhaId}` : pontos.map(p => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`).join(";");

    if (cacheGeometriaRuas[cacheKey]) {
        return cacheGeometriaRuas[cacheKey];
    }

    // Monta a URL de waypoints OSRM no formato {lng},{lat};{lng},{lat}
    const coordsStr = pontos.map(p => `${p.lng},${p.lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("OSRM indisponível");
        const data = await response.json();

        if (data.routes && data.routes[0] && data.routes[0].geometry) {
            // OSRM retorna [lng, lat], Leaflet espera [lat, lng]
            const coordsLeaflet = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            cacheGeometriaRuas[cacheKey] = coordsLeaflet;
            return coordsLeaflet;
        }
    } catch (err) {
        console.warn("Aviso: Traçado OSRM indisponível, usando interpolação viária local:", err);
    }

    // Fallback: Interpolação suave entre os pontos
    const fallback = [];
    for (let i = 0; i < pontos.length - 1; i++) {
        const p1 = pontos[i];
        const p2 = pontos[i + 1];
        fallback.push([p1.lat, p1.lng]);
        // Ponto intermediário simulando traçado urbano
        const midLat = (p1.lat + p2.lat) / 2;
        const midLng = (p1.lng + p2.lng) / 2;
        fallback.push([midLat, midLng]);
    }
    const ultimo = pontos[pontos.length - 1];
    fallback.push([ultimo.lat, ultimo.lng]);

    cacheGeometriaRuas[cacheKey] = fallback;
    return fallback;
}

/* =========================================================
   5. INICIALIZAÇÃO DE MAPAS (LEAFLET)
   ========================================================= */

function inicializarMapas() {
    // 1. Mapa Principal (Linhas & Rotas)
    const elMapPrincipal = document.getElementById("mapaPrincipal");
    if (elMapPrincipal && !mapPrincipal) {
        mapPrincipal = L.map("mapaPrincipal", {
            center: CENTRO_ITAPETININGA,
            zoom: 14,
            zoomControl: true
        });

        tilesRuasPrincipal = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(mapPrincipal);

        tilesSatelitePrincipal = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
            maxZoom: 19,
            attribution: "Esri World Imagery"
        });

        mapPrincipal.on("click", function(e) {
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`<div style="font-size:13px; font-weight:600;">Rua/Local: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}</div>`)
                .openOn(mapPrincipal);
        });
    }

    // 2. Mapa do Roteador Inteligente
    const elMapRota = document.getElementById("mapaRota");
    if (elMapRota && !mapRota) {
        mapRota = L.map("mapaRota", {
            center: CENTRO_ITAPETININGA,
            zoom: 13,
            zoomControl: true
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(mapRota);

        mapRota.on("click", function(e) {
            tratarCliqueMapaRoteador(e.latlng);
        });
    }

    // 3. Mapa de Captura de Coordenadas do Admin
    const elMapAdmin = document.getElementById("mapaAdminPontos");
    if (elMapAdmin && !mapAdmin) {
        mapAdmin = L.map("mapaAdminPontos", {
            center: CENTRO_ITAPETININGA,
            zoom: 13,
            zoomControl: true
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(mapAdmin);

        mapAdmin.on("click", function(e) {
            tratarCliqueMapaAdmin(e.latlng);
        });
    }

    iniciarSimulacaoOnibusGPS();
}

function alternarCamadaSatelite() {
    if (!mapPrincipal) return;
    camadaSateliteAtiva = !camadaSateliteAtiva;
    const btn = document.getElementById("btnCamadaMapa");

    if (camadaSateliteAtiva) {
        mapPrincipal.removeLayer(tilesRuasPrincipal);
        tilesSatelitePrincipal.addTo(mapPrincipal);
        if (btn) btn.innerHTML = `<i class="fa-solid fa-map"></i> Mapa Ruas`;
    } else {
        mapPrincipal.removeLayer(tilesSatelitePrincipal);
        tilesRuasPrincipal.addTo(mapPrincipal);
        if (btn) btn.innerHTML = `<i class="fa-solid fa-layer-group"></i> Satélite`;
    }
}

function centralizarMapaGeral() {
    if (mapPrincipal) {
        mapPrincipal.setView(CENTRO_ITAPETININGA, 13);
    }
}

/* =========================================================
   6. SIMULAÇÃO DE GPS PELAS RUAS REAIS (TELEMETRIA AO VIVO)
   ========================================================= */

async function iniciarSimulacaoOnibusGPS() {
    if (animacaoOnibusInterval) clearInterval(animacaoOnibusInterval);

    // Carrega o traçado detalhado das ruas para cada linha
    marcadoresOnibus = [];

    for (let idx = 0; idx < linhas.length; idx++) {
        const linha = linhas[idx];
        const rotaCoordsRuas = await obterGeometriaRuas(linha.pontos, linha.id);
        const startPos = rotaCoordsRuas[0] || CENTRO_ITAPETININGA;

        const customIcon = L.divIcon({
            className: "custom-bus-marker",
            html: `<div class="bus-marker-pin" style="border-color:${linha.cor}; color:${linha.cor};" title="${linha.nome}">
                     <i class="fa-solid fa-bus"></i>
                   </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker(startPos, { icon: customIcon });

        marcadoresOnibus.push({
            linhaId: linha.id,
            linhaNome: linha.nome,
            cor: linha.cor,
            marker: marker,
            rotaCoords: rotaCoordsRuas,
            coordIndex: Math.floor((rotaCoordsRuas.length / linhas.length) * idx),
            velocidade: Math.floor(Math.random() * 12) + 26
        });
    }

    animacaoOnibusInterval = setInterval(() => {
        atualizarPosicoesOnibus();
    }, 2000);
}

function atualizarPosicoesOnibus() {
    if (!mapPrincipal) return;

    marcadoresOnibus.forEach(bus => {
        if (!bus.rotaCoords || bus.rotaCoords.length < 2) return;

        // Avança de coordenada em coordenada ao longo das curvas das ruas
        bus.coordIndex = (bus.coordIndex + 1) % bus.rotaCoords.length;
        const pos = bus.rotaCoords[bus.coordIndex];

        bus.marker.setLatLng(pos);

        const popupContent = `
            <div style="font-family:'Inter',sans-serif; min-width:160px;">
                <div style="font-weight:800; color:${bus.cor}; font-size:14px; margin-bottom:4px;">
                    <i class="fa-solid fa-bus"></i> ${bus.linhaNome}
                </div>
                <div style="font-size:12px; color:#475569;">
                    <strong>Velocidade:</strong> ${bus.velocidade} km/h nas ruas<br>
                    <strong>Posição:</strong> GPS em Tempo Real
                </div>
            </div>
        `;
        bus.marker.bindPopup(popupContent);
    });
}

/* =========================================================
   7. WIDGET DE CLIMA EM TEMPO REAL (OPEN-METEO API)
   ========================================================= */

async function carregarClimaItapetininga() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=-23.5898&longitude=-48.0535&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&timezone=America%2FSao_Paulo`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro na requisição do clima");
        const data = await res.json();
        dadosClimaAtuais = data;
        atualizarInterfaceClima(data);
    } catch (e) {
        console.warn("Clima offline, aplicando estimativa local:", e);
        // Fallback elegante
        dadosClimaAtuais = {
            current: {
                temperature_2m: 24,
                apparent_temperature: 25,
                relative_humidity_2m: 65,
                precipitation: 0,
                weather_code: 1,
                wind_speed_10m: 12
            }
        };
        atualizarInterfaceClima(dadosClimaAtuais);
    }
}

function decodificarWeatherCode(code) {
    if (code === 0) return { desc: "Céu Limpo", icon: "fa-sun", color: "#f59e0b" };
    if (code === 1 || code === 2) return { desc: "Parcialmente Nublado", icon: "fa-cloud-sun", color: "#f59e0b" };
    if (code === 3) return { desc: "Nublado", icon: "fa-cloud", color: "#64748b" };
    if (code >= 45 && code <= 48) return { desc: "Nevoeiro", icon: "fa-smog", color: "#94a3b8" };
    if (code >= 51 && code <= 67) return { desc: "Chuva Leve", icon: "fa-cloud-rain", color: "#3b82f6" };
    if (code >= 71 && code <= 77) return { desc: "Geada / Frio Intenso", icon: "fa-snowflake", color: "#06b6d4" };
    if (code >= 80 && code <= 82) return { desc: "Pancadas de Chuva", icon: "fa-cloud-showers-heavy", color: "#2563eb" };
    if (code >= 95) return { desc: "Tempestade", icon: "fa-cloud-bolt", color: "#dc2626" };
    return { desc: "Tempo Agradável", icon: "fa-sun", color: "#f59e0b" };
}

function atualizarInterfaceClima(data) {
    if (!data || !data.current) return;

    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const climaInfo = decodificarWeatherCode(code);

    // Widget Header
    const elTemp = document.getElementById("weatherTemp");
    const elDesc = document.getElementById("weatherDesc");
    const elIcon = document.getElementById("weatherIcon");

    if (elTemp) elTemp.innerText = `${temp}°C`;
    if (elDesc) elDesc.innerText = climaInfo.desc;
    if (elIcon) elIcon.innerHTML = `<i class="fa-solid ${climaInfo.icon}" style="color:${climaInfo.color};"></i>`;

    // Pill no Hero da Home
    const elPill = document.getElementById("heroClimaPill");
    if (elPill) elPill.innerHTML = `<i class="fa-solid ${climaInfo.icon}"></i> ${temp}°C • ${climaInfo.desc}`;

    // Dica na Sidebar
    const tipMsg = document.getElementById("sidebarWeatherTipMsg");
    if (tipMsg) {
        if (code >= 51) {
            tipMsg.innerText = "🌧️ Chuva prevista: leve guarda-chuva para o ponto e saia com antecedência!";
        } else if (temp >= 28) {
            tipMsg.innerText = "☀️ Dia quente em Itapetininga: hidrate-se e prefira linhas climatizadas.";
        } else {
            tipMsg.innerText = "⛅ Tempo agradável: condições ideais para deslocamento na cidade.";
        }
    }
}

function abrirDetalhesClima() {
    if (!dadosClimaAtuais || !dadosClimaAtuais.current) return;
    const cur = dadosClimaAtuais.current;
    const temp = Math.round(cur.temperature_2m);
    const sensacao = Math.round(cur.apparent_temperature);
    const umidade = cur.relative_humidity_2m;
    const vento = Math.round(cur.wind_speed_10m);
    const code = cur.weather_code;
    const info = decodificarWeatherCode(code);

    const body = document.getElementById("modalWeatherBody");
    if (body) {
        body.innerHTML = `
            <div style="text-align:center; margin-bottom:16px;">
                <div style="font-size:36px; font-weight:800; color:var(--text-primary);">${temp}°C</div>
                <div style="font-size:15px; color:var(--text-secondary);">${info.desc} • Itapetininga/SP</div>
            </div>

            <div class="weather-grid-metrics">
                <div class="weather-metric-box">
                    <i class="fa-solid fa-temperature-three-quarters"></i>
                    <div>
                        <strong>${sensacao}°C</strong>
                        <span>Sensação Térmica</span>
                    </div>
                </div>
                <div class="weather-metric-box">
                    <i class="fa-solid fa-droplet"></i>
                    <div>
                        <strong>${umidade}%</strong>
                        <span>Umidade do Ar</span>
                    </div>
                </div>
                <div class="weather-metric-box">
                    <i class="fa-solid fa-wind"></i>
                    <div>
                        <strong>${vento} km/h</strong>
                        <span>Velocidade do Vento</span>
                    </div>
                </div>
                <div class="weather-metric-box">
                    <i class="fa-solid fa-cloud-rain"></i>
                    <div>
                        <strong>${cur.precipitation || 0} mm</strong>
                        <span>Precipitação Atual</span>
                    </div>
                </div>
            </div>

            <div class="weather-tip-box">
                <i class="fa-solid fa-bus-simple" style="font-size:20px;"></i>
                <div>
                    <strong>Impacto no Transporte Público:</strong>
                    <span>${code >= 51 ? 'Pistas molhadas e trânsito mais cauteloso. Considere 10 a 15 minutos extras de margem para seu trajeto.' : 'Vias com boa fluidez em Itapetininga. Linhas de ônibus com pontualidade esperada.'}</span>
                </div>
            </div>
        `;
    }

    const modal = document.getElementById("modalClima");
    if (modal) modal.style.display = "flex";
}

function fecharDetalhesClima() {
    const modal = document.getElementById("modalClima");
    if (modal) modal.style.display = "none";
}

/* =========================================================
   8. TELA INICIAL
   ========================================================= */

function renderizarInicio() {
    const elTotal = document.getElementById("homeTotalLinhas");
    if (elTotal) elTotal.innerText = linhas.length;

    const elAlertas = document.getElementById("homeAlertasAtivos");
    const alertasValidados = relatosComunidade.filter(r => r.confirmado);
    if (elAlertas) elAlertas.innerText = alertasValidados.length;

    const agora = new Date();
    const horaFormat = agora.toTimeString().substring(0, 5);
    const diaNome = obterDiaSemanaAtual();

    let proxima = "23:59";
    linhas.forEach(l => {
        const hList = (l.horarios && l.horarios[diaNome]) || [];
        const achou = hList.find(h => h >= horaFormat);
        if (achou && achou < proxima) proxima = achou;
    });
    const elProx = document.getElementById("homeProximaSaida");
    if (elProx) elProx.innerText = proxima === "23:59" ? "--:--" : proxima;

    const urgente = notificacoes.find(n => n.bannerUrgente);
    const topBanner = document.getElementById("topBannerAlerta");
    const topBannerTexto = document.getElementById("topBannerTexto");
    if (urgente && topBanner && topBannerTexto) {
        topBannerTexto.innerText = urgente.texto;
        topBanner.style.display = "block";
    }

    const containerNotif = document.getElementById("notificacoesAdminInicio");
    if (containerNotif) {
        const visiveis = notificacoes.filter(n => n.validadaInicio !== false);
        if (!visiveis.length) {
            containerNotif.innerHTML = `<p class="text-muted" style="grid-column: 1/-1;">Nenhum comunicado oficial no momento.</p>`;
        } else {
            containerNotif.innerHTML = visiveis.slice(0, 4).map(n => {
                const tempoRelativo = formatarTempoRelativo(n.data);
                return `
                    <div class="notificacao-card-home ${n.bannerUrgente ? 'urgente' : ''}">
                        <div class="notif-home-header">
                            <span class="notif-tag">${n.destino === 'geral' ? 'Geral' : n.destino}</span>
                            <span class="notif-time"><i class="fa-regular fa-clock"></i> ${tempoRelativo}</span>
                        </div>
                        <p class="notif-text">${n.texto}</p>
                    </div>
                `;
            }).join("");
        }
    }

    const containerPartidas = document.getElementById("homePartidasImediatas");
    if (containerPartidas) {
        const partidas = [];
        linhas.forEach(linha => {
            const hList = (linha.horarios && linha.horarios[diaNome]) || [];
            const proximo = hList.find(h => h >= horaFormat) || hList[0];
            if (proximo) {
                partidas.push({
                    linha: linha.nome,
                    descricao: linha.descricao,
                    cor: linha.cor,
                    horario: proximo,
                    diffMin: calcularDiferencaMinutos(horaFormat, proximo)
                });
            }
        });

        partidas.sort((a, b) => a.horario.localeCompare(b.horario));

        containerPartidas.innerHTML = partidas.slice(0, 6).map(p => `
            <div class="partida-card">
                <div class="partida-info">
                    <strong style="color:${p.cor};"><i class="fa-solid fa-bus"></i> ${p.linha}</strong>
                    <span>${p.descricao}</span>
                </div>
                <div class="partida-tempo-badge">
                    ${p.diffMin > 0 ? `Em ${p.diffMin} min` : `Às ${p.horario}`}
                </div>
            </div>
        `).join("");
    }

    const containerRelatos = document.getElementById("homeRelatosRecentes");
    if (containerRelatos) {
        const ultimos = [...relatosComunidade].reverse().slice(0, 3);
        containerRelatos.innerHTML = ultimos.map(r => `
            <div class="relato-card-item">
                <div class="relato-top-bar">
                    <span class="relato-linha-badge">${r.linha}</span>
                    <span class="relato-status-tag ${obterClasseStatus(r.status)}">${r.status}</span>
                </div>
                <p class="relato-body">${r.detalhes || `Situação informada próximo a ${r.ponto}`}</p>
                <div class="relato-meta">
                    <span><i class="fa-solid fa-location-pin"></i> ${r.ponto}</span>
                    <span><i class="fa-regular fa-clock"></i> ${r.horario}</span>
                </div>
            </div>
        `).join("");
    }
}

function fecharBannerAlerta() {
    const el = document.getElementById("topBannerAlerta");
    if (el) el.style.display = "none";
}

/* =========================================================
   9. LINHAS E ROTAS COM TRAÇADO DE RUAS REAIS
   ========================================================= */

function renderizarLinhas(linhasFiltradas = null) {
    const dados = linhasFiltradas || linhas;
    const lista = document.getElementById("listaLinhas");
    const contador = document.getElementById("contadorLinhasFiltro");
    if (contador) contador.innerText = dados.length;

    if (!lista) return;

    if (!dados.length) {
        lista.innerHTML = `<p class="text-muted" style="padding:16px;">Nenhuma linha encontrada para esta busca.</p>`;
        return;
    }

    lista.innerHTML = dados.map((linha, idx) => {
        const isFav = favoritos.includes(linha.id);
        const isAtiva = idx === linhaSelecionadaIndex;
        return `
            <div class="linha-item-card ${isAtiva ? 'ativa' : ''}" onclick="selecionarLinha(${idx})">
                <div class="linha-badge-cor" style="background-color: ${linha.cor};"></div>
                <div class="linha-item-main">
                    <div class="linha-item-nome">
                        ${linha.nome}
                    </div>
                    <div class="linha-item-desc">${linha.descricao}</div>
                </div>
                <button class="linha-item-star ${isFav ? 'favoritado' : ''}" onclick="event.stopPropagation(); alternarFavorito(${linha.id})" title="Favoritar linha">
                    <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                </button>
            </div>
        `;
    }).join("");

    mostrarDetalhesLinha(dados[linhaSelecionadaIndex] || dados[0]);
}

function filtrarLinhas(termo) {
    const limpo = termo.toLowerCase().trim();
    if (!limpo) {
        linhaSelecionadaIndex = 0;
        renderizarLinhas();
        return;
    }

    const filtradas = linhas.filter(l => 
        l.nome.toLowerCase().includes(limpo) ||
        l.descricao.toLowerCase().includes(limpo) ||
        l.pontos.some(p => p.nome.toLowerCase().includes(limpo))
    );

    linhaSelecionadaIndex = 0;
    renderizarLinhas(filtradas);
}

function selecionarLinha(index) {
    linhaSelecionadaIndex = index;
    renderizarLinhas();
    const linha = linhas[index];
    if (linha) {
        destacarLinhaNoMapa(linha);
    }
}

// Destaca a linha no mapa desenhando pelas ruas reais de Itapetininga
async function destacarLinhaNoMapa(linha) {
    if (!mapPrincipal || !linha || !linha.pontos.length) return;

    camadasLinhaPrincipal.forEach(layer => mapPrincipal.removeLayer(layer));
    camadasLinhaPrincipal = [];

    // Marcadores das paradas
    linha.pontos.forEach((p) => {
        const stopIcon = L.divIcon({
            className: "custom-stop-marker",
            html: `<div class="stop-marker-pin ${p.principal ? 'principal' : ''}" title="${p.nome}"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const stopMarker = L.marker([p.lat, p.lng], { icon: stopIcon }).addTo(mapPrincipal);

        stopMarker.bindPopup(`
            <div style="font-family:'Inter',sans-serif;">
                <strong style="color:${linha.cor}; font-size:14px;">${p.nome}</strong><br>
                <span style="font-size:12px; color:#64748b;">${p.principal ? '★ Parada Principal' : 'Parada Secundária'}</span><br>
                <span style="font-size:12px;">Linha: <strong>${linha.nome}</strong></span>
            </div>
        `);

        camadasLinhaPrincipal.push(stopMarker);
    });

    // Obtém traçado real pelas ruas viárias de Itapetininga
    const coordsRuas = await obterGeometriaRuas(linha.pontos, linha.id);

    const polyline = L.polyline(coordsRuas, {
        color: linha.cor,
        weight: 6,
        opacity: 0.85,
        lineJoin: "round"
    }).addTo(mapPrincipal);

    camadasLinhaPrincipal.push(polyline);

    marcadoresOnibus.forEach(bus => {
        bus.marker.addTo(mapPrincipal);
    });

    mapPrincipal.fitBounds(polyline.getBounds(), { padding: [35, 35] });

    const titulo = document.getElementById("mapaTituloLinha");
    if (titulo) titulo.innerHTML = `<i class="fa-solid fa-route" style="color:${linha.cor}"></i> ${linha.nome} • ${linha.descricao}`;
}

function mostrarDetalhesLinha(linha) {
    const container = document.getElementById("detalhesLinha");
    if (!container || !linha) return;

    const diaAtual = obterDiaSemanaAtual();
    const horariosDoDia = (linha.horarios && linha.horarios[diaAtual]) || [];
    const agoraHora = new Date().toTimeString().substring(0, 5);

    container.innerHTML = `
        <div class="detalhes-header">
            <div>
                <h2 style="color:${linha.cor};"><i class="fa-solid fa-bus"></i> ${linha.nome}</h2>
                <p style="color:var(--text-secondary); margin-top:4px;">${linha.descricao}</p>
            </div>
            <button class="btn-secundario" onclick="ouvirLinhaAudio('${linha.nome}', '${linha.descricao}')">
                <i class="fa-solid fa-volume-high"></i> Ouvir Itinerário
            </button>
        </div>

        <div class="detalhes-tabs">
            <button class="tab-btn ativo" onclick="alternarTabLinha(this, 'tabPontos')">Itinerário nas Ruas (${linha.pontos.length} paradas)</button>
            <button class="tab-btn" onclick="alternarTabLinha(this, 'tabHorarios')">Tabela de Horários</button>
        </div>

        <div id="tabPontos" class="tab-conteudo">
            <div class="timeline-pontos">
                ${linha.pontos.map((p, i) => `
                    <div class="ponto-step">
                        <div class="ponto-bullet ${p.principal ? 'principal' : ''}"></div>
                        <div class="ponto-nome">${i + 1}. ${p.nome}</div>
                        ${p.principal ? `<span class="ponto-tag-principal">Principal</span>` : ''}
                    </div>
                `).join("")}
            </div>
        </div>

        <div id="tabHorarios" class="tab-conteudo" style="display:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <strong>Horários de Saída (${diaAtual}):</strong>
                <span style="font-size:12px; color:var(--text-muted);"><i class="fa-solid fa-circle" style="color:var(--accent-green); font-size:10px;"></i> Verde = Próximo horário</span>
            </div>
            <div class="horarios-chips-grid">
                ${horariosDoDia.map(h => {
                    const isProximo = h >= agoraHora;
                    return `<span class="horario-chip ${isProximo ? 'proximo' : ''}">${h}</span>`;
                }).join("")}
            </div>
        </div>
    `;
}

function alternarTabLinha(btn, tabId) {
    document.querySelectorAll(".detalhes-tabs .tab-btn").forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");

    document.querySelectorAll(".tab-conteudo").forEach(t => t.style.display = "none");
    const target = document.getElementById(tabId);
    if (target) target.style.display = "block";
}

/* =========================================================
   10. CÁLCULO DE ROTAS COM HORA DE CHEGADA (VITAL!)
   ========================================================= */

function alternarModoHorario(modo) {
    modoCalculoHorario = modo;
    const label = document.getElementById("labelHorarioAlvo");
    const input = document.getElementById("horarioAlvo");

    if (modo === "chegada") {
        if (label) label.innerHTML = `<i class="fa-solid fa-flag-checkered text-rose"></i> Horário que Você DEVE CHEGAR (Vital)`;
        if (input) input.placeholder = "Ex: 07:45";
    } else {
        if (label) label.innerHTML = `<i class="fa-solid fa-person-walking-arrow-right text-green"></i> Horário de Partida Desejado`;
        if (input) input.placeholder = "Ex: 07:00";
    }
}

let rotaLayers = [];

async function calcularRotaInteligente() {
    const origemTexto = document.getElementById("origemInput")?.value.trim();
    const destinoTexto = document.getElementById("destinoInput")?.value.trim();
    const horaInformada = document.getElementById("horarioAlvo")?.value || new Date().toTimeString().substring(0, 5);
    const diaSelecionado = document.getElementById("diaSemanaCalc")?.value;
    const diaEfetivo = diaSelecionado === "hoje" ? obterDiaSemanaAtual() : diaSelecionado;

    if (!origemTexto || !destinoTexto) {
        mostrarToast("Informe a Origem e o Destino para calcular a rota.", "warning");
        return;
    }

    if (origemTexto.toLowerCase() === destinoTexto.toLowerCase()) {
        mostrarToast("A Origem e o Destino devem ser locais diferentes.", "warning");
        return;
    }

    const pontoOrigem = encontrarPontoMaisProximo(origemTexto);
    const pontoDestino = encontrarPontoMaisProximo(destinoTexto);

    // Identifica se há linha direta entre as duas paradas
    let linhaDireta = linhas.find(l => 
        l.pontos.some(p => p.nome.toLowerCase() === pontoOrigem.nome.toLowerCase()) &&
        l.pontos.some(p => p.nome.toLowerCase() === pontoDestino.nome.toLowerCase())
    );

    let resultadoObj = null;

    if (linhaDireta) {
        // Viagem Direta
        const hList = (linhaDireta.horarios && linhaDireta.horarios[diaEfetivo]) || [];
        const tempoOnibusMin = 22; // tempo médio do trajeto em Itapetininga
        const caminhadaDestinoMin = 4;
        const caminhadaOrigemMin = 5;

        let proxPartida = "";
        let horaChegadaEstimada = "";
        let margemSegurancaMin = 0;

        if (modoCalculoHorario === "chegada") {
            // CÁLCULO REVERSO: Para chegar até XX:XX, qual ônibus pegar?
            // Horário limite em que o passageiro precisa estar no ônibus
            const limiteSaida = subtrairMinutos(horaInformada, tempoOnibusMin + caminhadaDestinoMin);
            // Procura o ônibus que parte ANTES ou exatamente no limite
            const partidasAntes = hList.filter(h => h <= limiteSaida);
            proxPartida = partidasAntes.length ? partidasAntes[partidasAntes.length - 1] : hList[0];
            horaChegadaEstimada = somarMinutos(proxPartida, tempoOnibusMin + caminhadaDestinoMin);
            margemSegurancaMin = calcularDiferencaMinutos(horaChegadaEstimada, horaInformada);
        } else {
            // CÁLCULO A PARTIR DA PARTIDA
            proxPartida = hList.find(h => h >= horaInformada) || hList[0] || "08:00";
            horaChegadaEstimada = somarMinutos(proxPartida, tempoOnibusMin + caminhadaDestinoMin);
        }

        // Obtém traçado real de ruas para o trecho
        const coordsRuas = await obterGeometriaRuas([pontoOrigem, pontoDestino], `direta_${linhaDireta.id}`);

        resultadoObj = {
            tipo: "direta",
            modoHorario: modoCalculoHorario,
            horarioAlvoUsuario: horaInformada,
            linha: linhaDireta,
            embarque: pontoOrigem.nome,
            desembarque: pontoDestino.nome,
            partida: proxPartida,
            chegada: horaChegadaEstimada,
            margemMin: margemSegurancaMin,
            duracaoTotal: tempoOnibusMin + caminhadaOrigemMin + caminhadaDestinoMin,
            caminhadaOrigemMin: caminhadaOrigemMin,
            caminhadaDestinoMin: caminhadaDestinoMin,
            coordenadasRuas: coordsRuas,
            pontosMarcadores: [pontoOrigem, pontoDestino]
        };
    } else {
        // Baldeação no Terminal Central
        const linhaA = linhas.find(l => l.pontos.some(p => p.nome.toLowerCase() === pontoOrigem.nome.toLowerCase())) || linhas[0];
        const linhaB = linhas.find(l => l.pontos.some(p => p.nome.toLowerCase() === pontoDestino.nome.toLowerCase())) || linhas[1];

        const pontoTerminal = { nome: "Terminal Central", lat: -23.5878, lng: -48.0495 };
        const tempoTotalMin = 40;

        let partA = "";
        let chegFinal = "";
        let margemSegurancaMin = 0;

        const hListA = (linhaA.horarios && linhaA.horarios[diaEfetivo]) || [];

        if (modoCalculoHorario === "chegada") {
            const limiteA = subtrairMinutos(horaInformada, tempoTotalMin);
            const partidasAntes = hListA.filter(h => h <= limiteA);
            partA = partidasAntes.length ? partidasAntes[partidasAntes.length - 1] : hListA[0];
            chegFinal = somarMinutos(partA, tempoTotalMin);
            margemSegurancaMin = calcularDiferencaMinutos(chegFinal, horaInformada);
        } else {
            partA = hListA.find(h => h >= horaInformada) || hListA[0] || "08:00";
            chegFinal = somarMinutos(partA, tempoTotalMin);
        }

        const coordsRuasA = await obterGeometriaRuas([pontoOrigem, pontoTerminal]);
        const coordsRuasB = await obterGeometriaRuas([pontoTerminal, pontoDestino]);

        resultadoObj = {
            tipo: "baldeacao",
            modoHorario: modoCalculoHorario,
            horarioAlvoUsuario: horaInformada,
            linhaA: linhaA,
            linhaB: linhaB,
            embarque: pontoOrigem.nome,
            integracao: "Terminal Central",
            desembarque: pontoDestino.nome,
            partida: partA,
            chegada: chegFinal,
            margemMin: margemSegurancaMin,
            duracaoTotal: tempoTotalMin + 8,
            caminhadaOrigemMin: 4,
            caminhadaDestinoMin: 4,
            coordenadasRuas: [...coordsRuasA, ...coordsRuasB],
            pontosMarcadores: [pontoOrigem, pontoTerminal, pontoDestino]
        };
    }

    exibirResultadoCalculo(resultadoObj);
    plotarRotaNoMapa(resultadoObj);
}

function exibirResultadoCalculo(res) {
    const container = document.getElementById("resultadoRotaCard");
    if (!container) return;
    container.style.display = "block";

    const destaqueChegada = res.modoHorario === "chegada" ? `
        <div style="background:var(--accent-green-light); border:1px solid var(--accent-green); padding:10px 14px; border-radius:var(--radius-md); margin-bottom:14px; font-size:13px; color:#065f46;">
            <strong><i class="fa-solid fa-clock-check"></i> Chegada garantida antes das ${res.horarioAlvoUsuario}:</strong><br>
            Você chegará às <strong>${res.chegada}</strong> (${res.margemMin >= 0 ? `${res.margemMin} minutos de folga antes do seu compromisso` : 'muito pontual'}).
        </div>
    ` : '';

    if (res.tipo === "direta") {
        container.innerHTML = `
            ${destaqueChegada}
            <div class="resumo-viagem-box">
                <div class="resumo-tempo">
                    <h3>${res.duracaoTotal} min</h3>
                    <span>Tempo total porta a porta</span>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:17px; font-weight:800; color:${res.linha.cor};">
                        <i class="fa-solid fa-bus"></i> ${res.linha.nome}
                    </div>
                    <span style="font-size:12.5px; color:var(--text-muted);">Viagem Direta nas Ruas</span>
                </div>
            </div>

            <div class="passos-itinerario">
                <div class="passo-card">
                    <div class="passo-icone walk"><i class="fa-solid fa-person-walking"></i></div>
                    <div class="passo-detalhe">
                        <strong>Caminhe ~${res.caminhadaOrigemMin} min até ${res.embarque}</strong>
                        <p>Saia às <strong>${subtrairMinutos(res.partida, res.caminhadaOrigemMin)}</strong> para não perder o ônibus.</p>
                    </div>
                </div>

                <div class="passo-card">
                    <div class="passo-icone bus" style="background:${res.linha.cor};"><i class="fa-solid fa-bus"></i></div>
                    <div class="passo-detalhe">
                        <strong>Embarque na ${res.linha.nome} exatamente às ${res.partida}</strong>
                        <p>Linha: ${res.linha.descricao} • Desça na parada <strong>${res.desembarque}</strong>.</p>
                    </div>
                </div>

                <div class="passo-card">
                    <div class="passo-icone dest"><i class="fa-solid fa-location-dot"></i></div>
                    <div class="passo-detalhe">
                        <strong>Chegada ao destino às ${res.chegada}</strong>
                        <p>Caminhada final de ~${res.caminhadaDestinoMin} min até o seu destino.</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            ${destaqueChegada}
            <div class="resumo-viagem-box">
                <div class="resumo-tempo">
                    <h3>${res.duracaoTotal} min</h3>
                    <span>Tempo com baldeação</span>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:15px; font-weight:800; color:var(--primary);">
                        <i class="fa-solid fa-arrows-split-up-and-left"></i> 1 Integração
                    </div>
                    <span style="font-size:12px; color:var(--text-muted);">${res.linhaA.nome} ➔ ${res.linhaB.nome}</span>
                </div>
            </div>

            <div class="passos-itinerario">
                <div class="passo-card">
                    <div class="passo-icone bus" style="background:${res.linhaA.cor};"><i class="fa-solid fa-bus"></i></div>
                    <div class="passo-detalhe">
                        <strong>1º Trecho: ${res.linhaA.nome} às ${res.partida}</strong>
                        <p>Embarque em <strong>${res.embarque}</strong> e desça no <strong>Terminal Central</strong>.</p>
                    </div>
                </div>

                <div class="passo-card">
                    <div class="passo-icone walk"><i class="fa-solid fa-repeat"></i></div>
                    <div class="passo-detalhe">
                        <strong>Integração no Terminal Central</strong>
                        <p>Troque para a plataforma da ${res.linhaB.nome} sem custo extra.</p>
                    </div>
                </div>

                <div class="passo-card">
                    <div class="passo-icone bus" style="background:${res.linhaB.cor};"><i class="fa-solid fa-bus"></i></div>
                    <div class="passo-detalhe">
                        <strong>2º Trecho: ${res.linhaB.nome}</strong>
                        <p>Desça em <strong>${res.desembarque}</strong> com chegada às <strong>${res.chegada}</strong>.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

function plotarRotaNoMapa(res) {
    if (!mapRota) return;

    rotaLayers.forEach(l => mapRota.removeLayer(l));
    rotaLayers = [];

    // Marcadores dos pontos
    res.pontosMarcadores.forEach((p, idx) => {
        const isInicio = idx === 0;
        const isFim = idx === res.pontosMarcadores.length - 1;

        const m = L.marker([p.lat, p.lng]).addTo(mapRota);
        m.bindPopup(`<strong>${isInicio ? 'Partida' : isFim ? 'Destino Final' : 'Integração'}:</strong> ${p.nome}`);
        if (isInicio) m.openPopup();
        rotaLayers.push(m);
    });

    // Traçado pelas ruas reais
    const poly = L.polyline(res.coordenadasRuas, {
        color: res.linha ? res.linha.cor : "#3b5bf5",
        weight: 6,
        opacity: 0.85,
        lineJoin: "round"
    }).addTo(mapRota);

    rotaLayers.push(poly);
    mapRota.fitBounds(poly.getBounds(), { padding: [45, 45] });
}

function encontrarPontoMaisProximo(nomeOuTexto) {
    const limpo = nomeOuTexto.toLowerCase();
    for (const linha of linhas) {
        for (const p of linha.pontos) {
            if (p.nome.toLowerCase().includes(limpo) || limpo.includes(p.nome.toLowerCase())) {
                return p;
            }
        }
    }
    return { nome: nomeOuTexto, lat: -23.5878, lng: -48.0495 };
}

function ativarSelecaoNoMapa(campo) {
    campoAlvoMapa = campo;
    const label = document.getElementById("statusSelecaoMapa");
    if (label) label.innerText = `Clique no mapa para marcar ${campo.toUpperCase()}`;
    mostrarToast(`Clique em qualquer local do mapa ao lado para definir o ponto de ${campo}.`, "info");
}

function tratarCliqueMapaRoteador(latlng) {
    if (!campoAlvoMapa) return;
    const nomeAprox = `Ponto Coordenada (${latlng.lat.toFixed(3)}, ${latlng.lng.toFixed(3)})`;
    if (campoAlvoMapa === "origem") {
        document.getElementById("origemInput").value = nomeAprox;
    } else {
        document.getElementById("destinoInput").value = nomeAprox;
    }
    mostrarToast(`${campoAlvoMapa.toUpperCase()} definido pelo clique no mapa!`, "success");
    campoAlvoMapa = null;
    const label = document.getElementById("statusSelecaoMapa");
    if (label) label.innerText = "Modo Navegação";
}

function inverterOrigemDestino() {
    const o = document.getElementById("origemInput");
    const d = document.getElementById("destinoInput");
    if (o && d) {
        const tmp = o.value;
        o.value = d.value;
        d.value = tmp;
    }
}

function usarLocalAtual(campo) {
    if (!navigator.geolocation) {
        mostrarToast("Geolocalização não é suportada pelo seu navegador.", "warning");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const val = `Localização Atual (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`;
            if (campo === "origem") {
                document.getElementById("origemInput").value = val;
            } else {
                document.getElementById("destinoInput").value = val;
            }
            mostrarToast("Localização GPS obtida com sucesso!", "success");
        },
        () => {
            document.getElementById(campo === "origem" ? "origemInput" : "destinoInput").value = "Terminal Central (Itapetininga)";
            mostrarToast("GPS simulado no Terminal Central.", "info");
        }
    );
}

/* =========================================================
   11. SISTEMA COLABORATIVO (WAZE DO ÔNIBUS)
   ========================================================= */

function preencherSelectLinhasColaborativo() {
    const selects = [document.getElementById("colabLinha"), document.getElementById("filtroLinhaComunidade")];
    selects.forEach(sel => {
        if (!sel) return;
        const valorAtual = sel.value;
        sel.innerHTML = sel.id === "filtroLinhaComunidade" ? `<option value="todas">Todas as Linhas</option>` : "";
        linhas.forEach(l => {
            const opt = document.createElement("option");
            opt.value = l.nome;
            opt.innerText = `${l.nome} - ${l.descricao}`;
            sel.appendChild(opt);
        });
        if (valorAtual) sel.value = valorAtual;
    });
}

function enviarColaboracaoNova() {
    const linha = document.getElementById("colabLinha")?.value;
    const statusRadio = document.querySelector('input[name="colabStatus"]:checked');
    const status = statusRadio ? statusRadio.value : "Atrasado";
    const ponto = document.getElementById("colabPontoReferencia")?.value.trim() || "Ponto no trajeto";
    const detalhes = document.getElementById("colabDetalhes")?.value.trim();

    if (!linha) {
        mostrarToast("Selecione uma linha para registrar o relato.", "warning");
        return;
    }

    const agora = new Date();
    const novoRelato = {
        id: Date.now(),
        linha: linha,
        status: status,
        ponto: ponto,
        detalhes: detalhes || `Passageiro relatou situação de: ${status}`,
        horario: agora.toTimeString().substring(0, 5),
        data: agora.toISOString(),
        confirmado: true,
        votosPositivos: 1,
        votosNegativos: 0,
        votadoUsuario: "pos"
    };

    relatosComunidade.unshift(novoRelato);
    salvarStorage("itabus_relatos_v3", relatosComunidade);

    document.getElementById("colabPontoReferencia").value = "";
    document.getElementById("colabDetalhes").value = "";

    renderizarComunidade();
    renderizarInicio();
    mostrarToast("Informação compartilhada! Obrigado por ajudar a comunidade.", "success");
}

function renderizarComunidade() {
    const container = document.getElementById("listaComunidadeFeed");
    const filtro = document.getElementById("filtroLinhaComunidade")?.value || "todas";
    if (!container) return;

    let lista = relatosComunidade;
    if (filtro !== "todas") {
        lista = lista.filter(r => r.linha === filtro);
    }

    if (!lista.length) {
        container.innerHTML = `<p class="text-muted" style="padding:24px;">Nenhum relato registrado para esta seleção.</p>`;
        return;
    }

    container.innerHTML = lista.map(r => {
        const tempoRelativo = formatarTempoRelativo(r.data);
        return `
            <div class="relato-card-item">
                <div class="relato-top-bar">
                    <span class="relato-linha-badge">${r.linha}</span>
                    <span class="relato-status-tag ${obterClasseStatus(r.status)}">${r.status}</span>
                </div>
                <p class="relato-body">${r.detalhes}</p>
                <div class="relato-meta">
                    <span><i class="fa-solid fa-location-pin"></i> ${r.ponto}</span>
                    <span><i class="fa-regular fa-clock"></i> ${r.horario} (${tempoRelativo})</span>
                </div>
                <div class="relato-votos-bar">
                    <span style="font-size:12px; color:var(--text-muted);">Confirma este alerta?</span>
                    <button class="btn-voto ${r.votadoUsuario === 'pos' ? 'votado' : ''}" onclick="votarRelato(${r.id}, 'pos')">
                        <i class="fa-solid fa-thumbs-up"></i> Sim (${r.votosPositivos})
                    </button>
                    <button class="btn-voto ${r.votadoUsuario === 'neg' ? 'votado' : ''}" onclick="votarRelato(${r.id}, 'neg')">
                        <i class="fa-solid fa-thumbs-down"></i> Não (${r.votosNegativos})
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function votarRelato(id, tipo) {
    const relato = relatosComunidade.find(r => r.id === id);
    if (!relato) return;

    if (relato.votadoUsuario === tipo) {
        if (tipo === "pos") relato.votosPositivos--;
        else relato.votosNegativos--;
        relato.votadoUsuario = null;
    } else {
        if (relato.votadoUsuario === "pos") relato.votosPositivos--;
        if (relato.votadoUsuario === "neg") relato.votosNegativos--;

        if (tipo === "pos") relato.votosPositivos++;
        else relato.votosNegativos++;
        relato.votadoUsuario = tipo;
    }

    salvarStorage("itabus_relatos_v3", relatosComunidade);
    renderizarComunidade();
}

function obterClasseStatus(status) {
    const s = status.toLowerCase();
    if (s.includes("quebrado") || s.includes("pane")) return "quebrado";
    if (s.includes("atrasado")) return "atrasado";
    if (s.includes("lotado")) return "lotado";
    return "normal";
}

/* =========================================================
   12. FAVORITOS DO USUÁRIO
   ========================================================= */

function alternarFavorito(linhaId) {
    const idx = favoritos.indexOf(linhaId);
    if (idx >= 0) {
        favoritos.splice(idx, 1);
        mostrarToast("Linha removida dos favoritos.", "info");
    } else {
        favoritos.push(linhaId);
        favoritosUsuariosStats[linhaId] = (favoritosUsuariosStats[linhaId] || 0) + 1;
        salvarStorage("itabus_fav_stats_v3", favoritosUsuariosStats);
        mostrarToast("Linha favoritada! ⭐", "success");
    }

    salvarStorage("itabus_favoritos_v3", favoritos);
    atualizarBadgesHeader();
    renderizarLinhas();
    if (document.getElementById("favoritos").classList.contains("ativa")) {
        renderizarFavoritos();
    }
}

function renderizarFavoritos() {
    const container = document.getElementById("listaFavoritosCards");
    if (!container) return;

    const linhasFav = linhas.filter(l => favoritos.includes(l.id));

    if (!linhasFav.length) {
        container.innerHTML = `
            <div class="card" style="grid-column: 1/-1; text-align:center; padding:48px 24px;">
                <i class="fa-regular fa-star" style="font-size:42px; color:var(--text-muted); margin-bottom:12px;"></i>
                <h3>Você ainda não tem linhas favoritas</h3>
                <p class="text-muted" style="margin:8px 0 20px;">Favorite suas linhas diárias para acompanhar status e horários rapidamente.</p>
                <button class="btn-principal" onclick="abrirTela('linhas', document.querySelectorAll('.nav-btn')[1])">
                    Explorar Linhas de Ônibus
                </button>
            </div>
        `;
        return;
    }

    const diaAtual = obterDiaSemanaAtual();
    const agoraHora = new Date().toTimeString().substring(0, 5);

    container.innerHTML = linhasFav.map(linha => {
        const hList = (linha.horarios && linha.horarios[diaAtual]) || [];
        const proximo = hList.find(h => h >= agoraHora) || hList[0] || "--:--";
        const alertaLinha = relatosComunidade.find(r => r.linha === linha.nome && r.confirmado);

        return `
            <div class="favorito-card" style="border-top: 5px solid ${linha.cor};">
                <div>
                    <div class="favorito-card-top">
                        <strong style="color:${linha.cor}; font-size:18px;">
                            <i class="fa-solid fa-bus"></i> ${linha.nome}
                        </strong>
                        <button class="linha-item-star favoritado" onclick="alternarFavorito(${linha.id})" title="Remover dos favoritos">
                            <i class="fa-solid fa-star"></i>
                        </button>
                    </div>
                    <p style="font-size:14px; color:var(--text-secondary); margin-bottom:12px;">${linha.descricao}</p>

                    <div style="background:var(--primary-light); padding:10px 14px; border-radius:var(--radius-md); margin-bottom:12px;">
                        <span style="font-size:12px; color:var(--text-muted);">Próxima Partida:</span>
                        <div style="font-size:20px; font-weight:800; color:var(--primary-dark);">${proximo}</div>
                    </div>

                    ${alertaLinha ? `
                        <div style="background:var(--accent-rose-light); color:var(--accent-rose); padding:8px 12px; border-radius:var(--radius-md); font-size:12px; font-weight:600;">
                            <i class="fa-solid fa-triangle-exclamation"></i> ${alertaLinha.status}: ${alertaLinha.ponto}
                        </div>
                    ` : `
                        <div style="background:var(--accent-green-light); color:var(--accent-green); padding:8px 12px; border-radius:var(--radius-md); font-size:12px; font-weight:600;">
                            <i class="fa-solid fa-circle-check"></i> Operação normal no itinerário
                        </div>
                    `}
                </div>

                <div class="favorito-card-actions">
                    <button class="btn-secundario" style="flex:1;" onclick="irParaLinhaEspecifica(${linha.id})">
                        Ver no Mapa
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function irParaLinhaEspecifica(linhaId) {
    const idx = linhas.findIndex(l => l.id === linhaId);
    if (idx >= 0) {
        linhaSelecionadaIndex = idx;
        abrirTela('linhas', document.querySelectorAll('.nav-btn')[1]);
    }
}

function atualizarBadgesHeader() {
    const badgeFav = document.getElementById("badgeFavoritosTotal");
    if (badgeFav) {
        badgeFav.innerText = favoritos.length;
        badgeFav.style.display = favoritos.length ? "inline-block" : "none";
    }

    const badgeColab = document.getElementById("badgeColabTotal");
    if (badgeColab) {
        badgeColab.innerText = relatosComunidade.length;
        badgeColab.style.display = relatosComunidade.length ? "inline-block" : "none";
    }
}

/* =========================================================
   13. PAINEL DE ADMINISTRADOR (DASHBOARD & CRUD)
   ========================================================= */

function abrirLogin() {
    const modal = document.getElementById("modalLogin");
    if (modal) modal.style.display = "flex";
}

function fecharLogin() {
    const modal = document.getElementById("modalLogin");
    if (modal) modal.style.display = "none";
}

function fazerLogin() {
    const user = document.getElementById("usuarioAdmin")?.value.trim();
    const pass = document.getElementById("senhaAdmin")?.value;

    if (user === "admin" && pass === "1234") {
        sessaoAdmin = true;
        sessionStorage.setItem("itabus_admin_logado", "true");
        fecharLogin();
        atualizarInterfaceAdmin();
        abrirTela("adminDashboard", document.getElementById("navAdminDashboard"));
        mostrarToast("Sessão ADM iniciada com sucesso!", "success");
    } else {
        mostrarToast("Usuário ou senha inválidos.", "danger");
    }
}

function sairModoRestrito() {
    sessaoAdmin = false;
    sessionStorage.removeItem("itabus_admin_logado");
    atualizarInterfaceAdmin();
    abrirTela("inicio", document.querySelectorAll(".nav-btn")[0]);
    mostrarToast("Você retornou ao modo usuário.", "info");
}

function atualizarInterfaceAdmin() {
    const adminGroup = document.getElementById("navAdminGroup");
    const btnSair = document.getElementById("btnSairAdmin");
    const btnAuth = document.getElementById("btnAuth");

    if (sessaoAdmin) {
        if (adminGroup) adminGroup.style.display = "flex";
        if (btnSair) btnSair.style.display = "inline-flex";
        if (btnAuth) btnAuth.style.display = "none";
    } else {
        if (adminGroup) adminGroup.style.display = "none";
        if (btnSair) btnSair.style.display = "none";
        if (btnAuth) btnAuth.style.display = "inline-flex";
    }

    aplicarVisaoMenusADM();
}

function renderizarDashboardAdmin() {
    const totalLinhas = document.getElementById("kpiTotalLinhas");
    if (totalLinhas) totalLinhas.innerText = linhas.length;

    let countPontos = 0;
    linhas.forEach(l => countPontos += l.pontos.length);
    const totalPontos = document.getElementById("kpiTotalPontos");
    if (totalPontos) totalPontos.innerText = countPontos;

    const pendentes = relatosComunidade.filter(r => !r.confirmado);
    const kpiPendentes = document.getElementById("kpiAlertasPendentes");
    if (kpiPendentes) kpiPendentes.innerText = pendentes.length;

    let somaFav = 0;
    Object.values(favoritosUsuariosStats).forEach(v => somaFav += v);
    const kpiFav = document.getElementById("kpiTotalFavoritos");
    if (kpiFav) kpiFav.innerText = somaFav;

    const containerFrota = document.getElementById("adminStatusFrotaList");
    if (containerFrota) {
        containerFrota.innerHTML = marcadoresOnibus.map(b => `
            <div class="frota-item">
                <div>
                    <strong style="color:${b.cor};"><i class="fa-solid fa-bus"></i> ${b.linhaNome}</strong>
                    <span style="font-size:12px; color:var(--text-muted); display:block;">Ruas Mapeadas: ${b.rotaCoords.length} pontos viários</span>
                </div>
                <span class="live-gps-chip" style="font-size:10px;">${b.velocidade} km/h</span>
            </div>
        `).join("");
    }
}

/* CRUD de Linhas */
let linhaEmEdicaoId = null;

function renderizarGestaoLinhas() {
    const container = document.getElementById("tabelaLinhasAdmin");
    if (container) {
        container.innerHTML = linhas.map(l => `
            <div class="linha-admin-card">
                <div>
                    <strong style="color:${l.cor};">${l.nome}</strong>
                    <div style="font-size:12px; color:var(--text-muted);">${l.descricao} (${l.pontos.length} paradas)</div>
                </div>
                <div style="display:flex; gap:6px;">
                    <button class="btn-pequeno" onclick="editarLinhaAdmin(${l.id})"><i class="fa-solid fa-pen"></i> Editar</button>
                    <button class="btn-pequeno" style="color:var(--accent-rose);" onclick="excluirLinhaAdmin(${l.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `).join("");
    }

    if (!linhaEmEdicaoId) {
        carregarCamposPontosAdmin(linhas[0] ? linhas[0].pontos : []);
        carregarHorariosDiaAdmin();
    }
}

function carregarCamposPontosAdmin(pontos = []) {
    const container = document.getElementById("pontosAdminContainer");
    if (!container) return;
    container.innerHTML = "";

    if (!pontos.length) {
        adicionarCampoPonto("Ponto Inicial", -23.5878, -48.0495, true);
    } else {
        pontos.forEach(p => adicionarCampoPonto(p.nome, p.lat, p.lng, p.principal));
    }
}

function adicionarCampoPonto(nome = "", lat = -23.5898, lng = -48.0535, principal = false) {
    const container = document.getElementById("pontosAdminContainer");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "ponto-admin-row";
    row.innerHTML = `
        <input type="text" class="ponto-nome-input" placeholder="Nome do Ponto" value="${nome}">
        <input type="number" step="0.0001" class="ponto-lat-input" placeholder="Latitude" value="${lat}">
        <input type="number" step="0.0001" class="ponto-lng-input" placeholder="Longitude" value="${lng}">
        <label style="font-size:12px; display:flex; align-items:center; gap:4px;">
            <input type="checkbox" class="ponto-princ-input" ${principal ? 'checked' : ''}> Princ.
        </label>
        <button type="button" class="btn-remove-ponto" onclick="this.parentElement.remove()" title="Remover"><i class="fa-solid fa-xmark"></i></button>
    `;
    container.appendChild(row);
}

function tratarCliqueMapaAdmin(latlng) {
    const label = document.getElementById("coordenadasCapturadas");
    if (label) label.innerText = `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}`;

    adicionarCampoPonto(`Parada (${latlng.lat.toFixed(3)}, ${latlng.lng.toFixed(3)})`, latlng.lat, latlng.lng, false);
    mostrarToast("Ponto adicionado com coordenadas capturadas no mapa!", "success");
}

function carregarHorariosDiaAdmin() {
    const dia = document.getElementById("diaSemanaAdmin")?.value;
    const txtArea = document.getElementById("horariosListaInput");
    if (!dia || !txtArea) return;

    const linha = linhaEmEdicaoId ? linhas.find(l => l.id === linhaEmEdicaoId) : linhas[0];
    const lista = (linha && linha.horarios && linha.horarios[dia]) || [];
    txtArea.value = lista.join(", ");
}

function salvarLinhaCompletaAdmin() {
    const nome = document.getElementById("adminNomeLinha")?.value.trim();
    const desc = document.getElementById("adminDescricaoLinha")?.value.trim();
    const cor = document.getElementById("adminCorLinha")?.value || "#3b82f6";
    const dia = document.getElementById("diaSemanaAdmin")?.value;
    const horariosTxt = document.getElementById("horariosListaInput")?.value || "";

    if (!nome || !desc) {
        mostrarToast("Preencha o Nome e a Descrição da linha.", "warning");
        return;
    }

    const pontosRows = document.querySelectorAll(".ponto-admin-row");
    const pontos = [];
    pontosRows.forEach(row => {
        const pNome = row.querySelector(".ponto-nome-input").value.trim();
        const pLat = parseFloat(row.querySelector(".ponto-lat-input").value);
        const pLng = parseFloat(row.querySelector(".ponto-lng-input").value);
        const pPrinc = row.querySelector(".ponto-princ-input").checked;
        if (pNome) {
            pontos.push({ nome: pNome, lat: pLat, lng: pLng, principal: pPrinc });
        }
    });

    if (!pontos.length) {
        mostrarToast("Adicione pelo menos um ponto de parada à rota.", "warning");
        return;
    }

    const horariosArray = horariosTxt.split(",").map(h => h.trim()).filter(h => h.length >= 4);

    if (linhaEmEdicaoId) {
        const linha = linhas.find(l => l.id === linhaEmEdicaoId);
        if (linha) {
            linha.nome = nome;
            linha.descricao = desc;
            linha.cor = cor;
            linha.pontos = pontos;
            if (!linha.horarios) linha.horarios = {};
            linha.horarios[dia] = horariosArray;
        }
        mostrarToast("Linha atualizada com sucesso!", "success");
    } else {
        const nova = {
            id: Date.now(),
            nome: nome,
            descricao: desc,
            cor: cor,
            ativa: true,
            pontos: pontos,
            horarios: {
                [dia]: horariosArray,
                "Segunda a sexta": horariosArray,
                "Sábado": horariosArray.slice(0, Math.ceil(horariosArray.length / 2)),
                "Domingo / Feriado": horariosArray.slice(0, Math.ceil(horariosArray.length / 3))
            }
        };
        linhas.push(nova);
        mostrarToast("Nova linha cadastrada no sistema!", "success");
    }

    salvarStorage("itabus_linhas_v3", linhas);
    cancelarEdicaoLinha();
    renderizarGestaoLinhas();
    renderizarLinhas();
    iniciarSimulacaoOnibusGPS();
}

function editarLinhaAdmin(id) {
    const linha = linhas.find(l => l.id === id);
    if (!linha) return;

    linhaEmEdicaoId = id;
    document.getElementById("gestaoTituloForm").innerHTML = `<i class="fa-solid fa-pen text-blue"></i> Editando: ${linha.nome}`;
    document.getElementById("btnCancelarEdicao").style.display = "inline-block";
    document.getElementById("adminNomeLinha").value = linha.nome;
    document.getElementById("adminDescricaoLinha").value = linha.descricao;
    document.getElementById("adminCorLinha").value = linha.cor;

    carregarCamposPontosAdmin(linha.pontos);
    carregarHorariosDiaAdmin();
}

function cancelarEdicaoLinha() {
    linhaEmEdicaoId = null;
    document.getElementById("gestaoTituloForm").innerHTML = `<i class="fa-solid fa-plus-circle text-blue"></i> Adicionar Nova Linha`;
    document.getElementById("btnCancelarEdicao").style.display = "none";
    document.getElementById("adminNomeLinha").value = "";
    document.getElementById("adminDescricaoLinha").value = "";
    document.getElementById("adminCorLinha").value = "#3b82f6";
    carregarCamposPontosAdmin([]);
}

function excluirLinhaAdmin(id) {
    if (confirm("Tem certeza que deseja excluir esta linha do sistema?")) {
        linhas = linhas.filter(l => l.id !== id);
        salvarStorage("itabus_linhas_v3", linhas);
        renderizarGestaoLinhas();
        renderizarLinhas();
        mostrarToast("Linha excluída com sucesso.", "info");
    }
}

/* Moderação */
function renderizarModeracaoRelatos() {
    const container = document.getElementById("listaPendentesContainer");
    if (!container) return;

    container.innerHTML = relatosComunidade.map(r => `
        <div class="relato-pendente-card">
            <div>
                <strong>${r.linha} • <span class="relato-status-tag ${obterClasseStatus(r.status)}">${r.status}</span></strong>
                <p style="font-size:14px; margin-top:4px;">${r.detalhes}</p>
                <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">
                    Local: ${r.ponto} | Horário: ${r.horario} | Votos 👍: ${r.votosPositivos}
                </div>
            </div>
            <div class="mod-acoes">
                <button class="btn-pequeno btn-outline" onclick="destacarRelatoInicio(${r.id})">Fixar no Início</button>
                <button class="btn-pequeno" style="color:var(--accent-rose);" onclick="excluirRelatoAdmin(${r.id})">Excluir</button>
            </div>
        </div>
    `).join("");
}

function destacarRelatoInicio(id) {
    const relato = relatosComunidade.find(r => r.id === id);
    if (!relato) return;

    notificacoes.unshift({
        id: Date.now(),
        destino: relato.linha,
        texto: `Alerta da Comunidade: ${relato.status} na ${relato.linha} (${relato.ponto}).`,
        data: new Date().toISOString(),
        bannerUrgente: false,
        validadaInicio: true
    });

    salvarStorage("itabus_notificacoes_v3", notificacoes);
    mostrarToast("Relato promovido a comunicado no Início!", "success");
}

function excluirRelatoAdmin(id) {
    relatosComunidade = relatosComunidade.filter(r => r.id !== id);
    salvarStorage("itabus_relatos_v3", relatosComunidade);
    renderizarModeracaoRelatos();
    renderizarComunidade();
    mostrarToast("Relato removido.", "info");
}

/* Avisos Oficiais */
function renderizarNotificacoesAdmin() {
    const container = document.getElementById("listaNotificacoesAdminCards");
    const selectLinha = document.getElementById("linhaNotificacaoSelect");

    if (selectLinha) {
        selectLinha.innerHTML = linhas.map(l => `<option value="${l.nome}">${l.nome} - ${l.descricao}</option>`).join("");
    }

    if (container) {
        container.innerHTML = notificacoes.map(n => `
            <div class="notificacao-card-home ${n.bannerUrgente ? 'urgente' : ''}">
                <div class="notif-home-header">
                    <span class="notif-tag">${n.destino}</span>
                    <button class="btn-link" style="color:var(--accent-rose);" onclick="excluirNotificacaoOficial(${n.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
                <p class="notif-text">${n.texto}</p>
            </div>
        `).join("");
    }
}

function atualizarSelectLinhaNotificacao() {
    const tipo = document.getElementById("destinoNotificacaoSelect")?.value;
    const box = document.getElementById("boxLinhaEspecificaNotif");
    if (box) box.style.display = tipo === "linha" ? "block" : "none";
}

function aplicarModeloNotificacao(texto) {
    const input = document.getElementById("textoNotificacaoInput");
    if (input) input.value = texto;
}

function publicarNotificacaoOficial() {
    const destinoTipo = document.getElementById("destinoNotificacaoSelect")?.value;
    const destino = destinoTipo === "linha" ? document.getElementById("linhaNotificacaoSelect")?.value : "geral";
    const texto = document.getElementById("textoNotificacaoInput")?.value.trim();
    const banner = document.getElementById("checkExibirNoBanner")?.checked || false;

    if (!texto) {
        mostrarToast("Digite o texto do comunicado oficial.", "warning");
        return;
    }

    const nova = {
        id: Date.now(),
        destino: destino,
        texto: texto,
        data: new Date().toISOString(),
        bannerUrgente: banner,
        validadaInicio: true
    };

    notificacoes.unshift(nova);
    salvarStorage("itabus_notificacoes_v3", notificacoes);

    document.getElementById("textoNotificacaoInput").value = "";
    renderizarNotificacoesAdmin();
    renderizarInicio();
    mostrarToast("Comunicado oficial publicado com sucesso!", "success");
}

function excluirNotificacaoOficial(id) {
    notificacoes = notificacoes.filter(n => n.id !== id);
    salvarStorage("itabus_notificacoes_v3", notificacoes);
    renderizarNotificacoesAdmin();
    renderizarInicio();
    mostrarToast("Comunicado excluído.", "info");
}

function renderizarEstatisticasFavoritos() {
    const container = document.getElementById("listaFavoritosUsuariosContainer");
    if (!container) return;

    const ranking = linhas.map(l => ({
        nome: l.nome,
        desc: l.descricao,
        cor: l.cor,
        total: favoritosUsuariosStats[l.id] || Math.floor(Math.random() * 80) + 20
    })).sort((a, b) => b.total - a.total);

    const max = ranking[0]?.total || 100;

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
            ${ranking.map(r => {
                const perc = Math.round((r.total / max) * 100);
                return `
                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-weight:700;">
                            <span style="color:${r.cor};"><i class="fa-solid fa-bus"></i> ${r.nome} • ${r.desc}</span>
                            <span>${r.total} usuários</span>
                        </div>
                        <div style="height:10px; background:var(--border-color); border-radius:5px; overflow:hidden;">
                            <div style="width:${perc}%; height:100%; background:${r.cor}; border-radius:5px;"></div>
                        </div>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function resetarDadosPadrao() {
    if (confirm("Deseja restaurar as linhas e alertas padrão originais de Itapetininga?")) {
        linhas = [...linhasPadraoItapetininga];
        notificacoes = [...notificacoesOficiaisPadrao];
        relatosComunidade = [...relatosComunidadePadrao];
        salvarStorage("itabus_linhas_v3", linhas);
        salvarStorage("itabus_notificacoes_v3", notificacoes);
        salvarStorage("itabus_relatos_v3", relatosComunidade);
        location.reload();
    }
}

/* =========================================================
   14. ACESSIBILIDADE E RECURSOS DE INCLUSÃO FUNCIONANDO 100%
   ========================================================= */

function temaEscuro() {
    const isEscuro = document.body.classList.toggle("tema-escuro");
    salvarStorage("itabus_tema_escuro", isEscuro);

    const btn = document.getElementById("btnToggleTema");
    const label = document.getElementById("labelTema");
    if (isEscuro) {
        if (btn) btn.innerHTML = `<i class="fa-solid fa-sun"></i> <span class="btn-label" id="labelTema">Claro</span>`;
        mostrarToast("Modo escuro ativado.", "info");
    } else {
        if (btn) btn.innerHTML = `<i class="fa-solid fa-moon"></i> <span class="btn-label" id="labelTema">Escuro</span>`;
        mostrarToast("Modo claro ativado.", "info");
    }
}

function altoContraste() {
    const isContraste = document.body.classList.toggle("alto-contraste");
    salvarStorage("itabus_alto_contraste", isContraste);

    const btn = document.getElementById("btnAltoContraste");
    if (btn) {
        if (isContraste) btn.classList.add("active");
        else btn.classList.remove("active");
    }
    mostrarToast(isContraste ? "Alto contraste ativado!" : "Contraste normal restaurado.", "info");
}

function alterarFonte(delta) {
    tamanhoFonte = Math.min(24, Math.max(13, tamanhoFonte + delta));
    document.body.style.fontSize = `${tamanhoFonte}px`;
    salvarStorage("itabus_fonte", tamanhoFonte);
    mostrarToast(`Tamanho do texto: ${tamanhoFonte}px`, "info");
}

/* LEITOR DE TELA POR VOZ ROBUSTO */
let vozSintetizadaEmAndamento = false;
let vozPausada = false;

function alternarLeituraVoz() {
    if (!("speechSynthesis" in window)) {
        mostrarToast("Seu navegador não suporta sintetizador de voz.", "warning");
        return;
    }

    if (vozSintetizadaEmAndamento) {
        pararLeituraVoz();
        return;
    }

    const telaAtiva = document.querySelector(".tela.ativa");
    let texto = telaAtiva ? telaAtiva.innerText : document.body.innerText;

    // Limpa caracteres especiais e quebras excessivas
    texto = texto.replace(/\n+/g, ". ").replace(/\s+/g, " ").trim();
    if (texto.length > 900) texto = texto.substring(0, 900) + "... Fim da leitura desta seção.";

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "pt-BR";
    utterance.rate = 1.05;

    utterance.onstart = function() {
        vozSintetizadaEmAndamento = true;
        vozPausada = false;
        const bar = document.getElementById("audioBarPlayer");
        if (bar) bar.style.display = "block";
        const label = document.getElementById("labelLeituraVoz");
        if (label) label.innerText = "Parar";
        const btn = document.getElementById("btnAudioLeitura");
        if (btn) btn.classList.add("active");
        mostrarToast("Iniciando leitura em voz...", "info");
    };

    utterance.onend = function() {
        finalizarEstadoAudio();
    };

    utterance.onerror = function() {
        finalizarEstadoAudio();
    };

    window.speechSynthesis.speak(utterance);
}

function pausarRetomarVoz() {
    if (!("speechSynthesis" in window)) return;
    const btn = document.getElementById("btnPausarVoz");

    if (vozPausada) {
        window.speechSynthesis.resume();
        vozPausada = false;
        if (btn) btn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        mostrarToast("Áudio retomado.", "info");
    } else {
        window.speechSynthesis.pause();
        vozPausada = true;
        if (btn) btn.innerHTML = `<i class="fa-solid fa-play"></i>`;
        mostrarToast("Áudio pausado.", "info");
    }
}

function pararLeituraVoz() {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }
    finalizarEstadoAudio();
    mostrarToast("Leitura em voz encerrada.", "info");
}

function finalizarEstadoAudio() {
    vozSintetizadaEmAndamento = false;
    vozPausada = false;
    const bar = document.getElementById("audioBarPlayer");
    if (bar) bar.style.display = "none";
    const label = document.getElementById("labelLeituraVoz");
    if (label) label.innerText = "Ouvir";
    const btn = document.getElementById("btnAudioLeitura");
    if (btn) btn.classList.remove("active");
}

function ouvirLinhaAudio(nome, desc) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${nome}, itinerário: ${desc}.`);
    utterance.lang = "pt-BR";
    window.speechSynthesis.speak(utterance);
}

/* =========================================================
   15. FUNÇÕES UTILITÁRIAS E TOASTS
   ========================================================= */

function mostrarToast(mensagem, tipo = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;

    let icone = "fa-circle-info";
    if (tipo === "success") icone = "fa-circle-check";
    if (tipo === "warning") icone = "fa-triangle-exclamation";
    if (tipo === "danger") icone = "fa-circle-exclamation";

    toast.innerHTML = `<i class="fa-solid ${icone}"></i> <span>${mensagem}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 4000);
}

function obterDiaSemanaAtual() {
    const d = new Date().getDay();
    if (d === 0) return "Domingo / Feriado";
    if (d === 6) return "Sábado";
    return "Segunda a sexta";
}

function calcularDiferencaMinutos(horaA, horaB) {
    const [hA, mA] = horaA.split(":").map(Number);
    const [hB, mB] = horaB.split(":").map(Number);
    const minA = hA * 60 + mA;
    const minB = hB * 60 + mB;
    return minB - minA;
}

function somarMinutos(horaStr, minSomar) {
    const [h, m] = horaStr.split(":").map(Number);
    const data = new Date();
    data.setHours(h, m + minSomar, 0);
    return data.toTimeString().substring(0, 5);
}

function subtrairMinutos(horaStr, minSubtrair) {
    const [h, m] = horaStr.split(":").map(Number);
    const data = new Date();
    data.setHours(h, m - minSubtrair, 0);
    return data.toTimeString().substring(0, 5);
}

function formatarTempoRelativo(isoString) {
    if (!isoString) return "";
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (diff < 1) return "Agora";
    if (diff < 60) return `Há ${diff} min`;
    const h = Math.floor(diff / 60);
    return `Há ${h}h`;
}

/* =========================================================
   16. INICIALIZAÇÃO NO CARREGAMENTO DA PÁGINA
   ========================================================= */

document.addEventListener("DOMContentLoaded", function() {
    // Restaura configurações salvas
    if (carregarStorage("itabus_tema_escuro", false)) {
        document.body.classList.add("tema-escuro");
        const btn = document.getElementById("btnToggleTema");
        if (btn) btn.innerHTML = `<i class="fa-solid fa-sun"></i> <span class="btn-label" id="labelTema">Claro</span>`;
    }

    if (carregarStorage("itabus_alto_contraste", false)) {
        document.body.classList.add("alto-contraste");
        const btn = document.getElementById("btnAltoContraste");
        if (btn) btn.classList.add("active");
    }

    tamanhoFonte = carregarStorage("itabus_fonte", 15);
    document.body.style.fontSize = `${tamanhoFonte}px`;

    // Carrega clima de Itapetininga em tempo real
    carregarClimaItapetininga();

    // Inicialização dos mapas e componentes
    inicializarMapas();
    atualizarInterfaceAdmin();
    atualizarBadgesHeader();
    renderizarInicio();
    renderizarLinhas();

    // Define hora de chegada desejada para daqui a 30 minutos por padrão
    const inputHora = document.getElementById("horarioAlvo");
    if (inputHora) {
        inputHora.value = somarMinutos(new Date().toTimeString().substring(0, 5), 35);
    }
});