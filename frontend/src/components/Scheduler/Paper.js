import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%'
    }
  }
}))

export default function PaperComp ({ Comp, Title, noPaper }) {
  const classes = useStyles()

  return (
    <div className={classes.root} style={{ margin: '40px 0px' }}>
      <h2 style={{ marginBottom: '0', marginTop: '0', fontWeight: '300' }}>
        {Title}
      </h2>

      {noPaper ? (
        <Comp />
      ) : (
        <Paper elevation={3} style={{ padding: '10px 30px' }}>
          <Comp />
        </Paper>
      )}
    </div>
  )
}
