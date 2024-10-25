import { Op } from "sequelize";
import TicketTraking from "./models/TicketTraking";
import moment from "moment";
import Ticket from "./models/Ticket";
import Whatsapp from "./models/Whatsapp";
import { getIO } from "./libs/socket";
import ShowTicketService from "./services/TicketServices/ShowTicketService";
import { logger } from "./utils/logger";





async function transferirTicket(ticket, wpp) {
  const io = getIO();
  await ticket.update({
    queueId: wpp.transferQueueId,
  });

  const ticketTraking = await TicketTraking.findOne({
    where: {
      ticketId: ticket.id
    },
    order: [["createdAt", "DESC"]]
  });

  await ticketTraking.update({
    queuedAt: moment().toDate(),
    queueId: wpp.transferQueueId,
  });

  const currentTicket = await ShowTicketService(ticket.id, ticket.companyId);

  const companyId = ticket.companyId;

  io.to(`company-${companyId}-pending`)
    .to(`queue-${ticket.queueId}-pending`)
    .to(`user-${ticket.userId}`)
    .emit(`company-${companyId}-ticket`, {
      action: "delete",
      ticketId: ticket.id
    });


  io.to(`company-${companyId}-${ticket.status}`)
    .to(`company-${companyId}-notification`)
    .to(`queue-${ticket.queueId}-${ticket.status}`)
    .to(`queue-${ticket.queueId}-notification`)
    .to(ticket.id.toString())
    .to(`user-${ticket?.userId}`)
    .emit(`company-${companyId}-ticket`, {
      action: "update",
      ticket: currentTicket
    });


  logger.info(`Ticket ${ticket.id} transferido as ${moment().format("DD/MM/YYYY HH:mm:ss")}`);
}

export const TransferTicketQueue = async (): Promise<void> => {



  const whatsapps = await Whatsapp.findAll({
    where: {
      timeToTransfer: {
        [Op.gt]: 0
      },
      transferQueueId: {
        [Op.not]: null
      }
    },
    include: [{ model: Ticket, as: "tickets", where: { status: "pending", queueId: null } }]
  });

  if (whatsapps.length == 0) return;

  for (const wpp of whatsapps) {
    const tickets = wpp.tickets;
    for (const ticket of tickets) {
      const tempoLimiteMs = wpp.timeToTransfer * 60 * 1000;
      const tempoDecorrido = Date.now() - ticket.updatedAt.getTime();
      const tempoRestante = tempoLimiteMs - tempoDecorrido;
      if (tempoRestante <= 0) {
        await transferirTicket(ticket, wpp);
      } else if (tempoRestante < 60000) {
        logger.info(`Agendando transferência do ticket ${ticket.id} em ${tempoRestante}ms`); // Menos de 1 minuto
        setTimeout(async () => {
          const ticketAlvo = await Ticket.findOne({
            where: {
              status: "pending",
              queueId: null
            }
          });
          if (ticketAlvo) {

            await transferirTicket(ticket, wpp);
          }
        }, tempoRestante);
      }
    }

  }




}

// Função auxiliar para transferir o ticket

