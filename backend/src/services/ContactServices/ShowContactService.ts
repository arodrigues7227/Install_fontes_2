import Contact from "../../models/Contact";
import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import User from "../../models/User";



const ShowContactService = async (
  id: string | number,
  companyId: number
): Promise<Contact> => {
  const contact = await Contact.findByPk(id, {
    include: [
      "extraInfo",
      {
        model: Whatsapp,
        as: 'whatsapp',
        attributes: { exclude: ['session'] }
      },
      {
        model: User,
        as: 'users',
        attributes: ['id', 'name', 'email'], // Especifique apenas os atributos necessários
        through: { attributes: [] } // Isso evita a inclusão de atributos da tabela de junção
      }
    ]
  });

  if (contact?.companyId !== companyId) {
    throw new AppError("Não é possível excluir registro de outra empresa");
  }

  if (!contact) {
    throw new AppError("ERR_NO_CONTACT_FOUND", 404);
  }

  return contact;
};

export default ShowContactService;
