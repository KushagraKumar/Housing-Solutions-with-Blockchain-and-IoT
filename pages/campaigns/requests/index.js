import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { Link, Router } from '../../../routes';
import { Checkbox } from 'semantic-ui-react';

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
      address: props.query.address,
      security: summary[1],
      availablity: summary[2],
      description: summary[3],
      popularity: summary[4],
      rentPerDay: summary[5],
      name: summary[6]
    };
  }

  state = {
    address: this.props.address,
    name: this.props.name,
    security: this.props.security,
    description: this.props.description,
    rentPerDay: this.props.rentPerDay,
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.state.address);

      await campaign.methods
        .editDetails(this.state.security,this.state.description,this.state.rentPerDay,this.state.name,true)
        .send({
          from: accounts[0]
        });

      Router.pushRoute(`/campaigns/${this.state.address}`);
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Name of vehicle</label>
          <Input
            label="Short Name"
            labelPosition="right"
            value={this.state.name}
            onChange={event =>
              this.setState({ name: event.target.value })}
          />
        </Form.Field>
          <Form.Field>
            <label>Minimum Security Amount</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.security}
              onChange={event =>
                this.setState({ security: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Description of Vehicle</label>
            <Input
              label="Complete Details"
              labelPosition="right"
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Rent Per Day</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.rentPerDay}
              onChange={event =>
                this.setState({ rentPerDay: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestIndex;
