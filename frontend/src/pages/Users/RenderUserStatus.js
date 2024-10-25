import React from 'react'
import { green, red } from "@material-ui/core/colors";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

export const RenderUserStatus = ({userStatus}) => {
  return (
    <div>
        {userStatus?.includes('online') ? <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}><CheckCircleIcon style={{ color: green[600], fontSize: '20px', marginRight: '5px' }} /> {userStatus}</span> : <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}><ErrorIcon style={{color: red[600], fontSize: '20px', marginRight: '5px'}} /> {userStatus}</span>}
    </div>
  )
}