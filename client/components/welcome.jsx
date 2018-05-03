import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Button, Form, Icon, Dropdown } from "semantic-ui-react";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgs: [],
      repos: [],
      selectedOrg: props.username,
      selectedRepo: ""
    };
  }

  componentWillReceiveProps(props) {
    console.log("received", props);
    this.setState({ selectedOrg: props.user.username });
  }

  componentDidMount() {
    this.getUserRepos();
    this.getUserOrganizations();
  }

  getUserOrganizations() {
    axios
      .get("/api/repos/orgs")
      .then(res => res.data)
      .then(orgs => {
        this.setState({ orgs: orgs.data });
      });
  }

  getUserRepos() {
    axios
      .get("/api/repos")
      .then(res => res.data)
      .then(repos => {
        this.setState({ repos: repos.data });
      });
  }

  getOrganizationRepos(organization) {
    axios
      .get(`/api/repos/orgs/${organization}/repos`)
      .then(res => res.data)
      .then(repos => {
        this.setState({ repos: repos.data });
      });
  }

  onCreateProjectClick = () => {};

  onChange = (evt, { name, value }) => {
    this.setState({ [name]: value });
    if (name === "selectedOrg") {
      if (value === this.props.user.username) this.getUserRepos();
      else this.getOrganizationRepos(value);
    }
  };

  render() {
    console.log("state", this.state);
    const { orgs, repos } = this.state;
    const { user } = this.props;
    let orgOptions = orgs.map(org => ({ key: org.login, text: org.login, value: org.login }));
    const repoOptions = repos.map(repo => ({ key: repo.name, text: repo.name, value: repo.name }));
    orgOptions = [{ key: user.username, text: user.username, value: user.username }, ...orgOptions];

    return (
      <div>
        <Form.Select
          fluid
          name="selectedOrg"
          label="Organization"
          options={orgOptions}
          placeholder="Organization"
          value={this.state.selectedOrg}
          onChange={this.onChange}
        />
        <Form.Select
          fluid
          name="selectedRepo"
          label="Repositories"
          options={repoOptions}
          placeholder="Repositories"
          onChange={this.onChange}
        />
        <Button onClick={this.onCreateProjectClick}>
          <Icon name="github" /> Create Project
        </Button>
      </div>

      // <div>
      //   <Dropdown
      //     value={this.state.selectedOrg}
      //     text="LiviLammister"
      //     onChange={event => this.onChange(event, event.target)}
      //     name="selectedOrg">
      //     <Dropdown.Menu>
      //       <Dropdown.Item text="LiviLammister" key="livilammister" value="livilammister" />
      //       {orgs.map(org => <Dropdown.Item text={org.login} key={org.id} value={org.login} />)}
      //     </Dropdown.Menu>
      //   </Dropdown>
      //   <Dropdown
      //     text="Repositories..."
      //     value={this.state.selectedRepo}
      //     onChange={this.onChange}
      //     name="selectedOrg">
      //     <Dropdown.Menu>
      //       {repos.map(repo => <Dropdown.Item text={repo.name} key={repo.id} value={repo.name} />)}
      //     </Dropdown.Menu>
      //   </Dropdown>
      // </div>
    );
  }
}

const mapState = ({ user }) => {
  return { user: user.username ? user : { username: "Nothing" } };
};

export default connect(mapState, null)(Welcome);
