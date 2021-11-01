pragma solidity ^0.6.3;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ArtAuction is ERC721 {
    
  using SafeMath for uint256;

  mapping(uint256 => ArtItem) private _artItems;
  address public owner;

//   mapping (uint256=>string) public a;
  uint256 public _tokenIds;
  uint256 public _artItemIds;
  bool public canceled;
  mapping(uint256=>mapping(address => uint256)) public fundsByBidder; 
  mapping(uint256=>bidding) public bid;
  bool auctionstarted = false; 
  bool firsttime = false;

    event LogBid(address bidder, uint bid, address highestBidder, uint highestBid, uint highestBindingBid);   
    event LogWithdrawal(address withdrawer, address withdrawalAccount, uint amount);
    event LogCanceled();

    struct ArtItem {
        address payable seller;
        uint256 minbid;
        string tokenURI;
        bool exists;  
        uint bidIncrement;
    }
    
    struct bidding{
     uint highestBindingBid;
     address payable highestBidder;
    }


  constructor() public ERC721("DART", "ART")  //Initializing ERC721 
  {   
    owner=msg.sender;
  }

  
  modifier artItemExist(uint256 id) {
        require(_artItems[id].exists, "Not Found");
        _;
    }
    
    modifier onlyNotOwner(uint256 id) {      
      ArtItem memory artItem = _artItems[id];   
      if (msg.sender == artItem.seller) revert();
    _;
     }

    modifier onlyNotCanceled{  
    if (canceled) revert();
    _;
     }
    modifier onlyOwner(uint256 id)
     {
        ArtItem memory artItem = _artItems[id];   
        if (msg.sender != artItem.seller) revert();
         _;
     }
     
    modifier minbid(uint256 id)
    {
        ArtItem memory artItem = _artItems[id];
        if(msg.value<artItem.minbid) revert();
        _;
    }

  function addArtItem(uint256 price, string memory tokenURI, uint _bidincrement) public {
        require(price >= 0, "Price cannot be lesss than 0");

        _artItemIds++;
        _artItems[_artItemIds] = ArtItem(msg.sender, price, tokenURI, true, _bidincrement );
    }

  function getArtItem(uint256 id)   //get art item info
        public
        view
        artItemExist(id)
        returns (
            uint256,
            uint256,
            string memory,
            uint256,
            address
        )
    {
        ArtItem memory artItem = _artItems[id];
        bidding memory bid = bid[id]; 
        return (id, artItem.minbid, artItem.tokenURI, bid.highestBindingBid, artItem.seller);
    }

    function getArtItem2(uint256 id)   //get art item info
        public
        view
        artItemExist(id)
        returns (
            string memory,
            uint256
        )
    {
        ArtItem memory artItem = _artItems[id];
        bidding memory bid = bid[id]; 
        return (artItem.tokenURI, bid.highestBindingBid);
    }
    
    function getArtItemIds() public 
    returns (uint256)
    {
        return _artItemIds;
    }

    // function getAlltid() 
    // returns (mapping)
    // {
    //     uint i = 0;
    //     while(i < _artItemIds) {
    //         a[i] = _artItems[i].tokenURI;
    //         i++;
    //     }
    //     return (a);
    // }

    function cancelAuction(uint256 id) public payable
    onlyOwner(id)
    onlyNotCanceled()
    returns (bool success)
   {
    canceled = true;
    
    if(auctionstarted==true)
    {
    ArtItem memory artItem = _artItems[id];   
    bidding storage bid = bid[id]; 
    _tokenIds++; 
    _safeMint(msg.sender, _tokenIds);
    _setTokenURI(_tokenIds, artItem.tokenURI);
    
    if (bid.highestBindingBid == 0) revert();
    fundsByBidder[id][bid.highestBidder] -= bid.highestBindingBid;
    if (!msg.sender.send(bid.highestBindingBid)) revert();
        } 
    
    LogCanceled();
    return true;
   }
   
   function placeBid(uint256 id) public
    payable
    onlyNotCanceled
    onlyNotOwner(id)
    minbid(id)
    
    returns (bool success)
{
    if (msg.value == 0) revert();
    
    bidding storage bid = bid[id]; 
    auctionstarted = true;
    ArtItem memory artItem = _artItems[id];  

    uint newBid = fundsByBidder[id][msg.sender] + msg.value;
    

    if (newBid <= bid.highestBindingBid) revert();

    uint highestBid = fundsByBidder[id][bid.highestBidder];

    fundsByBidder[id][msg.sender] = newBid;

    if (newBid <= highestBid) {
        if(newBid+artItem.bidIncrement> highestBid)
        {
            bid.highestBindingBid = highestBid;
        }
        else
        {
            bid.highestBindingBid = newBid+artItem.bidIncrement;
        }
    } else {

        if (msg.sender != bid.highestBidder) {
            bid.highestBidder = msg.sender;
        if(newBid+artItem.bidIncrement> highestBid)
        {   if(firsttime==false)
            bid.highestBindingBid = highestBid;
            else
            {bid.highestBindingBid = artItem.minbid + artItem.bidIncrement;
            firsttime=true;
            }
        }
        else
        {
            bid.highestBindingBid = newBid+artItem.bidIncrement;
        }
        }
        highestBid = newBid;
    }

    LogBid(msg.sender, newBid, bid.highestBidder, highestBid, bid.highestBindingBid);
    return true;
    }
    
    function withdraw(uint256 id) public payable onlyNotOwner(id)
    returns (bool success) 
{   
    require(canceled==true);
    require(auctionstarted==true);
    address payable withdrawalAccount;
    uint withdrawalAmount;
    bidding storage bid = bid[id]; 
    
        if (msg.sender == bid.highestBidder) {
            withdrawalAccount = bid.highestBidder;
            withdrawalAmount = fundsByBidder[id][bid.highestBidder];
        }
        else {
            withdrawalAccount = msg.sender;
            withdrawalAmount = fundsByBidder[id][withdrawalAccount];
        }

    if (withdrawalAmount == 0) revert();

    fundsByBidder[id][withdrawalAccount] -= withdrawalAmount;

    if (!msg.sender.send(withdrawalAmount)) revert();

    LogWithdrawal(msg.sender, withdrawalAccount, withdrawalAmount);

    return true;
}
        
}