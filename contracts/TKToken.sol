pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TKToken is ERC20 {
	constructor() ERC20("Token name", "TKN") {
		_mint(msg.sender, 100000 * (10 ** 18));
	}
}