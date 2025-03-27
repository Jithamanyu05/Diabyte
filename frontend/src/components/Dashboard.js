import React from 'react'
import CGMForm from './cgm/CGMForm'
import CGMAnalysis from './cgm/CGMAnalysis'
import CGMChart from './cgm/CGMChart'
function Dashboard() {
  return (
    <div>Dashboard
      <CGMForm/>
      {/* <CGMChart/> */}
    </div>
    
  )
}

export default Dashboard