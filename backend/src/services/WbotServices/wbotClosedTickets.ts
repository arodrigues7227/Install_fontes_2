import { Op } from "sequelize";
import Ticket from "../../models/Ticket"
import Whatsapp from "../../models/Whatsapp"
import { getIO } from "../../libs/socket"
import formatBody from "../../helpers/Mustache";
import SendWhatsAppMessage from "./SendWhatsAppMessage";
import moment from "moment";
import ShowTicketService from "../TicketServices/ShowTicketService";
import { verifyMessage } from "./wbotMessageListener";
import TicketTraking from "../../models/TicketTraking";

export const ClosedAllOpenTickets = async (companyId: number): Promise<void> => {

  // @ts-ignore: Unreachable code error
  const closeTicket = async (ticket: any, currentStatus: any, body: any) => {
    if (currentStatus === 'nps') {

      await ticket.update({
        status: "closed",
        //userId: ticket.userId || null,
        lastMessage: body,
        unreadMessages: 0,
        amountUseBotQueues: 0
      });

    } else if (currentStatus === 'open') {

      await ticket.update({
        status: "closed",
        //  userId: ticket.userId || null,
        lastMessage: body,
        unreadMessages: 0,
        amountUseBotQueues: 0
      });

    } else {

      await ticket.update({
        status: "closed",
        //userId: ticket.userId || null,
        unreadMessages: 0
      });
    }
  };



  const io = getIO();
  try {

    const { rows: tickets } = await Ticket.findAndCountAll({
      where: { status: { [Op.in]: ["open", "npsOpen"] }, companyId },
      order: [["updatedAt", "DESC"]]
    });

    console.log("Runnning wbotClosedTickets", moment().format("DD/MM/YYYY HH:mm:ss"))
    console.log('tickets', JSON.stringify(tickets, null, 2))

    tickets.forEach(async ticket => {
      const showTicket = await ShowTicketService(ticket.id, companyId);
      const whatsapp = await Whatsapp.findByPk(showTicket?.whatsappId);

      const ticketTraking = await TicketTraking.findOne({
        where: {
          ticketId: ticket.id,
          finishedAt: null,
        }
      })

      if (!whatsapp) return;

      let {
        expiresInactiveMessage, //mensage de encerramento por inatividade
        expiresTicket //tempo em horas para fechar ticket automaticamente
      } = whatsapp


      if (ticketTraking?.ratingAt && moment(ticketTraking.ratingAt).isBefore(moment().subtract(2, 'minutes'))) {

        const sentMessage = await SendWhatsAppMessage({ body: whatsapp.complationMessage, ticket: showTicket });

        await verifyMessage(sentMessage, showTicket, showTicket.contact);

        await ticketTraking.update({
          finishedAt: moment().toDate(),
          closedAt: moment().toDate(),
          whatsappId: ticket.whatsappId,
          userId: ticket.userId,
        })

        setTimeout(async () => {
          await closeTicket(showTicket, showTicket.status, whatsapp.complationMessage);
        }, 2500)

      } else {
        const expiresTicketNumber = Number(expiresTicket);
        if (expiresTicketNumber > 0) {
          //mensagem de encerramento por inatividade
          console.log('expiresInactiveMessage', expiresInactiveMessage)
          const bodyExpiresMessageInactive = formatBody(`\u200e ${expiresInactiveMessage}`, showTicket.contact);

          const dataLimite = new Date()
          dataLimite.setMinutes(dataLimite.getMinutes() - expiresTicketNumber);

          if (showTicket.status === "open" && !showTicket.isGroup) {

            const dataUltimaInteracaoChamado = new Date(showTicket.updatedAt)

            if (dataUltimaInteracaoChamado < dataLimite && showTicket.fromMe) {



              if (expiresInactiveMessage !== "" && expiresInactiveMessage !== undefined) {
                const sentMessage = await SendWhatsAppMessage({ body: bodyExpiresMessageInactive, ticket: showTicket });

                await verifyMessage(sentMessage, showTicket, showTicket.contact);
              }

              await ticketTraking.update({
                finishedAt: moment().toDate(),
                closedAt: moment().toDate(),
                whatsappId: ticket.whatsappId,
                userId: ticket.userId,
              })

              setTimeout(async () => {
                await closeTicket(showTicket, showTicket.status, whatsapp.complationMessage);
                io.to(`company-${companyId}-${"open"}`)
                .to(`queue-${ticket.queueId}-${"open"}`)
                .to(`user-${ticket.userId}`)
                .emit(`company-${companyId}-ticket`, {
                  action: "delete",
                  ticketId: ticket.id
                });
                  }, 2500)



            }
          }
        }
      }


      // @ts-ignore: Unreachable code error

    });

  } catch (e: any) {
    console.log('e', e)
  }

}
