import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EventForm from './eventForm.jsx';
import YelpSearchForm from './yelpSearchForm.jsx';
import BusinessGridList from './business.jsx';
import { GOOGLE_API } from '../../config.jsx'
import loadjs from 'loadjs';
import * as yelpActions from '../../actions/yelp.jsx'
import * as eventActions from '../../actions/events.jsx';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import { titleStyle } from './paperStyle.jsx';


class CreateEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statePlace: ''
    }
    this.handleEventSubmit = this.handleEventSubmit.bind(this);
    this.handleYelpClick = this.handleYelpClick.bind(this);
  }

  componentDidMount() {
    const url = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_API + "&libraries=places";
    loadjs(url, {
      success: () => {
        const input = document.getElementById('google_auto')
        const searchBox = new window.google.maps.places.SearchBox(input);
        searchBox.addListener('places_changed', () => {
          const place = searchBox.getPlaces();
          this.setState({
            statePlace: place[0].formatted_address
          })
        });

      },
      error: (error) => {
        console.log("Fail to load google autocomplete api url");
      }
    })
  }

  handleEventSubmit(value) {
    const date = value.date.toString().split(' ').slice(0, 4);
    const time = value.time.toString().split(' ').slice(4);
    const orginal = date.join(' ') + ' ' + time.join(' ');
    const datetimeString = this.props.translateDateTimeToString(date, time);
    const showBusinessAddress = this.props.selected_business ?
      this.props.selected_business.location.display_address.join(', ') : "";
    const showBusinessName = this.props.selected_business ? this.props.selected_business.name : "";
    const eventObj = {
      Name: showBusinessName,
      Email: localStorage.getItem('user_email'),
      Location: showBusinessAddress,
      Date: datetimeString,
      Original_Date: orginal,
      Title: value.title,
      Description: value.description,
      Image: this.props.selected_business.image_url,
      Rating: this.props.selected_business.rating.toString()
    }
    this.props.postEvents(eventObj);

  }

  handleYelpClick(value) {
    this.props.getYelpBusiness(value.keywordYelp, this.state.statePlace);
  }

  render() {
    return (
      <div className="HostEventContainer" style={{ "marginTop": "10%" }}>
        <Paper style={titleStyle} zDepth={1}>
          <h1>Host An Event</h1>
          <h3>Find Meeting Place</h3>
          <YelpSearchForm onSubmit={this.handleYelpClick} />
          {this.props.clicked_yelp ?
            <CircularProgress size={60} thickness={7} /> :
            this.props.yelp_businesses ? <BusinessGridList /> : null}
          <hr size="30px" />
          <EventForm onSubmit={this.handleEventSubmit} />
        </Paper>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    yelp_businesses: state.yelp.businesses,
    selected_business: state.business.selected_business,
    clicked_yelp: state.business.clicked_yelp
  };
}




export default connect(mapStateToProps, { ...yelpActions, ...eventActions })(CreateEvent);