import { useState, useEffect, useCallback, useContext } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
  useTheme,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ethers } from "ethers";
import { ERC20ABI } from "@/utils/ERC20ABI";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getTokenInfo, toString } from "@/utils/Helper";
import AssetPoolABI from "@/contracts/AssetPool.json";
import { SuppotedAssetPoolContractAddress } from "@/utils/Tokens";
import { LoanContext } from "@/context/loan-provider";

const Repay = ({ tokenAddress }: { tokenAddress: any }) => {
  const { address, provider, signer } = useContext(LoanContext);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<any>({});
  const [payoffAmount, setPayoffAmount] = useState(0);
  const [maxRepayAmount, setMaxRepayAmount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [allow, setAllow] = useState(0);

  const getMaxRepayAmount = useCallback(
    async (tokenObject: any) => {
      try {
        const tokenContract = new ethers.Contract(
          tokenObject.address,
          ERC20ABI,
          signer,
        );
        let _balance = await tokenContract.balanceOf(address);
        _balance = Number(
          ethers.utils.formatUnits(_balance, tokenObject.decimals),
        );
        const assetPool = new ethers.Contract(
          SuppotedAssetPoolContractAddress(provider?._network.chainId),
          AssetPoolABI.abi,
          signer,
        );
        const userPoolData = await assetPool.getUserPoolData(
          address,
          tokenObject.address,
        );
        const _compoundBorrow = Number(
          ethers.utils.formatUnits(userPoolData.compoundedBorrowBalance),
        );
        setPayoffAmount(_compoundBorrow);
        setMaxRepayAmount(Math.min(_compoundBorrow, _balance));
      } catch (error) {
        toast.error("Cannot get maximum repay amount!");
        console.log(error);
      }
    },
    [address, signer, provider],
  );

  const checkAllowance = useCallback(
    async (tokenObject: any) => {
      try {
        const tokenContract = new ethers.Contract(
          tokenObject.address,
          ERC20ABI,
          signer,
        );
        let _allow = await tokenContract.allowance(
          address,
          SuppotedAssetPoolContractAddress(provider?._network.chainId),
        );
        setAllow(
          Number(ethers.utils.formatUnits(_allow, tokenObject.decimals)),
        );
      } catch (error) {
        toast.error("Cannot get allowance for token!");
        console.error(error);
      }
    },
    [address, signer, provider],
  );

  const loadRepayInfo = useCallback(
    async (tokenAddress: any) => {
      setLoading(true);
      try {
        const tokenObject = await getTokenInfo(tokenAddress, provider);
        setToken(tokenObject);
        await getMaxRepayAmount(tokenObject);
        await checkAllowance(tokenObject);
      } catch (error) {
        toast.error("Failed to load information for repay!");
        console.log(error);
      }
      setLoading(false);
    },
    [checkAllowance, getMaxRepayAmount, provider],
  );

  useEffect(() => {
    if (address && tokenAddress) {
      loadRepayInfo(tokenAddress);
    }
  }, [address, tokenAddress, loadRepayInfo]);

  const handleChange = (e: any) => {
    let tmpVal = e.target.value ? e.target.value : 0;
    if (tmpVal < 0 || isNaN(tmpVal)) {
      return;
    } else if (
      !(
        typeof tmpVal === "string" &&
        (tmpVal.endsWith(".") || tmpVal.startsWith("."))
      )
    ) {
      tmpVal = Number(e.target.value.toString());
    }
    setAmount(tmpVal);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const tokenContract = new ethers.Contract(
        token.address,
        ERC20ABI,
        signer,
      );
      const allowAmount = ethers.utils.parseUnits(
        toString(amount * 1.1),
        token.decimals,
      );
      const tx = await tokenContract.approve(
        SuppotedAssetPoolContractAddress(provider?._network.chainId),
        allowAmount,
      );
      await tx.wait();
      toast.info("Deposit amount is approved!");
      await checkAllowance(token);
    } catch (error) {
      toast.error("Cannot approve the repayment amount!");
      console.error(error);
    }
    setLoading(false);
  };

  const getBorrowedShareBalance = async (assetPool: any, tokenAddress: any) => {
    try {
      const userPoolData = await assetPool.userPoolData(address, tokenAddress);
      return userPoolData.borrowShares;
    } catch (error) {
      toast.error("Cannot get the balance of borrowed shares!");
      console.log(error);
    }
    return 0;
  };

  const handleRepay = async () => {
    setLoading(true);
    try {
      const assetPool = new ethers.Contract(
        SuppotedAssetPoolContractAddress(provider?._network.chainId),
        AssetPoolABI.abi,
        signer,
      );
      let tx;
      if (payoffAmount <= amount) {
        // Pay off the loan
        const borrowedSharesAmount = await getBorrowedShareBalance(
          assetPool,
          token.address,
        );
        tx = await assetPool.repayByShare(token.address, borrowedSharesAmount);
      } else {
        tx = await assetPool.repayByAmount(
          token.address,
          ethers.utils.parseUnits(toString(amount), token.decimals),
        );
      }
      await tx.wait();
      toast.info(`Repay token successfully! Transaction hash: ${tx.hash}`);
      setAmount(0);
      await getMaxRepayAmount(token);
      await checkAllowance(token);
    } catch (error) {
      toast.error("Cannot repay token!");
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div>
      <Grid item>
        <Grid container columnGap={12}>
          <Grid item>
            <Typography sx={{ mt: 1 }}>Repay the loan</Typography>
          </Grid>
        </Grid>
        <Divider />
        <div>
          <div className="w-full p-2 mt-2 flex-col items-center">
            <p className="font-semibold text-md">Amount to Deposit</p>

            <input
              type="number"
              id="reward_per_block"
              value={amount == 0 ? "" : amount}
              onChange={handleChange}
              placeholder={`enter repay token (${token.symbol}) amount`}
              className="bg-none w-full mt-2 text-lg font-normal placeholder:text-slate-500 placeholder:font-normal placeholder:text-lg  bg-cream shadow-sm p-2 rounded-lg outline-none border-none"
            />
          </div>
          <div className="w-full flex justify-between pr-2 items-center">
            <p className="p-2 font-semibold">
              Maximum Repayment Amount {token.symbol}:
            </p>
            <div className="space-x-1 justify-center items-center">
              <span className="font-medium">{maxRepayAmount}</span>
              <div
                className="text-xs cursor-pointer float-end font-semibold text-[#D7009A]"
                onClick={() => setAmount(maxRepayAmount)}
              >
                Max
              </div>
            </div>
          </div>
          <Grid item xs={4}></Grid>
          <div className="w-full flex space-x-2 p-2">
            <Button
              className="!bg-cream w-1/2 text-[#D7009A] font-semibold rounded-lg"
              disabled={amount <= 0 || allow >= amount}
              fullWidth
              onClick={() => handleApprove()}
            >
              {allow < amount && loading ? (
                <CircularProgress sx={{ color: "#D7009A" }} />
              ) : (
                "Approve"
              )}
            </Button>

            <Button
              className="!bg-cream w-1/2 text-[#D7009A] font-semibold rounded-lg"
              disabled={
                amount <= 0 || allow < amount || amount > maxRepayAmount
              }
              fullWidth
              onClick={handleRepay}
            >
              {allow >= amount && loading ? (
                <CircularProgress sx={{ color: "#D7009A" }} />
              ) : (
                "Repay"
              )}
            </Button>
          </div>
          <Grid item xs={4}></Grid>
        </div>
      </Grid>
    </div>
  );
};

export default Repay;
