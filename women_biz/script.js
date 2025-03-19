document.addEventListener('DOMContentLoaded', function() {
    // Inicializar EmailJS
    emailjs.init("user_abc123xyz456"); // Usando um ID de usuário de exemplo
    
    // Elementos do DOM
    const form = document.getElementById('consultoriaForm');
    const sections = document.querySelectorAll('.form-section');
    const progressBar = document.getElementById('progress');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const submitButton = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const addSocioButton = document.getElementById('adicionarSocio');
    const sociosContainer = document.getElementById('sociosContainer');
    
    // Variáveis de controle
    let currentSection = 0;
    let socioCount = 1;
    
    // Inicialização
    updateProgressBar();
    setupTipoNegocioListeners();
    setupHiddenInputListeners();
    
    // Event Listeners para navegação
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateSection(currentSection)) {
                goToNextSection();
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', goToPrevSection);
    });
    
    // Event Listener para adicionar sócio
    addSocioButton.addEventListener('click', addNewSocio);
    
    // Event Listener para envio do formulário
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateSection(currentSection)) {
            submitForm();
        }
    });
    
    // Funções de navegação
    function goToNextSection() {
        sections[currentSection].classList.remove('active');
        currentSection++;
        sections[currentSection].classList.add('active');
        updateProgressBar();
    }
    
    function goToPrevSection() {
        sections[currentSection].classList.remove('active');
        currentSection--;
        sections[currentSection].classList.add('active');
        updateProgressBar();
    }
    
    function updateProgressBar() {
        // Atualiza a barra de progresso
        const progress = ((currentSection) / (sections.length - 1)) * 100;
        progressBar.style.width = progress + '%';
        
        // Atualiza os passos
        progressSteps.forEach((step, idx) => {
            if (idx <= currentSection) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
            
            if (idx < currentSection) {
                step.classList.add('completed');
            } else {
                step.classList.remove('completed');
            }
        });
    }
    
    // Função para mostrar questionário específico por tipo de negócio
    function setupTipoNegocioListeners() {
        const tipoNegocioRadios = document.querySelectorAll('input[name="tipoNegocio"]');
        const tipoNegocioSections = document.querySelectorAll('.tipo-negocio-section');
        
        tipoNegocioRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                // Esconde todas as seções
                tipoNegocioSections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // Mostra a seção correspondente ao tipo selecionado
                if (this.checked) {
                    const value = this.value;
                    switch(value) {
                        case 'airbnb':
                            document.getElementById('airbnbSection').style.display = 'block';
                            break;
                        case 'eventos':
                            document.getElementById('eventosSection').style.display = 'block';
                            break;
                        case 'coworking':
                            document.getElementById('coworkingSection').style.display = 'block';
                            break;
                        case 'ecommerce':
                            document.getElementById('ecommerceSection').style.display = 'block';
                            break;
                        case 'consultoria':
                            document.getElementById('consultoriaSection').style.display = 'block';
                            break;
                    }
                    
                    // Se for "outro", mostra o campo de texto
                    if (value === 'outro') {
                        document.getElementById('tipoOutroTexto').style.display = 'inline-block';
                    } else {
                        document.getElementById('tipoOutroTexto').style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Função para mostrar/esconder campos de texto para opções "Outro"
    function setupHiddenInputListeners() {
        const checkboxesWithOther = document.querySelectorAll('input[type="checkbox"][value="outro"], input[type="checkbox"][value="outros"], input[type="radio"][value="outro"]');
        
        checkboxesWithOther.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const inputId = this.id + 'Texto';
                const hiddenInput = document.getElementById(inputId);
                
                if (hiddenInput) {
                    if (this.checked) {
                        hiddenInput.style.display = 'inline-block';
                    } else {
                        hiddenInput.style.display = 'none';
                        hiddenInput.value = '';
                    }
                }
            });
        });
    }
    
    // Função para adicionar novo sócio
    function addNewSocio() {
        socioCount++;
        
        // Clone do template do primeiro sócio
        const firstSocio = document.querySelector('.socio-section');
        const newSocio = firstSocio.cloneNode(true);
        
        // Atualiza os IDs e labels
        newSocio.setAttribute('data-socio', socioCount);
        newSocio.querySelector('h3').textContent = `Sócia ${socioCount}`;
        
        // Atualiza os IDs dos inputs
        const inputs = newSocio.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const oldId = input.id;
            const newId = oldId.replace('1', socioCount);
            input.id = newId;
            
            // Limpa os valores
            if (input.type === 'text' || input.type === 'number' || input.tagName === 'TEXTAREA') {
                input.value = '';
            } else if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            }
            
            // Atualiza o name dos radio buttons
            if (input.type === 'radio') {
                const oldName = input.name;
                const newName = oldName.replace('1', socioCount);
                input.name = newName;
            }
        });
        
        // Atualiza os for dos labels
        const labels = newSocio.querySelectorAll('label');
        labels.forEach(label => {
            if (label.htmlFor) {
                const oldFor = label.htmlFor;
                const newFor = oldFor.replace('1', socioCount);
                label.htmlFor = newFor;
            }
        });
        
        // Adiciona o novo sócio ao container
        sociosContainer.appendChild(newSocio);
        
        // Reinicia os listeners para os novos elementos
        setupHiddenInputListeners();
    }
    
    // Função para validar seção atual
    function validateSection(sectionIndex) {
        const currentSectionElement = sections[sectionIndex];
        const requiredInputs = currentSectionElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        // Remove mensagens de erro anteriores
        const errorMessages = currentSectionElement.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        // Valida cada campo obrigatório
        requiredInputs.forEach(input => {
            input.classList.remove('input-error');
            
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('input-error');
                
                // Adiciona mensagem de erro
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Este campo é obrigatório';
                errorMessage.style.color = 'var(--error-color)';
                errorMessage.style.fontSize = '0.85rem';
                errorMessage.style.marginTop = '5px';
                
                input.parentNode.appendChild(errorMessage);
            }
        });
        
        // Validações específicas para cada seção
        switch(sectionIndex) {
            case 0: // Informações do Negócio
                const tipoNegocioSelected = currentSectionElement.querySelector('input[name="tipoNegocio"]:checked');
                if (!tipoNegocioSelected) {
                    isValid = false;
                    // Adiciona mensagem de erro
                    const tipoNegocioGroup = currentSectionElement.querySelector('.form-group:first-of-type');
                    if (!tipoNegocioGroup.querySelector('.error-message')) {
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Selecione um tipo de negócio';
                        errorMessage.style.color = 'var(--error-color)';
                        errorMessage.style.fontSize = '0.85rem';
                        errorMessage.style.marginTop = '5px';
                        
                        tipoNegocioGroup.appendChild(errorMessage);
                    }
                }
                break;
                
            // Adicione validações específicas para outras seções se necessário
        }
        
        return isValid;
    }
    
    // Função para enviar o formulário
    function submitForm() {
        // Coleta os dados do formulário
        const formData = new FormData();
        
        // Informações do Negócio
        const tipoNegocio = document.querySelector('input[name="tipoNegocio"]:checked')?.value || '';
        formData.append('tipoNegocio', tipoNegocio);
        formData.append('descricaoNegocio', document.getElementById('descricaoNegocio').value);
        formData.append('estagioNegocio', document.getElementById('estagioNegocio').value);
        formData.append('localizacao', document.getElementById('localizacao').value);
        formData.append('alcance', document.getElementById('alcance').value);
        
        // Email para envio do relatório
        const emailContato = document.getElementById('emailContato').value;
        formData.append('emailContato', emailContato);
        
        // Envio do relatório de consultoria por email
        sendConsultancyReport(emailContato, formData);
        
        // Exibe mensagem de sucesso
        form.style.display = 'none';
        document.querySelector('.progress-container').style.display = 'none';
        successMessage.classList.remove('hidden');
        
        // Rolagem para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Função para enviar o relatório de consultoria por email
    function sendConsultancyReport(email, formData) {
        // Gera o relatório de consultoria personalizado
        const reportHTML = window.EmailService.generateConsultancyReport(formData);
        
        console.log(`Enviando relatório de consultoria para: ${email}`);
        
        // Preparação dos parâmetros para o EmailJS
        const templateParams = {
            email_to: email,
            tipo_negocio: formData.get('tipoNegocio'),
            estagio_negocio: formData.get('estagioNegocio'),
            report_html: reportHTML
        };
        
        // Envio real do email usando EmailJS
        emailjs.send('service_abc123', 'template_xyz456', templateParams, 'user_abc123xyz456')
            .then(function(response) {
                console.log('Email enviado!', response.status, response.text);
            }, function(error) {
                console.log('Falha no envio do email...', error);
            });
    }
});
