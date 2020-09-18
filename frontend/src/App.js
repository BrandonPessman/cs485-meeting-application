import React from 'react'

import People from './components/People'

import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import MeetingCreatorIcon from '@material-ui/icons/AddBox'
import UpcomingScheduleIcon from '@material-ui/icons/CalendarToday'
import PastScheduleIcon from '@material-ui/icons/History'
import LogoutIcon from '@material-ui/icons/ExitToApp'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerContainer: {
    overflow: 'auto'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}))

export default function ClippedDrawer () {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <Typography variant='h6' noWrap>
            Meeting Scheduler
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant='permanent'
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button key='nav-meeting-creator'>
              <ListItemIcon>
                <MeetingCreatorIcon />
              </ListItemIcon>
              <ListItemText primary='New Meeting' />
            </ListItem>
            <ListItem button key='nav-upcoming-schedule'>
              <ListItemIcon>
                <UpcomingScheduleIcon />
              </ListItemIcon>
              <ListItemText primary='Upcoming Schedule' />
            </ListItem>
            <ListItem button key='nav-past-schedule'>
              <ListItemIcon>
                <PastScheduleIcon />
              </ListItemIcon>
              <ListItemText primary='Past Schedule' />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key='nav-logout'>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary='Logout' />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <People />
      </main>
    </div>
  )
}
