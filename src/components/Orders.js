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

  .ITAMInput{
    box-shadow: 0px 0px 2px 3px rgba(255,204,0,0.5);

    &:focus{
      box-shadow: 0px 0px 2px 3px rgba(0, 105, 217, 0.3)
    }
  }

  .techInput{
    box-shadow: 0px 0px 2px 3px rgba(23, 162, 184, 0.5);

    &:focus{
      box-shadow: 0px 0px 2px 3px rgba(0, 105, 217, 0.3)
    }
  }
`

const DELETE_ORDER = gql`
  mutation deleteOrder(
    $id: ID!,
  ) {
    deleteOrder(
      id: $id,
    ) {
      id
    }
  }
`

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNotNewHire: !this.props.orders.newhire,
      isDeleted: false
    };
  }

  newHireToggle = () =>{
    this.setState((state, props) => {
      return {isNotNewHire: !this.state.isNotNewHire};
    });
  }

  formatDate = (date) =>{
    if(date){
      return date.split("T")[0]
    }
    else{
      return ""
    }
  }

  verifyDelete = () => {
    this.setState({isDeleted: true})
  }

  render(){
    return (
      <Styles style={{display: `${!this.state.isDeleted ? "inline":"none"}`}}>
        <div class="container-fluid">
          <div class="row orders">
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="orderNum">Order #</span>
                </div>
                <input type="text" class="form-control" placeholder="Order Number" aria-label="Order Number" aria-describedby="orderNum" value={this.props.orders.orderid}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="dateCreated">Date Created</span>
                </div>
                <input type="text" class="form-control" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="dateCreated" value={this.formatDate(this.props.orders.datecreated)}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="dateApproved">Date Approved</span>
                </div>
                <input type="text" class="form-control" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="dateApproved" value={this.formatDate(this.props.orders.dateapproved)}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="createdBy">Created By</span>
                </div>
                <input type="text" class="form-control" placeholder="Firstname  Lastname" aria-label="Firstname  Lastname" aria-describedby="createdBy" value={this.props.orders.createdby}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="createdByEmail">Email</span>
                </div>
                <input type="text" class="form-control" placeholder="Created By Email" aria-label="Created By Email" aria-describedby="createdByEmail" value={this.props.orders.createdbyemail}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="recipient">Recipient</span>
                </div>
                <input type="text" class="form-control" placeholder="Firstname  Lastname" aria-label="Firstname  Lastname" aria-describedby="recipient" value={this.props.orders.recipient}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <input type="checkbox" id="newHire" aria-label="New Hire" onClick={this.newHireToggle} checked={this.props.orders.newhire}/>
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
                    <input type="text" class="form-control" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="hireDate" disabled={this.state.isNotNewHire} value={this.formatDate(this.props.orders.hiredate)}/>
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
                    <input type="text" class="form-control" placeholder="Firstname  Lastname" aria-label="Firstname  Lastname" aria-describedby="hireName" disabled={this.state.isNotNewHire} value={this.props.orders.hirename}/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${!this.state.isNotNewHire ? "inline":"none"}`}}>
              <Fade in={!this.state.isNotNewHire}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="hireStartDate">Hire Start Date</span>
                    </div>
                    <input type="text" class="form-control" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="hireStartDate" disabled={this.state.isNotNewHire}/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${!this.state.isNotNewHire ? "inline":"none"}`}}>
              <Fade in={!this.state.isNotNewHire}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="sla">SLA</span>
                    </div>
                    <input type="text" class="form-control" placeholder="Natural Number" aria-label="Natural Number" aria-describedby="sla" disabled={this.state.isNotNewHire}/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="appManager">Approval Manager</span>
                </div>
                <input type="text" class="form-control" placeholder="Firstname  Lastname" aria-label="Firstname  Lastname" aria-describedby="appManager" value={this.props.orders.approvalmanager}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="bussUnit">Business Unit</span>
                </div>
                <input type="text" class="form-control" placeholder="Business Unit" aria-label="Business Unit" aria-describedby="bussUnit" value={this.props.orders.businessunit}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="attention">Attention</span>
                </div>
                <input type="text" class="form-control" placeholder="Firstname  Lastname" aria-label="Firstname  Lastname" aria-describedby="attention" value={this.props.orders.attention}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="shipAddress">Shipping Address</span>
                </div>
                <input type="text" class="form-control" placeholder="Street, City, Province,  Postal" aria-label="Street, City, Province,  Postal" aria-describedby="shipAddress" value={this.props.orders.shippingaddress}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="orderItem">Order Item</span>
                </div>
                <input type="text" class="form-control" placeholder="Order Item" aria-label="Order Item" aria-describedby="orderItem" value={this.props.orders.items}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="orderTotal">Order Total $</span>
                </div>
                <input type="text" class="form-control" placeholder="Order Total" aria-label="Order Total" aria-describedby="orderTotal" value={this.props.orders.total.toFixed(2)}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">Item Type</label>
                </div>
                <select class="custom-select" id="inputGroupSelect01">
                  <option selected>Choose...</option>
                  <option value="1">PC</option>
                  <option value="2">Accessory</option>
                </select>
              </div>
            </div>
            {/* =======================================================================================================
                =================================================ITAM==================================================
                =======================================================================================================*/}
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="ITAMStatus">ITAM Status</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="ITAM Status" aria-label="ITAM Status" aria-describedby="ITAMStatus"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="ITAMName">ITAM Name</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="ITAM Name" aria-label="ITAM Name" aria-describedby="ITAMName"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                        <input type="checkbox" id="verificationSent" aria-label="Verification Email Sent"/>
                      </div>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder ="Verification Email Sent?" aria-label="Verification Email Sent" disabled/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="productSource">Product Source</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="Emerge/Dell etc." aria-label="Emerge/Dell etc." aria-describedby="productSource"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="oldAssetTag">Old Asset Tag</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="FIN##### etc." aria-label="FIN##### etc." aria-describedby="oldAssetTag"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="oldModel">Old Model</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="T440, Lat5490 etc." aria-label="T440, Lat5490 etc." aria-describedby="oldModel"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="monitorModel">Monitor Model</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="Viewsonic etc." aria-label="Viewsonic etc." aria-describedby="monitorModel"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="monitorNum"># of Monitors</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="Natural Number" aria-label="Natural Number" aria-describedby="monitorNum"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="connectorTypes">Type of Connectors</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="VGA, DVI etc." aria-label="VGA, DVI etc." aria-describedby="connectorTypes"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="orderPendEmail">Order Pending Email</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="orderPendEmail"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${!this.state.isNotNewHire ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <Fade in={!this.state.isNotNewHire}>
                  <div>
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="confirmedNewHire">Confirmed as Newhire</span>
                      </div>
                      <input type="text" class="form-control ITAMInput" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="confirmedNewHire" disabled={this.state.isNotNewHire}/>
                    </div>
                  </div>
                </Fade>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="PONumber">PO/Order #</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="Natural Number" aria-label="Natural Number" aria-describedby="PONumber"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="dellOrderNum">Dell Order #</span>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder="Natural Number" aria-label="Natural Number" aria-describedby="dellOrderNum"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isITAM ? "inline":"none"}`}}>
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <div class="input-group-text">
                        <input type="checkbox" id="dellEmailNotif" aria-label="Dell Email Notification Sent?"/>
                      </div>
                    </div>
                    <input type="text" class="form-control ITAMInput" placeholder ="Dell Email Notification Sent?" aria-label="dellEmailNotif" disabled/>
                  </div>
                </div>
              </Fade>
            </div>
            {/* =======================================================================================================
                =================================================TECH==================================================
                =======================================================================================================*/}
            <div class="col-sm-4" style={{display: `${this.props.isTech ? "inline":"none"}`}}>
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="techOwner">Tech Owner</span>
                    </div>
                    <input type="text" class="form-control techInput" placeholder="Tech Name" aria-label="Tech Status" aria-describedby="Tech Name"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isTech ? "inline":"none"}`}}>
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="techStatus">Tech Status</span>
                    </div>
                    <input type="text" class="form-control techInput" placeholder="Tech Status" aria-label="Tech Status" aria-describedby="techStatus"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isTech ? "inline":"none"}`}}>
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="confirmedUser">Confirmed User</span>
                    </div>
                    <input type="text" class="form-control techInput" placeholder="Firstname Lastname" aria-label="Firstname Lastname" aria-describedby="confirmedUser"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isTech ? "inline":"none"}`}}>
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="costCenter">Cost Center</span>
                    </div>
                    <input type="text" class="form-control techInput" placeholder="Location" aria-label="Location" aria-describedby="costCenter"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isTech ? "inline":"none"}`}}>
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="serviceTag">Service Tag</span>
                    </div>
                    <input type="text" class="form-control techInput" placeholder="CAL-*******" aria-label="CAL-*******" aria-describedby="serviceTag"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isTech ? "inline":"none"}`}}>
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="techEmailSent">Email/PC Sent</span>
                    </div>
                    <input type="text" class="form-control techInput" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="techEmailSent"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isTech ? "inline":"none"}`}}>
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="techFollowupEmail">Tech Followup Email Sent</span>
                    </div>
                    <input type="text" class="form-control techInput" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="techFollowupEmail"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4" style={{display: `${this.props.isTech ? "inline":"none"}`}}>
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="setupComplete">Date Setup Completed</span>
                    </div>
                    <input type="text" class="form-control techInput" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="setupComplete"/>
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-12">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="comments">Comments</span>
                </div>
                <textarea class="form-control" aria-label="With textarea" aria-describedby="comments" value={this.props.orders.comments}></textarea>
              </div>
            </div>
          </div>
          <div class="row buttons">
            <div class="col-sm">
              <button type="button" class="btn btn-success">Save</button>
            </div>
            <div class="col-sm">
              <button type="button" class="btn btn-primary">Edit</button>
            </div>
            <div class="col-sm">
              <Mutation mutation={DELETE_ORDER} variables={{id: this.props.orders.id}}>
                {deleteOrder => <button type="button" class="btn btn-danger" onClick={() => {deleteOrder(); window.location.reload();}}>Delete</button>}
              </Mutation>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}
export default Orders;
