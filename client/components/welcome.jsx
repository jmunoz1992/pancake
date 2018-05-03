import React, { Component } from "react";
import axios from "axios";
import { Dropdown } from "semantic-ui-react";

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orgs: [],
            repos: [],
            selectedOrg: "",
            selectedRepo: "",
        };
    }

    componentDidMount() {
        axios.get("/api/repos/orgs")
            .then(res => res.data)
            .then(orgs => {
                this.setState({ orgs: orgs.data });
            });
        axios.get("/api/repos")
            .then(res => res.data)
            .then(repos => {
                this.setState({ repos: repos.data });
            });
    }

    onChange = (evt, { name, value }) => this.setState({ [name]: value })

    render() {
        console.log("state", this.state);
        const { orgs, repos } = this.state;
        return (
            <div>
                <Dropdown value={this.state.selectedOrg} text="LiviLammister" onChange={this.onChange} name="selectedOrg">
                    <Dropdown.Menu>
                        <Dropdown.Item text="LiviLammister" key="livilammister" value="livilammister" />
                        {orgs.map(org =>
                            <Dropdown.Item text={org.login} key={org.id} value={org.login} />
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown text="Repositories..." value={this.state.selectedRepo} onChange={this.onChange} name="selectedOrg">
                    <Dropdown.Menu>
                        {repos.map(repo =>
                            <Dropdown.Item text={repo.name} key={repo.id} value={repo.name} />
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }
}


export default Welcome;
