import React from "react";
import styled from "styled-components";
import Fade from "react-bootstrap/Fade";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const Styles = styled.div`
  .container-fluid{
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: #393733;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    margin-bottom: 2em;

    &:focus-within{
      border-color: #FFCC00;
    }
  }

  .row{
    margin-top: 2em;
  }

  .buttons{
    padding-top: 1em;
    background-color: #393733;
  }

  input{
    &:focus{
      box-shadow: 0px 0px 2px 3px rgba(0, 105, 217, 0.3) !important
    }
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
      comments: $comments
    ) {
        id
    }
  }
`

class CreateOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNotNewHire: true,
      orderid: null,
      dateCreated: null,
      dateApproved: null,
      createdBy: "",
      createdByEmail: null,
      recipient: "",
      newHire: false,
      hireName: "",
      hireDate: null,
      approvalManager: "",
      businessUnit: "",
      attention: "",
      shippingAddress: "",
      item: "",
      total: 0,
      comments: "",
      isValidID: false,
      isValidCreated: false,
      isValidApproved: false,
      isValidHire: true,
      isValidEmail: false
    };
  }

  newHireToggle = () =>{
      this.setState({newHire: !this.state.newHire});
      this.setState({isNotNewHire: !this.state.isNotNewHire});
  }

  toValidFloat = (usrInput, selectedFloat) =>{
    var num;
    if(usrInput && parseFloat(usrInput) < 10000000000000000){
      num = usrInput;
    }
    else{
      num = 0;
    }

    if(selectedFloat === "ID"){
      this.setState({isValidID: true});
      this.setState({orderid: parseFloat(num)});
    }
    else if(selectedFloat === "Total"){ //Need to figure out how to fix decimals for Total
      this.setState({total: parseFloat(num)});
    }
  }

  toValidDate = (usrInputDate, selectedDate) =>{
    var valid;
    if(usrInputDate.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/g)){
      valid = true;
    }
    else{
      valid = false;
    }
    if(selectedDate === "dateCreated"){
      this.setState({dateCreated: usrInputDate});
      this.setState({isValidCreated: valid});
    }
    else if(selectedDate === "dateApproved"){
      this.setState({dateApproved: usrInputDate});
      this.setState({isValidApproved: valid});
    }
    else if(selectedDate === "hireDate"){
      if(usrInputDate === ""){
        valid = true;
        usrInputDate = null;
      }
      this.setState({hireDate: usrInputDate});
      this.setState({isValidHire: valid});
    }
  }

  validateEmail = (usrInputEmail) =>{
    if(usrInputEmail.match(/^.+@\w+\.\w+$/g)){
      this.setState({isValidEmail: true});
    }
    else{
      this.setState({isValidEmail: false});
    }
    this.setState({createdByEmail: usrInputEmail});
  }

  render(){

    const {
      isNotNewHire,
      orderid,
      dateCreated,
      dateApproved,
      createdBy,
      createdByEmail,
      recipient,
      newHire,
      hireName,
      hireDate,
      approvalManager,
      businessUnit,
      attention,
      shippingAddress,
      item,
      total,
      comments
    } = this.state

    return (
      <Styles>
        <div class="container-fluid">
          <div class="row orders">
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="orderNum">Order #</span>
                </div>
                <input type="text" class="form-control" placeholder="Order Number" aria-label="Order Number" aria-describedby="orderNum" value={orderid} onChange={e=>this.toValidFloat(e.target.value,"ID")} style={{boxShadow: `${this.state.isValidID ? "0px 0px 2px 3px rgba(0, 230, 64, 0.5)":"0px 0px 2px 3px rgba(242, 38, 19, 0.5)"}`}}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="dateCreated">Date Created</span>
                </div>
                <input type="text" class="form-control" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="dateCreated" value={dateCreated} onChange={e=>this.toValidDate(e.target.value, "dateCreated")} style={{boxShadow: `${this.state.isValidCreated ? "0px 0px 2px 3px rgba(0, 230, 64, 0.5)":"0px 0px 2px 3px rgba(242, 38, 19, 0.5)"}`}}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="dateApproved">Date Approved</span>
                </div>
                <input type="text" class="form-control" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="dateApproved" value={dateApproved} onChange={e=>this.toValidDate(e.target.value, "dateApproved")} style={{boxShadow: `${this.state.isValidApproved ? "0px 0px 2px 3px rgba(0, 230, 64, 0.5)":"0px 0px 2px 3px rgba(242, 38, 19, 0.5)"}`}}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="createdBy">Created By</span>
                </div>
                <input type="text" class="form-control" placeholder="Firstname  Lastname" aria-label="Firstname  Lastname" aria-describedby="createdBy" value={createdBy} onChange={e=>this.setState({createdBy: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="createdByEmail">Created By Email</span>
                </div>
                <input type="text" class="form-control" placeholder="***@email.com" aria-label="Created By Email" aria-describedby="createdByEmail" value={createdByEmail} onChange={e=>this.validateEmail(e.target.value)} style={{boxShadow: `${this.state.isValidEmail ? "0px 0px 2px 3px rgba(0, 230, 64, 0.5)":"0px 0px 2px 3px rgba(242, 38, 19, 0.5)"}`}}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="recipient">Recipient</span>
                </div>
                <input type="text" class="form-control" placeholder="Firstname  Lastname" aria-label="Firstname  Lastname" aria-describedby="recipient" value={recipient} onChange={e=>this.setState({recipient: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <input type="checkbox" id="newHire" aria-label="New Hire" onClick={this.newHireToggle}/>
                  </div>
                </div>
                <input type="text" class="form-control" placeholder ="New Hire" aria-label="New Hire" disabled/>
              </div>
            </div>
            <div class="col-sm-4" style={{display: `${!this.state.isNotNewHire ? "inline":"none"}`}}>
               <Fade in={!this.state.isNotNewHire}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="hireDate">Hire Date</span>
                    </div>
                    <input type="text" class="form-control" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="hireDate" disabled={this.state.isNotNewHire} value={hireDate} onChange={e=>this.toValidDate(e.target.value, "hireDate")} style={{boxShadow: `${this.state.isValidHire ? "0px 0px 2px 3px rgba(0, 230, 64, 0.5)":"0px 0px 2px 3px rgba(242, 38, 19, 0.5)"}`}}/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${!this.state.isNotNewHire ? "inline":"none"}`}}>
              <Fade in={!this.state.isNotNewHire}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="hireName">Hire Name</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Firstname  Lastname" aria-label="Firstname  Lastname" aria-describedby="hireName" disabled={this.state.isNotNewHire} value={hireName} onChange={e=>this.setState({hireName: e.target.value})}/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="appManager">Approval Manager</span>
                </div>
                <input type="text" class="form-control" placeholder="Firstname  Lastname" aria-label="Firstname  Lastname" aria-describedby="appManager" value={approvalManager} onChange={e=>this.setState({approvalManager: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="bussUnit">Business Unit</span>
                </div>
                <input type="text" class="form-control" placeholder="Business Unit" aria-label="Business Unit" aria-describedby="bussUnit" value={businessUnit} onChange={e=>this.setState({businessUnit: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="attention">Attention</span>
                </div>
                <input type="text" class="form-control" placeholder="Firstname  Lastname" aria-label="Firstname  Lastname" aria-describedby="attention" value={attention} onChange={e=>this.setState({attention: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="shipAddress">Shipping Address</span>
                </div>
                <input type="text" class="form-control" placeholder="Street, City, Province,  Postal" aria-label="Street, City, Province,  Postal" aria-describedby="shipAddress" value={shippingAddress} onChange={e=>this.setState({shippingAddress: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="orderItem">Order Item</span>
                </div>
                <input type="text" class="form-control" placeholder="Order Item" aria-label="Order Item" aria-describedby="orderItem" value={item} onChange={e=>this.setState({item: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="orderTotal">Order Total $</span>
                </div>
                <input type="text" class="form-control" placeholder="Order Total" aria-label="Order Total" aria-describedby="orderTotal" value={total} onChange={e=>this.toValidFloat(e.target.value,"Total")}/>
              </div>
            </div>
            <div class="col-sm-12">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="comments">Comments</span>
                </div>
                <textarea class="form-control" aria-label="With textarea" aria-describedby="comments" value={comments} onChange={e=>this.setState({comments: e.target.value})}></textarea>
              </div>
            </div>
          </div>
          <div class="row buttons">
            <div class="col-sm">
              <Mutation mutation={CREATE_ORDER} variables={{
                orderid: orderid,
                datecreated: dateCreated,
                dateapproved: dateApproved,
                createdby: createdBy,
                createdbyemail: createdByEmail,
                recipient: recipient,
                newhire: newHire,
                hiredate: hireDate,
                hirename: hireName,
                approvalmanager: approvalManager,
                businessunit: businessUnit,
                attention: attention,
                shippingaddress: shippingAddress,
                items: item,
                total: total,
                comments: comments}}>
                {createOrder => <button type="button" class="btn btn-success" onClick={() =>{createOrder(); window.location.reload();}} disabled={!(this.state.isValidID * this.state.isValidCreated * this.state.isValidApproved * this.state.isValidHire * this.state.isValidEmail)}>Create</button>}
              </Mutation>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}
export default CreateOrder;
