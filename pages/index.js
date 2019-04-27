import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';
import LeaseHouse from '../ethereum/campaign.js'

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.returnContractList().call();

    const parray = campaigns.map(async (address) => {
      const campaign = LeaseHouse(address);
      const name = await campaign.methods.getName().call();
      const avail = await campaign.methods.getAvailabilty().call();
      const popu = await campaign.methods.popularity().call();
      return {
        name: name,
        addr: address,
        available: avail,
        popularity: popu
      };
    });

    const names = await Promise.all(parray);
    return { names };
  }

  retrieveColor(value) {
    if(value) {
      return "green";
    } else {
      return "red";
    }
  }

  ifAvailable(value) {
    if(value) {
      return "Available";
    } else {
      return "Unavailable";
    }
  }

  renderCampaigns() {
    const items = this.props.names.map(nm => {
      return {
        header: nm.name,
        description: (
          <div style={{color:this.retrieveColor(nm.available)}}>
          {this.ifAvailable(nm.available)}
          <br></br>
          <Link route={`/campaigns/${nm.addr}`}>
            <a>View Listing</a>
          </Link>
          </div>
        ),
        meta: "Popularity: " + nm.popularity,
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Listings</h3>

          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Listings"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
