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
      parserResult: "none"
    };
    this.debouncedParse = debounce(this.parse, 500);
  }

  componentWillReceiveProps(newProps) {
    // TODO: Deserialize filter in newProps if another component changes the filter.
    if (this.state.filter !== newProps.issues.filter) console.log("FilterBox: Receiving new filter via props.");
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
    this.setState({ filterText: event.target.value });
    this.debouncedParse();
  };

  parse() {
    const result = parse(this.state.filterText);
    this.setState({
      filter: result,
      parserResult: JSON.stringify(result),
      parserSerialized: this.serializeFilterObject(result)
    });
    this.props.setIssueFilter(result);
  }

  // Look into contentEditable div
  render() {
    return (
      <span className="inverted">
        <Search
          icon="search"
          placeholder="Filter Issues"
          value={this.state.filterText}
          onChange={this.onFilterChanged}
        />
      </span>
    );
  }

  renderDatalist() {
    return (
      <datalist id="context-suggestions">
        <option value="English" />
        <option value="Chinese" />
        <option value="Dutch" />
      </datalist>
    );
  }
}

const mapState = ({ issues }) => ({ issues });
const mapDispatch = { setIssueFilter };

export default connect(mapState, mapDispatch)(FilterBox);
