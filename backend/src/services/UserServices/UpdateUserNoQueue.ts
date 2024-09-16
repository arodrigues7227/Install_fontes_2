import * as Yup from "yup";

import AppError from "../../errors/AppError";
import ShowUserService from "./ShowUserService";
import Company from "../../models/Company";
import User from "../../models/User";
import { getIO } from "../../libs/socket";

interface UserData {
  email?: string;
  password?: string;
  name?: string;
  profile?: string;
  companyId?: number;
  queueIds?: number[];
  whatsappId?: number;
  allTicket?: string;
  lastPresence?: Date;
  tokenVersion?: number;
  canDeleteTicket?: boolean;
}

interface Request {
  userData: UserData;
  user: User;

}

interface Response {
  id: number;
  name: string;
  email: string;
  profile: string;
}

const UpdateUserNoQueue = async ({
  userData,
  user,

}: Request): Promise<Response | undefined> => {


  const schema = Yup.object().shape({
    name: Yup.string().min(2),
    email: Yup.string().email(),
    profile: Yup.string(),
    password: Yup.string(),
    allTicket: Yup.string()
  });

  const { email, password, profile, name, whatsappId, allTicket, lastPresence, tokenVersion, canDeleteTicket } = userData;

  try {
    await schema.validate({ email, password, profile, name, allTicket });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  await user.update({
    email,
    password,
    profile,
    name,
    whatsappId: whatsappId || null,
    allTicket,
    lastPresence,
    tokenVersion,
    canDeleteTicket
  });


 


  const serializedUser = await User.findByPk(user.id,{
    attributes:["id", "name", "email", "profile","companyId","lastPresence", "updatedAt", "userStatus", "tokenVersion", "canDeleteTicket"],
    include:["company", "queues"]
  })




  const io = getIO();
  io.to(`company-${user.companyId}-mainchannel`).emit(`company-${user.companyId}-user`, {
    action: "update",
    user: serializedUser
  });

  return serializedUser;
};

export default UpdateUserNoQueue;
