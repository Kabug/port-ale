import React from "react";
import Orders from "./Orders";
import CreateOrder from "./CreateOrder";
import styled from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import OImage from "../assets/OTest.png";

const Styles = styled.div`

  h1{
    margin: 1em;
  }

  h5{
    font-weight:normal;
  }

  #orderFilter{
    background-color: #393733;
    color: white;
  }

  .optionsBackground{
    border-style: solid;
    border-width: 1px;
    border-color: #393733;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .blackBackground{
    padding-top: 1em;
    background-color: #393733;
    color: white;
  }

  .btn{
    margin-bottom: 1em;
    width: 15em;
    height: 3em;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .mainBtnDivStyles{
    margin-bottom: 2em;
  }

  .btn-primary{
    background-color: #FFCC00 !important;
    border-color: #FFCC00 !important;

    &:hover{
      background-color: #F0B400 !important;
      border-color: #F5B800 !important;
    }
    &:active{
      box-shadow: 0px 0px 1px 3px rgba(255,204,0,0.7) !important;
    }

  }

  .btn-group{
    display: block !important;
  }

  .ordersStyles{
    max-height: 75vh;
    overflow-y: auto;
  }
`;

const QUERY_ORDERS = gql`
  query filteredOrdersQuery($ordercategory: String!){
    filteredOrders(ordercategory: $ordercategory){
      id
      orderid
      datecreated
      dateapproved
      createdby
      createdbyemail
      recipient
      newhire
      hirestartdate
      hirename
      approvalmanager
      businessunit
      attention
      shippingaddress
      items
      total
      comments
      ordercategory
      sla
      itam{
        id
        itamowner{
          name
        }
        status
        verificationemailsent
        productsource
        oldassettag
        oldmodel
        modelofmonitor
        numofmonitor
        connectortypes
        orderpendingemailsent
        confirmednewhire
        poordernum
        dellordernum
        dellemailnotif
      }
      tech{
        id
        techowner{
          name
        }
        status
        confirmeduser
        costcenter
        servicetag
        initialemailsent
        followupemailsent
        datefollowuptemp
        datecompleted
      }
    }
  }
`;

class PortalOrders extends React.Component {
  constructor(props) {
    super( props );
    this.state = {
      isITAM: false,
      isTech: false,
      isAll: true,
      orderCategory: "New Order"
    };
  }

  ITAMToggle = () => {
    this.setState( ( state, props) => {
      return { isITAM: !this.state.isITAM };
    });
  };

  techToggle = () => {
    this.setState( ( state, props) => {
      return { isTech: !this.state.isTech };
    });
  };

  allToggle = () => {
    this.setState({ isAll: !this.state.isAll });

    if ( this.state.isAll ) {
      this.setState({ isITAM: true, isTech: true });
    } else {
      this.setState({ isITAM: false, isTech: false });
    }
  };

  render() {

    const {
      ITAMToggle,
      techToggle,
      allToggle,
      orderCategory
    } = this.state;

    return (
      <Styles>
        <div class ="container-fluid">
          <div class="row optionsBackground">
            <div class="col-sm-6 blackBackground">
              <h5>Order Filter</h5>
              <div class="input-group">
                <select
                  class="custom-select"
                  id="orderFilter"
                  onChange={e=>this.setState({ orderCategory: e.target.value })}
                >
                  <option value="New Order">New Order</option>
                  <option value="Accessory">Accessory</option>
                  <option value="New Hire">New Hire</option>
                  <option value="Priority Deployment">Priority Deployment</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div class="col-sm-6 blackBackground">
              <h5>User Filter</h5>
              <div class="input-group">
                <select class="custom-select" id="orderFilter">
                  <option value="All">All</option>
                  <option value="None">None</option>
                  <option value="Lianne">Lianne</option>
                  <option value="Holly">Holly</option>
                  <option value="Katharine">Katharine</option>
                  <option value="Nate">Nate</option>
                </select>
              </div>
            </div>
            <div class="col-sm-12 blackBackground">
              <div class="btn-group btn-group-justified">
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={this.ITAMToggle}
                >
                ITAM
                </button>
                <button type="button" class="btn btn-info" onClick={this.techToggle}>Tech</button>
                <button type="button" class="btn btn-dark" onClick={this.allToggle}>All</button>
              </div>
            </div>
          </div>
          <div class="row ordersStyles">
            <div class="col-sm-12">
              <h1>Portal <img src={OImage} alt="O"/>rders</h1>
            </div>
            <div class="col-sm-12">
            <CreateOrder/>
            <Query query={QUERY_ORDERS} variables={{
              ordercategory: orderCategory
            }}>
              {({ loading, error, data }) => {
                if ( loading ) { return <div>Fetching</div>;}
                if ( error ) { return <div>Error</div>;}
                const ordersToRender = data.filteredOrders;
                return (
                  <div>
                    {ordersToRender.slice( 0 ).reverse().map( orders =>
                      <Orders
                        key={orders.id}
                        orders={orders}
                        isITAM={this.state.isITAM}
                        isTech={this.state.isTech}
                      />
                    )}
                  </div>
                );
              }}
            </Query>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}
export default PortalOrders;
