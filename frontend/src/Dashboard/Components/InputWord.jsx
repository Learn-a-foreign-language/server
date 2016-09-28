import React from 'react';
import Autosuggest from 'react-autosuggest';

export default React.createClass({
    getInitialState: function() {
        return {
            value: ''
        };
    },
    makeSuggestion: function(input, callback) {
        this.setState({value: input});

        const req = new XMLHttpRequest();
        req.open("GET", "/words?search="+input, true);
        req.onreadystatechange = () => {
            if (req.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (req.status !== 200) {
                callback(new Error("Couldn't get suggestions"));
                return;
            }
            var suggestions = JSON.parse(req.responseText).words.map(w => w/*.expression*/);
            callback(null, suggestions);
        };
        req.send();
    },
    renderSuggestion: function(suggestion, input) { // suggestion is a word that will be displayed below the input as a suggestion
      const index = suggestion.expression.indexOf(input);
      return (
        <span>{suggestion.expression.slice(0, index)}<strong>{suggestion.expression.slice(index, index+input.length)}</strong>{suggestion.expression.slice(index+input.length)}</span>
      )
    },
    getSuggestionValue: function(suggestionObj) {
      return suggestionObj.expression;
    },
    style: {
        display: 'block',
        margin: '3px auto'
    },
    render: function() {
        const inputAttributes = {
            id: this.props.id,
            placeholder: this.props.placeholder,
            onChange: this.props.onChange
        };
        return <Autosuggest suggestions={this.makeSuggestion}
                            inputAttributes={inputAttributes}
                            suggestionRenderer={this.renderSuggestion}
                            suggestionValue={this.getSuggestionValue}
                            />
    }
});