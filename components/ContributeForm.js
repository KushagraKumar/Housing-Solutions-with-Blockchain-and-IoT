import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
  state = {
    value: '',
    days:'',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();
    const campaign = Campaign(this.props.address);
    this.setState({ loading: true, errorMessage: '' });
    let passTime = new Date(Date.now() + (this.state.days*60*1000));
    console.log(passTime);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.lease(passTime.getTime().toString(),this.state.days).send({
        from: accounts[0],
        value: this.state.value,
        gas: 1000000
      });

      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: '' });
  };


  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Duration of Stay:</label>
          <Input
            type='number'
            min={1}
            value={this.state.days}
            onChange={event => this.setState({ days: event.target.value })}
            label="wei"
            labelPosition="right"
          />
        </Form.Field>

        <Form.Field>
          <label>Amount to be paid: - {this.state.value=(Number(this.state.days)*Number(this.props.rentPerDay)+Number(this.props.security))} </label>
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
