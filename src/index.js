import React from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios'

let lat;
let long;
let intro;
let button;
let results;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            displayIntro: true,
            displayResults: false
        }
        this.handleBobaClick = this.handleBobaClick.bind(this);
    }

    componentDidMount() {
        if(navigator.geolocation) {
            console.log("getting current location")
            navigator.geolocation.getCurrentPosition(
            function(position) {
                lat = position.coords.latitude;
                long = position.coords.longitude;
                console.log("location acquired");
                let el = document.createElement('p');
                el.innerText = "Current Location: " + lat.toFixed(3) + ", " + long.toFixed(3);
                document.getElementById('current-location').appendChild(el);
            },
            function(error) {
                console.log("Please allow us to stalk you");
            });
        } else {
            console.log("What'd you do bruh?");
        }
    }

    handleBobaClick() {
        if(navigator.geolocation) {
            console.log("getting current location")
            navigator.geolocation.getCurrentPosition(
            function(position) {
                lat = position.coords.latitude;
                long = position.coords.longitude;
                console.log("location acquired");
                let current = document.getElementById('current-location');
                while(current.firstChild) {
                    current.removeChild(current.lastChild);
                }
                let el = document.createElement('p');
                el.innerText = "Current Location: " + lat.toFixed(3) + ", " + long.toFixed(3);
                document.getElementById('current-location').appendChild(el);
            },
            function(error) {
                console.log("Please allow us to stalk you");
            });
        }
        if(lat && long) {
            intro = null;
            results = null;
            document.getElementById('boba-button').innerText = "Refresh";
            this.setState({ displayIntro: false, displayResults: false });
            axios({
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
                if(response.data.businesses.length > 0) {
                    this.setState({
                        data: response.data.businesses,
                        displayResults: true,
                    })
                } else {
                    console.log("DAMN BRUH AINT NO BOBA AROUND YOU FOR 25 MILES")
                }
            })
            .catch((error)=> {
                console.log(error);
                return;
            })
        }
    }

    render() {
        if(this.state.displayIntro) { intro = <IntroPage /> }
        if(this.state.displayResults) {  results = <DisplayNearest data={this.state.data}/>}
        return (
            <div>
                <h1>Boba Near U</h1>
                <div id="current-location"></div>
                {intro}
                <button id="boba-button" onClick={this.handleBobaClick}>Find Boba!</button>
                {results}
            </div>
        )
    }
}

class IntroPage extends React.Component {
    render() {
        return (
            <div>
                <p>This is an application that takes your current location, wherever you are in the world, and finds the nearest boba/bubbletea parlor relative to your locaton</p>
                <p>If location permissions have not been enabled, you should have been greeted by an alert asking for permission</p>
                <p>Please be sure to accept location permissions and click on the button below to begin</p>
            </div>
        )
    }
}

class DisplayNearest extends React.Component {
    render() {
        let distance = (this.props.data[0].distance * 0.000621371)
        return (
            <div>
                <h1>{this.props.data[0].name}</h1>
                <p>{this.props.data[0].location.address1}</p>
                <p>{this.props.data[0].location.city}, {this.props.data[0].location.state} {this.props.data[0].location.zip_code}</p>
                <p>{this.props.data[0].display_phone}</p>
                {<p>{distance.toFixed(3)} miles away</p>}
            </div>
        )
    }
}

class LoadAnimation extends React.Component {
    render() {
        return (
            <div></div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));