import React from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios'

class GetBoba extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: "",
            long: "",
            data: null,
            nearestBobaName: "",
            nearestBobaAddress: "",
            nearestBobaCity: "",
            nearestBobaZip: "",
            nearestBobaState: "",
            nearestBobaPhone: "",
            nearestBobaDistance: ""
        }
    }

    componentDidMount() {
        if("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
            function(position) {
                this.setState({ lat: position.coords.latitude, long: position.coords.longitude});
            },
            function(error) {
                console.log("Please allow us to stalk you");
            });
        } else {
            console.log("What'd you do bruh?");
        }
    }

    getBoba(lat, long) {
        return axios({
            "method":"GET",
            "url":"https://cors-anywhere.herokuapp.com/api.yelp.com/v3/businesses/search",
            "headers":{
                "Access-Control-Allow-Origin":"*",
                "Authorization": `Bearer ${process.env.REACT_APP_YELP_KEY}`,
            },
            "params":{
                "term":process.env.REACT_APP_SEARCH_TERM,
                "latitude": lat,
                "longitude": long,
                "sort_by":"distance",
                "limit": 50,
                "radius": 40000
            }
        })
        .then((response)=> {
            console.log(response);
            if(response.data.businesses > 0) {
                this.setState({
                    data: response.data.businesses,
                    nearestBobaName: response.data.businesses[0].name,
                    nearestBobaAddress: response.data.businesses[0].location.address1,
                    nearestBobaCity: response.data.businesses[0].location.city,
                    nearestBobaZip: response.data.businesses[0].location.zip_code,
                    nearestBobaState: response.data.businesses[0].location.state,
                    nearestBobaPhone: response.data.businesses[0].display_phone,
                    nearestBobaDistance: (response.data.businesses[0].distance * 0.000621371)
                })
            } else {
                console.log("DAMN BRUH AINT NO BOBA AROUND YOU FOR 25 MILES")
            }
        })
        .catch((error)=> {
            console.log(error);
        })
    }

    render() {
        return (
            <ul>
                <li>{this.state.nearestBobaName}</li>
                <li>{this.state.nearestBobaAddress}</li>
                <li>{this.state.nearestBobaCity}</li>
                <li>{this.state.nearestBobaZip}</li>
                <li>{this.state.nearestBobaState}</li>
                <li>{this.state.nearestBobaPhone}</li>
                <li>{this.state.nearestBobaDistance}</li>
            </ul>
        )
    }
}

function App() {
    return(
        <div>
            <h1>Boba Near U</h1>
            <GetBoba />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));