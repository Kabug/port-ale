import React from "react";
import Orders from "./Orders";
import CreateOrder from "./CreateOrder";
import styled from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import OImage from "../assets/OTest.png";

const Styles = styled.div`

  h1{
    margin: 2em;
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

const QUERY_INITIAL_ORDERS = gql`
  query initialOrders($orderCategory: String!){
    initialOrders(orderCategory: $orderCategory){
      id
      orderSimplexId
      orderDateCreated
      orderDateApproved
      orderCreatedBy
      orderCreatedByEmail
      orderNewHire
      orderRecipient
      orderHireStartDate
      orderHireName
      orderApprovalManager
      orderBusinessUnit
      orderAttention
      orderShippingAddress
      orderItem
      orderTotal
      orderComments
      orderCategory
      orderSla
      orderItam{
        id
        itamOwner{
          id
          userName
        }
        itamStatus
        itamVerificationEmailSent
        itamProductSource
        itamOldAssetTag
        itamOldModel
        itamMonitorModel
        itamMonitorNum
        itamConnectorTypes
        itamOrderPendingEmail
        itamConfirmedNewHire
        itamPoOrderId
        itamDellOrderId
        itamDellEmailNotif
      }
      orderTech{
        id
        techOwner{
          id
          userName
        }
        techStatus
        techConfirmedUser
        techCostCenter
        techServiceTag
        techInitialEmail
        techDateFollowupTemp
        techFollowupEmailSent
        techDateCompleted
      }
    }
  }
`;

const QUERY_NEXT_ORDERS = gql`
  query nextOrders($orderCategory: String!, $after: ID!){
    nextOrders(orderCategory: $orderCategory, after: $after){
      id
      orderSimplexId
      orderDateCreated
      orderDateApproved
      orderCreatedBy
      orderCreatedByEmail
      orderNewHire
      orderRecipient
      orderHireStartDate
      orderHireName
      orderApprovalManager
      orderBusinessUnit
      orderAttention
      orderShippingAddress
      orderItem
      orderTotal
      orderComments
      orderCategory
      orderSla
      orderItam{
        id
        itamOwner{
          id
          userName
        }
        itamStatus
        itamVerificationEmailSent
        itamProductSource
        itamOldAssetTag
        itamOldModel
        itamMonitorModel
        itamMonitorNum
        itamConnectorTypes
        itamOrderPendingEmail
        itamConfirmedNewHire
        itamPoOrderId
        itamDellOrderId
        itamDellEmailNotif
      }
      orderTech{
        id
        techOwner{
          id
          userName
        }
        techStatus
        techConfirmedUser
        techCostCenter
        techServiceTag
        techInitialEmail
        techDateFollowupTemp
        techFollowupEmailSent
        techDateCompleted
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
      orderCategory: "New Order",
      lastID: null
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

  setLastOrder = (newId) => {
    this.setState({ lastID: newId });
  };

  loadMoreOrders = ( orderCategory, after) => {
    const { loading, error, data } = useQuery( QUERY_NEXT_ORDERS, {
      variables:{
        orderCategory: orderCategory,
        after: after
      }
    });

    if ( loading ) { return <div>Fetching</div>;}
    if ( error ) { return <div>Error</div>;}

    return (
      <div>HI</div>
    );
  };

  render() {

    const {
      orderCategory,
      lastID
    } = this.state;

    return (
      <Styles>
        <div class ="container-fluid">
          <div className="row optionsBackground">
            <div className="col-sm-6 blackBackground">
              <h5>Order Filter</h5>
              <div className="input-group">
                <select
                  className="custom-select"
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
            <div className="col-sm-6 blackBackground">
              <h5>User Filter</h5>
              <div className="input-group">
                <select className="custom-select" id="orderFilter">
                  <option value="All">All</option>
                  <option value="None">None</option>
                  <option value="Lianne">Lianne</option>
                  <option value="Holly">Holly</option>
                  <option value="Katharine">Katharine</option>
                  <option value="Nate">Nate</option>
                </select>
              </div>
            </div>
            <div className="col-sm-12 blackBackground">
              <div className="btn-group btn-group-justified">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.ITAMToggle}
                >
                ITAM
                </button>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={this.techToggle}
                >
                  Tech
                </button>
                <button type="button" className="btn btn-dark" onClick={this.allToggle}>All</button>
              </div>
            </div>
          </div>
          <div className="row ordersStyles">
            <div className="col-sm-12">
              <h1>Portal <img src={OImage} alt="O"/>rders</h1>
            </div>
            <div className="col-sm-12">
            <CreateOrder/>
            <Query query={QUERY_INITIAL_ORDERS} variables={{
              orderCategory: orderCategory
            }}>
              {({ loading, error, data }) => {
                if ( loading ) { return <div>Fetching</div>;}
                if ( error ) { return <div>Error</div>;}
                const ordersToRender = data.initialOrders;
                return (
                  <div>
                    {ordersToRender.slice( 0 ).reverse().map( order =>
                      <Orders
                        key={order.id}
                        orders={order}
                        isITAM={this.state.isITAM}
                        isTech={this.state.isTech}
                      />
                    )}
                    <button
                      type="button"
                      className="btn btn-dark"
                      onClick={() => this.loadMoreOrders( orderCategory, ordersToRender[ 0 ].id )}
                    >
                      Next
                    </button>
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
