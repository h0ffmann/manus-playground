#!/usr/bin/env node

/**
 * Script para geração direta de relatórios de consultoria para mulheres empreendedoras
 * Este script permite gerar relatórios personalizados sem a necessidade de preencher o formulário web
 */

const fs = require('fs');
const path = require('path');

// Função para processar argumentos da linha de comando
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      params[key] = value || true;
    }
  });
  
  return params;
}

// Função para gerar o relatório de consultoria
function generateConsultancyReport(params) {
  const tipoNegocio = params.tipo || 'outro';
  const estagioNegocio = params.estagio || 'planejamento';
  
  // Recomendações personalizadas com base no tipo de negócio
  let socialMediaRecommendations = '';
  let crmRecommendations = '';
  let paidTrafficRecommendations = '';
  
  // Recomendações de social media por tipo de negócio
  switch(tipoNegocio) {
    case 'airbnb':
      socialMediaRecommendations = `
      <h3>Recomendações de Social Media para AirBnb/Hospedagem</h3>
      <ul>
          <li><strong>Instagram:</strong> Foco em conteúdo visual das propriedades e experiências dos hóspedes</li>
          <li><strong>Pinterest:</strong> Criação de boards temáticos para inspiração</li>
          <li><strong>Google Meu Negócio:</strong> Essencial para visibilidade local</li>
      </ul>`;
      break;
    case 'eventos':
      socialMediaRecommendations = `
      <h3>Recomendações de Social Media para Host de Eventos</h3>
      <ul>
          <li><strong>Instagram:</strong> Portfólio visual de eventos realizados</li>
          <li><strong>LinkedIn:</strong> Foco em eventos corporativos</li>
          <li><strong>Pinterest:</strong> Inspiração para diferentes tipos de eventos</li>
      </ul>`;
      break;
    case 'coworking':
      socialMediaRecommendations = `
      <h3>Recomendações de Social Media para Coworking</h3>
      <ul>
          <li><strong>LinkedIn:</strong> Principal canal para captação de clientes</li>
          <li><strong>Instagram:</strong> Showcase do espaço e comunidade</li>
          <li><strong>Google Meu Negócio:</strong> Essencial para buscas locais</li>
      </ul>`;
      break;
    case 'ecommerce':
      socialMediaRecommendations = `
      <h3>Recomendações de Social Media para E-commerce</h3>
      <ul>
          <li><strong>Instagram:</strong> Vitrine de produtos com recursos de compra</li>
          <li><strong>Pinterest:</strong> Ideal para produtos visuais</li>
          <li><strong>Facebook:</strong> Marketplace e grupos de nicho</li>
      </ul>`;
      break;
    case 'consultoria':
      socialMediaRecommendations = `
      <h3>Recomendações de Social Media para Serviços de Consultoria</h3>
      <ul>
          <li><strong>LinkedIn:</strong> Construção de autoridade e networking</li>
          <li><strong>Instagram:</strong> Conteúdo educativo e cases de sucesso</li>
          <li><strong>YouTube:</strong> Vídeos explicativos e webinars</li>
      </ul>`;
      break;
    default:
      socialMediaRecommendations = `
      <h3>Recomendações de Social Media</h3>
      <ul>
          <li><strong>LinkedIn:</strong> Para networking profissional</li>
          <li><strong>Instagram:</strong> Para conteúdo visual e engajamento</li>
          <li><strong>Facebook:</strong> Para comunidades e grupos de interesse</li>
      </ul>`;
  }
  
  // Recomendações de CRM com base no estágio do negócio
  switch(estagioNegocio) {
    case 'ideia':
    case 'planejamento':
      crmRecommendations = `
      <h3>Recomendações de CRM para Negócios Iniciantes</h3>
      <ul>
          <li><strong>HubSpot CRM (gratuito):</strong> Ideal para gestão básica de contatos e pipeline de vendas</li>
          <li><strong>Trello + Extensões CRM:</strong> Solução flexível e de baixo custo</li>
          <li><strong>Notion:</strong> Sistema personalizável para gestão de clientes</li>
      </ul>`;
      break;
    case 'operacao_inicial':
      crmRecommendations = `
      <h3>Recomendações de CRM para Negócios em Operação Inicial</h3>
      <ul>
          <li><strong>Pipedrive:</strong> Foco em gestão de pipeline de vendas</li>
          <li><strong>RD Station CRM:</strong> Solução brasileira com bom suporte local</li>
          <li><strong>Monday.com:</strong> Altamente personalizável para diferentes tipos de negócio</li>
      </ul>`;
      break;
    case 'expansao':
      crmRecommendations = `
      <h3>Recomendações de CRM para Negócios em Expansão</h3>
      <ul>
          <li><strong>Salesforce:</strong> Solução completa e escalável</li>
          <li><strong>HubSpot (pago):</strong> Suite completa de marketing, vendas e atendimento</li>
          <li><strong>Zoho CRM:</strong> Solução robusta com bom custo-benefício</li>
      </ul>`;
      break;
    default:
      crmRecommendations = `
      <h3>Recomendações de CRM</h3>
      <ul>
          <li><strong>HubSpot CRM (gratuito):</strong> Ideal para gestão básica de contatos</li>
          <li><strong>Pipedrive:</strong> Foco em gestão de pipeline de vendas</li>
          <li><strong>RD Station CRM:</strong> Solução brasileira com bom suporte local</li>
      </ul>`;
  }
  
  // Recomendações de tráfego pago por tipo de negócio
  switch(tipoNegocio) {
    case 'airbnb':
      paidTrafficRecommendations = `
      <h3>Estratégias de Tráfego Pago para AirBnb/Hospedagem</h3>
      <ul>
          <li><strong>Google Ads (40% do orçamento):</strong> Campanhas de pesquisa focadas em termos como "airbnb em [localidade]", "hospedagem em [localidade]"</li>
          <li><strong>Meta Ads - Facebook/Instagram (40% do orçamento):</strong> Campanhas de conversão com segmentação por interesse em viagens</li>
          <li><strong>Pinterest Ads (20% do orçamento):</strong> Campanhas de awareness para inspiração de viagem</li>
      </ul>`;
      break;
    case 'eventos':
      paidTrafficRecommendations = `
      <h3>Estratégias de Tráfego Pago para Host de Eventos</h3>
      <ul>
          <li><strong>Google Ads (35% do orçamento):</strong> Campanhas de pesquisa para termos como "espaço para eventos em [localidade]"</li>
          <li><strong>Meta Ads - Facebook/Instagram (35% do orçamento):</strong> Campanhas segmentadas por eventos de vida (noivado, casamento, formatura)</li>
          <li><strong>LinkedIn Ads (30% do orçamento):</strong> Campanhas por cargo e setor de atuação para eventos corporativos</li>
      </ul>`;
      break;
    case 'coworking':
      paidTrafficRecommendations = `
      <h3>Estratégias de Tráfego Pago para Coworking</h3>
      <ul>
          <li><strong>Google Ads (40% do orçamento):</strong> Campanhas de pesquisa para termos como "coworking em [localidade]", "escritório compartilhado"</li>
          <li><strong>LinkedIn Ads (40% do orçamento):</strong> Campanhas segmentadas por profissão, cargo e localidade</li>
          <li><strong>Meta Ads - Facebook/Instagram (20% do orçamento):</strong> Campanhas de remarketing e awareness local</li>
      </ul>`;
      break;
    case 'ecommerce':
      paidTrafficRecommendations = `
      <h3>Estratégias de Tráfego Pago para E-commerce</h3>
      <ul>
          <li><strong>Google Shopping (40% do orçamento):</strong> Anúncios de produtos com imagens e preços</li>
          <li><strong>Meta Ads - Facebook/Instagram (40% do orçamento):</strong> Campanhas de catálogo de produtos e remarketing dinâmico</li>
          <li><strong>Pinterest Ads (20% do orçamento):</strong> Pins promovidos para produtos visuais</li>
      </ul>`;
      break;
    case 'consultoria':
      paidTrafficRecommendations = `
      <h3>Estratégias de Tráfego Pago para Serviços de Consultoria</h3>
      <ul>
          <li><strong>Google Ads (35% do orçamento):</strong> Campanhas de pesquisa para termos relacionados à sua especialidade</li>
          <li><strong>LinkedIn Ads (45% do orçamento):</strong> Campanhas de conteúdo patrocinado e InMail para decision-makers</li>
          <li><strong>Meta Ads - Facebook/Instagram (20% do orçamento):</strong> Campanhas de remarketing e geração de leads</li>
      </ul>`;
      break;
    default:
      paidTrafficRecommendations = `
      <h3>Estratégias de Tráfego Pago</h3>
      <ul>
          <li><strong>Google Ads (40% do orçamento):</strong> Campanhas de pesquisa para termos relacionados ao seu negócio</li>
          <li><strong>Meta Ads - Facebook/Instagram (40% do orçamento):</strong> Campanhas de conversão e remarketing</li>
          <li><strong>LinkedIn Ads (20% do orçamento):</strong> Para negócios B2B e profissionais</li>
      </ul>`;
  }
  
  // Gera o HTML do relatório
  const reportHTML = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Consultoria para Mulheres Empreendedoras</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
          }
          h1, h2, h3 {
              color: #8e44ad;
          }
          h1 {
              border-bottom: 2px solid #8e44ad;
              padding-bottom: 10px;
          }
          .section {
              margin-bottom: 30px;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 5px;
          }
          ul {
              padding-left: 20px;
          }
          li {
              margin-bottom: 10px;
          }
          .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 0.9em;
              color: #666;
          }
          .cta-button {
              display: inline-block;
              background-color: #8e44ad;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px 0;
          }
      </style>
  </head>
  <body>
      <h1>Relatório de Consultoria para Mulheres Empreendedoras</h1>
      
      <p>Este relatório foi gerado automaticamente com base nos parâmetros fornecidos:</p>
      <ul>
          <li><strong>Tipo de Negócio:</strong> ${tipoNegocio}</li>
          <li><strong>Estágio do Negócio:</strong> ${estagioNegocio}</li>
      </ul>
      
      <div class="section">
          <h2>Recomendações de Ferramentas de Social Media</h2>
          ${socialMediaRecommendations}
      </div>
      
      <div class="section">
          <h2>Recomendações de CRM</h2>
          ${crmRecommendations}
      </div>
      
      <div class="section">
          <h2>Estratégias de Tráfego Pago</h2>
          ${paidTrafficRecommendations}
      </div>
      
      <div class="section">
          <h2>Board no Trello</h2>
          <p>Um board no Trello com todas as tarefas necessárias para implementação do seu projeto pode ser acessado através do link abaixo:</p>
          <a href="https://trello.com/b/exemplo/board-consultoria" class="cta-button">Acessar Board no Trello</a>
          <p>Este board inclui:</p>
          <ul>
              <li>Tarefas organizadas por prioridade</li>
              <li>Checklists detalhados para cada etapa</li>
              <li>Prazos recomendados</li>
              <li>Recursos e ferramentas sugeridos</li>
          </ul>
      </div>
      
      <div class="section">
          <h2>Próximos Passos</h2>
          <ol>
              <li>Acesse o board no Trello e familiarize-se com as tarefas</li>
              <li>Implemente as recomendações de social media para seu tipo de negócio</li>
              <li>Configure o CRM recomendado para gerenciar seus contatos e vendas</li>
              <li>Planeje suas campanhas de tráfego pago de acordo com as estratégias sugeridas</li>
              <li>Acompanhe seu progresso e ajuste sua estratégia conforme necessário</li>
          </ol>
      </div>
      
      <div class="footer">
          <p>Este relatório foi gerado automaticamente pelo script de consultoria para mulheres empreendedoras.</p>
          <p>Para mais informações ou assistência personalizada, entre em contato conosco.</p>
          <p>&copy; 2025 Consultoria para Mulheres Empreendedoras. Todos os direitos reservados.</p>
      </div>
  </body>
  </html>
  `;
  
  return reportHTML;
}

// Função para enviar o relatório por email (simulação)
function sendReportByEmail(email, reportHTML) {
  console.log(`Enviando relatório para ${email}...`);
  console.log('Em um ambiente real, o relatório seria enviado por email usando um serviço como EmailJS, SendGrid, etc.');
  console.log('Para implementar o envio real, configure um serviço de email e atualize este script.');
}

// Função principal
function main() {
  // Obter parâmetros da linha de comando
  const params = parseArgs();
  
  // Verificar parâmetros obrigatórios
  if (!params.tipo) {
    console.log('Erro: Parâmetro --tipo é obrigatório');
    console.log('Uso: node generate-report.js --tipo=airbnb --estagio=operacao_inicial --email=exemplo@email.com --output=relatorio.html');
    console.log('Tipos disponíveis: airbnb, eventos, coworking, ecommerce, consultoria, outro');
    console.log('Estágios disponíveis: ideia, planejamento, operacao_inicial, expansao');
    process.exit(1);
  }
  
  // Gerar o relatório
  console.log('Gerando relatório de consultoria...');
  const reportHTML = generateConsultancyReport(params);
  
  // Salvar o relatório em arquivo se o parâmetro output for fornecido
  if (params.output) {
    const outputPath = path.resolve(params.output);
    fs.writeFileSync(outputPath, reportHTML);
    console.log(`Relatório salvo em: ${outputPath}`);
  } else {
    // Se não houver output, salvar em um arquivo padrão
    const defaultOutput = path.resolve(`relatorio-${params.tipo}-${Date.now()}.html`);
    fs.writeFileSync(defaultOutput, reportHTML);
    console.log(`Relatório salvo em: ${defaultOutput}`);
  }
  
  // Enviar por email se o parâmetro email for fornecido
  if (params.email) {
    sendReportByEmail(params.email, reportHTML);
  }
  
  console.log('Processo concluído com sucesso!');
}

// Executar o script
main();
