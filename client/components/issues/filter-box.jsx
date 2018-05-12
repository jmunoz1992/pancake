import React, { Component } from "react";
import { Form, Input } from "semantic-ui-react";
import { debounce } from "lodash";
import { default as filter } from "./filter-parser";
const parse = filter.parse;

class FilterBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: "",
      parserResult: "none"
    };
    this.doParse = debounce(this.runParser, 1000);
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
    this.doParse();
  };

  runParser() {
    const result = parse(this.state.filterText);
    this.setState({
      parserResult: JSON.stringify(result),
      parserSerialized: this.serializeFilterObject(result)
    });
  }

  // Look into contentEditable div
  render() {
    return (
      <span className="inverted">
        <Input
          icon="search"
          placeholder="Filter Issues"
          value={this.state.filterText}
          onChange={this.onFilterChanged}
        />
        {`Parsed: ${this.state.parserResult}, `}
        {`Serialized: ${this.state.parserSerialized}`}
      </span>
    );
  }
}

export default FilterBox;
