pragma solidity ^0.4.25; //

contract EntryToken

{

    mapping(address => uint256[]) inventory;

    uint256[] public spawnedTokens;

    mapping(bytes32 => bool) signatureChecked;

    address public organiser;

    address public paymaster;

    string public name;

    uint8 public constant decimals = 0; //no decimals as Tokens cannot be split

    bool expired = false;

    string public state;

    string public locality;

    string public street;

    string public building;

    string public symbol;

    bytes4 balHash = bytes4(keccak256('balanceOf(address)'));

    bytes4 tradeHash =
bytes4(keccak256('trade(uint256,uint256[],uint8,bytes32,bytes32)'));

    bytes4 passToHash =
bytes4(keccak256('passTo(uint256,uint256[],uint8,bytes32,bytes32,address)'));

    bytes4 spawnPassToHash =bytes4(keccak256('spawnPassTo(uint256,uint256[],uint8,bytes32,bytes32,address)'
));

 

    event Transfer(address indexed _to, uint256 count);

    event TransferFrom(address indexed _from, address indexed _to, uint256
count);

    event Trade(address indexed seller, uint256[] TokenIndices, uint8 v, bytes32
r, bytes32 s);

    event PassTo(uint256[] TokenIndices, uint8 v, bytes32 r, bytes32 s, address
indexed recipient);

 

    modifier organiserOnly()

    {

        require(msg.sender == organiser);

        _;

    }

 

    modifier payMasterOnly()

    {

        require(msg.sender == paymaster);

        _;

    }

 

    function() payable public { revert(); } //should not send any ether directly

 

    constructor (

        uint256[] Tokens,

        string buildingName,

        string streetName,

        string localityName,

        string stateName,

        string symbolName,

        string contractName) public

    {

        organiser = msg.sender;

        paymaster = msg.sender;

        inventory[msg.sender] = Tokens;

        building = buildingName;

        street = streetName;

        locality = localityName;

        state = stateName;

        symbol = symbolName;

        name = contractName;

    }

 

    function supportsInterface(bytes4 interfaceID) external view returns (bool)

    {

        if(interfaceID == balHash

        || interfaceID == tradeHash

        || interfaceID == passToHash

        || interfaceID == spawnPassToHash) return true;

        return false;

    }

 

    function isExpired(uint256 tokenId) public view returns(bool)

    {

        return expired;

    }

 

    function getStreet(uint256 tokenId) public view returns(string)

    {

        return street;

    }

 

    function getBuildingName(uint256 tokenId) public view returns(string)

    {

        return building;

    }

 

    function getState(uint256 tokenId) public view returns(string)

    {

        return state;

    }

 

    function getLocality(uint256 tokenId) public view returns(string)

    {

        return locality;

    }

 

    function getDecimals() public pure returns(uint)

    {

        return decimals;

    }

 

    function name() public view returns(string)

    {

        return name;

    }

 

    function setExpired(uint256[] tokenIds, bool isExpired) public organiserOnly

    {

        expired = isExpired;

    }

 

    function setStreet(uint256[] tokenIds, string newStreet) public
organiserOnly returns(string)

    {

        street = newStreet;

    }

 

    function setBuilding(uint256[] tokenIds, string newBuildingName) public
organiserOnly returns(string)

    {

        building = newBuildingName;

    }

 

    function setState(uint256[] tokenIds, string newState) public organiserOnly
returns(string)

    {

        state = newState;

    }

 

    function setLocality(uint256[] tokenIds, string newLocality) public organiserOnly returns(string)

    {

        locality = newLocality;

    }

 

    // example: 0, [3, 4], 27, "0x9CAF1C785074F5948310CD1AA44CE2EFDA0AB19C308307610D7BA2C74604AE98", "0x23D8D97AB44A2389043ECB3C1FB29C40EC702282DB6EE1D2B2204F8954E4B451"

    // price is encoded in the server and the msg.value is added to the message digest,

    // if the message digest is thus invalid then either the price or something else in the message is invalid

    function trade(uint256 expiry,

                   uint256[] TokenIndices,

                   uint8 v,

                   bytes32 r,

                   bytes32 s) public payable

    {

        //checks expiry timestamp,

        //if fake timestamp is added then message verification will fail

        require(expiry > block.timestamp || expiry == 0);

 

        bytes32 message = encodeMessage(msg.value, expiry, TokenIndices);

        address seller = ecrecover(message, v, r, s);

       

        require(seller == organiser); //only contract owner can issue magiclinks

 

        for(uint i = 0; i < TokenIndices.length; i++)

        { // transfer each individual Tokens in the ask order

            uint256 index = TokenIndices[i];

            assert(inventory[seller][index] != uint256(0)); // 0 means Token gone.

            inventory[msg.sender].push(inventory[seller][index]);

            // 0 means Token gone.

            delete inventory[seller][index];

        }

        seller.transfer(msg.value);

 

        emit Trade(seller, TokenIndices, v, r, s);

    }

 

    function loadNewTokens(uint256[] Tokens) public organiserOnly

    {

        for(uint i = 0; i < Tokens.length; i++)

        {

            inventory[organiser].push(Tokens[i]);

        }

   }

 

    //for new Tokens to be created and given over

    //this requires a special magic link format with tokenids inside rather than indicies

    function spawnPassTo(uint256 expiry,

                    uint256[] Tokens,

                    uint8 v,

                    bytes32 r,

                    bytes32 s,

                    address recipient) public payable

    {

        require(expiry > block.timestamp || expiry == 0);

        bytes32 message = encodeMessageSpawnable(msg.value, expiry, Tokens);

        address giver = ecrecover(message, v, r, s);

        //only the organiser can authorise this

        require(giver == organiser);

        require(!signatureChecked[s]);

        organiser.transfer(msg.value);

        for(uint i = 0; i < Tokens.length; i++)

        {

            inventory[recipient].push(Tokens[i]);

            //log each spawned Token used for a record

            spawnedTokens.push(Tokens[i]);

        }

        //prevent link being reused with the same signature

        signatureChecked[s] = true;

    }

 

           //check if a spawnable Token that created in a magic link is redeemed

    function spawned(uint256 Token) public view returns (bool)

    {

        for(uint i = 0; i < spawnedTokens.length; i++)

        {

            if(spawnedTokens[i] == Token)

            {

                return true;

            }

        }

        return false;

    }

 

    function passTo(uint256 expiry,

                    uint256[] TokenIndices,

                    uint8 v,

                    bytes32 r,

                    bytes32 s,

                    address recipient) public organiserOnly

    {

        require(expiry > block.timestamp || expiry == 0);

        bytes32 message = encodeMessage(0, expiry, TokenIndices);

        address giver = ecrecover(message, v, r, s);

        for(uint i = 0; i < TokenIndices.length; i++)

        {

            uint256 index = TokenIndices[i];

            //needs to use revert as all changes should be reversed

            //if the user doesnt't hold all the Tokens

            assert(inventory[giver][index] != uint256(0));

            uint256 Token = inventory[giver][index];

            inventory[recipient].push(Token);

            delete inventory[giver][index];

        }

        emit PassTo(TokenIndices, v, r, s, recipient);

    }

 

    // Pack value, expiry, Tokens into 1 array

    function encodeMessage(uint value, uint expiry, uint256[] TokenIndices)

        internal view returns (bytes32)

    {

        bytes memory message = new bytes(84 + TokenIndices.length * 2);

        address contractAddress = getThisContractAddress();

        for (uint i = 0; i < 32; i++)

        {

            message[i] = byte(bytes32(value << (8 * i)));

        }

 

        for (i = 0; i < 32; i++)

        {

            message[i + 32] = byte(bytes32(expiry << (8 * i)));

        }

 

        for(i = 0; i < 20; i++)

        {

            message[64 + i] = byte(bytes20(contractAddress) << (8 * i));

        }

 

        for (i = 0; i < TokenIndices.length; i++)

        {

            message[84 + i * 2 ] = byte(TokenIndices[i] >> 8);

            message[84 + i * 2 + 1] = byte(TokenIndices[i]);

        }

 

        return keccak256(message);

    }

 

    // Pack value, expiry, Tokens into 1 array

    function encodeMessageSpawnable(uint value, uint expiry, uint256[] Tokens)

        internal view returns (bytes32)

    {

        bytes memory message = new bytes(84 + Tokens.length * 32);

        address contractAddress = getThisContractAddress();

        for (uint i = 0; i < 32; i++)

        {

            message[i] = byte(bytes32(value << (8 * i)));

        }

 

        for (i = 0; i < 32; i++)

        {

            message[i + 32] = byte(bytes32(expiry << (8 * i)));

        }

 

        for(i = 0; i < 20; i++)

        {

            message[64 + i] = byte(bytes20(contractAddress) << (8 * i));

        }

 

        for (i = 0; i < Tokens.length; i++)

        {

            for (uint j = 0; j < 32; j++)

            {

                message[84 + i * 32 + j] = byte(bytes32(Tokens[i] << (8 * j)));

            }

        }

        return keccak256(message);

    }

 

    function getSymbol() public view returns(string)

    {

        return symbol;

    }

 

    function balanceOf(address _owner) public view returns (uint256[])

    {

        return inventory[_owner];

    }

 

    function myBalance() public view returns(uint256[])

    {

        return inventory[msg.sender];

    }

 

    function transfer(address _to, uint256[] TokenIndices) organiserOnly public

    {

        for(uint i = 0; i < TokenIndices.length; i++)

        {

            uint index = uint(TokenIndices[i]);

            require(inventory[msg.sender][index] != uint256(0));

            //pushes each element with ordering

            inventory[_to].push(inventory[msg.sender][index]);

            delete inventory[msg.sender][index];

        }

        emit Transfer(_to, TokenIndices.length);

    }

 

    function transferFrom(address _from, address _to, uint256[] TokenIndices)

        organiserOnly public

    {

        for(uint i = 0; i < TokenIndices.length; i++)

        {

            uint index = uint(TokenIndices[i]);

            require(inventory[_from][index] != uint256(0));

            //pushes each element with ordering

            inventory[_to].push(inventory[_from][index]);

            delete inventory[_from][index];

        }

        emit TransferFrom(_from, _to, TokenIndices.length);

    }

 

    function endContract() public organiserOnly

    {

        selfdestruct(organiser);

    }

 

    function isStormBirdContract() public pure returns (bool)

    {

        return true;

    }

 

    function getThisContractAddress() public view returns(address)

    {

        return this;

    }

}
