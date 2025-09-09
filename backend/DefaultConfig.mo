import ICRC7 "mo:icrc7-mo";

module {
  public let defaultConfig = func(caller : Principal) : ICRC7.InitArgs {
    ?{
      symbol = ?"MTC";
      name = ?"MitraChain";
      description = ?"NFT License for Franchise";
      logo = ?"https://res.cloudinary.com/dqvlnzw9f/image/upload/v1757313932/logo_d0wvuj.png";
      expires_at = null;
      supply_cap = null;
      allow_transfers = null;
      max_query_batch_size = ?100;
      max_update_batch_size = ?100;
      default_take_value = ?1000;
      max_take_value = ?10000;
      max_memo_size = ?512;
      permitted_drift = null;
      tx_window = null;
      burn_account = null; //burned nfts are deleted
      deployer = caller;
      supported_standards = null;
    };
  };

  public let tokenURI = "https://res.cloudinary.com/dqvlnzw9f/image/upload/v1757313932/logo_d0wvuj.png";
};
