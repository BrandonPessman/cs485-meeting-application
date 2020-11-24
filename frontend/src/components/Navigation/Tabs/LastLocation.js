import { useRadioGroup } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import './LastLocation.css'
import LocationPin from './LocationPin'
import Grid from '@material-ui/core/Grid'

export default function LastLocation() {
    const [data, setData] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        window.navigator.geolocation.getCurrentPosition(position => {
            let lat = position.coords.latitude
            let lon = position.coords.longitude
            setLatitude(lat);
            setLongitude(lon);
            fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=2ad801f1e7934ba8a6c0a7977caad679`)
            .then(response => response.json())
            .then(res => {
                setData(res.results[0].components)
                console.log(res.results[0].components)

                let d = {
                        address: data.road,
                        lat: lat,
                        lng: lon,  
                }

                setLocation(d)
            });
        });
    }, [])



    return (
        <div>
            <Grid container spacing={12} style={{marginLeft: '20px', marginBottom: '20px'}}>
                <Grid item xs={3}>
                    <h1>Last Location</h1>
                    <h2>Details</h2>
                    <p><strong>Country:</strong> {data.country} ({data.country_code})</p>
                    <p><strong>State:</strong> {data.state} ({data.state_code})</p>
                    <p><strong>County:</strong> {data.county}</p>
                    <p><strong>Postal Code:</strong> {data.postcode}</p>
                    <p><strong>Road:</strong> {data.road}</p>
                    <h2>Advance Details</h2>
                    <p><strong>Latitude:</strong> {latitude}</p>
                    <p><strong>Longitude:</strong> {longitude}</p>
                </Grid>
                <Grid item xs={9}>
                    <div className="map">
                        <div className="google-map">
                            {location ?
                                <GoogleMapReact
                                    bootstrapURLKeys={{ key: 'AIzaSyACSFRGNtxV9Vc6ddTlOCBmUpvJjXiLA8I' }}
                                    defaultCenter={location}
                                    defaultZoom={15}
                                >
                                    <LocationPin
                                        lat={latitude}
                                        lng={longitude}
                                        text={data.road}
                                    />
                                </GoogleMapReact>
                            : <></>}
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}