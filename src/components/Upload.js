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
    margin-top: 5em;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin-bottom: 3em;
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

`

const CREATE_ORDER = gql`
  mutation createOrder(
    $orderid: Float!,
    $datecreated: DateTime!,
    $dateapproved: DateTime!,
    $createdby: String!,
    $createdbyemail: String!,
    $recipient: String!,
    $newhire: Boolean!,
    $hiredate: DateTime,
    $hirename: String,
    $approvalmanager: String!,
    $businessunit: String!,
    $attention: String!,
    $shippingaddress: String!,
    $items: String!,
    $total: Float!,
    $comments: String!
    $itam: ITAMProgressCreateOneWithoutOrderInput
  ) {
    createOrder(
      orderid: $orderid,
      datecreated: $datecreated,
      dateapproved: $dateapproved,
      createdby: $createdby,
      createdbyemail: $createdbyemail,
      recipient: $recipient,
      newhire: $newhire,
      hiredate: $hiredate,
      hirename: $hirename,
      approvalmanager: $approvalmanager,
      businessunit: $businessunit,
      attention: $attention,
      shippingaddress: $shippingaddress,
      items: $items,
      total: $total,
      comments: $comments,
      itam: { create: $itam }
    ) {
        id
    }
  }
`

class Upload extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      newOrders: []
    };
  }

  setDataToState = (data) =>{
    var tempData = data;

    //Remove uneeded columns
    for(var order in tempData){
      if(!(data[order]) || data[order][0] === ""){
        data.splice(order, 1);
      }
      else if(data[order][0].match(/^[0-9]+$/) == null){
          data.splice(order, 1);
      }
    }

    //Formatting value types
    var finalOrders = []
    for(var order in data){
      data[order][0] = parseFloat(data[order][0]);
      data[order][1] = this.formatDate(data[order][1]);
      data[order][2] = this.formatDate(data[order][2]);
      data[order][10] = data[order][10].replace("Facility: ","").replace("Cost Center: ","")
      data[order][14] = parseFloat(data[order][14].replace("$","").replace(",",""));
      if(data[order][6] === "Yes"){
        data[order][6] = true;
        data[order][7] = this.formatDate(data[order][7])
      }
      else{
        data[order][6] = false;
      }
      if(data[order][7] === ""){
        data[order][7] = null
      }
      if(data[order][13].match(/\d -/g).length > 1){
        var items = (data[order][13].split(/\d -/)).filter(Boolean);
        for(var item in items){
          var newOrder = [...data[order]];
          newOrder[13] = items[item];
          finalOrders.push(newOrder);
        }
      }

    }
    console.log(finalOrders);
    this.setState({newOrders: finalOrders});
  }

  formatDate(originalDate){
    return (new Date(originalDate).toISOString().split("T")[0]).toString();
  }

  removeFromState = (orderId) =>{
    console.log(orderId)
    var updatedOrders = [...this.state.newOrders];
    updatedOrders.splice(orderId, 1)
    this.setState({newOrders: updatedOrders})
  }

  render(){
    return (
      <Styles>
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-12">
              <CSVReader onFileLoaded={data => this.setDataToState(data)} />
            </div>

            <div class ="col-sm-12">
              <p style={{display: `${this.state.newOrders[0] ? "inline":"none"}`}}>Click <b>Submit</b> after verifying.</p>
            </div>
          </div>
            {this.state.newOrders.map((order, index) =>
              <div class="row newOrdersDiv">
                <div class="col-sm-3">
                  <b>ID:</b><br /> {order[0]}
                </div>
                <div class="col-sm-3">
                  <b>Date Created:</b><br /> {order[1]}
                </div>
                <div class="col-sm-3">
                  <b>Date Approved:</b><br /> {order[2]}
                </div>
                <div class="col-sm-3">
                  <b>Created by:</b><br /> {order[3]}
                </div>
                <div class="col-sm-3">
                  <b>Created by Email:</b><br /> {order[4]}
                </div>
                <div class="col-sm-3">
                  <b>Recipient:</b><br /> {order[5]}
                </div>
                <div class="col-sm-3">
                  <b>New Hire:</b><br /> {order[6].toString()}
                </div>
                <div class="col-sm-3">
                  <b>Hire Date:</b><br /> {order[7]}
                </div>
                <div class="col-sm-3">
                  <b>Hire Name:</b><br /> {order[8]}
                </div>
                <div class="col-sm-3">
                  <b>Approval Manager:</b><br /> {order[9]}
                </div>
                <div class="col-sm-3">
                  <b>Business Unit:</b><br /> {order[10]}
                </div>
                <div class="col-sm-3">
                  <b>Attention:</b><br /> {order[11]}
                </div>
                <div class="col-sm-3">
                  <b>Shipping Address:</b><br /> {order[12]}
                </div>
                <div class="col-sm-3">
                  <b>Order Items:</b><br /> {order[13]}
                </div>
                <div class="col-sm-3">
                  <b>Order Total:</b><br /> {order[14].toFixed(2)}
                </div>
                <div class="col-sm-3">
                  <b>Comments:</b><br /> {order[15]}
                </div>
                <div class="col-sm-12 buttonDiv">
                  <Mutation mutation={CREATE_ORDER} variables={{
                        orderid: order[0],
                        datecreated: order[1],
                        dateapproved: order[2],
                        createdby: order[3],
                        createdbyemail: order[4],
                        recipient: order[5],
                        newhire: order[6],
                        hiredate: order[7],
                        hirename: order[8],
                        approvalmanager: order[9],
                        businessunit: order[10],
                        attention: order[11],
                        shippingaddress: order[12],
                        items: order[13],
                        total: order[14],
                        comments: order[15],
                        itam: {status:"Not Started"}
                  }}>
                    {createOrder => <button type="button" class="btn btn-success" onClick={() =>{createOrder(); this.removeFromState(index)}}>Submit</button>}
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
