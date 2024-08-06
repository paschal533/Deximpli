import InfoBar from '@/components/infobar'
import ListAssetPools from '@/components/loan/list-loan'

const LoanPage = async () => {
   
  return (
    <>
      <InfoBar />
      <div className="w-full align-middle place-content-center justify-center items-center flex">
         <ListAssetPools />
      </div>
    </>
  )
}

export default LoanPage
