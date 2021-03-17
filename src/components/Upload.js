import React from "react";
import styled from "styled-components";
import CSVReader from "react-csv-reader";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const Styles = styled.div`

  .csv-input{
    border-style: dashed;
    border-radius: 20px;
    padding: 1%;
    background-color: #FFCC00;
    margin-top: 2.5em;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin-bottom: 3em;
  }

  .csv-input:hover{
    cursor: pointer;
    color: white;
  }

  .newOrdersDiv{
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: #393733;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin: 2em;
  }

  .newOrdersDiv :nth-child(even){
    background-color: rgba(255, 204, 0, 0.4);
  }

  .col-sm-3{
    border-style: solid;
    border-width: 1px;
  }

  .btn{
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    width: 15em;
    height: 3em;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .buttonDiv{
    background-color: #393733;
  }

  .orders{
    max-height: 91.7vh;
    overflow-y: auto;
  }

  .title{
    margin-top: 2.5em;
  }
`;

const CREATE_ORDER = gql`
  mutation createOrder($input: createOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`;

class Upload extends React.Component{

  constructor(props) {
    super( props );
    this.state = {
      newOrders: []
    };
  }

  setDataToState = (data) => {
    const tempData = data;

    try {
    // Remove uneeded columns
    let order;
    for ( order in tempData ) {
      if ( !(data[ order ]) || data[ order ][ 0 ] === "") {
        data.splice( order, 1 );
      } else if ( data[ order ][ 0 ].match( /^[0-9]+$/ ) == null ) {
          data.splice( order, 1 );
      }
    }

    // Formatting value types
    let finalOrders = [];
    for ( order in data ) {
      data[ order ][ 0 ] = parseFloat( data[ order ][ 0 ] );
      data[ order ][ 1 ] = this.formatDate( data[ order ][ 1 ] );
      data[ order ][ 2 ] = this.formatDate( data[ order ][ 2 ] );
      data[ order ][ 10 ] = data[ order ][ 10 ].replace("Facility: ", "" );
      data[ order ][ 10 ] = data [ order ][ 10 ].replace("Cost Center: ", "");
      data[ order ][ 14 ] = parseFloat( data[ order ][ 14 ].replace("$", "" ).replace(",", "" ) );
      if ( data[ order ][ 6 ] === "Yes") {
        data[ order ][ 6 ] = true;
        data[ order ][ 7 ] = this.formatDate( data[ order ][ 7 ] );
      } else {
        data[ order ][ 6 ] = false;
      }
      if ( data[ order ][ 7 ] === "") {
        data[ order ][ 7 ] = null;
      }
      if ( data[ order ][ 13 ].match( /\d -/g ).length > 1 ) {
        let items = (data[ order ][ 13 ].split( /\d -/ ) ).filter( Boolean );
        for ( let item in items ) {
          let newOrder = [ ...data[ order ] ];
          newOrder[ 13 ] = items[ item ];
          finalOrders.push( newOrder );
        }
      }

    }
    this.setState({ newOrders: finalOrders });
    }
    catch ( error ) {
      alert("Invalid CSV Format: \n" + error );
    }
  };

  formatDate( originalDate ) {
    return (new Date( originalDate ).toISOString().split("T")[ 0 ]).toString();
  }

  removeFromState = (orderId) => {
    let updatedOrders = [ ...this.state.newOrders ];
    updatedOrders.splice( orderId, 1 );
    this.setState({ newOrders: updatedOrders });
  };

  render() {

    const itamOwner = {
      connect: {
        userName: "Unassigned"
      }
    };

    const techOwner = {
      connect: {
        userName: "Unassigned"
      }
    };

    const createITAM = {
      create: {
        itamStatus: "Not Started",
        itamOwner: itamOwner
      }
    };

    const createTech = {
      create: {
        techStatus: "Not Started",
        techOwner: techOwner
      }
    };
    return (
      <Styles>
        <div class="container-fluid orders">
          <div class="row">
            <div class="col-sm-12 title">
              <h1>Upload from CSV</h1>
            </div>
            <div class="col-sm-12">
              <CSVReader onFileLoaded={data => this.setDataToState( data )} />
            </div>

            <div class ="col-sm-12">
              <p style={{ display: `${this.state.newOrders[ 0 ] ? "inline" : "none" } ` }}>
                Click <b>Submit</b> after verifying.
              </p>
            </div>
          </div>
            {this.state.newOrders.map( ( order, index) =>
              <div class="row newOrdersDiv">
                <div class="col-sm-3">
                  <b>ID:</b><br /> {order[ 0 ]}
                </div>
                <div class="col-sm-3">
                  <b>Date Created:</b><br /> {order[ 1 ]}
                </div>
                <div class="col-sm-3">
                  <b>Date Approved:</b><br /> {order[ 2 ]}
                </div>
                <div class="col-sm-3">
                  <b>Created by:</b><br /> {order[ 3 ]}
                </div>
                <div class="col-sm-3">
                  <b>Created by Email:</b><br /> {order[ 4 ]}
                </div>
                <div class="col-sm-3">
                  <b>Recipient:</b><br /> {order[ 5 ]}
                </div>
                <div class="col-sm-3">
                  <b>New Hire:</b><br /> {order[ 6 ].toString()}
                </div>
                <div class="col-sm-3">
                  <b>Hire Start Date:</b><br /> {order[ 7 ]}
                </div>
                <div class="col-sm-3">
                  <b>Hire Name:</b><br /> {order[ 8 ]}
                </div>
                <div class="col-sm-3">
                  <b>Approval Manager:</b><br /> {order[ 9 ]}
                </div>
                <div class="col-sm-3">
                  <b>Business Unit:</b><br /> {order[ 10 ]}
                </div>
                <div class="col-sm-3">
                  <b>Attention:</b><br /> {order[ 11 ]}
                </div>
                <div class="col-sm-3">
                  <b>Shipping Address:</b><br /> {order[ 12 ]}
                </div>
                <div class="col-sm-3">
                  <b>Order Items:</b><br /> {order[ 13 ]}
                </div>
                <div class="col-sm-3">
                  <b>Order Total:</b><br /> {order[ 14 ].toFixed( 2 )}
                </div>
                <div class="col-sm-3">
                  <b>Comments:</b><br /> {order[ 15 ]}
                </div>
                <div class="col-sm-12 buttonDiv">
                  <Mutation mutation={CREATE_ORDER} variables={{
                    input: {
                      orderSimplexId: order[ 0 ],
                      orderDateCreated: order[ 1 ],
                      orderDateApproved: order[ 2 ],
                      orderCreatedBy: order[ 3 ],
                      orderCreatedByEmail: order[ 4 ],
                      orderRecipient: order[ 5 ],
                      orderNewHire: order[ 6 ],
                      orderHireStartDate: order[ 7 ],
                      orderHireName: order[ 8 ],
                      orderApprovalManager: order[ 9 ],
                      orderBusinessUnit: order[ 10 ],
                      orderAttention: order[ 11 ],
                      orderShippingAddress: order[ 12 ],
                      orderItem: order[ 13 ],
                      orderTotal: order[ 14 ],
                      orderCategory: "New Order",
                      orderComments: order[ 15 ],
                      orderItam: createITAM,
                      orderTech: createTech
                    }
                  }}>
                    {createOrder =>
                      <button type="button" class="btn btn-success"
                        onClick={() => {createOrder(); this.removeFromState( index );}}>
                        Submit
                      </button>}
                  </Mutation>
                </div>
              </div>
            )}
        </div>
      </Styles>
    );
  }
}

export default Upload;
