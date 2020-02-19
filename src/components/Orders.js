import React from "react";
import styled from "styled-components";
import Fade from "react-bootstrap/Fade";
import { Mutation, Query } from "react-apollo";
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
`;

const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      id
    }
  }
`;

const QUERY_USERS = gql`
  {
    users{
      id
      userName
    }
  }
`;

const UPDATE_ENTIRE_ORDER = gql`
  mutation updateEntireOrder($input: updateEntireOrderInput!) {
    updateEntireOrder(input: $input) {
      id
      orderSimplexId
    }
  }
`;

class Orders extends React.Component {
  constructor(props) {
    super( props );
    this.state = {
      isDeleted: false,
      orderHidden: false,
      id: this.props.orders.id,
      orderID: this.props.orders.orderSimplexId,
      dateCreated: this.props.orders.orderDateCreated,
      dateApproved: this.props.orders.orderDateApproved,
      createdBy: this.props.orders.orderCreatedBy,
      createdByEmail: this.props.orders.orderCreatedByEmail,
      newHire: this.props.orders.orderNewHire,
      recipient: this.props.orders.orderRecipient,
      hireStartDate: this.props.orders.orderHireStartDate,
      hireName: this.props.orders.orderHireName,
      approvalManager: this.props.orders.orderApprovalManager,
      businessUnit: this.props.orders.orderBusinessUnit,
      attention: this.props.orders.orderAttention,
      shippingAddress: this.props.orders.orderShippingAddress,
      item: this.props.orders.orderItem,
      total: this.props.orders.orderTotal,
      comments: this.props.orders.orderComments,
      orderCategory: this.props.orders.orderCategory,
      sla: this.props.orders.orderSla,
      ITAMid: this.props.orders.orderItam.id,
      ITAMName: this.props.orders.orderItam.itamOwner.userName,
      ITAMStatus: this.props.orders.orderItam.itamStatus,
      ITAMVerificationEmailSent: this.props.orders.orderItam.itamVerificationEmailSent,
      ITAMProductSource: this.props.orders.orderItam.itamProductSource,
      ITAMOldAssetTag: this.props.orders.orderItam.itamOldAssetTag,
      ITAMOldModel: this.props.orders.orderItam.itamOldModel,
      ITAMMonitorModel: this.props.orders.orderItam.itamMonitorModel,
      ITAMMonitorNum: this.props.orders.orderItam.itamMonitorNum,
      ITAMConnectorType: this.props.orders.orderItam.itamConnectorTypes,
      ITAMOrderPendEmail: this.props.orders.orderItam.itamOrderPendingEmail,
      ITAMConfirmedNewhire: this.props.orders.orderItam.itamConfirmedNewHire,
      ITAMPOOrder: this.props.orders.orderItam.itamPoOrderId,
      ITAMDellOrder: this.props.orders.orderItam.itamDellOrderId,
      ITAMDellEmailNotif: this.props.orders.orderItam.itamDellEmailNotif,
      Techid: this.props.orders.orderTech.id,
      TechName: this.props.orders.orderTech.techOwner.userName,
      TechStatus: this.props.orders.orderTech.techStatus,
      TechConfirmedUser: this.props.orders.orderTech.techConfirmedUser,
      TechCostCenter: this.props.orders.orderTech.techCostCenter,
      TechServiceTag: this.props.orders.orderTech.techServiceTag,
      TechEmailPCSent: this.props.orders.orderTech.techInitialEmail,
      TechDateFollowupTemp: this.props.orders.orderTech.techDateFollowupTemp,
      TechFollowupEmail: this.props.orders.orderTech.techFollowupEmailSent,
      TechDateSetupCompleted: this.props.orders.orderTech.techDateCompleted,
      isValidID: true,
      isValidCreated: true,
      isValidApproved: true,
      isValidEmail: true,
      isValidStartDate: true,
      isValidVerifEmail: true,
      isValidPendEmail: true,
      isValidConfirmedHireDate: true,
      isValidEmailNotif: true,
      isValidPCEmailDate: true,
      isValidDateFollowup: true,
      isValidDateSetupCompleted: true,
      isValidFollowupEmail: true,
      buttonClicked: false
    };
  }

  removeOrderFromList = () => {
    this.props.removeOrderFromList( this.props.index );
  };

  newHireToggle = () => {
    this.setState({ newHire: !this.state.newHire });
  };

  formatDate = (date) => {
    if ( date ) {
      return date.split("T")[ 0 ];
    }
    return "";
  };

  verifyDelete = () => {
    this.setState({ isDeleted: true });
  };

  hideOrder = () => {
    this.setState({ orderHidden: true });
  };

  toValidFloat = (usrInput, selectedFloat) => {
    let num;
    if ( usrInput && parseFloat( usrInput ) < 10000000000000000 ) {
      num = usrInput;
    } else {
      num = 0;
    }
    if ( selectedFloat === "ID" ) {
      this.setState({ isValidID: true });
      this.setState({ orderID: parseFloat( num ) });
    } else if ( selectedFloat === "Total" ) {
      this.setState({ total: num });
    } else if ( selectedFloat === "MonitorNum" ) {
      this.setState({ ITAMMonitorNum: parseFloat( num ) });
    } else if ( selectedFloat === "sla" ) {
      this.setState({ sla: parseFloat( num ) });
    } else if ( selectedFloat === "POOrderNum" ) {
      this.setState({ ITAMPOOrder: parseFloat( num ) });
    } else if ( selectedFloat === "DellOrderNum" ) {
      this.setState({ ITAMDellOrder: parseFloat( num ) });
    }
  };

  toValidDate = (usrInputDate, selectedDate) => {
    let valid = false;
    if ( usrInputDate.match( /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/g ) ) {
      valid = true;
    }
    if ( usrInputDate === "" ) {
      valid = true;
      usrInputDate = null;
    }
    switch ( selectedDate ){
      case "dateCreated":
        if ( usrInputDate === null ) {
          valid = false;
          usrInputDate = null;
        }
        this.setState({ dateCreated: usrInputDate, isValidCreated: valid });
        break;
      case "dateApproved":
        if ( usrInputDate === null ) {
          valid = false;
          usrInputDate = null;
        }
        this.setState({ dateApproved: usrInputDate, isValidApproved: valid });
        break;
      case "verificationEmail":
        this.setState({ ITAMVerificationEmailSent: usrInputDate, isValidVerifEmail: valid });
        break;
      case "orderPendEmail":
        this.setState({ ITAMOrderPendEmail: usrInputDate, isValidPendEmail: valid });
        break;
      case "EmailPCSent":
        this.setState({ TechEmailPCSent: usrInputDate, isValidPCEmailDate: valid });
        break;
      case "FollowupEmail":
        this.setState({ TechFollowupEmail: usrInputDate, isValidFollowupEmail: valid });
        break;
      case "DateFollowupTemp":
        this.setState({ TechDateFollowupTemp: usrInputDate, isValidDateFollowup: valid });
        break;
      case "EmailNotif":
        this.setState({ ITAMDellEmailNotif: usrInputDate, isValidEmailNotif: valid });
        break;
      case "SetupCompleted":
        this.setState({ TechDateSetupCompleted: usrInputDate, isValidDateSetupCompleted: valid });
        break;
      case "confirmedNewHire":
        this.setState({ ITAMConfirmedNewhire: usrInputDate, isValidConfirmedHireDate: valid });
        break;
      case "hireStartDate":
        this.setState({ hireStartDate: usrInputDate, isValidStartDate: valid });
        break;
    }
  };

  validateEmail = ( usrInputEmail ) => {
    if ( usrInputEmail.match( /^.+@\w+\.\w+$/g ) ) {
      this.setState({ isValidEmail: true });
    } else {
      this.setState({ isValidEmail: false });
    }
    this.setState({ createdByEmail: usrInputEmail });
  };

  toCashMoney = (usrInput) => {
    usrInput = parseFloat( parseFloat( usrInput ).toFixed( 2 ) );
    this.setState({ total: usrInput });
  };

  render() {
    const {
      orderID,
      item,
      orderCategory,
      dateCreated,
      dateApproved,
      createdBy,
      createdByEmail,
      recipient,
      newHire,
      hireName,
      hireStartDate,
      sla,
      approvalManager,
      businessUnit,
      attention,
      shippingAddress,
      total,
      ITAMStatus,
      ITAMName,
      ITAMVerificationEmailSent,
      ITAMProductSource,
      ITAMOldAssetTag,
      ITAMOldModel,
      ITAMMonitorModel,
      ITAMMonitorNum,
      ITAMConnectorType,
      ITAMOrderPendEmail,
      ITAMConfirmedNewhire,
      ITAMPOOrder,
      ITAMDellOrder,
      ITAMDellEmailNotif,
      TechName,
      TechStatus,
      TechConfirmedUser,
      TechCostCenter,
      TechServiceTag,
      TechEmailPCSent,
      TechDateFollowupTemp,
      TechDateSetupCompleted,
      TechFollowupEmail,
      comments
    } = this.state;

    return (
      <Styles>
        <div
          class="container-fluid"
          style={{ display: `${this.state.orderHidden ? "none" : "inline-block" }` }}
        >
          <div class="row orders">
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="orderNum">Order #</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Natural Number"
                  aria-label="Order Number"
                  aria-describedby="orderNum"
                  value={orderID}
                  onChange={e=>this.toValidFloat( e.target.value, "ID" )}
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="orderItem">Order Item</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Order Item"
                  aria-label="Order Item"
                  aria-describedby="orderItem"
                  value={item}
                  onChange={e=>this.setState({ item: e.target.value })}
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <label class="input-group-text" htmlFor="orderCategory">Order Category</label>
                </div>
                <select
                  class="custom-select"
                  id="orderCategory"
                  onChange={e=>this.setState({ orderCategory:e.target.value })}
                  value={orderCategory}
                >
                  <option value="New Order">New Order</option>
                  <option value="Accessory">Accessory</option>
                  <option value="New Hire">New Hire</option>
                  <option value="Priority Deployment">Priority Deployment</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="dateCreated">Date Created</span>
                </div>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  aria-label="YYYY-MM-DD"
                  aria-describedby="dateCreated"
                  value={this.formatDate( dateCreated )}
                  onChange={e=>this.toValidDate( e.target.value, "dateCreated" )}
                  className={
                    `form-control ${this.state.isValidCreated ? "is-valid" : "is-invalid"}`
                  }
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="dateApproved">Date Approved</span>
                </div>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  aria-label="YYYY-MM-DD"
                  aria-describedby="dateApproved"
                  value={this.formatDate( dateApproved )}
                  onChange={e=>this.toValidDate( e.target.value, "dateApproved" )}
                  className={
                    `form-control ${this.state.isValidApproved ? "is-valid" : "is-invalid"}`
                  }
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="createdBy">Created By</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Firstname  Lastname"
                  aria-label="Firstname  Lastname"
                  aria-describedby="createdBy"
                  value={createdBy}
                  onChange={e=>this.setState({ createdBy: e.target.value })}
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="createdByEmail">Created By Email</span>
                </div>
                <input
                  type="text"
                  placeholder="***@email.com"
                  aria-label="Created By Email"
                  aria-describedby="createdByEmail"
                  value={createdByEmail}
                  onChange={e=>this.validateEmail( e.target.value )}
                  className={`form-control ${this.state.isValidEmail ? "is-valid" : "is-invalid"}`}
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="recipient">Recipient</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Firstname  Lastname"
                  aria-label="Firstname  Lastname"
                  aria-describedby="recipient"
                  value={recipient}
                  onChange={e=>this.setState({ recipient: e.target.value })}
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <div class="input-group-text">
                    <input
                      type="checkbox"
                      id="newHire"
                      aria-label="New Hire"
                      onClick={this.newHireToggle}
                      checked={newHire}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder ="New Hire"
                  aria-label="New Hire"
                  disabled
                />
              </div>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.state.newHire ? "inline" : "none"}` }}
            >
              <Fade in={this.state.newHire}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="hireName">Hire Name</span>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Firstname  Lastname"
                      aria-label="Firstname  Lastname"
                      aria-describedby="hireName"
                      disabled={!this.state.newHire}
                      value={hireName}
                      onChange={e=>this.setState({ hireName: e.target.value })}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.state.newHire ? "inline" : "none"}` }}
            >
              <Fade in={this.state.newHire}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="hireStartDate">Hire Start Date</span>
                    </div>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      aria-label="YYYY-MM-DD"
                      aria-describedby="hireStartDate"
                      disabled={!this.state.newHire}
                      value={this.formatDate( hireStartDate )}
                      onChange={e=>this.toValidDate( e.target.value, "hireStartDate" )}
                      className={
                        `form-control ${this.state.isValidStartDate ? "is-valid" : "is-invalid"}`
                      }
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.state.newHire ? "inline" : "none"}` }}
            >
              <Fade in={this.state.newHire}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="sla">SLA</span>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Natural Number"
                      aria-label="Natural Number"
                      aria-describedby="sla"
                      disabled={!this.state.newHire}
                      value={sla}
                      onChange={e=>this.toValidFloat( e.target.value, "sla" )}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="appManager">Approval Manager</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Firstname  Lastname"
                  aria-label="Firstname  Lastname"
                  aria-describedby="appManager"
                  value={approvalManager}
                  onChange={e=>this.setState({ approvalManager: e.target.value })}
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="bussUnit">Business Unit</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Business Unit"
                  aria-label="Business Unit"
                  aria-describedby="bussUnit"
                  value={businessUnit}
                  onChange={e=>this.setState({ businessUnit: e.target.value })}
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="attention">Attention</span>
                </div>
                <input
                  type="text"
                  class="form-control techInput"
                  placeholder="Firstname  Lastname"
                  aria-label="Firstname  Lastname"
                  aria-describedby="attention"
                  value={attention}
                  onChange={e=>this.setState({ attention: e.target.value })}
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="shipAddress">Shipping Address</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Street, City, Province,  Postal"
                  aria-label="Street, City, Province,  Postal"
                  aria-describedby="shipAddress"
                  value={shippingAddress}
                  onChange={e=>this.setState({ shippingAddress: e.target.value })}
                />
              </div>
            </div>
            <div class="col-sm-4">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="orderTotal">Order Total $</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Order Total"
                  aria-label="Order Total"
                  aria-describedby="orderTotal"
                  value={total}
                  onChange={e=>this.toValidFloat( e.target.value, "Total" )}
                  onBlur={e=>this.toCashMoney( e.target.value )}
                />
              </div>
            </div>
            {/* =================================================================================
                ======================================ITAM=======================================
                =================================================================================*/}
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" htmlFor="ITAMStatus">ITAM Status</label>
                    </div>
                    <select
                      class="custom-select ITAMInput"
                      id="ITAMStatus"
                      onChange={e=>this.setState({ ITAMStatus:e.target.value })}
                      value={ITAMStatus}
                    >
                      <option value="New">New</option>
                      <option value="Emailed">Emailed</option>
                    </select>
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" htmlFor="ITAMName">ITAM Name</label>
                    </div>
                    <Query query={QUERY_USERS}>
                      {({ loading, error, data }) => {
                        if ( loading ) {
                          return <select class="custom-select" id="ITAMName">Fetching</select>;
                        }
                        if ( error ) {
                          return <select class="custom-select" id="ITAMName">Error</select>;
                        }
                        const usersToRender = data.users;
                        return (
                          <select
                            class="custom-select ITAMInput"
                            id="ITAMName"
                            onChange={e=>this.setState({ ITAMName:e.target.value })}
                            value={ITAMName}
                          >
                            {usersToRender.slice( 0 ).map( user =>
                              <option value={user.userName}>{user.userName}</option>
                            )}
                          </select>
                        );
                      }}
                    </Query>
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="verifEmail">Verification Email</span>
                    </div>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      aria-label="YYYY-MM-DD"
                      aria-describedby="verifEmail"
                      value={this.formatDate( ITAMVerificationEmailSent )}
                      onChange={e=>this.toValidDate( e.target.value, "verificationEmail" )}
                      className={
                        `form-control ITAMInput ${this.state.isValidVerifEmail ?
                          "is-valid" : "is-invalid"
                        }`
                      }
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" htmlFor="productSource">Product Source</label>
                    </div>
                    <select
                      class="custom-select ITAMInput"
                      id="productSource"
                      onChange={e=>this.setState({ ITAMProductSource: e.target.value })}
                      value={ITAMProductSource}
                    >
                      <option value="">Select...</option>
                      <option value="Inhouse">Inhouse</option>
                      <option value="Emerge">Emerge</option>
                      <option value="Dell">Dell</option>
                    </select>
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="oldAssetTag">Old Asset Tag</span>
                    </div>
                    <input
                      type="text"
                      class="form-control ITAMInput"
                      placeholder="FIN##### etc."
                      aria-label="FIN##### etc."
                      aria-describedby="oldAssetTag"
                      value={ITAMOldAssetTag}
                      onChange={e=>this.setState({ ITAMOldAssetTag: e.target.value })}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="oldModel">Old Model</span>
                    </div>
                    <input
                      type="text"
                      class="form-control ITAMInput"
                      placeholder="T440, Lat5490 etc."
                      aria-label="T440, Lat5490 etc."
                      aria-describedby="oldModel"
                      value={ITAMOldModel}
                      onChange={e=>this.setState({ ITAMOldModel: e.target.value })}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="monitorModel">Monitor Model</span>
                    </div>
                    <input
                      type="text"
                      class="form-control ITAMInput"
                      placeholder="Viewsonic etc."
                      aria-label="Viewsonic etc."
                      aria-describedby="monitorModel"
                      value={ITAMMonitorModel}
                      onChange={e=>this.setState({ ITAMMonitorModel: e.target.value })}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="monitorNum"># of Monitors</span>
                    </div>
                    <input
                      type="text"
                      class="form-control ITAMInput"
                      placeholder="Natural Number"
                      aria-label="Natural Number"
                      aria-describedby="monitorNum"
                      value={ITAMMonitorNum}
                      onChange={e=>this.toValidFloat( e.target.value, "MonitorNum" )}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="connectorTypes">Type of Connectors</span>
                    </div>
                    <input
                      type="text"
                      class="form-control ITAMInput"
                      placeholder="VGA, DVI etc."
                      aria-label="VGA, DVI etc."
                      aria-describedby="connectorTypes"
                      value={ITAMConnectorType}
                      onChange={e=>this.setState({ ITAMConnectorType: e.target.value })}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span
                        class="input-group-text"
                        id="orderPendEmail"
                      >
                        Order Pending Followup
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      aria-label="YYYY-MM-DD"
                      aria-describedby="orderPendEmail"
                      value={this.formatDate( ITAMOrderPendEmail )}
                      onChange={e=>this.toValidDate( e.target.value, "orderPendEmail" )}
                      className={
                        `form-control ITAMInput ${this.state.isValidPendEmail ?
                          "is-valid" : "is-invalid"
                        }`
                      }
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.state.newHire ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <Fade in={this.state.newHire}>
                  <div>
                    <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <span
                          class="input-group-text"
                          id="confirmedNewHire"
                        >
                          Confirmed as Newhire
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        aria-label="YYYY-MM-DD"
                        aria-describedby="confirmedNewHire"
                        disabled={!this.state.newHire}
                        value={this.formatDate( ITAMConfirmedNewhire )}
                        onChange={e=>this.toValidDate( e.target.value, "confirmedNewHire" )}
                        className={
                          `form-control ITAMInput ${this.state.isValidConfirmedHireDate ?
                            "is-valid" : "is-invalid"
                          }`
                        }
                      />
                    </div>
                  </div>
                </Fade>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="PONumber">PO/Order #</span>
                    </div>
                    <input
                      type="text"
                      class="form-control ITAMInput"
                      placeholder="Natural Number"
                      aria-label="Natural Number"
                      aria-describedby="PONumber"
                      value={ITAMPOOrder}
                      onChange={e=>this.toValidFloat( e.target.value, "POOrderNum" )}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="dellOrderNum">Dell Order #</span>
                    </div>
                    <input
                      type="text"
                      class="form-control ITAMInput"
                      placeholder="Natural Number"
                      aria-label="Natural Number"
                      aria-describedby="dellOrderNum"
                      value={ITAMDellOrder}
                      onChange={e=>this.toValidFloat( e.target.value, "DellOrderNum" )}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isITAM ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isITAM}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span
                        class="input-group-text"
                        id="dellEmailNotif"
                      >
                        Dell Email Notification
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      aria-label="YYYY-MM-DD"
                      aria-describedby="dellEmailNotif"
                      value={this.formatDate( ITAMDellEmailNotif )}
                      onChange={e=>this.toValidDate( e.target.value, "EmailNotif" )}
                      className={
                        `form-control ITAMInput ${this.state.isValidEmailNotif ?
                          "is-valid" : "is-invalid"
                        }`
                      }
                    />
                  </div>
                </div>
              </Fade>
            </div>
            {/* =================================================================================
                ======================================TECH=======================================
                =================================================================================*/}
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isTech ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" htmlFor="techName">Tech Name</label>
                    </div>
                    <Query query={QUERY_USERS}>
                      {({ loading, error, data }) => {
                        if ( loading ) {
                          return <select class="custom-select" id="techName">Fetching</select>;
                        }
                        if ( error ) {
                          return <select class="custom-select" id="techName">Error</select>;
                        }
                        const usersToRender = data.users;
                        return (
                          <select
                            class="custom-select techInput"
                            id="techName"
                            onChange={e=>this.setState({ TechName:e.target.value })}
                            value={TechName}
                          >
                            {usersToRender.slice( 0 ).map( user =>
                              <option value={user.userName}>{user.userName}</option>
                            )}
                          </select>
                        );
                      }}
                    </Query>
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isTech ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <label class="input-group-text" htmlFor="techStatus">Tech Status</label>
                    </div>
                    <select
                      class="custom-select techInput"
                      id="techStatus"
                      onChange={e=>this.setState({ TechStatus:e.target.value })}
                    >
                      <option value ="Not Started" defaultValue>Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Shipped to User">Shipped to User</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isTech ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="confirmedUser">Confirmed User</span>
                    </div>
                    <input
                      type="text"
                      class="form-control techInput"
                      placeholder="Firstname Lastname"
                      aria-label="Firstname Lastname"
                      aria-describedby="confirmedUser"
                      value={TechConfirmedUser}
                      onChange={e=>this.setState({ TechConfirmedUser: e.target.value })}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isTech ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="costCenter">Cost Center</span>
                    </div>
                    <input
                      type="text"
                      class="form-control techInput"
                      placeholder="Location"
                      aria-label="Location"
                      aria-describedby="costCenter"
                      value={TechCostCenter}
                      onChange={e=>this.setState({ TechCostCenter: e.target.value })}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isTech ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="serviceTag">Service Tag</span>
                    </div>
                    <input
                      type="text"
                      class="form-control techInput"
                      placeholder="CAL-*******"
                      aria-label="CAL-*******"
                      aria-describedby="serviceTag"
                      value={TechServiceTag}
                      onChange={e=>this.setState({ TechServiceTag: e.target.value })}
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isTech ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="techEmailSent">Email/PC Sent</span>
                    </div>
                    <input
                      type="text"
                      class="form-control techInput"
                      placeholder="YYYY-MM-DD"
                      aria-label="YYYY-MM-DD"
                      aria-describedby="techEmailSent"
                      value={this.formatDate( TechEmailPCSent )}
                      onChange={e=>this.toValidDate( e.target.value, "EmailPCSent" )}
                      className={
                        `form-control techInput ${this.state.isValidPCEmailDate ?
                          "is-valid" : "is-invalid"
                        }`
                      }
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isTech ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span
                        class="input-group-text"
                        id="dateFollowupTemp2"
                      >
                        Date Followup Template #2
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      aria-label="YYYY-MM-DD"
                      aria-describedby="dateFollowupTemp2"
                      value={this.formatDate( TechDateFollowupTemp )}
                      onChange={e=>this.toValidDate( e.target.value, "DateFollowupTemp" )}
                      className={
                        `form-control techInput ${this.state.isValidDateFollowup ?
                          "is-valid" : "is-invalid"
                        }`
                      }
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isTech ? "inline" : "none"}` }}
            >
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="setupComplete">Date Setup Completed</span>
                    </div>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      aria-label="YYYY-MM-DD"
                      aria-describedby="setupComplete"
                      value={this.formatDate( TechDateSetupCompleted )}
                      onChange={e=>this.toValidDate( e.target.value, "SetupCompleted" )}
                      className={
                        `form-control techInput ${this.state.isValidDateSetupCompleted ?
                          "is-valid" : "is-invalid"
                        }`
                      }
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div
              class="col-sm-4"
              style={{ display: `${this.props.isTech ? "inline" : "none" }` }}
            >
              <Fade in={this.props.isTech}>
                <div>
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span
                        class="input-group-text"
                        id="techFollowupEmail"
                      >
                        Tech Followup Template #3
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      aria-label="YYYY-MM-DD"
                      aria-describedby="techFollowupEmail"
                      value={this.formatDate( TechFollowupEmail )}
                      onChange={e=>this.toValidDate( e.target.value, "FollowupEmail" )}
                      className={
                        `form-control techInput ${this.state.isValidFollowupEmail ?
                          "is-valid" : "is-invalid"
                        }`
                      }
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div class="col-sm-12">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="comments">Comments</span>
                </div>
                <textarea
                  class="form-control"
                  aria-label="With textarea"
                  aria-describedby="comments"
                  value={comments}
                  onChange={e=>this.setState({ comments: e.target.value })}
                >
                </textarea>
              </div>
            </div>
          </div>
          <div class="row buttons">
            <div class="col-sm">
              <Mutation
                mutation={UPDATE_ENTIRE_ORDER}
                variables={{
                  input:{
                    orderId: this.props.orders.id,
                    orderSimplexId: orderID,
                    orderDateCreated: dateCreated,
                    orderDateApproved: dateApproved,
                    orderCreatedBy: createdBy,
                    orderCreatedByEmail: createdByEmail,
                    orderNewHire: newHire,
                    orderRecipient: recipient,
                    orderHireStartDate: hireStartDate,
                    orderHireName: hireName,
                    orderApprovalManager: approvalManager,
                    orderBusinessUnit: businessUnit,
                    orderAttention: attention,
                    orderShippingAddress: shippingAddress,
                    orderItem: item,
                    orderTotal: total,
                    orderComments: comments,
                    orderCategory: orderCategory,
                    orderSla: sla,
                    itamId: this.props.orders.orderItam.id,
                    itamStatus: ITAMStatus,
                    itamVerificationEmailSent: ITAMVerificationEmailSent,
                    itamProductSource: ITAMProductSource,
                    itamOldAssetTag: ITAMOldAssetTag,
                    itamOldModel: ITAMOldModel,
                    itamMonitorModel: ITAMMonitorModel,
                    itamMonitorNum: ITAMMonitorNum,
                    itamConnectorTypes: ITAMConnectorType,
                    itamOrderPendingEmail: ITAMOrderPendEmail,
                    itamConfirmedNewHire: ITAMConfirmedNewhire,
                    itamPoOrderId: ITAMPOOrder,
                    itamDellOrderId: ITAMDellOrder,
                    itamDellEmailNotif: ITAMDellEmailNotif,
                    techId: this.props.orders.orderTech.id,
                    techStatus: TechStatus,
                    techConfirmedUser: TechConfirmedUser,
                    techCostCenter: TechCostCenter,
                    techServiceTag: TechServiceTag,
                    techInitialEmail: TechEmailPCSent,
                    techDateFollowupTemp: TechDateFollowupTemp,
                    techFollowupEmailSent: TechFollowupEmail,
                    techDateCompleted: TechDateSetupCompleted,
                    itamUserName: ITAMName,
                    techUserName: TechName
                  }
                }}
              >
                {updateEntireOrder =>
                  <button
                    type="button"
                    class="btn btn-success"
                    onClick={() => {
                      this.setState({ buttonClicked: true });
                      updateEntireOrder();
                    }}
                    disabled={!(
                      this.state.isValidID *
                      this.state.isValidCreated *
                      this.state.isValidApproved *
                      this.state.isValidVerifEmail  *
                      this.state.isValidEmail *
                      this.state.isValidStartDate *
                      this.state.isValidPendEmail *
                      this.state.isValidConfirmedHireDate *
                      this.state.isValidPCEmailDate *
                      this.state.isValidFollowupEmail *
                      this.state.isValidDateSetupCompleted *
                      this.state.isValidEmailNotif *
                      this.state.isValidDateFollowup *
                      !this.state.buttonClicked)}
                  >
                    Update
                  </button>
                }
              </Mutation>
            </div>
            <div class="col-sm">
              <button
                type="button"
                class="btn btn-danger"
                onClick={this.verifyDelete}
                style={{ display: `${!this.state.isDeleted ? "inline" : "none"}` }}
              >
                Delete
              </button>
              <div style={{ display: `${this.state.isDeleted ? "inline" : "none"}` }}>
                <Mutation mutation={DELETE_ORDER} variables={{ id: this.props.orders.id }}>
                  {deleteOrder =>
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={() => {deleteOrder(); this.hideOrder(); this.removeOrderFromList();}}
                    >
                      Permanently Delete
                    </button>
                  }
                </Mutation>
              </div>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}
export default Orders;
