import React from 'react';

export default React.createClass({
    getInitialState: function() {
        return {value: this.props.value};
    },
    handleChange: function(event) {
        this.setState({value: event.target.value});
    },
    render: function() {
        return <input type="submit" value={this.state.value} onChange={this.handleChange} onClick={this.props.onClick} />;
    }
});