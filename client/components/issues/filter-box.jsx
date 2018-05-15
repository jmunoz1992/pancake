import React, { Component } from "react";
import { Form, Input, Search } from "semantic-ui-react";
import { debounce } from "lodash";
import { connect } from "react-redux";
import { setIssueFilter } from "../../store";
import { default as filter } from "./filter-parser";
const parse = filter.parse;

class FilterBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
      filterText: "",
      suggestions: [],
      caretPosition: 0,
      focused: false
    };
    this.debouncedParse = debounce(this.parse, 1000);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.filter !== newProps.issues.filter) this.setState({ filterText: this.serializeFilterObject(newProps.issues.filter) });
  }

  serializeFilterObject(filterObj) {
    let filterString = "";
    const quoteString = str => (str.indexOf(" ") === -1 ? str : `"${str}"`);
    //eslint-disable-next-line
    for (const key in filterObj) {
      switch (key) {
        case "labels":
        case "assignees": {
          filterString += `${key}:${filterObj[key].map(quoteString).join()}`;
          break;
        }
        case "status":
          filterString += `status:${filterObj[key]}`;
          break;
        default:
          break;
      }
      filterString += " ";
    }
    if (filterObj.text) filterString += filterObj.text.join(" ");
    return filterString.trim();
  }

  onFilterChanged = event => {
    this.textboxRef = event.target;
    this.setState(
      { filterText: event.target.value, caretPosition: event.target.selectionStart },
      this.parseSuggestions
    );
    this.debouncedParse();
  };

  parseSuggestions() {
    const position = this.state.caretPosition;
    let category = "category";
    if (this.isUserTypingCriteria(position)) {
      category = this.determineCriteriaCategory(position);
    }
    this.setState({ suggestions: this.getSuggestions(this.getInput(position), category) });
  }

  getSuggestions(input, suggestionType) {
    console.log("getSuggestions", `input='${input}'`, `suggestionType='${suggestionType}'`);

    const testFn = item => item.indexOf(input) !== -1 && item !== input;

    switch (suggestionType) {
      case "category":
        return ["labels:", "assignees:", "status:"].filter(testFn);
      case "assignees":
        return this.props.assignees.filter(testFn);
      case "labels":
        return this.props.labels.filter(testFn);
      case "status":
        return ["open", "closed"].filter(testFn);
      default:
        return [];
    }
  }

  parse() {
    const result = parse(this.state.filterText);
    this.setState({
      filter: result,
      parserResult: JSON.stringify(result),
      parserSerialized: this.serializeFilterObject(result)
    });
    this.props.setIssueFilter(result);
  }

  // Iterates backwards from the caret position to see if we find a colon or a space first.
  // Finding a space indicates the user may be typing a filter category (label:, assignee:, etc).
  // Finding a colon indicates the user may be typing criteria for a category.
  isUserTypingCriteria(caretPosition) {
    let position = caretPosition;
    let ignoreSpace = false;
    while (position > 0) {
      position--;
      if (this.state.filterText[position] === "\"") ignoreSpace = !ignoreSpace;
      if (this.state.filterText[position] === ":") return true;
      if (!ignoreSpace && this.state.filterText[position] === " ") return false;
    }
    return false;
  }

  // Iterates backwards from carat position to find a colon.  From there, it looks for the word
  // before the colon to determine if it is a known filter type (label, assignee, status).  If so,
  // it displays suggestions appropriate for that category.
  determineCriteriaCategory(caretPosition) {
    let position = caretPosition;
    let colonPosition = -1;
    let ignoreSpace = false;
    while (position > 0) {
      if (this.state.filterText[position - 1] === "\"") ignoreSpace = !ignoreSpace;
      if (!ignoreSpace && this.state.filterText[position - 1] === " ") break;
      if (this.state.filterText[position - 1] === ":") colonPosition = position - 1;
      position--;
    }
    if (colonPosition === -1) return "unknown";
    return this.state.filterText.slice(position, colonPosition);
  }

  getInput(caretPosition) {
    let position = caretPosition;
    let ignoreSpace = false;
    while (position > 0) {
      if (this.state.filterText[position - 1] === "\"") ignoreSpace = !ignoreSpace;
      if (this.state.filterText[position - 1] === ":") break;
      if (!ignoreSpace && this.state.filterText[position - 1] === " ") break;
      if (this.state.filterText[position - 1] === ",") break;
      position--;
    }
    return this.state.filterText.slice(position, caretPosition);
  }

  onResultSelect = (event, { result }) => {
    const input = this.getInput(this.state.caretPosition);
    const indexOfInput = this.state.caretPosition - input.length;
    let selectedText = result.title;
    if (selectedText.indexOf(" ") !== -1) selectedText = `"${selectedText}"`;

    let newText = this.state.filterText.slice(0, indexOfInput) + selectedText;
    const lengthDifference = selectedText.length - input.length;
    newText += this.state.filterText.slice(this.state.caretPosition);

    this.setState({ filterText: newText, caretPosition: this.state.caretPosition + lengthDifference }, () => {
      this.parseSuggestions();
      this.textboxRef.scrollLeft = this.textboxRef.scrollWidth;
      this.debouncedParse();
    });
  };

  render() {
    const results = this.state.suggestions.map(suggestion => ({ title: suggestion }));
    // Have to touch the DOM in a few places because the Semantic UI search component is pretty busted
    const focused = document.activeElement === this.textboxRef;
    return (
      <Search
        fluid
        as={Input}
        icon="search"
        placeholder="Filter Issues"
        results={results}
        value={this.state.filterText}
        onSearchChange={this.onFilterChanged}
        onResultSelect={this.onResultSelect}
        open={!!results.length && focused}
        selectFirstResult={true}
      />
    );
  }
}

const mapState = ({ issues, labels, collaborators }) => {
  const assignees = Object.values(collaborators).map(collaborator => collaborator.login);
  const labelArray = Object.values(labels).map(label => label.name);
  return { issues, labels: labelArray, assignees };
};
const mapDispatch = { setIssueFilter };

export default connect(mapState, mapDispatch)(FilterBox);
