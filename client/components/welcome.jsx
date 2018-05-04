import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Button, Form, Icon } from "semantic-ui-react";

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

  onCreateProjectClick = () => {
    axios
      .post("/api/project/", { owner: this.state.selectedOrg, repository: this.state.selectedRepo })
      .then(thing => console.log("we made it!", thing));
  };

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
    );
  }
}

const mapState = ({ user }) => {
  return { user: user.username ? user : { username: "Nothing" } };
};

export default connect(mapState, null)(Welcome);
