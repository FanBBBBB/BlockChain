import React, { Component } from 'react';
import  ReactDOM from 'react-dom';
import { Button } from 'antd';
import logo from '../logo.png';
import Web3 from 'web3';
import ArtAuction from '../abis/ArtAuction.json'
import { Table, Space } from 'antd';
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // Infura IPFS API
const { Column } = Table;

// const columns = [
//   {
//     title: '商品名、加价',
//     dataIndex: 'name',
//     key: 'name',
//   },
//   {
//     title: '当前最高价',
//     dataIndex: 'price',
//     key: 'price',
//   },
//   {
//     title: 'Action',
//     key: 'action',
//     render: (text, record) => (
//       <Space size="middle">
//         <a>Invite {record.name}</a>
//         <a>Delete</a>
//       </Space>
//     ),
//   },
// ];

// const data1 = [
//   {
//     key: '1',
//     Name: 'John Brown',
//     price: 32,
//   },
//   {
//     key: '2',
//     Name: 'Jim Green',
//     price: 42,
//   },
//   {
//     key: '3',
//     Name: 'Joe Black',
//     price: 32,
//   },
// ];

// function add(params) {
//   const _tnp = JSON.parse(JSON.stringify(this.state.data1));
//   _tnp[key].splice(2, 1, limit+price);
//   this.setState({data1: _tmp});
// }

// function add(key) {
//   const _tnp = JSON.parse(JSON.stringify(this.state.data1));
//   _tnp[key].splice(2, 1, limit+price);
//   this.setState({data1: _tnp});
// }

// function del(key) {
//   const _top = JSON.parse(JSON.stringify(this.state.data1));
//   _top.splice(key-1, 1, {});
//   this.setState({data1: _top});
// }

// var limit = 0;
// var price = 0;
var key = 0;

class App extends Component {

  add(key) {
    // console.log("zhengchang1")
    const _tnp = JSON.parse(JSON.stringify(this.state.data1));
    // console.log("zhengchang2")
    // _tnp[key-1].splice(2, 1, limit+price);
    // console.log("above");
    // console.log(_tnp);
    // console.log(key);
    // console.log(_tnp[key]["price"]);
    // console.log(_tnp[key]["limit"]);
    _tnp[key]["price"] = String(Number(_tnp[key]["price"]) + Number(_tnp[key]["limit"]))
    // console.log("zhengchang3")
    this.setState({data1: _tnp});
    // console.log("zhengchang4")
  }
  
  del(key) {
    const _top = JSON.parse(JSON.stringify(this.state.data1));
    _top.pop()
    // _top.splice(key-1, 1, {});
    this.setState({data1: _top});
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
   
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider ||"https://localhost:7545")
    
    const accounts = await web3.eth.getAccounts()
    console.log("account  ",  accounts)
    this.setState({  account: accounts[0] })
    console.log("Account set", this.state.account)
    const networkId = await web3.eth.net.getId()
    var networkData = ArtAuction.networks[networkId]
    if(networkData) {
      var contract = new web3.eth.Contract(ArtAuction.abi, networkData.address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })

    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
     
    this.state = {
      ipfsHash: '', 
      contract: null,
      web3: null,
      buffer: null,
      account: null,
      price: null,
      totalSupply: 0,
      arthash: [],
      data1: [
        // {
        //   key: '1',
        //   Name: 'John Brown',
        //   price: 32,
        // },
        // {
        //   key: '2',
        //   Name: 'Jim Green',
        //   price: 42,
        // },
        // {
        //   key: '3',
        //   Name: 'Joe Black',
        //   price: 32,
        // },
      ]
      // data is an array, you should construct it 
      // find sth about adding elements to an array in js
      //这是默认值，通过this.setState({  data:新data })的方式赋值改变
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }  


  captureFile = (event) => {
    event.preventDefault()   
    var file = event.target.files[0] 
    var reader = new window.FileReader()
    reader.readAsArrayBuffer(file) 
    reader.onloadend = () => {  
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
      
    }
  }

  //Submitting file to IPFS
  onSubmit = (event) => {
    event.preventDefault()  
    console.log("Submitting file to ipfs")
    
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      const ipfsHash = result[0].hash 
      this.setState({ipfsHash: ipfsHash})
      if(error) {
        console.error(error)
        return
      }     
      
      })
   }

   getImage = (event) =>{
     event.preventDefault()
   }
   Bid = (event) =>{
    event.preventDefault()
  }
   handleSubmit(event) {
    event.preventDefault();
  }

  async push() {
  }

  

  render() {
    return (
    <>
    (
      
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href={"https://ipfs.infura.io/ipfs/" + this.state.ipfsHash}
            target="_blank"
            rel="noopener noreferrer"
          >
            文件IPFS CID ： {this.state.ipfsHash}
          </a>
          
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
             <small className="text-white">用户名 ： {this.state.account}</small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="https://zju.edu.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h2>NFT拍卖系统</h2>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' />
                  </form>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  var price = document.getElementById("p").value 
                  var limit = document.getElementById("i").value 
                 this.state.contract.methods.addArtItem(price, this.state.ipfsHash, limit).send({ from: this.state.account })
                //  var key = document.getElementById("t").value
                  // console.log(key++);
                  var Name = this.state.ipfsHash;
                  
                const _tmp = JSON.parse(JSON.stringify(this.state.data1));

                  // let _tmp =  this.state.data1;
                  _tmp.push({key, Name, price, limit});
                  console.log(_tmp);
                  key++;
                  this.setState({data1: _tmp});

                //  this.state.data1.push({key, Name, price})
                 // this kind of operation is ILLEGAL!
                 // You can ONLY modify data1 through setState
                 // store the data and 
                 //  document.write("<table>");
                //  document.write("<tbody>");
                //   // for(i=0;i<zhi;i++){
                //     var a = this.state.ipfsHash;
                //     var b = price;
                //     var c = "<a href='javascript:;' onclick='push(this)' >加价</a>";
                //     document.write("<tr>");
                //       // for(x=0;x<zhi;x++){
                //           document.write("<td>"+a+b+c+"</td>");
                //       // }
                //   document.write("</tr>");
                //   // }
                //   document.write("</tbody>");
                //   document.write("</table>");
          
                              
                          
                              // var tr=document.createElement("tr");
                              // var xh=document.createElement("td");
                              // var xm=document.createElement("td");
                              // xh.innerHTML=this.state.ipfsHash;
                              // xm.innerHTML=price;
                              // var push=document.createElement("td");
                              // push.innerHTML="<a href='javascript:;' onclick='push(this)' >加价</a>";
                              // var tab=document.getElementById("table");
                              // tab.appendChild(tr);
                              // tr.appendChild(xh);
                              // tr.appendChild(xm);
                              // tr.appendChild(push);
                              // console.log(tab);
                              // console.log(tr);
                              // var trk = document.getElementsByTagName("tr");
                              // for(var i= 0;i<trk.length;i++){
                              //   // bgcChange(trk[i]);
                              // }
                            
                }}>
                  <label>
                  Price:
                  <input id="p" type="number" name="price" />
                  </label>
                  <label>
                    Increment
                  <input id="i" type="number" name="limit" />
                  </label>
                  <input type='submit' />
                </form>  

                <label>
                  Token ID
                  <input id="t" type="number" name="price" />
                  </label> 
                 <button onClick={async(event) => {
                   var tid = document.getElementById("t").value 
                  event.preventDefault()
                  var x = await this.state.contract.methods.getArtItem(tid).call({ from: this.state.account })  
                  console.log(x)
                  // console.log(tid)
                }}
                >Show ERC721 that was minted</button>

                {/* ReactDOM.render(<Table columns={columns} dataSource={data} />, mountNode); */}

                {/* <button onClick={async(event) => {
                  var zhi=document.getArtItemIds().value;
                  document.write("<table>");
             
                  for(i=0;i<zhi;i++){
                    var x = await this.state.contract.methods.getArtItem2(i).call({ from: this.state.account }) 
                    document.write("<tr>");
                      for(x=0;x<zhi;x++){
                          document.write("<td>"+x+"</td>");
                      }
                  document.write("</tr>");
                  }
                  document.write("</table>");

                  // var tid = document.getElementById("t").value 
                  // event.preventDefault()
                  // var x = await this.state.contract.methods.getArtItem(tid).call({ from: this.state.account })  
                  // console.log(x)
                  // console.log(tid)
                }}
                >展示当前拍卖品列表</button>          */}
              </div>
            </main>
          </div>
        </div>

      </div>
      {/* <Table columns={columns} dataSource={data1} /> */}
      <h1 align = "center">当前所有拍品 </h1>
      <Table dataSource={this.state.data1} bordered>
      <Column title="Name" dataIndex="Name" key="Name" />
      <Column title="price" dataIndex="price" key="price" />
      <Column title="limit" dataIndex="limit" key="limit" />
      <Column
        title="Action"
        key="action"
        render={(record) => (
          <Space size="middle">
            <Button type="primary" onClick={async(event) => {
                  event.preventDefault()
                  // console.log(record.key)
                  this.add(record.key)
                }}>加价</Button>
          </Space>
        )}
      />
    </Table>
    <h1 align = "center">当前用户所有拍品 </h1>
      <Table dataSource={this.state.data1} bordered>
      <Column title="Name" dataIndex="Name" key="Name" />
      <Column title="price" dataIndex="price" key="price" />
      <Column title="limit" dataIndex="limit" key="limit" />
      <Column
        title="Action"
        key="action"
        render={(record) => (
          <Space size="middle">
            <Button type="primary" onClick={async(event) => {
                  event.preventDefault()
                  this.del(record.key)
                }}>下架</Button>
          </Space>
        )}
      />
    </Table>
    </>
    );
  }
  
}
;

export default App;