// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.24;

//Importing @openzeppelin/solidity ERC-721 implemented Standard
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {

    // Star data
    struct Star {
        string name;
    }

    // Implement Task 1 Add a name and symbol properties
    // name: Is a short name to your token
    // symbol: Is a short string like 'USD' -> 'American Dollar'
    string myName = "CoolStars";
    string mySymbol = "CST";
    // Implementation done in current ERC721 implementation

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;
 
    // Thanks to Markus here: https://ethereum.stackexchange.com/a/83270
    constructor() ERC721(myName, mySymbol) { }

    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you don't own");
        starsForSale[_tokenId] = _price;
    }


    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return payable(x); // Changed according to k06a's answer: https://ethereum.stackexchange.com/a/65694
    }

    function buyStar(uint256 _tokenId) public  payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        // TODO: Change to safeTransferFrom with prior approval of sender
        //safeTransferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        _transfer(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use transfer (as transferFrom requires prior approval)
        address payable ownerAddressPayable = _make_payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost) {
            address payable senderAddressPayable = _make_payable(msg.sender);
            senderAddressPayable.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0; // Remove the token ID from the starsForSale mapping
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (string memory) {
        //1. You should return the Star saved in tokenIdToStarInfo mapping
        string memory starName = tokenIdToStarInfo[_tokenId].name;
        require(keccak256(bytes(starName)) != keccak256(bytes("")), "Queried star info for nonexistent token ID"); // Thanks to Greg Mikeska: https://ethereum.stackexchange.com/a/11754
        return starName;
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId2))
        //4. Use _transferFrom function to exchange the tokens.

        // Check if sender owns one of the tokens
        require((ownerOf(_tokenId1) == msg.sender) || (ownerOf(_tokenId2) == msg.sender), "Can only exchange stars if you own at least one of them");

        // Get token owners
        address owner1 = ownerOf(_tokenId1);
        address owner2 = ownerOf(_tokenId2);

        // Use _transfer (no approval checks) to exchange tokens
        _transfer(owner1, owner2, _tokenId1); 
        _transfer(owner2, owner1, _tokenId2);  
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star

        // Check if sender owns the token
        require(ownerOf(_tokenId) == msg.sender, "Can only transfer stars you own");

        // Transfer star (no approval check)
        _transfer(msg.sender, _to1, _tokenId);
    }


}
