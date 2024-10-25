import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import ContactCustomField from "../../models/ContactCustomField";
import User from "../../models/User";
import UsersContacts from "../../models/UsersContacts";

interface ExtraInfo {
  id?: number;
  name: string;
  value: string;
}
interface ContactData {
  email?: string;
  number?: string;
  name?: string;
  active?: boolean;
  extraInfo?: ExtraInfo[];
  users?: User[];
}

interface Request {
  contactData: ContactData;
  contactId: string;
  companyId: number;
}

const UpdateContactService = async ({
  contactData,
  contactId,
  companyId
}: Request): Promise<Contact> => {
  const { email, name, number, extraInfo, active, users } = contactData;
  const contact = await Contact.findOne({
    where: { id: contactId },
    attributes: ["id", "name", "number", "email", "companyId", "profilePicUrl", "active", "isGroup"],
    include: ["extraInfo"]
  });

  if (contact?.companyId !== companyId) {
    throw new AppError("Não é possível alterar registros de outra empresa");
  }

  if (!contact) {
    throw new AppError("ERR_NO_CONTACT_FOUND", 404);
  }

  if (extraInfo) {
    await Promise.all(
      extraInfo.map(async (info: any) => {
        await ContactCustomField.upsert({ ...info, contactId: contact.id });
      })
    );

    await Promise.all(
      contact.extraInfo.map(async oldInfo => {
        const stillExists = extraInfo.findIndex(info => info.id === oldInfo.id);

        if (stillExists === -1) {
          await ContactCustomField.destroy({ where: { id: oldInfo.id } });
        }
      })
    );
  }


  await contact.update({
    name,
    number,
    email,
	active,
  });

  if (users && contact.isGroup) {
    try {
      // Verificar se o contato existe
      const contactExists = await Contact.findByPk(contact.id);
      if (!contactExists) {
        throw new AppError("Contato não encontrado", 404);
      }

      // Remover associações existentes
      await UsersContacts.destroy({ where: { contactId: contact.id } });

      // Adicionar novas associações
      for (const user of users) {
        // Verificar se o usuário existe
        const userExists = await User.findByPk(user.id);
        if (!userExists) {
          throw new AppError(`Usuário com ID ${user.id} não encontrado`, 404);
        }

        await UsersContacts.create({
          contactId: contact.id,
          userId: user.id
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar usuários do contato:", error);
      throw new AppError("Erro ao atualizar usuários do contato", 500);
    }
  }

  await contact.reload({
    attributes: ["id", "name", "number", "email", "profilePicUrl","active"],
    include: ["extraInfo"]
  });

  return contact;
};

export default UpdateContactService;
