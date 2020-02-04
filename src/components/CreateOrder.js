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
`;

const CREATE_ORDER = gql`
  mutation createOrder(
    $orderSimplexId: Float!,
    $orderDateCreated: Date!,
    $orderDateApproved: Date!,
    $orderCreatedBy: String!,
    $orderCreatedByEmail: String!,
    $orderNewHire: Boolean,
    $orderRecipient: String!,
    $orderHireStartDate: Date,
    $orderHireName: String,
    $orderApprovalManager: String!,
    $orderBusinessUnit: String!,
    $orderAttention: String!,
    $orderShippingAddress: String!,
    $orderItem: String!,
    $orderTotal: Float!,
    $orderComments: String!,
    $orderCategory: String!,
    $orderSla: Int,
    $orderItam: ItamProgressCreateOneWithoutItamOrderInput,
    $orderTech: TechProgressCreateOneWithoutTechOrderInput
  ) {
    createOrder(
      orderSimplexId: $orderSimplexId,
      orderDateCreated: $orderDateCreated,
      orderDateApproved: $orderDateApproved,
      orderCreatedBy: $orderCreatedBy,
      orderCreatedByEmail: $orderCreatedByEmail,
      orderNewHire: $orderNewHire,
      orderRecipient: $orderRecipient,
      orderHireStartDate: $orderHireStartDate,
      orderHireName: $orderHireName,
      orderApprovalManager: $orderApprovalManager,
      orderBusinessUnit: $orderBusinessUnit,
      orderAttention: $orderAttention,
      orderShippingAddress: $orderShippingAddress,
      orderItem: $orderItem,
      orderTotal: $orderTotal,
      orderComments: $orderComments,
      orderCategory: $orderCategory,
      orderSla: $orderSla,
      orderItam: $orderItam,
      orderTech: $orderTech
    ) {
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

class CreateOrder extends React.Component {
  constructor(props) {
    super( props );
    this.state = {
      orderid: 0,
      dateCreated: new Date().toISOString().split("T")[ 0 ],
      dateApproved: new Date().toISOString().split("T")[ 0 ],
      createdBy: "",
      createdByEmail: null,
      recipient: "",
      newHire: false,
      hireName: "",
      hireStartDate: null,
      sla: null,
      approvalManager: "",
      businessUnit: "",
      attention: "",
      shippingAddress: "",
      item: "",
      itemType: "Choose...",
      total: 0.00,
      comments: "",
      orderCategory: "New Order",
      itamStatus: "Not Started",
      itamName: "Unassigned",
      itamVerifEmail: null,
      itamProductSource: "",
      itamOldAssetTag: null,
      itamOldModel: null,
      itamMonitorModel: null,
      itamMonitorNum: 0,
      itamConnectorType: null,
      itamOrderPendEmail: null,
      itamConfirmedNewhire: null,
      itamPOOrder: null,
      itamDellOrder: null,
      itamDellEmailNotif: null,
      techStatus: "Not Started",
      techName: "Unassigned",
      techConfirmedUser: null,
      techCostCenter: null,
      techServiceTag: null,
      techEmailPCSent: null,
      techFollowupEmail: null,
      techDateFollowupTemp: null,
      techDateSetupCompleted: null,
      isValidID: true,
      isValidCreated: true,
      isValidApproved: true,
      isValidEmail: false,
      isValidStartDate: true,
      isValidPendEmail: true,
      isValidConfirmedHireDate: true,
      isValidPCEmailDate: true,
      isValidDateFollowup: true,
      isValidFollowupEmail: true,
      isValidDateSetupCompleted: true,
      isValidVerifEmail: true,
      isValidEmailNotif: true,
      buttonClicked: false
    };
  }

  newHireToggle = () => {
    this.setState({ newHire: !this.state.newHire });
  };

  toCashMoney = (usrInput) => {
    usrInput = parseFloat( parseFloat( usrInput ).toFixed( 2 ) );
    this.setState({ total: usrInput });
  };

  toValidFloat = (usrInput, selectedFloat) => {
    var num;
    if ( usrInput && parseFloat( usrInput ) < 10000000000000000 ) {
      num = usrInput;
    } else {
      num = 0;
    }

    if ( selectedFloat === "ID" ) {
      this.setState({ isValidID: true });
      this.setState({ orderid: parseFloat( num ) });
    } else if ( selectedFloat === "Total" ) {
      this.setState({ total: num });
    } else if ( selectedFloat === "MonitorNum" ) {
      this.setState({ itamMonitorNum: parseFloat( num ) });
    } else if ( selectedFloat === "sla" ) {
      this.setState({ sla: parseFloat( num ) });
    } else if ( selectedFloat === "POOrderNum" ) {
      this.setState({ itamPOOrder: parseFloat( num ) });
    } else if ( selectedFloat === "DellOrderNum" ) {
      this.setState({ itamDellOrder: parseFloat( num ) });
    }
  };

  toValidDate = (usrInputDate, selectedDate) => {
    var valid = false;
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
        this.setState({ itamVerifEmail: usrInputDate, isValidVerifEmail: valid });
        break;
      case "orderPendEmail":
        this.setState({ itamOrderPendEmail: usrInputDate, isValidPendEmail: valid });
        break;
      case "EmailPCSent":
        this.setState({ techEmailPCSent: usrInputDate, isValidPCEmailDate: valid });
        break;
      case "FollowupEmail":
        this.setState({ techFollowupEmail: usrInputDate, isValidFollowupEmail: valid });
        break;
      case "DateFollowupTemp":
        this.setState({ techDateFollowupTemp: usrInputDate, isValidDateFollowup: valid });
        break;
      case "EmailNotif":
        this.setState({ itamDellEmailNotif: usrInputDate, isValidEmailNotif: valid });
        break;
      case "SetupCompleted":
        this.setState({ techDateSetupCompleted: usrInputDate, isValidDateSetupCompleted: valid });
        break;
      case "confirmedNewHire":
        this.setState({ itamConfirmedNewhire: usrInputDate, isValidConfirmedHireDate: valid });
        break;
      case "hireStartDate":
        this.setState({ hireStartDate: usrInputDate, isValidStartDate: valid });
        break;
    }
  };

  validateEmail = (usrInputEmail) => {
    if ( usrInputEmail.match( /^.+@\w+\.\w+$/g ) ) {
      this.setState({ isValidEmail: true });
    } else {
      this.setState({ isValidEmail: false });
    }
    this.setState({ createdByEmail: usrInputEmail });
  };

  render() {

    const {
      orderid,
      dateCreated,
      dateApproved,
      createdBy,
      createdByEmail,
      recipient,
      newHire,
      hireName,
      hireStartDate,
      approvalManager,
      businessUnit,
      attention,
      shippingAddress,
      item,
      itemType,
      total,
      sla,
      orderCategory,
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
      techName,
      techConfirmedUser,
      techCostCenter,
      techServiceTag,
      techEmailPCSent,
      techFollowupEmail,
      techDateFollowupTemp,
      techDateSetupCompleted
    } = this.state;

    const itamOwner = {
      connect: {
        userName: itamName
      }
    };

    const techOwner = {
      connect: {
        userName: techName
      }
    };

    const createITAM = {
      create: {
        itamStatus: itamStatus,
        itamVerificationEmailSent: itamVerifEmail,
        itamProductSource: itamProductSource,
        itamOldAssetTag: itamOldAssetTag,
        itamOldModel: itamOldModel,
        itamMonitorModel: itamMonitorModel,
        itamMonitorNum: itamMonitorNum,
        itamConnectorTypes: itamConnectorType,
        itamOrderPendingEmail: itamOrderPendEmail,
        itamConfirmedNewHire: itamConfirmedNewhire,
        itamPoOrderId: itamPOOrder,
        itamDellOrderId: itamDellOrder,
        itamDellEmailNotif: itamDellEmailNotif,
        itamOwner: itamOwner
      }
    };

    const createTech = {
      create: {
        techStatus: techStatus,
        techConfirmedUser: techConfirmedUser,
        techCostCenter: techCostCenter,
        techServiceTag: techServiceTag,
        techInitialEmail: techEmailPCSent,
        techDateFollowupTemp: techDateFollowupTemp,
        techFollowupEmailSent: techFollowupEmail,
        techDateCompleted: techDateSetupCompleted,
        techOwner: techOwner
      }
    };

    return (
      <Styles>
        <div className="container-fluid">
          <div className="row orders">
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="orderNum">Order #</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Natural Number"
                  aria-label="Order Number"
                  aria-describedby="orderNum"
                  disabled
                  value={orderid}
                  onChange={e=>this.toValidFloat( e.target.value, "ID" )}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="orderItem">Order Item</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Order Item"
                  aria-label="Order Item"
                  aria-describedby="orderItem"
                  value={item}
                  onChange={e=>this.setState({ item: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="orderCategory">Order Category</label>
                </div>
                <select
                  className="custom-select"
                  id="orderCategory"
                  onChange={e=>this.setState({ orderCategory:e.target.value })}
                >
                  <option value="New Order" selected>New Order</option>
                  <option value="Accessory">Accessory</option>
                  <option value="New Hire">New Hire</option>
                  <option value="Priority Deployment">Priority Deployment</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="dateCreated">Date Created</span>
                </div>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  aria-label="YYYY-MM-DD"
                  aria-describedby="dateCreated"
                  value={dateCreated}
                  onChange={e=>this.toValidDate( e.target.value, "dateCreated" )}
                  className={
                    `form-control ${this.state.isValidCreated ? "is-valid" : "is-invalid"}`
                  }
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="dateApproved">Date Approved</span>
                </div>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  aria-label="YYYY-MM-DD"
                  aria-describedby="dateApproved"
                  value={dateApproved}
                  onChange={e=>this.toValidDate( e.target.value, "dateApproved")}
                  className={
                    `form-control ${this.state.isValidApproved ? "is-valid" : "is-invalid"}`
                  }
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="createdBy">Created By</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Firstname  Lastname"
                  aria-label="Firstname  Lastname"
                  aria-describedby="createdBy"
                  value={createdBy}
                  onChange={e=>this.setState({ createdBy: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="createdByEmail">Created By Email</span>
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
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="recipient">Recipient</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Firstname  Lastname"
                  aria-label="Firstname  Lastname"
                  aria-describedby="recipient"
                  value={recipient}
                  onChange={e=>this.setState({ recipient: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <input
                      type="checkbox"
                      id="newHire"
                      aria-label="New Hire"
                      onClick={this.newHireToggle}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder ="New Hire"
                  aria-label="New Hire"
                  disabled
                />
              </div>
            </div>
            <div
              className="col-sm-4"
              style={{ display: `${this.state.newHire ? "inline" : "none"}` }}
            >
              <Fade in={this.state.newHire}>
                <div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="hireName">Hire Name</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
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
              className="col-sm-4"
              style={{ display: `${this.state.newHire ? "inline" : "none"}` }}
            >
              <Fade in={this.state.newHire}>
                <div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="hireStartDate">Hire Start Date</span>
                    </div>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      aria-label="YYYY-MM-DD"
                      aria-describedby="hireStartDate"
                      disabled={!this.state.newHire}
                      value={hireStartDate}
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
              className="col-sm-4"
              style={{
                display: `${this.state.newHire ? "inline" : "none"}`
              }}
            >
              <Fade in={this.state.newHire}>
                <div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="sla">SLA</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
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
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="appManager">Approval Manager</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Firstname  Lastname"
                  aria-label="Firstname  Lastname"
                  aria-describedby="appManager"
                  value={approvalManager}
                  onChange={e=>this.setState({ approvalManager: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="bussUnit">Business Unit</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Business Unit"
                  aria-label="Business Unit"
                  aria-describedby="bussUnit"
                  value={businessUnit}
                  onChange={e=>this.setState({ businessUnit: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="attention">Attention</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Firstname  Lastname"
                  aria-label="Firstname  Lastname"
                  aria-describedby="attention"
                  value={attention}
                  onChange={e=>this.setState({ attention: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="shipAddress">Shipping Address</span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Street, City, Province,  Postal"
                  aria-label="Street, City, Province,  Postal"
                  aria-describedby="shipAddress"
                  value={shippingAddress}
                  onChange={e=>this.setState({ shippingAddress: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="orderTotal">Order Total $</span>
                </div>
                <input
                type="text"
                className="form-control"
                placeholder="Order Total"
                aria-label="Order Total"
                aria-describedby="orderTotal"
                value={total}
                onChange={e=>
                  this.toValidFloat( e.target.value, "Total")}
                  onBlur={e=>this.toCashMoney( e.target.value )}
                />
              </div>
            </div>
            {/* =================================================================================
                ======================================ITAM=======================================
                =================================================================================*/}
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="ITAMStatus">ITAM Status</label>
                </div>
                <select
                  className="custom-select"
                  id="ITAMStatus"
                  onChange={e=>this.setState({ itamStatus:e.target.value })}
                >
                  <option value="New" selected>New</option>
                  <option value="Emailed">Emailed</option>
                </select>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="ITAMName">ITAM Name</label>
                </div>
                <Query query={QUERY_USERS}>
                  {({ loading, error, data }) => {
                    if ( loading ) {
                      return <select className="custom-select" id="ITAMName">Fetching</select>;
                    }
                    if ( error ) {
                      return <select className="custom-select" id="ITAMName">Error</select>;
                    }
                    const usersToRender = data.users;
                    return (
                      <select
                        className="custom-select"
                        id="ITAMName"
                        onChange={e=>this.setState({ itamName: e.target.value })}
                      >
                        {usersToRender.slice( 0 ).map( user =>
                          <option value={user.name}>{user.name}</option>
                        )}
                      </select>
                    );
                  }}
                </Query>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="verifEmail">Verification Email</span>
                </div>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  aria-label="YYYY-MM-DD"
                  aria-describedby="verifEmail"
                  value={itamVerifEmail}
                  onChange={e=>this.toValidDate( e.target.value, "verificationEmail")}
                  className={
                    `form-control ${this.state.isValidVerifEmail ? "is-valid" : "is-invalid"}`
                  }
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="productSource">Product Source</label>
                </div>
                <select
                  className="custom-select"
                  id="productSource"
                  onChange={e=>this.setState({ itamProductSource:e.target.value })}
                >
                  <option value="" Selected>Select...</option>
                  <option value="Inhouse">Inhouse</option>
                  <option value="Emerge">Emerge</option>
                  <option value="Dell">Dell</option>
                </select>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="oldAssetTag">Old Asset Tag</span>
                </div>
                <input
                  type="text"
                  className="form-control ITAMInput"
                  placeholder="FIN##### etc."
                  aria-label="FIN##### etc."
                  aria-describedby="oldAssetTag"
                  value={itamOldAssetTag}
                  onChange={e=>this.setState({ itamOldAssetTag: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="oldModel">Old Model</span>
                </div>
                <input
                  type="text"
                  className="form-control ITAMInput"
                  placeholder="T440, Lat5490 etc."
                  aria-label="T440, Lat5490 etc."
                  aria-describedby="oldModel"
                  value={itamOldModel}
                  onChange={e=>this.setState({ itamOldModel: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="monitorModel">Monitor Model</span>
                </div>
                <input
                  type="text"
                  className="form-control ITAMInput"
                  placeholder="Viewsonic etc."
                  aria-label="Viewsonic etc."
                  aria-describedby="monitorModel"
                  value={itamMonitorModel}
                  onChange={e=>this.setState({ itamMonitorModel: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="monitorNum"># of Monitors</span>
                </div>
                <input
                  type="text"
                  className="form-control ITAMInput"
                  placeholder="Natural Number"
                  aria-label="Natural Number"
                  aria-describedby="monitorNum"
                  value={itamMonitorNum}
                  onChange={e=>this.toValidFloat( e.target.value, "MonitorNum")}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="connectorTypes">Type of Connectors</span>
                </div>
                <input
                  type="text"
                  className="form-control ITAMInput"
                  placeholder="VGA, DVI etc."
                  aria-label="VGA, DVI etc."
                  aria-describedby="connectorTypes"
                  value={itamConnectorType}
                  onChange={e=>this.setState({ itamConnectorType: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
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
                  value={itamOrderPendEmail}
                  onChange={e=>this.toValidDate( e.target.value, "orderPendEmail")}
                  className={
                    `form-control ITAMInput ${this.state.isValidPendEmail ?
                      "is-valid" : "is-invalid"
                    }`
                  }
                />
              </div>
            </div>
            <div
              className="col-sm-4"
              style={{ display: `${this.state.newHire ? "inline" : "none" }` }}
            >
              <Fade in={this.state.newHire}>
                <div>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span
                        className="input-group-text"
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
                      value={itamConfirmedNewhire}
                      onChange={e=>this.toValidDate( e.target.value, "confirmedNewHire")}
                      className={
                        `form-control ITAMInput ${this.state.isValidConfirmedHireDate ?
                          "is-valid" : "is-invalid"
                        }`
                      }
                    />
                  </div>
                </div>
              </Fade>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="PONumber">PO/Order #</span>
                </div>
                <input
                  type="text"
                  className="form-control ITAMInput"
                  placeholder="Natural Number"
                  aria-label="Natural Number"
                  aria-describedby="PONumber"
                  value={itamPOOrder}
                  onChange={e=>this.toValidFloat( e.target.value, "POOrderNum")}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="dellOrderNum">Dell Order #</span>
                </div>
                <input
                  type="text"
                  className="form-control ITAMInput"
                  placeholder="Natural Number"
                  aria-label="Natural Number"
                  aria-describedby="dellOrderNum"
                  value={itamDellOrder}
                  onChange={e=>this.toValidFloat( e.target.value, "DellOrderNum")}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    id="dellEmailNotif"
                  >
                    Dell Email Notification
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="YYYY-MM-DD"
                  aria-label="YYYY-MM-DD"
                  aria-describedby="dellEmailNotif"
                  value={itamDellEmailNotif}
                  onChange={e=>this.toValidDate( e.target.value, "EmailNotif")}
                  className={
                    `form-control ${this.state.isValidEmailNotif ? "is-valid" : "is-invalid"}`
                  }
                />
              </div>
            </div>
            {/* =================================================================================
                ======================================TECH=======================================
                =================================================================================*/}
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="techName">Tech Name</label>
                </div>
                <Query query={QUERY_USERS}>
                  {({ loading, error, data }) => {
                    if ( loading ) {
                      return <select className="custom-select" id="techName">Fetching</select>;
                    }
                    if ( error ) {
                      return <select className="custom-select" id="techName">Error</select>;
                    }
                    const usersToRender = data.users;
                    return (
                      <select
                        className="custom-select"
                        id="techName"
                        onChange={e=>this.setState({ techName:e.target.value })}
                      >
                        {usersToRender.slice( 0 ).map( user =>
                          <option value={user.name}>{user.name}</option>
                        )}
                      </select>
                    );
                  }}
                </Query>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <label className="input-group-text" for="techStatus">Tech Status</label>
                </div>
                <select
                  className="custom-select"
                  id="techStatus"
                  onChange={e=>this.setState({ techStatus:e.target.value })}
                >
                  <option value ="Not Started" selected>Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Shipped to User">Shipped to User</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="confirmedUser">Confirmed User</span>
                </div>
                <input
                  type="text"
                  className="form-control techInput"
                  placeholder="Firstname Lastname"
                  aria-label="Firstname Lastname"
                  aria-describedby="confirmedUser"
                  value={techConfirmedUser}
                  onChange={e=>this.setState({ techConfirmedUser: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="costCenter">Cost Center</span>
                </div>
                <input
                  type="text"
                  className="form-control techInput"
                  placeholder="Location"
                  aria-label="Location"
                  aria-describedby="costCenter"
                  value={techCostCenter}
                  onChange={e=>this.setState({ techCostCenter: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="serviceTag">Service Tag</span>
                </div>
                <input
                  type="text"
                  className="form-control techInput"
                  placeholder="CAL-*******"
                  aria-label="CAL-*******"
                  aria-describedby="serviceTag"
                  value={techServiceTag}
                  onChange={e=>this.setState({ techServiceTag: e.target.value })}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="techEmailSent">Email/PC Sent</span>
                </div>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  aria-label="YYYY-MM-DD"
                  aria-describedby="techEmailSent"
                  value={techEmailPCSent}
                  onChange={e=>this.toValidDate( e.target.value, "EmailPCSent" )}
                  className={
                    `form-control techInput ${this.state.isValidPCEmailDate ?
                      "is-valid" : "is-invalid"
                    }`
                  }
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
                    id="dateFollowupTemp2"
                  >
                    Date Followup Template #2
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control techInput"
                  placeholder="YYYY-MM-DD"
                  aria-label="YYYY-MM-DD"
                  aria-describedby="dateFollowupTemp2"
                  value={techDateFollowupTemp}
                  onChange={e=>this.toValidDate( e.target.value, "DateFollowupTemp" )}
                  className={
                    `form-control ${this.state.isValidDateFollowup ? "is-valid" : "is-invalid"}`}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="setupComplete">Date Setup Completed</span>
                </div>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  aria-label="YYYY-MM-DD"
                  aria-describedby="setupComplete"
                  value={techDateSetupCompleted}
                  onChange={e=>this.toValidDate( e.target.value, "SetupCompleted")}
                  className={
                    `form-control ${this.state.isValidDateSetupCompleted ?
                      "is-valid" : "is-invalid"
                    }`
                  }
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text"
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
                  value={techFollowupEmail}
                  onChange={e=>this.toValidDate( e.target.value, "FollowupEmail")}
                  className={
                    `form-control techInput ${this.state.isValidFollowupEmail ?
                      "is-valid" : "is-invalid"
                    }`
                  }
                />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="comments">Comments</span>
                </div>
                <textarea
                  className="form-control"
                  aria-label="With textarea"
                  aria-describedby="comments"
                  value={comments}
                  onChange={e=>this.setState({ comments: e.target.value })}>
                </textarea>
              </div>
            </div>
          </div>
          <div className="row buttons">
            <div className="col-sm">
              <Mutation
                mutation={CREATE_ORDER}
                variables={{
                  orderSimplexId: orderid,
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
                  orderItam: createITAM,
                  orderTech: createTech
                }}
              >
                {createOrder =>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      this.setState({ buttonClicked: true });
                      createOrder();
                      window.location.reload();
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
                      !this.state.buttonClicked)
                    }
                  >
                    Create
                  </button>
                }
              </Mutation>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}
export default CreateOrder;
