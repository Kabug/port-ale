import React from "react";
import styled from "styled-components";
import CSVReader from "react-csv-reader";

const Styles = styled.div`

  .csv-input{
    border-style: dashed;
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

`

class Upload extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      newOrders: []
    };
  }

   setDataToState = (data) =>{

    for(var order in data){
      console.log(data[order])
      if(data[order][0] === ""){
        data.splice(order, 1);
        console.log("Delete: ")
        console.log(data[order][0])
      } else if(data[order][0].match(/^[0-9]+$/) == null){
          data.splice(order, 1);
          console.log("Delete: ")
          console.log(data[order][0])
        }
        else{
          console.log("Keep: ")
          console.log(data[order][0])
        }
      console.log("===========================")
    }
    console.log(data)
    this.setState({newOrders: data})
  }


  render(){
    return (
      <Styles>
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-12">
              <CSVReader onFileLoaded={data => this.setDataToState(data)} />
            </div>
          </div>
            {this.state.newOrders.map(order =>
              <div class="row">
                <div class="col-sm newOrdersDiv">
                  {order}
                </div>
              </div>
            )}
        </div>
      </Styles>
    );
  }
}

export default Upload;
