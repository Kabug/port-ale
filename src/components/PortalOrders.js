import React from "react";
import Orders from "./Orders";
import CreateOrder from "./CreateOrder";
import styled from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { ApolloConsumer } from "react-apollo";
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

const QUERY_NEXT_ORDERS = gql`
  query nextOrders($input: nextOrdersInput!){
    nextOrders(input: $input){
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
      lastID: "",
      listOfOrders: []
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

  removeOrderFromList = (index) => {
    const newList = [
      ...this.state.listOfOrders.slice( 0, index ),
      ...this.state.listOfOrders.slice( index + 1 )
    ];
    this.setState({ listOfOrders: newList });
    if ( newList.length ) {
      this.setState({ lastID: newList[ newList.length - 1 ].id });
    } else {
      this.setState({ lastID: "" });
    }
  };

  render() {

    const {
      orderCategory,
      lastID,
      listOfOrders
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
              {listOfOrders.slice( 0 ).map( (order, index) =>
                <Orders
                  key={order.id}
                  index = {index}
                  orders={order}
                  isITAM={this.state.isITAM}
                  isTech={this.state.isTech}
                  removeOrderFromList={this.removeOrderFromList}
                />
              )}
              <ApolloConsumer>
                { client => (
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={async () => {
                      const { loading, error, data } = await client.query({
                        query: QUERY_NEXT_ORDERS,
                        variables: {
                          input: {
                            orderCategory: orderCategory,
                            before: lastID
                          }
                        }
                      });
                      if ( loading ) { return <div>Fetching</div>;}
                      if ( error ) { return <div>Error</div>;}
                      let newOrders = data.nextOrders;
                      if ( newOrders.length ) {
                        newOrders.reverse();
                        this.setState({
                          listOfOrders: this.state.listOfOrders.concat( newOrders ),
                          lastID: newOrders[ newOrders.length - 1 ].id
                        });
                      }
                    }}
                  >
                    Next
                  </button>
                )}
              </ApolloConsumer>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}
export default PortalOrders;
