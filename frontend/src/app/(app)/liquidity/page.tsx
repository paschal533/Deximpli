import InfoBar from "@/components/infobar";
import LiquidityTabs from "@/components/liquidity/tabs";

const LiquidityPoolPage = async () => {
  return (
    <>
      <InfoBar />
      <div className="w-full align-middle place-content-center justify-center items-center flex">
        <LiquidityTabs />
      </div>
    </>
  );
};

export default LiquidityPoolPage;
