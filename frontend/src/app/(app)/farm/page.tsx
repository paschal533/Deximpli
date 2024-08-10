"use client";
import FarmTabs from "@/components/farm/tabs";
import InfoBar from "@/components/infobar";

const YieldFarmingPage = async () => {
  return (
    <>
      <InfoBar />
      <div className="w-full align-middle place-content-center justify-center items-center flex">
        <FarmTabs />
      </div>
    </>
  );
};

export default YieldFarmingPage;
