import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import { Icon } from '@iconify/react';
import filePlus from '@iconify/icons-mdi/plus-thick';
import fileDocument from '@iconify/icons-mdi/file-document';

export default function LastLocation() {
    useEffect(() => {

    }, [])

    return (
        <div style={{ margin: '40px 0px' }}>
            <h2 style={{ marginBottom: '0', marginTop: '0', fontWeight: '500' }}>
                My Files
                <span style={{ float: 'right' }}><Button variant='contained' color='primary' onClick={() => { document.body.style.zoom = .75; window.print(); document.body.style.zoom = 1; }}>
                    Upload File
            </Button></span>
            </h2>
            <h4 style={{fontStyle: 'italic', fontWeight: '300'}}>Upload any files related to your application. All those involved will be able to view them.</h4>

            <Grid container spacing={12} style={{marginTop: '20px'}}>
                <Grid item xs={2}>
                    <Paper style={{width: '90%', height: '220px'}} className="files">
                        <Icon icon={filePlus} style={{width: '100%', fontSize: '12em', color: "rgba(0,0,0,.08)", paddingTop: '20px'}} />
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <Paper style={{width: '90%', height: '220px'}} className="files">
                        <center>
                            <p style={{margin: '0', padding: '0', width: '100%', paddingTop: '5px'}}>resume.pdf</p>
                        </center>
                        <Icon icon={fileDocument} style={{width: '100%', fontSize: '9em', color: "rgb(27, 14, 83)", paddingTop: '20px'}} />
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <Paper style={{width: '90%', height: '220px'}} className="files">
                        <center>
                            <p style={{margin: '0', padding: '0', width: '100%', paddingTop: '5px'}}>coverletter.pdf</p>
                        </center>
                        <Icon icon={fileDocument} style={{width: '100%', fontSize: '9em', color: "rgb(27, 14, 83)", paddingTop: '20px'}} />
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <Paper style={{width: '90%', height: '220px'}} className="files">
                        <center>
                            <p style={{margin: '0', padding: '0', width: '100%', paddingTop: '5px'}}>recs.pdf</p>
                        </center>
                        <Icon icon={fileDocument} style={{width: '100%', fontSize: '9em', color: "rgb(27, 14, 83)", paddingTop: '20px'}} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}