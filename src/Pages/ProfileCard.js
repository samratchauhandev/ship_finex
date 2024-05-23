import React, { useState } from 'react';
import { Button, Typography, Box, Avatar, IconButton, Tooltip } from '@material-ui/core';
import { ethers } from 'ethers';
import { CryptoState } from "../CryptoContext";;

function ProfileCard() {
    const [balance, setBalance] = useState(null);
    const [state, setState] = useState(false)
    const [account, setAccount] = useState(null);
    const { currency, symbol } = CryptoState();

    async function requestAccount() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts"
                });
                setAccount(accounts[0]);
            } catch (error) {
                console.error('Error connecting to MetaMask', error);
            }
        } else {
            alert('MetaMask not detected. Please install it:', 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en')
            console.log('MetaMask not detected. Please install it:', 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en');
        }
    }

    async function connectWallet() {
        await requestAccount();
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const balance = await signer.getBalance();
            const formattedBalance = ethers.utils.formatEther(balance);
            setBalance(formattedBalance);
        }
    }

    const handelprofile = () => {
        setState(prev => !prev)
    }

    return (
        <Box sx={{ position: "relative" }}>
            <Tooltip title="Open settings">
                <IconButton style={{ margin: 15 }} onClick={handelprofile} sx={{ p: 0 }}>
                    <Avatar alt="User profile" src="/src/Pages/avatar.jpg">
                        {account ? '🙋🏻‍♂️' : "🗨️"}
                    </Avatar>
                </IconButton>
            </Tooltip>
            {
                state ?
                    <Box sx={{
                        position: "absolute", top: "100%", right: "40%", p: 2.5, borderRadius: 12,
                        background: "rgba(32 34 37)",
                    }}>
                        <Button
                            variant="outlined"
                            style={{ height: 40, width: 'max-content', marginBottom: "16px" }}
                            onClick={connectWallet}
                        >
                            {account ? 'Connected' : 'Connect Account'}
                        </Button>
                        {account && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <Typography variant="h6">Account: </Typography>
                                    <Typography>{account}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <Typography variant="h6">Balance:</Typography>
                                    <Typography>{balance} {symbol}</Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <Typography variant="h6">Currency:</Typography>
                                    <Typography>{currency}</Typography>
                                </Box>
                            </Box>
                        )}
                    </Box> : null
            }
        </Box>
    );
}

export default ProfileCard;

