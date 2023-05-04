import React, { useState, useEffect } from "react";

export default function MultDivChart() {
   //states
   const [dimensions, setDimensions] = useState({
      rows: 10,
      cols: 10,
   });

   const [cellData, setCellData] = useState([[1]]);

   const [tooltipData, setTooltipData] = useState({
      int1: "",
      int2: "",
      top: "",
      left: ""
   });


   //when dimensions are updated, call this to fill in cellData.
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


   //subcomponents
   function tableHeaderRow() {
      return (
         <tr>
            <th className="multdiv_th">0</th>
            {_tableHeaderCells()}
         </tr>
      );
   };

   function _tableHeaderCells() {
      // iterate through all cells of row 0
      return cellData[0].map((cell, index) => {
         return (
            <th key={cell} className="multdiv_th" data-col={index +1}>{cell}</th>
         );
      });
   };

   function tableBody() {
      return cellData.map(row => {
         return (
            <tr key={row[0]}>
               <th className="multdiv_th" data-row={row[0]}>{row[0]}</th>
               {_tableBodyTDs(row)}
            </tr>
         );
      });
   };

   function _tableBodyTDs(row) {
      return row.map((cell, index) => {
         return (
            <td key={cell} className="multdiv_td" data-row={row[0]} data-col={index +1}
            onMouseOver={highlightHover} onMouseLeave={clearHighlightHover}>{cell}</td>
         );
      });
   };

   function hoverTooltip() {
      const {int1, int2, top, left} = tooltipData;

      if(int1 == "" || int2 == "") {
         return("");  //don't show the hover div at all.
      } else {
         const result = int1 * int2;
         return(
            <div className="multdiv_tooltip multdiv_display_flex" style={{'top':top, 'left': left}}>
               {mathEquations(int1,int2,result)}
            </div>
         );
      };

   };

   function mathEquations(int1, int2, result) {
      if(int1 == int2) {
         return (
            <div>
               <b className="multdiv_tooltip_text">{int1} x {int2} = {result} </b>
               <hr className="multdiv_tooltip_line_bold"></hr>
               <b className="multdiv_tooltip_text">{result} &#x00F7; {int1} = {int2} </b>
            </div>
         );
      } else {
         return(
            <div>
               <b className="multdiv_tooltip_text">{int1} x {int2} = {result} </b>
               <hr className="multdiv_tooltip_line"></hr>
               <b className="multdiv_tooltip_text">{int2} x {int1} = {result} </b>
               <hr className="multdiv_tooltip_line_bold"></hr>
               <b className="multdiv_tooltip_text">{result} &#x00F7; {int1} = {int2} </b>
               <hr className="multdiv_tooltip_line"></hr>
               <b className="multdiv_tooltip_text">{result} &#x00F7; {int2} = {int1} </b>
            </div>
         );
      };
      
   }


   //Mouse Event Handlers
   function highlightHover(event) {
      const target = event.target;
      target.classList.add("multdiv_highlighted_target");
      
      //table cell highlighting
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
         const cellDC = parseInt(cell.getAttribute('data-col')) || 0;
         const targetDC = parseInt(target.getAttribute('data-col')) || 0;    
         if(cellDC <= targetDC) {
            cell.classList.add("multdiv_highlighted");
         }
      });

      //tooltip position
      const cellWidth = getComputedStyle(target).getPropertyValue('--cellWidth');
      const xPos = target.offsetLeft + parseInt(cellWidth);
      const yPos = target.offsetTop + 2.5 * parseInt(cellWidth) + 15;
      
      //tooltip content
      const data_row = target.getAttribute('data-row');
      const data_col = target.getAttribute('data-col');
      
      setTooltipData({int1: data_col, int2: data_row, top: yPos+'px', left: xPos+'px'});
      
   };

   function clearHighlightHover(event) {
      event.target.classList.remove("multdiv_highlighted_target");
      const affectedCells = document.querySelectorAll('.multdiv_highlighted');
      affectedCells.forEach(cell => cell.classList.remove("multdiv_highlighted"));
      
      setTooltipData({int1: "", int2: "", top: "", left: ""});

   };

   
   //component's body
   return (
      <div className="multdiv_div">
         <ul className="multdiv_ul">
            <li className="multdiv_li padding-right">
               <b>Change table dimensions: </b>
            </li>
            <li className="multdiv_li">
               <input type="number" className="multdiv_input" name="X" 
                  min="1" max="20" value={dimensions.cols} onKeyDown={()=>{return false}} onChange={event => 
                     setDimensions({rows: dimensions.rows, cols: parseInt(event.target.value)})
                  }>
               </input>
            </li>
            <li className="multdiv_li">
               <b>X</b>
            </li>
            <li className="multdiv_li">
               <input type="number" className="multdiv_input" name="Y" 
                  min="1" max="20" value={dimensions.rows} onKeyDown={()=>{return false}} onChange={event =>
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
         {hoverTooltip()}
      </div>
   );
};
