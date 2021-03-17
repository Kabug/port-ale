import React from "react";
import Orders from "./Orders";
import CreateOrder from "./CreateOrder";
import styled from "styled-components";
import { Query, ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import OImage from "../assets/OTest.png";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

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

  .loadMoreBut{
    display: none;
  }

  .spinner-border{
    margin-bottom: 20px;
  }

  .List {
    overflow: auto !important;
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
      listOfOrders: [],
      loadedAllOrders: false,
      ordersToBeDeleted: []
    };
  }

  componentDidMount() {
    this.setState({ lastID: "", listOfOrders: [] }, () => {
      this.loadMore.click();
    });
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

  handleScroll = (e) => {
    try {
      const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
      if ( bottom * !this.state.loadedAllOrders ) {
        this.loadMore.click();
      }
    }
    catch(e){
    }
  };

  updateCategory = (e) => {
    this.setState({ orderCategory: e.target.value, listOfOrders: [], lastID: "" }, ()=> {
      this.allOrders.scrollTo( 0, 0 ); this.loadMore.click();
    });
  };

  render() {

    const {
      orderCategory,
      lastID,
      listOfOrders
    } = this.state;

    const Row = ({ index, style }) => (
      <div className="row" style={style}>
        {listOfOrders.length && listOfOrders [ index ] ?
            <div className="col-sm-12">
              <Orders
                orders={listOfOrders[ index ]}
                isITAM={this.state.isITAM}
                isTech={this.state.isTech}
              />
            </div>
            :
            "Loading"
        }
      </div>
    );

    return (
      <Styles>
        <div className="container-fluid">
          <div className="row optionsBackground">
            <div className="col-sm-6 blackBackground">
              <h5>Order Filter</h5>
              <div className="input-group">
                <select
                  className="custom-select"
                  id="orderFilter"
                  onChange={e=> this.updateCategory( e )}
                >
                  <option value="New Order">New Order</option>
                  <option value="Accessory">Accessory</option>
                  <option value="New Hire">New Hire</option>
                  <option value="Priority Deployment">Priority Deployment</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Done">Done</option>
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
          <div
            className="row ordersStyles"
            ref={ allOrders => this.allOrders = allOrders }
            onScroll={this.handleScroll}
          >
            <div className="col-sm-12">
              <h1>Portal <img src={OImage} alt="O"/>rders</h1>
            </div>
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-12">
                  <CreateOrder/>
                </div>
              </div>
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      className="List"
                      height={height * 4/5}
                      itemCount={listOfOrders.length}
                      itemSize={1000}
                      width={width}
                      onScroll={this.handleScroll}
                    >
                      {Row}
                    </List>
                  )}
                </AutoSizer>

              <div className="row">
                <div className="col-sm-12">
                  <ApolloConsumer>
                    { client => (
                      <button
                        type="button"
                        className="btn btn-dark"
                        style={{display:"none"}}
                        ref={ loadMore => this.loadMore = loadMore }
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
                          let newOrders = [ ...data.nextOrders ];
                          if ( newOrders.length ) {
                            this.setState({
                              listOfOrders: this.state.listOfOrders.concat( newOrders.reverse() ),
                              lastID: newOrders[ newOrders.length - 1 ].id,
                              loadedAllOrders: false
                            });
                          } else {
                            this.setState({ loadedAllOrders: true });
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
            <div
              className="col-sm-12"
              style={{ display: `${!this.state.loadedAllOrders ? "inline" : "none"}` }}
            >
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}
export default PortalOrders;
