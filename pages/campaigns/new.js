import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    security: '',
    description: '',
    rnt : '',
    name: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createLease(this.state.security,this.state.description,this.state.rnt, this.state.name)
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    } catch (err) {
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
            <label>Security</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.security}
              onChange={event =>
                this.setState({ security: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Description</label>
            <Input
              label="Complete Descriptions"
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
              value={this.state.rnt}
              onChange={event =>
                this.setState({ rnt: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Name</label>
            <Input
              label="Title"
              labelPosition="right"
              value={this.state.name}
              onChange={event =>
                this.setState({ name: event.target.value })}
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

export default CampaignNew;
