import React, { useState, useEffect } from "react";

export default function MultDivChart() {
   const [dimensions, setDimensions] = useState({
      rows: 10,
      cols: 10,
   });

   const [cellData, setCellData] = useState([[1]]);

   useEffect(() => {
      function fillCellData() {
         const data = [];
         for(let j = 0; j < dimensions.rows; j++) {
            data[j] = []
            for(let i = 0; i < dimensions.cols; i++) {
               data[j][i] = (j+1) * (i+1);
            }
         }
         setCellData(data);
      }
      fillCellData();
      return;
   },[dimensions.cols, dimensions.rows]);

   

   function tableHeaderRow() {
      return (
         <tr key="header_row">
            <th className="multdiv_th">0</th>
            {tableHeaderCells()}
         </tr>
      );
   };

   function tableHeaderCells() {
      // iterate through all cells of row 0
      return cellData[0].map((cell, index) => {
         return (
            <th className="multdiv_th" data-col={index +1}>{cell}</th>
         );
      });
   };

   function tableBody() {
      return cellData.map(row => {
         return (
            <tr>
               <th className="multdiv_th" data-row={row[0]}>{row[0]}</th>
               {tableBodyTDs(row)}
            </tr>
         );
      });
   };

   function tableBodyTDs(row) {
      return row.map((cell, index) => {
         return (
            <td className="multdiv_td" data-row={row[0]} data-col={index +1}
            onMouseOver={highlightHover} onMouseLeave={clearHighlightHover}>{cell}</td>
         );
      });
   };

   function highlightHover(event) {
      const target = event.target;
      
      const colId = target.getAttribute('data-col');
      let affectedCells = document.querySelectorAll(`[data-col='${colId}']`);
      affectedCells.forEach(cell => {
         const cellDR = parseInt(cell.getAttribute('data-row')) || 0;
         const targetDR = parseInt(target.getAttribute('data-row'))  || 0; 
         if(cellDR <= targetDR) {
            cell.classList.add("multdiv_highlighted");
         }
      });
      const rowId = event.target.getAttribute('data-row');
      affectedCells = document.querySelectorAll(`[data-row='${rowId}']`);
      affectedCells.forEach(cell => {
         const cellDR = parseInt(cell.getAttribute('data-col')) || 0;
         const targetDR = parseInt(target.getAttribute('data-col')) || 0;    
         if(cellDR <= targetDR) {
            cell.classList.add("multdiv_highlighted");
         }
      });
   }

   function clearHighlightHover(event) {
      const affectedCells = document.querySelectorAll('.multdiv_highlighted');
      affectedCells.forEach(cell => cell.classList.remove("multdiv_highlighted"));
      
   }

   return (
      <div className="multdiv_div">
         <ul className="multdiv_ul">
            <li className="multdiv_li padding-right">
               <b>Change table dimensions: </b>
            </li>
            <li className="multdiv_li">
               <input type="number" className="multdiv_input" name="X" 
                  min="1" max="20" value={dimensions.cols} onChange={event => 
                     setDimensions({rows: dimensions.rows, cols: parseInt(event.target.value)})
                  }>
               </input>
            </li>
            <li className="multdiv_li">
               <b>X</b>
            </li>
            <li className="multdiv_li">
               <input type="number" className="multdiv_input" name="Y" 
                  min="1" max="20" value={dimensions.rows} onChange={event =>
                     setDimensions({rows:  parseInt(event.target.value), cols: dimensions.cols})
                  }>
               </input>
            </li>
         </ul>
         <table className="multdiv_table">
            <thead>
               {tableHeaderRow()}
            </thead>
            <tbody>
               {tableBody()}
            </tbody>
         </table>
      </div>
   );
}
