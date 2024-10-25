'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Configurations', [{
      nomeSistema: 'Whaticket Plus',
      numeroSuporte: '5551992919891',
      codigoCor: '#0039e6',
      primaryDark: '#1949d7',
      textPrimary: '#0fcc35',
      tabHeaderBackground: '#1949d7',
      options: '#0fcc35',
      fancyBackground: '#0fcc35',
      companyId: 1,
      logo: null,
      mensagemWhatsApp: 'Mensagem de WhatsApp padrão',
      mensagemEmail: 'Mensagem de e-mail padrão',
      mensagemRedefinicaoSenha: 'Olá,\n\nVocê solicitou a redefinição da sua senha para a sua conta. Para continuar com o processo de redefinição, por favor, utilize o token de segurança abaixo:\n\nToken de Redefinição: {tokenSenha}\n\nSe você não solicitou a redefinição da senha, por favor ignore este e-mail ou entre em contato conosco se você acredita que isso foi um erro.\n\nAgradecemos pela sua atenção.\n\nAtenciosamente',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Configurations', null, {});
  }
};