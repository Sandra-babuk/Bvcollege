import React from 'react'
import './resultstd.css'
const ResultStd = () => {
  return (
    <div className='result'>
      <div className="table-container">
          <table className='table'>
            <thead className='thead'>
              <tr className='head '>
                <th>ID</th>
                <th>sub_name</th>
                <th>Maximum Score </th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className='body'>
                <td>1</td>
                <td>sub_name</td>
                <td>max_score</td>
                <td>score</td>
                <td>pass</td>
              </tr>
            </tbody>
          </table>
       
      </div>
    </div>
  )
}

export default ResultStd