import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Button, Container, Divider, Form, Header, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import store, { me } from "../store";

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
      .then(() => {
        store.dispatch(me());
        this.props.history.push("/");
      });
  };

  onChange = (evt, { name, value }) => {
    this.setState({ [name]: value });
    if (name === "selectedOrg") {
      if (value === this.props.user.username) this.getUserRepos();
      else this.getOrganizationRepos(value);
    }
  };

  render() {
    const { orgs, repos } = this.state;
    const { user } = this.props;
    let orgOptions = orgs.map(org => ({ key: org.login, text: org.login, value: org.login }));
    let repoOptions = [];
    if (orgOptions && repos) {
      repoOptions = repos.map(repo => ({ key: repo.name, text: repo.name, value: repo.name }));
      orgOptions = [{ key: user.username, text: user.username, value: user.username }, ...orgOptions];
    }
    return (
      <Container text>
        <Divider hidden />
        <Header as="h2">Select Organization and Project </Header>
        <Divider hidden />
        <Form.Select
          fluid
          name="selectedOrg"
          label="Organization"
          options={orgOptions}
          placeholder="Organization"
          value={this.state.selectedOrg}
          onChange={this.onChange}
        />
        <Divider hidden />
        <Form.Select
          fluid
          name="selectedRepo"
          label="Repositories"
          options={repoOptions}
          placeholder="Repositories"
          onChange={this.onChange}
        />
        <Divider hidden />
        <Button primary onClick={this.onCreateProjectClick}>
          <Icon name="github" /> Create Project
        </Button>
      </Container>
    );
  }
}

const mapState = ({ user }) => {
  return { user: user.username ? user : { username: "Nothing" } };
};

export default withRouter(connect(mapState, null)(Welcome));
