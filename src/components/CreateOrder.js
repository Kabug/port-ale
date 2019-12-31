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
    $comments: String!,
    $itam: ITAMProgressCreateOneWithoutOrderInput,
    $tech: TechnicianProgressCreateOneWithoutOrderInput
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
      itam: $itam
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
      dateCreated: new Date().toISOString().split("T")[0],
      dateApproved: new Date().toISOString().split("T")[0],
      createdBy: "",
      createdByEmail: null,
      recipient: "",
      newHire: false,
      hireName: "",
      hireDate: null,
      hireStartDate: null,
      sla: null,
      approvalManager: "",
      businessUnit: "",
      attention: "",
      shippingAddress: "",
      item: "",
      itemType: "Choose...",
      total: 0,
      comments: "",
      itamStatus: "Not Started",
      itamName: null,
      itamVerifEmail: false,
      itamProductSource: null,
      itamOldAssetTag: null,
      itamOldModel: null,
      itamMonitorModel: null,
      itamMonitorNum: 0,
      itamConnectorType: null,
      itamOrderPendEmail: null,
      itamConfirmedNewhire: null,
      itamPOOrder: null,
      itamDellOrder: null,
      itamDellEmailNotif: false,
      techStatus: "Not Started",
      techConfirmedNewHire: null,
      techCostCenter: null,
      techServiceTag: null,
      techEmailPCSent: null,
      techFullowUpSent: null,
      techDateSetupCompleted: null,
      isValidID: false,
      isValidCreated: true,
      isValidApproved: true,
      isValidHire: true,
      isValidEmail: false,
      isValidStartDate: true,
      isValidPendEmail: true
    };
  }

  newHireToggle = () =>{
    this.setState({newHire: !this.state.newHire});
    this.setState({isNotNewHire: !this.state.isNotNewHire});
  }

  verifEmailToggle = () =>{
    this.setState({itamVerifEmail: !this.state.itamVerifEmail});
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
    else if(selectedFloat === "MonitorNum"){ //Need to figure out how to fix decimals for Total
      this.setState({itamMonitorNum: parseFloat(num)});
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
    else if(selectedDate === "hireStartDate"){
      if(usrInputDate === ""){
        valid = true;
        usrInputDate = null;
      }
      this.setState({hireStartDate: usrInputDate});
      this.setState({isValidStartDate: valid});
    }
    else if(selectedDate === "orderPendEmail"){
      if(usrInputDate === ""){
        valid = true;
        usrInputDate = null;
      }
      this.setState({hireStartDate: usrInputDate});
      this.setState({isValidPendEmail: valid});
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
      hireStartDate,
      approvalManager,
      businessUnit,
      attention,
      shippingAddress,
      item,
      itemType,
      total,
      sla,
      comments,
      itamStatus,
      itamName,
      itamVerifEmail,
      itamProductSource,
      itamOldAssetTag,
      itamOldModel,
      itamMonitorModel,
      itamMonitorNum,
      itamConnectorType,
      itamOrderPendEmail,
      itamConfirmedNewhire,
      itamPOOrder,
      itamDellOrder,
      itamDellEmailNotif,
      techStatus,
      techConfirmedNewHire,
      techCostCenter,
      techServiceTag,
      techEmailPCSent,
      techFullowUpSent,
      techDateSetupCompleted,
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
                <input type="text" class="form-control" placeholder="Natural Number" aria-label="Order Number" aria-describedby="orderNum" value={orderid} onChange={e=>this.toValidFloat(e.target.value,"ID")} style={{boxShadow: `${this.state.isValidID ? "0px 0px 2px 3px rgba(0, 230, 64, 0.5)":"0px 0px 2px 3px rgba(242, 38, 19, 0.5)"}`}}/>
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
            <div class="col-sm-4" style={{display: `${!this.state.isNotNewHire ? "inline":"none"}`}}>
              <Fade in={!this.state.isNotNewHire}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="hireStartDate">Hire Start Date</span>
                    </div>
                    <input type="text" class="form-control" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="hireStartDate" disabled={this.state.isNotNewHire} value={hireStartDate} onChange={e=>this.toValidDate(e.target.value, "hireStartDate")} style={{boxShadow: `${this.state.isValidStartDate ? "0px 0px 2px 3px rgba(0, 230, 64, 0.5)":"0px 0px 2px 3px rgba(242, 38, 19, 0.5)"}`}}/>
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
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">Item Type</label>
                </div>
                <select class="custom-select" id="inputGroupSelect01" value={itemType} onChange={e=>this.setState({itemType: e.target.value})}>
                  <option selected>Choose...</option>
                  <option value="PC">PC</option>
                  <option value="Accessory">Accessory</option>
                </select>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="ITAMStatus">ITAM Status</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="ITAM Status" aria-label="ITAM Status" aria-describedby="ITAMStatus" value={itamStatus} onChange={e=>this.setState({itamStatus: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="ITAMName">ITAM Name</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="ITAM Name" aria-label="ITAM Name" aria-describedby="ITAMName" value={itamName} onChange={e=>this.setState({itamName: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <input type="checkbox" id="verificationSent" aria-label="Verification Email Sent" onClick={this.verifEmailToggle}/>
                  </div>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder ="Verification Email Sent?" aria-label="Verification Email Sent" disabled/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="productSource">Product Source</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="Emerge/Dell etc." aria-label="Emerge/Dell etc." aria-describedby="productSource" value={itamProductSource} onChange={e=>this.setState({itamProductSource: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="oldAssetTag">Old Asset Tag</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="FIN##### etc." aria-label="FIN##### etc." aria-describedby="oldAssetTag" value={itamOldAssetTag} onChange={e=>this.setState({itamOldAssetTag: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="oldModel">Old Model</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="T440, Lat5490 etc." aria-label="T440, Lat5490 etc." aria-describedby="oldModel" value={itamOldModel} onChange={e=>this.setState({itamOldModel: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="monitorModel">Monitor Model</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="Viewsonic etc." aria-label="Viewsonic etc." aria-describedby="monitorModel" value={itamMonitorModel} onChange={e=>this.setState({itamMonitorModel: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="monitorNum"># of Monitors</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="Natural Number" aria-label="Natural Number" aria-describedby="monitorNum" value={itamMonitorNum} onChange={e=>this.toValidFloat(e.target.value,"MonitorNum")}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="connectorTypes">Type of Connectors</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="VGA, DVI etc." aria-label="VGA, DVI etc." aria-describedby="connectorTypes" value={itamConnectorType} onChange={e=>this.setState({itamConnectorType: e.target.value})}/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="orderPendEmail">Order Pending Email</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="orderPendEmail" value={itamOrderPendEmail} onChange={e=>this.toValidDate(e.target.value, "orderPendEmail")} style={{boxShadow: `${this.state.isValidPendEmail ? "0px 0px 2px 3px rgba(0, 230, 64, 0.5)":"0px 0px 2px 3px rgba(242, 38, 19, 0.5)"}`}}/>
              </div>
            </div>
            <div class="col-sm-4" style={{display: `${!this.state.isNotNewHire ? "inline":"none"}`}}>
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
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="PONumber">PO/Order #</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="Natural Number" aria-label="Natural Number" aria-describedby="PONumber"/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="dellOrderNum">Dell Order #</span>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder="Natural Number" aria-label="Natural Number" aria-describedby="dellOrderNum"/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <input type="checkbox" id="dellEmailNotif" aria-label="Dell Email Notification Sent?"/>
                  </div>
                </div>
                <input type="text" class="form-control ITAMInput" placeholder ="Dell Email Notification Sent?" aria-label="dellEmailNotif" disabled/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="techOwner">Tech Owner</span>
                </div>
                <input type="text" class="form-control techInput" placeholder="Tech Name" aria-label="Tech Status" aria-describedby="Tech Name"/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="techStatus">Tech Status</span>
                </div>
                <input type="text" class="form-control techInput" placeholder="Tech Status" aria-label="Tech Status" aria-describedby="techStatus"/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="confirmedUser">Confirmed User</span>
                </div>
                <input type="text" class="form-control techInput" placeholder="Firstname Lastname" aria-label="Firstname Lastname" aria-describedby="confirmedUser"/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="costCenter">Cost Center</span>
                </div>
                <input type="text" class="form-control techInput" placeholder="Location" aria-label="Location" aria-describedby="costCenter"/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="serviceTag">Service Tag</span>
                </div>
                <input type="text" class="form-control techInput" placeholder="CAL-*******" aria-label="CAL-*******" aria-describedby="serviceTag"/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="techEmailSent">Email/PC Sent</span>
                </div>
                <input type="text" class="form-control techInput" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="techEmailSent"/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="techFollowupEmail">Tech Followup Email Sent</span>
                </div>
                <input type="text" class="form-control techInput" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="techFollowupEmail"/>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="setupComplete">Date Setup Completed</span>
                </div>
                <input type="text" class="form-control techInput" placeholder="YYYY-MM-DD" aria-label="YYYY-MM-DD" aria-describedby="setupComplete"/>
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
                comments: comments,
                }}>
                {createOrder => <button type="button" class="btn btn-success" onClick={() =>{createOrder(); window.location.reload();}} disabled={!(this.state.isValidID * this.state.isValidCreated * this.state.isValidApproved * this.state.isValidHire * this.state.isValidEmail * this.state.isValidStartDate * this.state.isValidPendEmail)}>Create</button>}
              </Mutation>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}
export default CreateOrder;
