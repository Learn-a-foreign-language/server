import React from 'react';

export default React.createClass({
    getInitialState: function() {
        return {value: ''};
    },
    handleChange: function(event) {
        this.setState({value: event.target.value});
    },
    style: {
        display: 'block',
        margin: '3px auto'
    },
    render: function() {
        return <input style={this.style} name={this.props.name} type={this.props.type} placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange} required />;
    }
});