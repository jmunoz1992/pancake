import React from "react";
import { Dropdown, Input, Button, Icon, Item } from "semantic-ui-react";
import { connect } from "react-redux";
import { fetchMockupList, createNewMockup, switchMockup } from "../../store";

class MockupSwitcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addNewMockupText: ""
    };
  }

  componentDidMount() {
    this.props.fetchMockupList();
  }

  componentWillReceiveProps(props) {
    console.log(props);
    if (!props.networkStatus.connecting && !props.networkStatus.connected && props.mockupList.length) this.props.switchMockup(props.selectedMockup.id || props.mockupList[0].id);
  }

  render() {
    return (
      <Dropdown
        upward
        text={this.props.selectedMockup.name || "Loading..."}
        floating
        labeled
        button
        className="icon">
        <Dropdown.Menu>
          <Dropdown.Header content="Create New Mockup" />
          <Input
            action={{
              content: "Add",
              onClick: () => {
                this.props.createNewMockup(this.state.addNewMockupText);
                this.setState({ addNewMockupText: "" });
              }
            }}
            placeholder="Name"
            value={this.state.addNewMockupText}
            onChange={({ target }) => this.setState({ addNewMockupText: target.value })}
            onClick={event => event.stopPropagation()}
          />
          <Dropdown.Header content="Switch Mockup" />
          <Dropdown.Divider />
          {this.props.mockupList.map(mockup => (
            <Dropdown.Item key={mockup.id} onClick={() => this.props.switchMockup(mockup.id)}>
              {mockup.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const mapState = state => ({
  mockupList: state.mockups.mockupList,
  selectedMockup: state.mockups.mockupList.find(mockup => mockup.id === state.mockups.selectedMockup) || {
    id: 0,
    name: ""
  },
  networkStatus: state.designer.networkStatus
});

const mapDispatch = { fetchMockupList, createNewMockup, switchMockup };

export default connect(mapState, mapDispatch)(MockupSwitcher);
