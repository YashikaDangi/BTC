import React, { useState } from "react";
import { ConnectMultiButton } from "bitcoin-wallet-adapter";
import InnerMenu from "./InnerMenu";

const WalletButton = () => {
  const [connected, setConnected] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const handleConnect = () => {
    setConnected(true);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setOpenMenu(false);
  };

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  return (
    <div className="m-2 p-2">
      <ConnectMultiButton
        walletImageClass="w-[60px]"
        walletLabelClass="pl-3 font-bold text-xl ml-2"
        walletItemClass="border w-full md:w-6/12 cursor-pointer border-transparent rounded-xl mb-4 hover:border-green-500 transition-all"
        headingClass="text-white text-4xl pb-12 font-bold text-center"
        buttonClassname="bg-purple-400 hover:bg-purple-200 rounded-sm flex items-center text-purple-800 px-4 py-1 mb-4 font-bold"
        InnerMenu={connected && (
          <InnerMenu
            open={openMenu}
            onClose={handleCloseMenu}
            onDisconnect={handleDisconnect} // Pass handleDisconnect function to InnerMenu
          />
        )} 
        icon=""
        iconClass=""
        balance={1000}
        onConnect={handleConnect}
        onOpen={handleOpenMenu}
      >
        
      </ConnectMultiButton>
    </div>
  );
};

export default WalletButton;
