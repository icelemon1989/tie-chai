import React from 'react';
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form';
import { signupFields } from '../form-fields.jsx';
import validate from './validate.jsx';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Multiselect from 'react-widgets/lib/Multiselect';
import DropdownList from 'react-widgets/lib/DropdownList';
import * as actions from '../../../actions/interests.jsx';


const { renderRadioGroup, renderTextField, renderCheckBox } = signupFields;
const renderDropDownList = ({ input, ...rest }) => <DropdownList {...input} {...rest}/>;

const renderMultiselect = ({ input, ...rest }) => <Multiselect {...input} onBlur={() => input.onBlur()} value={input.value || []} {...rest}/>;

class SurveySecondPage extends React.Component {
    constructor(props) {
      super(props);
    }

  render() {
    const { handleSubmit, previousPage } = this.props;
    return (
      <form onSubmit={ handleSubmit }>
        <div className="survey_container">
          <Field name="city" component={ renderRadioGroup } className="cities_list">
            {
              this.props.cities.map(city => 
                <RadioButton style={{ width: 0 }} key={ city.ID } value={ city.City_Name } label={ city.City_Name } />
              )
            }
          </Field>
        </div>
        <div>
          <Field name="profession" component={ renderTextField } label="Profession"/>
          <Field name="company" component={ renderTextField } label="Company"/>
        </div>
        <Field name="bio" component={ renderTextField } label="About me" multiLine={ true } rows={ 2 } />
         <div> 
          <h3 className="interests">Interests</h3>
          <Field name="interests" component={renderMultiselect} defaultValue={[]} onBlur={() => props.onBlur()} data={this.props.interests.map(i => i.Interest_Name)}/>
        </div>
        <div>
          <button type="button" className="Button survey" onClick={previousPage}>Previous</button>
          <button type="submit" className="Button survey">Sign Up</button>
        </div>
      </form>
    )
  }
}

SurveySecondPage = reduxForm({
  form: 'survey',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(SurveySecondPage);

function mapStateToProps(state){
  return {
    cities: state.cities,
    interests: state.interests
  }
}

export default connect(mapStateToProps, actions)(SurveySecondPage);