
import React, { Component } from 'react';
import { Form , Card, Grid, Button, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link , Router } from '../../routes';

import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyD_unTfi1pO5H_fxNDao8EN2uTki0YrTmc",
    authDomain: "project-4d8a2.firebaseapp.com",
    databaseURL: "https://project-4d8a2.firebaseio.com",
    projectId: "project-4d8a2",
    storageBucket: "project-4d8a2.appspot.com",
    messagingSenderId: "490337552154"
}

if(!firebase.apps.length){
  firebase.initializeApp(config);
}

class CampaignShow extends Component {
  state = {
      motorOn: 1,
      door: "Unlock Door",
      loading : false,
      newloading: false,
      errorMessage: '',
      errorMessage2: ''
  };

  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.methods.getSummary().call();

    return {
      address: props.query.address,
      security: summary[1],
      available: summary[2],
      description: summary[3],
      popularity: summary[4],
      rentPerDay: summary[5],
      name: summary[6],
      loading: false,
      motorOn: summary[7]
    };
  }

  checkAvail(available) {
    if(available) {
      return "Available";
    } else {
      return "Unavailable";
    }
  }

  renderCards() {
    const {
      address,
      security,
      available,
      description,
      popularity,
      rentPerDay,
      name,
      motorOn
    } = this.props;

    const items = [
      {
        header: address,
        meta: 'Address of Manager',
        description:
          'The manager is leasing this property and is the owner of said property.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: security,
        meta: 'Security',
        description:
          "Security Amount muse be paid in full before the renting of the property. Deductions may be performed onthe amount if the time of stay is exceeded."
      },
      {
        header: this.checkAvail(available),
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers'
      },
      {
        header: 'Description',
        meta: 'Details about the property',
        description: description
      },
      {
        header: popularity,
        meta: 'Popularity',
        description: 'This number describes the number of times this property has been selected for renting purposes.'
      },
      {
        header: rentPerDay,
        meta: 'Daily Rent',
        description: 'This figure is the daily rent for the resident. Upon exceeding the time of stay, this figure multiplied by excess time will be subtracted from security.'
      }
    ];

    return <Card.Group items={items} />;
  }

  changeMotorValue = async event => {

    event.preventDefault();
    this.setState({ newloading: true, errorMessage: '' });

    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(this.props.address);
    const tmp = await campaign.methods.motorOn().call();

    if(tmp == 1)
    {
      if(this.state.motorOn == 1) {
        this.setState({motorOn: 2});
        this.setState({door: "Lock Door"});
        console.log("Lock");

        firebase.database().ref().set({
          motorOn: this.state.motorOn
        });

      } else if(this.state.motorOn == 2) {
        this.setState({motorOn : 1});
        console.log("Unlock");
        this.setState({door: "Unlock Door"})

        firebase.database().ref().set({
          motorOn: this.state.motorOn
        });
      } else {
        // DO NOTHING
      }
    }
    this.setState({ newloading: false });

  };

renderColumns() {
  if(this.props.available) {
    return (
      <Grid.Column width={6}>
        <ContributeForm address={this.props.address} rentPerDay={this.props.rentPerDay} security={this.props.security}/>
      </Grid.Column>
    );
  } else {
    return (
      <Grid.Column width={6}>
        <Form onSubmit={this.onSubmitTime} error={!!this.state.errorMessage2}>
          <Message error header="Oops!" content={this.state.errorMessage2} />
          <Button loading={this.state.loading}  >Request Security</Button>
        </Form>

        <Form onSubmit={this.changeMotorValue} error={!!this.state.errorMessage2}>
          <Message error header="Oops!" content={this.state.errorMessage2} />
          <Button loading={this.state.newloading} style={{margin:12}}>{this.state.door}</Button>
        </Form>
      </Grid.Column>
  );
  }
}

onSubmitTime = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage2: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = Campaign(this.props.address);
      const tmp = await campaign.methods.rentingTime().call();
      const timelimit = (new Date(Number(tmp))).getTime();
      if(timelimit>Date.now()){
      await campaign.methods
        .returnSecurity()
        .send({
          from: accounts[0]
        });
      }
      else{
        const overtime = parseInt((Date.now() - timelimit)/(60000));
        console.log(overtime);
        await campaign.methods
          .deductSecurity(overtime)
          .send({
            from: accounts[0]
          });
      }
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage2: err.message });
    }

    this.setState({ loading: false });
  };

onSubmit = async event => {
  event.preventDefault();
  this.setState({ loading: true, errorMessage: '' });

  try {
    const accounts = await web3.eth.getAccounts();

    await factory.methods
      .deleteEntry(this.props.address)
      .send({
        from: accounts[0]
      });

    Router.replaceRoute('/');
  } catch (err) {
    console.log(err);
    this.setState({ errorMessage: err.message });
  }

  this.setState({ loading: false });
};

renderEdit() {
  if(this.props.available) {
    return (
      <Grid.Column>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>

        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>
            <Button primary>Edit Details</Button>
          </a>
        </Link>

          <a>
            <Button secondary loading={this.state.loading}>Delete Listing</Button>
          </a>
        </Form>
      </Grid.Column>
    );
  }
}


  render() {
    return (
      <Layout>
        <h3>{this.props.name}</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            {this.renderColumns()}
          </Grid.Row>

          <Grid.Row>
            {this.renderEdit()}
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
