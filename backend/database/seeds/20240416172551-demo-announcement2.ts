'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove dados existentes das tabelas
    await queryInterface.bulkDelete('Announcements', null, {});
    await queryInterface.bulkDelete('AnnouncementVisibilities', null, {});

    // Insere um novo anúncio
    const announcements = [{
      priority: 1,
      title: 'Principais Funcionalidades.',
      text: '🔊 Transcrever Áudios: Converta áudios recebidos em texto.\n\n🌟 Atendimento Organizado: Adicione vários atendentes e defina por setores para uma gestão organizada.\n\n📲 Adicionar Participantes: Integre novos participantes facilmente em conversas existentes.\n\n📢 Campanhas Personalizadas: Crie campanhas com agendamento e utilize variáveis para comunicações personalizadas.\n\n🗓️ Agendamento Recorrente: Automatize o envio de mensagens agendadas por contatos.\n\n🤖 Chatbot Inteligente: Configure seu chatbot por setor para respostas automatizadas.\n\n📁 Envio de Arquivos: Compartilhe imagens, vídeos, documentos e áudios de forma prática.\n\n📈 Gerenciamento de Leads: Capture leads automaticamente ao receberem contato.\n\n✉️ Mensagens Rápidas: Crie mensagens pré-configuradas para respostas ágeis.\n\n🏷️ Tags Personalizadas: Adicione tags para um melhor gerenciamento e organização.\n\n💼 Integração Financeira: Integre com sistemas de gestão financeira para uma visão completa.\n\n🏢 Gerenciamento Empresarial: Cadastre múltiplas empresas para uma gestão ampla.\n\n\nAtt. EQ. Whaticket Plus',
      mediaPath: '1713287704144_55.png',
      mediaName: '55.png',
      companyId: 1,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }];

    await queryInterface.bulkInsert('Announcements', announcements, {});

    // Obtém o ID do anúncio recém-inserido
    const [results] = await queryInterface.sequelize.query(
      'SELECT id FROM "Announcements" WHERE title = \'Principais Funcionalidades.\';'
    );
    const announcementId = results[0].id;

    // Insere a visibilidade do anúncio
    const visibilities = [{
      announcementId: announcementId,
      companyId: 1,
      visible: true,
      title: 'Principais Funcionalidades.',
      text: '🔊 Transcrever Áudios: Converta áudios recebidos em texto.\n\n🌟 Atendimento Organizado: Adicione vários atendentes e defina por setores para uma gestão organizada.\n\n📲 Adicionar Participantes: Integre novos participantes facilmente em conversas existentes.\n\n📢 Campanhas Personalizadas: Crie campanhas com agendamento e utilize variáveis para comunicações personalizadas.\n\n🗓️ Agendamento Recorrente: Automatize o envio de mensagens agendadas por contatos.\n\n🤖 Chatbot Inteligente: Configure seu chatbot por setor para respostas automatizadas.\n\n📁 Envio de Arquivos: Compartilhe imagens, vídeos, documentos e áudios de forma prática.\n\n📈 Gerenciamento de Leads: Capture leads automaticamente ao receberem contato.\n\n✉️ Mensagens Rápidas: Crie mensagens pré-configuradas para respostas ágeis.\n\n🏷️ Tags Personalizadas: Adicione tags para um melhor gerenciamento e organização.\n\n💼 Integração Financeira: Integre com sistemas de gestão financeira para uma visão completa.\n\n🏢 Gerenciamento Empresarial: Cadastre múltiplas empresas para uma gestão ampla.\n\n\nAtt. EQ. Whaticket Plus',
      mediaPath: '1713287704144_55.png',
      mediaName: '55.png',
      createdAt: new Date(),
      updatedAt: new Date()
    }];

    await queryInterface.bulkInsert('AnnouncementVisibilities', visibilities, {});
  },

  async down(queryInterface, Sequelize) {
    // Remove os dados inseridos
    await queryInterface.bulkDelete('AnnouncementVisibilities', null, {});
    await queryInterface.bulkDelete('Announcements', null, {});
  }
};