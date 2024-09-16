import React from "react";
import { convertForHours } from "../../helpers/convertForHours";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { green, red } from "@material-ui/core/colors";


const offline = <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}><ErrorIcon style={{color: red[600], fontSize: '20px', marginRight: '5px'}} />Offline</span>
const online = <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}><CheckCircleIcon style={{ color: green[600], fontSize: '20px', marginRight: '5px' }} /> online</span>

export const RenderStatus = ({user}) => {
    const { lastPresence, tokenVersion } = user

    if(tokenVersion === 0) {
        return offline
    }else if(lastPresence) {
        let st =  offline
        let sTime = new Date().getTime() - new Date(lastPresence).getTime()
        let time = 1000 * 60 * 10 // se o a ultima confirmação de presença é 10 minutos atrás marca como online
        if (sTime < time) {
          st = online;
        }
        else {
          st = "offline a " + convertForHours(sTime)
        }
        return st
      }
    return  offline
}
