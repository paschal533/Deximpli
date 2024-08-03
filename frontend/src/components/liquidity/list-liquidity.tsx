"use client"
import React, { useContext } from 'react'
import { LiquidityContext } from '@/context/liquidity-provider'
import {
    Grid, Divider, Button, Accordion, AccordionSummary, AccordionDetails,
    Typography, CircularProgress
  } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IntegrationTrigger from './modalTrigger'

function ListLiquidity() {
  const {
    loading, 
     expanded,  
     liquidity,
     sharePercent,
     pooledTokenA,  
     pooledTokenB,
     handleClick,
     address
  } = useContext(LiquidityContext)

  return (
    <div> 
        <Grid container direction="column">
      {address ? (loading ? <CircularProgress /> : <>
        {liquidity.length > 0 ? liquidity.map((item : any, index : any) =>
          <Accordion
            key={`liq-list-${index}`}
            expanded={expanded === item.pairAddress}
            onChange={handleClick(item)}
            sx={{ border: 2, my: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <Grid container direction="column">
                <Grid item>
                  {item.tokenA.symbol}/{item.tokenB.symbol}
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={5}
                >
                  <Grid item>Liquidity Pool Token Balance</Grid>
                  <Grid item>{item.balance.toFixed(2)}</Grid>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography>Pooled {item.tokenA.symbol}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{pooledTokenA.toFixed(2)}</Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Typography>Pooled {item.tokenB.symbol}</Typography>
                </Grid>
                <Grid item>
                  <Typography>{pooledTokenB.toFixed(2)}</Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mt: 2 }} alignItems="center">
                <Typography>Share of pool</Typography>
                <Typography>{`${sharePercent.toFixed(2)} %`}</Typography>
              </Grid>
              <Grid container justifyContent="center" spacing={2}>
                <Grid item xs={6}>
                <IntegrationTrigger
                title={"Remove Liquidity"}
                type="Remove-pair"
                selectToken={item.pairAddress}
              >
                   <Button fullWidth onClick={
                    () => {/*navigate(`remove?pair=${item.pairAddress}`)*/}
                  }>Remove</Button>
              </IntegrationTrigger>
                </Grid>
                <Grid item xs={6}>
                <IntegrationTrigger
                title={"Add Liquidity"}
                type="add-liquidity"
                selectToken={item.pairAddress}
              >
                   <Button fullWidth onClick={
                    () => {/*navigate(`remove?pair=${item.pairAddress}`)*/}
                  }>Add</Button>
              </IntegrationTrigger>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ) : <h1 className='text-center h-[100px] bg-cream justify-center items-center flex rounded-lg w-full text-md font-semibold'>No Liquidity Found in you account</h1>}
      </>) : <h1 className='text-center bg-cream justify-center h-[100px] items-center flex rounded-lg w-full text-md font-semibold'>Please connect to a wallet to view your liquidity.</h1>}
    </Grid>
    </div>
  )
}

export default ListLiquidity