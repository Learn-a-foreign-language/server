import React from 'react';

export default React.createClass({
    getInitialState: function() {
        return {
            value: "",
            lines: []
        };
    },
    handleChange: function(event) {
        const new_lines = event.target.value.split('\n');
        console.log("change")
        console.log(event.target.value)
        this.setState({
            value: event.target.value,
            lines: new_lines
        });
        console.log(new_lines)
        this.props.onChange(new_lines);
    },
    render: function() {
        return <textarea rows="5" name="description" value={this.state.value} onChange={this.handleChange} />;
    }
});