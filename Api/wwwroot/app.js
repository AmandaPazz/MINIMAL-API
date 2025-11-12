// ============================================================================
// NOTA: O frontend foi desenvolvido com auxílio de IA para o aprendizado.
// Utilizei a ferramenta para gerar um frontend base e ir alterando e melhorando.
// Também tentei documentar o máximo para realmente entender cada funcionalidae,
// maximando meu aprendizado.
// ============================================================================





// ============================================================================
// CONFIGURAÇÃO INICIAL E VARIÁVEIS GLOBAIS
// ============================================================================

// URL base da API - pega automaticamente a origem (localhost:5000, etc)
// window.location.origin = "http://localhost:5000" quando rodando localmente
const API_BASE_URL = window.location.origin;

// Token JWT de autenticação - armazenado no localStorage do navegador
// localStorage = armazenamento persistente no navegador (sobrevive ao fechar)
let authToken = localStorage.getItem('authToken');

// Email do usuário logado - também armazenado no localStorage
let userEmail = localStorage.getItem('userEmail');

// Perfil do usuário (Adm ou Editor) - determina quais funcionalidades aparecem
let userPerfil = localStorage.getItem('userPerfil');

// ============================================================================
// ELEMENTOS DO DOM (Document Object Model)
// ============================================================================
// DOM = representação HTML da página que o JavaScript pode manipular
// getElementById = busca um elemento HTML pelo seu id

// Telas principais
const loginScreen = document.getElementById('loginScreen');      // Tela de login
const mainScreen = document.getElementById('mainScreen');         // Tela principal (após login)

// Elementos do formulário de login
const loginForm = document.getElementById('loginForm');          // Formulário de login
const loginError = document.getElementById('loginError');        // Onde aparecem erros de login

// Elementos do header
const logoutBtn = document.getElementById('logoutBtn');          // Botão "Sair"
const userEmailSpan = document.getElementById('userEmail');     // Onde mostra o email do usuário

// Elementos da seção de veículos
const veiculosList = document.getElementById('veiculosList');    // Onde aparecem os cards de veículos
const loading = document.getElementById('loading');              // Indicador "Carregando..."
const emptyState = document.getElementById('emptyState');        // Mensagem quando não há veículos
const addVeiculoBtn = document.getElementById('addVeiculoBtn');  // Botão "Adicionar Veículo"
const refreshBtn = document.getElementById('refreshBtn');        // Botão de atualizar lista

// Elementos do modal de veículo
const veiculoModal = document.getElementById('veiculoModal');    // Modal (popup) de veículo
const veiculoForm = document.getElementById('veiculoForm');      // Formulário dentro do modal
const closeModal = document.getElementById('closeModal');        // Botão X para fechar modal
const cancelBtn = document.getElementById('cancelBtn');          // Botão "Cancelar" do modal
const modalTitle = document.getElementById('modalTitle');       // Título do modal ("Adicionar" ou "Editar")
const formError = document.getElementById('formError');          // Onde aparecem erros do formulário

// ============================================================================
// VERIFICAÇÃO INICIAL: JÁ ESTÁ LOGADO?
// ============================================================================
// Quando a página carrega, verifica se há token salvo
// Se tiver token, mostra a tela principal; se não, mostra login

if (authToken) {
    // Se existe token no localStorage, o usuário já estava logado
    showMainScreen();
} else {
    // Se não tem token, mostra a tela de login
    showLoginScreen();
}

// ============================================================================
// EVENT LISTENERS - CAPTURADORES DE EVENTOS
// ============================================================================
// Quando o evento acontece, executa a função especificada

// Evento: Submeter formulário de login
loginForm.addEventListener('submit', handleLogin);
// Quando usuário clica "Entrar" ou pressiona Enter, executa handleLogin()

// Evento: Clicar no botão "Sair"
logoutBtn.addEventListener('click', handleLogout);
// Quando clica em "Sair", executa handleLogout() e volta para login

// Evento: Clicar em "Adicionar Veículo"
addVeiculoBtn.addEventListener('click', () => openModal());
// () => openModal() = função anônima penModal()
// Abre o modal para criar um novo veículo

// Evento: Clicar no X do modal de veículo
closeModal.addEventListener('click', closeModalFunc);
// Fecha o modal quando clica no X

// Evento: Clicar em "Cancelar" no modal de veículo
cancelBtn.addEventListener('click', closeModalFunc);
// Fecha o modal quando clica em "Cancelar"

// Evento: Clicar no botão de atualizar (refresh)
refreshBtn.addEventListener('click', () => {
    // Verifica qual seção está visível e atualiza a lista correspondente
    const veiculosSection = document.getElementById('veiculosSection');
    if (veiculosSection.style.display !== 'none') {
        // Se a seção de veículos está visível, atualiza veículos
        loadVeiculos();
    } else {
        // Se não, está na seção de administradores, atualiza administradores
        loadAdministradores();
    }
});

// Evento: Submeter formulário de veículo
veiculoForm.addEventListener('submit', handleSaveVeiculo);
// Quando salva no modal, executa handleSaveVeiculo()

// ============================================================================
// ELEMENTOS E EVENT LISTENERS PARA ADMINISTRADORES
// ============================================================================

// Busca elementos relacionados a administradores
const adminBtn = document.getElementById('adminBtn');                    // Botão "Administradores"
const backToVeiculosBtn = document.getElementById('backToVeiculosBtn'); // Botão "Voltar"
const addAdminBtn = document.getElementById('addAdminBtn');              // Botão "Adicionar Administrador"
const adminModal = document.getElementById('adminModal');                // Modal de administrador
const adminForm = document.getElementById('adminForm');                 // Formulário do modal
const closeAdminModal = document.getElementById('closeAdminModal');     // X do modal
const cancelAdminBtn = document.getElementById('cancelAdminBtn');        // Cancelar do modal

// Event Listeners para administradores (só funcionam se os elementos existirem)
if (adminBtn) adminBtn.addEventListener('click', showAdministradoresSection);
// Se o botão existe, quando clicado mostra a seção de administradores

if (backToVeiculosBtn) backToVeiculosBtn.addEventListener('click', showVeiculosSection);
// Quando clica em "Voltar", volta para a seção de veículos

if (addAdminBtn) addAdminBtn.addEventListener('click', () => openAdminModal());
// Abre modal para criar novo administrador

if (closeAdminModal) closeAdminModal.addEventListener('click', closeAdminModalFunc);
// Fecha modal quando clica no X

if (cancelAdminBtn) cancelAdminBtn.addEventListener('click', closeAdminModalFunc);
// Fecha modal quando clica em "Cancelar"

if (adminForm) adminForm.addEventListener('submit', handleSaveAdmin);
// Quando salva no modal de admin, executa handleSaveAdmin()

// Evento: Fechar modal de administrador ao clicar fora dele
if (adminModal) {
    adminModal.addEventListener('click', (e) => {
        // e = evento (contém informações sobre o clique)
        // e.target = elemento que foi clicado
        if (e.target === adminModal) {
            // Se clicou exatamente no fundo do modal (não no conteúdo), fecha
            closeAdminModalFunc();
        }
    });
}

// Evento: Fechar modal de veículo ao clicar fora dele
veiculoModal.addEventListener('click', (e) => {
    if (e.target === veiculoModal) {
        closeModalFunc();
    }
});

// ============================================================================
// FUNÇÕES DE NAVEGAÇÃO ENTRE TELAS
// ============================================================================

/**
 * Mostra a tela de login e limpa dados do usuário
 * Esta função é chamada quando:
 * - O usuário faz logout
 * - Não há token salvo
 * - O token expirou ou é inválido
 */
function showLoginScreen() {
    // Adiciona classe "active" na tela de login (faz ela aparecer)
    loginScreen.classList.add('active');
    
    // Remove classe "active" da tela principal (faz ela sumir)
    mainScreen.classList.remove('active');
    
    // Limpa as variáveis globais
    authToken = null;
    userEmail = null;
    userPerfil = null;
    
    // Remove dados do localStorage (limpa o armazenamento)
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPerfil');
}

/**
 * Mostra a tela principal após login bem-sucedido
 * IMPORTANTE: Sempre mostra a seção de veículos por padrão (segurança)
 * Isso previne que um Editor acesse a tela de administradores se um Admin estava nela
 */
function showMainScreen() {
    // Esconde tela de login
    loginScreen.classList.remove('active');
    
    // Mostra tela principal
    mainScreen.classList.add('active');
    
    // Mostra o email do usuário no header
    userEmailSpan.textContent = userEmail || 'Usuário';
    
    // ===== CONTROLE DE ACESSO BASEADO NO PERFIL =====
    // Busca o botão de administradores
    const adminBtn = document.getElementById('adminBtn');
    
    if (userPerfil === 'Adm') {
        // Se o usuário é Administrador, mostra o botão
        adminBtn.style.display = 'inline-flex';
    } else {
        // Se é Editor ou outro perfil, esconde o botão
        adminBtn.style.display = 'none';
    }
    
    // ===== SEGURANÇA: SEMPRE COMEÇA NA SEÇÃO DE VEÍCULOS =====
    // Garante que qualquer usuário sempre começa na seção de veículos
    // Isso previne que um Editor veja a tela de administradores se um Admin estava nela
    const veiculosSection = document.getElementById('veiculosSection');
    const administradoresSection = document.getElementById('administradoresSection');
    
    // Mostra seção de veículos
    veiculosSection.style.display = 'block';
    
    // Esconde seção de administradores (importante para segurança)
    administradoresSection.style.display = 'none';
    
    // Carrega a lista de veículos
    loadVeiculos();
}

// ============================================================================
// FUNÇÃO DE LOGIN
// ============================================================================

/**
 * Função que processa o login do usuário
 * @param {Event} e - 
 * 
 * Como funciona:
 * 1. Pega email e senha do formulário
 * 2. Envia para API /administradores/login
 * 3. Se válido, recebe token JWT
 * 4. Armazena token e informações do usuário
 * 5. Mostra tela principal
 */
async function handleLogin(e) {
    // Previne o comportamento padrão do formulário (não recarrega a página)
    e.preventDefault();
    
    // Remove mensagens de erro anteriores
    loginError.classList.remove('show');
    
    // Pega os valores digitados nos campos do formulário
    // .value = pega o texto que o usuário digitou
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    
    try {
        // Faz requisição HTTP POST para a API
        // fetch = função JavaScript para fazer requisições HTTP
        const response = await fetch(`${API_BASE_URL}/administradores/login`, {
            method: 'POST',  // Método HTTP (POST = enviar dados)
            headers: {
                'Content-Type': 'application/json',  // Informa que está enviando JSON
            },
            body: JSON.stringify({ email, senha })  // Converte objeto para JSON e envia
            // { email, senha } = forma abreviada de { email: email, senha: senha }
        });

        // Verifica se a resposta foi bem-sucedida
        // response.ok = true se status for 200-299
        if (!response.ok) {
            // Se não foi bem-sucedida, trata o erro
            
            // Mensagem padrão de erro
            let errorMessage = 'Email ou senha incorretos';
            
            try {
                // Tenta ler a resposta como JSON (pode conter mensagem de erro da API)
                const errorData = await response.json();
                if (errorData.mensagem) {
                    errorMessage = errorData.mensagem;
                }
            } catch (e) {
                // Se não conseguir ler como JSON, usa mensagens baseadas no status HTTP
                // Status 401 = Não autorizado (credenciais inválidas)
                // Status 404 = Não encontrado (endpoint não existe ou usuário não existe)
                if (response.status === 401 || response.status === 404) {
                    errorMessage = 'Email ou senha incorretos';
                } 
                // Status 500+ = Erro no servidor
                else if (response.status >= 500) {
                    errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
                } 
                // Outros erros
                else {
                    errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
                }
            }
            
            // Mostra a mensagem de erro na tela
            loginError.textContent = errorMessage;
            loginError.classList.add('show');
            return;  // Para a execução da função aqui
        }

        // Se chegou aqui, o login foi bem-sucedido
        // Converte a resposta para JSON
        const data = await response.json();

        // Verifica se recebeu o token
        if (data.token) {
            // Armazena o token e informações do usuário
            authToken = data.token;        // Token JWT para autenticação
            userEmail = data.email;       // Email do usuário
            userPerfil = data.perfil;      // Perfil (Adm ou Editor)
            
            // Salva no localStorage (persiste mesmo após fechar o navegador)
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userEmail', userEmail);
            localStorage.setItem('userPerfil', userPerfil || '');
            
            // Mostra a tela principal
            showMainScreen();
        } else {
            // Se não recebeu token, mostra erro
            loginError.textContent = 'Resposta inválida do servidor';
            loginError.classList.add('show');
        }
    } catch (error) {
        // Erro de rede ou conexão (API não está rodando, sem internet, etc)
        loginError.textContent = 'Erro ao conectar com o servidor. Verifique se a API está rodando em ' + API_BASE_URL;
        loginError.classList.add('show');
        console.error('Erro de conexão:', error);  // Mostra erro no console do navegador (F12)
    }
}

// ============================================================================
// FUNÇÃO DE LOGOUT
// ============================================================================

/**
 * Faz logout do usuário
 * Limpa todos os dados e volta para a tela de login
 */
function handleLogout() {
    showLoginScreen();  // Volta para login e limpa tudo
}

// ============================================================================
// FUNÇÕES DE GERENCIAMENTO DE VEÍCULOS
// ============================================================================

/**
 * Carrega a lista de veículos da API
 * 
 * Como funciona:
 * 1. Mostra indicador "Carregando..."
 * 2. Faz requisição GET para /veiculos com token JWT
 * 3. Se sucesso, renderiza os veículos na tela
 * 4. Se erro, mostra mensagem apropriada
 */
async function loadVeiculos() {
    // Mostra indicador de carregamento
    loading.classList.add('show');
    
    // Esconde lista e mensagem de vazio
    veiculosList.classList.remove('show');
    emptyState.classList.remove('show');

    try {
        // Faz requisição GET para buscar veículos
        // GET = método HTTP para buscar dados (não envia body)
        const response = await fetch(`${API_BASE_URL}/veiculos`, {
            headers: {
                'Authorization': `Bearer ${authToken}`  // Envia token JWT para autenticação
                // Bearer = tipo de autenticação (padrão para JWT)
            }
        });

        // Se token inválido ou expirado, volta para login
        if (response.status === 401) {
            showLoginScreen();
            return;
        }

        // Converte resposta para JSON (array de veículos)
        const veiculos = await response.json();

        // Esconde indicador de carregamento
        loading.classList.remove('show');

        // Verifica se há veículos
        if (veiculos.length === 0) {
            // Se não há veículos, mostra mensagem de estado vazio
            emptyState.classList.add('show');
        } else {
            // Se há veículos, mostra a lista e renderiza os cards
            veiculosList.classList.add('show');
            renderVeiculos(veiculos);  // Cria os cards HTML para cada veículo
        }
    } catch (error) {
        // Erro de conexão
        loading.classList.remove('show');
        alert('Erro ao carregar veículos. Verifique se a API está rodando.');
        console.error('Erro:', error);
    }
}

/**
 * Cria os cards HTML para cada veículo
 * @param {Array} veiculos - Array de objetos veículo da API
 * 
 * Como funciona:
 * 1. Para cada veículo, cria HTML de um card
 * 2. Insere os dados do veículo no card
 * 3. Adiciona botões de editar e excluir
 * 4. Insere todos os cards no elemento veiculosList
 */
function renderVeiculos(veiculos) {
    // .map() = percorre cada veículo e cria HTML para ele
    // .join('') = junta todos os HTMLs em uma única string
    veiculosList.innerHTML = veiculos.map(veiculo => `
        <div class="veiculo-card">
            <!-- Card individual de cada veículo -->
            <h3>${escapeHtml(veiculo.nome)}</h3>
            <!-- Nome do veículo (escapeHtml previne XSS - ataques de segurança) -->
            <div class="marca">${escapeHtml(veiculo.marca)}</div>
            <!-- Marca do veículo -->
            <div class="ano">Ano: ${veiculo.ano}</div>
            <!-- Ano do veículo -->
            <div class="veiculo-actions">
                <!-- Container com botões de ação -->
                <button class="btn btn-success" onclick="editVeiculo(${veiculo.id})">✏️ Editar</button>
                <!-- 
                    onclick="editVeiculo(${veiculo.id})" = quando clica, chama função editVeiculo com o ID
                    ${veiculo.id} = interpolação de template (insere o ID do veículo)
                -->
                <button class="btn btn-danger" onclick="deleteVeiculo(${veiculo.id})">🗑️ Excluir</button>
                <!-- Botão para excluir veículo -->
            </div>
        </div>
    `).join('');
}

/**
 * Abre o modal para adicionar ou editar um veículo
 * @param {Object} veiculo - Objeto veículo (se null, é para adicionar; se tem dados, é para editar)
 * 
 * Como funciona:
 * 1. Limpa o formulário
 * 2. Se veiculo existe, preenche campos com dados dele (modo edição)
 * 3. Se veiculo é null, deixa campos vazios (modo criação)
 * 4. Mostra o modal
 */
function openModal(veiculo = null) {
    // Remove mensagens de erro anteriores
    formError.classList.remove('show');
    
    // Limpa o formulário
    veiculoForm.reset();
    
    // Limpa o campo oculto de ID
    document.getElementById('veiculoId').value = '';

    // Verifica se é edição ou criação
    if (veiculo) {
        // MODO EDIÇÃO: Preenche campos com dados do veículo
        modalTitle.textContent = 'Editar Veículo';
        document.getElementById('veiculoId').value = veiculo.id;  // ID oculto para saber qual editar
        document.getElementById('nome').value = veiculo.nome;
        document.getElementById('marca').value = veiculo.marca;
        document.getElementById('ano').value = veiculo.ano;
    } else {
        // MODO CRIAÇÃO: Campos vazios
        modalTitle.textContent = 'Adicionar Veículo';
    }

    // Mostra o modal (adiciona classe "show" que faz ele aparecer)
    veiculoModal.classList.add('show');
}

/**
 * Fecha o modal de veículo
 */
function closeModalFunc() {
    veiculoModal.classList.remove('show');  // Esconde o modal
    formError.classList.remove('show');      // Remove mensagens de erro
}

/**
 * Carrega dados de um veículo para edição
 * @param {number} id - ID do veículo a ser editado
 * 
 * Como funciona:
 * 1. Busca o veículo na API pelo ID
 * 2. Se encontrado, abre o modal com os dados preenchidos
 */
async function editVeiculo(id) {
    try {
        // Faz requisição GET para buscar o veículo específico
        const response = await fetch(`${API_BASE_URL}/veiculos/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            // Se encontrou, converte para JSON e abre modal
            const veiculo = await response.json();
            openModal(veiculo);  // Abre modal no modo edição
        } else {
            alert('Erro ao carregar veículo');
        }
    } catch (error) {
        alert('Erro ao carregar veículo');
        console.error('Erro:', error);
    }
}

/**
 * Salva um veículo (cria novo ou atualiza existente)
 * @param {Event} e - Evento do formulário
 * 
 * Como funciona:
 * 1. Pega valores do formulário
 * 2. Verifica se tem ID (edição) ou não (criação)
 * 3. Envia POST (novo) ou PUT (editar) para API
 * 4. Se sucesso, fecha modal e recarrega lista
 */
async function handleSaveVeiculo(e) {
    // Previne recarregar página
    e.preventDefault();
    
    // Remove erros anteriores
    formError.classList.remove('show');

    // Pega o ID do campo oculto
    const id = document.getElementById('veiculoId').value;
    
    // Cria objeto com dados do formulário
    const veiculo = {
        nome: document.getElementById('nome').value,
        marca: document.getElementById('marca').value,
        ano: parseInt(document.getElementById('ano').value)  // parseInt converte string para número
    };

    try {
        // Determina URL e método HTTP baseado se é edição ou criação
        const url = id ? `${API_BASE_URL}/veiculos/${id}` : `${API_BASE_URL}/veiculos`;
        // Se tem ID, edita; se não, cria novo
        const method = id ? 'PUT' : 'POST';
        // PUT = atualizar | POST = criar

        // Envia requisição para API
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(veiculo)  // Converte objeto para JSON
        });

        if (response.ok) {
            // Se sucesso, fecha modal e recarrega lista
            closeModalFunc();
            loadVeiculos();  // Atualiza a lista mostrando o veículo novo/editado
        } else {
            // Se erro, tenta ler mensagem de erro da API
            const error = await response.json();
            let errorMessage = 'Erro ao salvar veículo';
            
            // Verifica se há mensagens de validação
            if (error.mensagens && Array.isArray(error.mensagens)) {
                // Se há array de mensagens, junta todas
                errorMessage = error.mensagens.join(', ');
            } else if (error.mensagem) {
                // Se há mensagem única, usa ela
                errorMessage = error.mensagem;
            }
            
            // Mostra erro no formulário
            formError.textContent = errorMessage;
            formError.classList.add('show');
        }
    } catch (error) {
        // Erro de conexão
        formError.textContent = 'Erro ao conectar com o servidor';
        formError.classList.add('show');
        console.error('Erro:', error);
    }
}

/**
 * Exclui um veículo
 * @param {number} id - ID do veículo a ser excluído
 * 
 * Como funciona:
 * 1. Pede confirmação ao usuário
 * 2. Se confirmar, envia DELETE para API
 * 3. Se sucesso, recarrega lista
 */
async function deleteVeiculo(id) {
    // Pede confirmação antes de excluir
    // confirm() = mostra popup de confirmação (retorna true se clicar OK)
    if (!confirm('Tem certeza que deseja excluir este veículo?')) {
        return;  // Se cancelou, para aqui
    }

    try {
        // Envia requisição DELETE
        const response = await fetch(`${API_BASE_URL}/veiculos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        // DELETE geralmente retorna 204 (No Content) ou 200 (OK)
        if (response.ok || response.status === 204) {
            loadVeiculos();  // Recarrega lista (veículo foi removido)
        } else {
            alert('Erro ao excluir veículo');
        }
    } catch (error) {
        alert('Erro ao excluir veículo');
        console.error('Erro:', error);
    }
}

// ============================================================================
// FUNÇÃO AUXILIAR: ESCAPAR HTML
// ============================================================================

/**
 * Previne ataques XSS (Cross-Site Scripting)
 * Remove caracteres especiais que poderiam ser interpretados como HTML
 * @param {string} text - Texto a ser escapado
 * @returns {string} - Texto seguro para inserir no HTML
 * 
 * Exemplo:
 * escapeHtml("<script>alert('hack')</script>") 
 * retorna: "&lt;script&gt;alert('hack')&lt;/script&gt;"
 * Isso faz o navegador mostrar o texto ao invés de executar código
 */
function escapeHtml(text) {
    const div = document.createElement('div');  // Cria elemento temporário
    div.textContent = text;                     // Insere texto (automaticamente escapa HTML)
    return div.innerHTML;                      // Retorna HTML escapado
}

// ============================================================================
// FUNÇÕES DE GERENCIAMENTO DE ADMINISTRADORES
// ============================================================================
// Estas funções só são acessíveis para usuários com perfil "Adm"

/**
 * Mostra a seção de administradores
 * IMPORTANTE: Só deve ser chamada se userPerfil === 'Adm'
 * O botão só aparece para Adm, mas esta verificação adicional garante segurança
 */
function showAdministradoresSection() {
    // Verificação de segurança: só permite se for Administrador
    if (userPerfil !== 'Adm') {
        // Se não for Adm, volta para veículos e mostra alerta
        showVeiculosSection();
        alert('Acesso negado. Apenas administradores podem acessar esta seção.');
        return;
    }
    
    // Esconde seção de veículos
    document.getElementById('veiculosSection').style.display = 'none';
    
    // Mostra seção de administradores
    document.getElementById('administradoresSection').style.display = 'block';
    
    // Carrega lista de administradores
    loadAdministradores();
}

/**
 * Volta para a seção de veículos
 * Sempre mostra veículos e esconde administradores
 */
function showVeiculosSection() {
    // Esconde seção de administradores
    document.getElementById('administradoresSection').style.display = 'none';
    
    // Mostra seção de veículos
    document.getElementById('veiculosSection').style.display = 'block';
    
    // Recarrega lista de veículos
    loadVeiculos();
}

/**
 * Carrega lista de administradores da API
 * Similar a loadVeiculos(), mas para administradores
 */
async function loadAdministradores() {
    // Verificação de segurança
    if (userPerfil !== 'Adm') {
        showVeiculosSection();
        return;
    }
    
    // Busca elementos do DOM
    const adminLoading = document.getElementById('adminLoading');
    const administradoresList = document.getElementById('administradoresList');
    const adminEmptyState = document.getElementById('adminEmptyState');

    // Mostra carregamento
    adminLoading.classList.add('show');
    administradoresList.classList.remove('show');
    adminEmptyState.classList.remove('show');

    try {
        // Faz requisição GET para buscar administradores
        const response = await fetch(`${API_BASE_URL}/administradores`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        // Se token inválido, volta para login
        if (response.status === 401) {
            showLoginScreen();
            return;
        }

        // Se não foi bem-sucedida, lança erro
        if (!response.ok) {
            throw new Error('Erro ao carregar administradores');
        }

        // Converte resposta para JSON
        const administradores = await response.json();

        // Esconde carregamento
        adminLoading.classList.remove('show');

        // Verifica se há administradores
        if (administradores.length === 0) {
            adminEmptyState.classList.add('show');
        } else {
            administradoresList.classList.add('show');
            renderAdministradores(administradores);
        }
    } catch (error) {
        adminLoading.classList.remove('show');
        alert('Erro ao carregar administradores. Verifique se a API está rodando.');
        console.error('Erro:', error);
    }
}

/**
 * Cria cards HTML para cada administrador
 * @param {Array} administradores - Array de objetos administrador
 */
function renderAdministradores(administradores) {
    const administradoresList = document.getElementById('administradoresList');
    administradoresList.innerHTML = administradores.map(admin => `
        <div class="veiculo-card">
            <!-- Reutiliza o estilo de card de veículo -->
            <h3>${escapeHtml(admin.email)}</h3>
            <!-- Mostra email do administrador -->
            <div class="marca">Perfil: ${escapeHtml(admin.perfil)}</div>
            <!-- Mostra perfil (Adm ou Editor) -->
            <div class="veiculo-actions">
                <button class="btn btn-success" onclick="editAdmin(${admin.id})">✏️ Editar</button>
                <button class="btn btn-danger" onclick="deleteAdmin(${admin.id})" 
                        ${admin.id === 1 ? 'disabled title="Não é possível excluir o administrador principal"' : ''}>
                    🗑️ Excluir
                </button>
                <!-- 
                    Se ID é 1 (primeiro admin), desabilita botão de excluir
                    disabled = botão não funciona
                    title = texto que aparece ao passar mouse
                -->
            </div>
        </div>
    `).join('');
}

/**
 * Abre modal para adicionar ou editar administrador
 * @param {Object} admin - Objeto administrador (null = criar, com dados = editar)
 */
function openAdminModal(admin = null) {
    // Verificação de segurança
    if (userPerfil !== 'Adm') {
        alert('Acesso negado. Apenas administradores podem gerenciar outros administradores.');
        return;
    }
    
    const adminFormError = document.getElementById('adminFormError');
    
    // Limpa formulário
    adminForm.reset();
    document.getElementById('adminId').value = '';

    if (admin) {
        // MODO EDIÇÃO
        document.getElementById('adminModalTitle').textContent = 'Editar Administrador';
        document.getElementById('adminId').value = admin.id;
        document.getElementById('adminEmail').value = admin.email;
        document.getElementById('adminSenha').value = '';  // Não preenche senha (segurança)
        document.getElementById('adminPerfil').value = admin.perfil;
    } else {
        // MODO CRIAÇÃO
        document.getElementById('adminModalTitle').textContent = 'Adicionar Administrador';
    }

    // Remove erros e mostra modal
    adminFormError.classList.remove('show');
    adminModal.classList.add('show');
}

/**
 * Fecha modal de administrador
 */
function closeAdminModalFunc() {
    adminModal.classList.remove('show');
    const adminFormError = document.getElementById('adminFormError');
    adminFormError.classList.remove('show');
}

/**
 * Carrega dados de um administrador para edição
 * @param {number} id - ID do administrador
 */
async function editAdmin(id) {
    // Verificação de segurança
    if (userPerfil !== 'Adm') {
        alert('Acesso negado.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/administradores/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const admin = await response.json();
            openAdminModal(admin);
        } else {
            alert('Erro ao carregar administrador');
        }
    } catch (error) {
        alert('Erro ao carregar administrador');
        console.error('Erro:', error);
    }
}

/**
 * Salva administrador (cria ou atualiza)
 * @param {Event} e - Evento do formulário
 */
async function handleSaveAdmin(e) {
    // Verificação de segurança
    if (userPerfil !== 'Adm') {
        alert('Acesso negado.');
        return;
    }
    
    e.preventDefault();
    const adminFormError = document.getElementById('adminFormError');
    adminFormError.classList.remove('show');

    // Pega dados do formulário
    const id = document.getElementById('adminId').value;
    const admin = {
        email: document.getElementById('adminEmail').value,
        senha: document.getElementById('adminSenha').value,
        perfil: document.getElementById('adminPerfil').value
    };

    try {
        // Determina URL e método
        const url = `${API_BASE_URL}/administradores${id ? `/${id}` : ''}`;
        const method = id ? 'PUT' : 'POST';

        // Envia requisição
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(admin)
        });

        if (response.ok) {
            closeAdminModalFunc();
            loadAdministradores();
        } else {
            // Trata erros
            const error = await response.json();
            let errorMessage = 'Erro ao salvar administrador';
            
            if (error.mensagens && Array.isArray(error.mensagens)) {
                errorMessage = error.mensagens.join(', ');
            } else if (error.mensagem) {
                errorMessage = error.mensagem;
            }
            
            adminFormError.textContent = errorMessage;
            adminFormError.classList.add('show');
        }
    } catch (error) {
        adminFormError.textContent = 'Erro ao conectar com o servidor';
        adminFormError.classList.add('show');
        console.error('Erro:', error);
    }
}

/**
 * Exclui um administrador
 * @param {number} id - ID do administrador
 */
async function deleteAdmin(id) {
    // Verificação de segurança
    if (userPerfil !== 'Adm') {
        alert('Acesso negado.');
        return;
    }
    
    // Não permite excluir o primeiro administrador (ID 1)
    if (id === 1) {
        alert('Não é possível excluir o administrador principal');
        return;
    }

    // Pede confirmação
    if (!confirm('Tem certeza que deseja excluir este administrador?')) {
        return;
    }

    try {
        // Envia requisição DELETE
        const response = await fetch(`${API_BASE_URL}/administradores/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok || response.status === 204) {
            loadAdministradores();  // Recarrega lista
        } else {
            alert('Erro ao excluir administrador');
        }
    } catch (error) {
        alert('Erro ao excluir administrador');
        console.error('Erro:', error);
    }
}
