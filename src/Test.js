import React from 'react';
import Select from 'react-select-plus';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select-plus/dist/react-select-plus.css';

export default class Test extends React.Component {

    state = {
        multi: true,
        multiValue: [],
        options: [
            { value: 'R', label: 'Red' },
            { value: 'G', label: 'Green' },
            { value: 'B', label: 'Blue' }
        ],
        value: undefined
    }

    shouldComponentUpdate() {
        return true
    }

	handleOnChange (value) {
		const { multi } = this.state;
		if (multi) {
			this.setState({ multiValue: value });
		} else {
			this.setState({ value });
		}
	}

    render() {


        function logChange(val) {
            console.log(val);
        }
        const { multi, multiValue, options, value } = this.state;
        return (
            <Select.Creatable
                multi={multi}
                options={options}
                onChange={this.handleOnChange.bind(this)}
                value={multi ? multiValue : value}
            />
        )


    }
}