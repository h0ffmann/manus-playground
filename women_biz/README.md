# Consultoria para Mulheres Empreendedoras

Este repositório contém um template de consultoria para mulheres empreendedoras, que coleta informações sobre o tipo de negócio, capital inicial e perfil dos sócios, e gera um relatório personalizado com recomendações sobre ferramentas de social media, CRM e estratégias de tráfego pago.

## 📋 Funcionalidades

- Formulário completo para coleta de informações sobre o negócio
- Geração de relatório personalizado com base no tipo de negócio
- Envio automático do relatório por email
- Geração direta de relatórios via script (sem necessidade de preencher o formulário)
- Interface responsiva e amigável

## 🚀 Como executar localmente

### Pré-requisitos

- Navegador web moderno
- Servidor HTTP local (como o módulo `http-server` do Node.js ou o servidor HTTP do Python)

### Instalação e execução

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/consultoria-empreendedoras.git
cd consultoria-empreendedoras
```

2. Inicie um servidor HTTP local:

**Usando Python:**
```bash
python -m http.server 8000
```

**Usando Node.js:**
```bash
# Instale o http-server se ainda não tiver
npm install -g http-server
# Execute o servidor
http-server -p 8000
```

3. Acesse o template no navegador:
```
http://localhost:8000
```

## 📧 Configuração do envio de email

Para habilitar o envio de emails reais, é necessário configurar o EmailJS:

1. Crie uma conta em [EmailJS](https://www.emailjs.com/)
2. Configure um serviço de email (Gmail, Outlook, etc.)
3. Crie um template de email
4. Substitua os IDs de exemplo no arquivo `script.js`:

```javascript
// Substitua estes valores pelos seus IDs reais do EmailJS
emailjs.init("SEU_USER_ID");
emailjs.send('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', templateParams, 'SEU_USER_ID')
```

## 📊 Geração direta de relatórios (sem formulário)

Para gerar relatórios diretamente sem preencher o formulário, use o script `generate-report.js`:

```bash
node generate-report.js --tipo=airbnb --estagio=operacao_inicial --email=exemplo@email.com
```

Parâmetros disponíveis:
- `--tipo`: Tipo de negócio (airbnb, eventos, coworking, ecommerce, consultoria)
- `--estagio`: Estágio do negócio (ideia, planejamento, operacao_inicial, expansao)
- `--email`: Email para envio do relatório (opcional)
- `--output`: Caminho para salvar o relatório em HTML (opcional)

## 🌐 Deploy

### Deploy em serviço de hospedagem estática

1. Construa o projeto (não é necessário build para este projeto estático)
2. Faça upload dos arquivos para seu serviço de hospedagem preferido (Netlify, Vercel, GitHub Pages, etc.)

**Exemplo com GitHub Pages:**

1. Faça push do repositório para o GitHub
2. Vá para Settings > Pages
3. Selecione a branch main e a pasta raiz
4. Clique em Save

### Deploy via linha de comando (usando Netlify CLI)

```bash
# Instale o Netlify CLI
npm install -g netlify-cli

# Faça login
netlify login

# Deploy
netlify deploy --prod
```

## 🔄 CI/CD

Este repositório inclui configurações de CI/CD para GitHub Actions e Netlify:

- `.github/workflows/deploy.yml`: Configuração para deploy automático no GitHub Pages
- `netlify.toml`: Configuração para deploy automático no Netlify

Para usar o CI/CD:

1. Faça push do repositório para o GitHub
2. Conecte o repositório ao Netlify ou ative o GitHub Pages
3. Os deploys serão realizados automaticamente a cada push para a branch main

## 📝 Personalização

Para personalizar o template:

- Edite `index.html` para modificar a estrutura do formulário
- Edite `styles.css` para alterar o estilo visual
- Edite `email-service.js` para modificar a geração do relatório
- Edite `script.js` para alterar o comportamento do formulário

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request
