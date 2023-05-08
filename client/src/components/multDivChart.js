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
      targetElement: ""
   });

   const [colorRecords, setColorRecords] = useState([]);

   const [colorChoice, setColorChoice] = useState("Default");

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
      };
      
      fillCellData();
      return;
   },[dimensions.cols, dimensions.rows]);

   //used to fetch our records from the DB.
   useEffect(() => {
      async function getColorRecords() {
         const response = await fetch(`http://localhost:5000/multDivTable/`);
     
         if (!response.ok) {
           const message = `An error occurred: ${response.statusText}`;
           window.alert(message);
           return;
         }
     
         const records = await response.json();
         setColorRecords(records);
      }
     
      getColorRecords();
   },[colorRecords.length]);
   
   //used to adjust color theme 
   useEffect(() => {
      function writeStyleVariables() {
         if(colorRecords.length === 0 || colorChoice === "") {
            return;
         }
         const colorRecord = colorRecords.filter(record => 
            record.desc === colorChoice
         )[0];

   
         //title
         if(colorRecord.titleFontColor != null) {
            document.documentElement.style.setProperty('--titleFontColor',colorRecord.titleFontColor);   
         }
   
         if(colorRecord.titleFontBGColor != null) {
            document.documentElement.style.setProperty('--titleFontBGColor',colorRecord.titleFontBGColor);   
         }
   
         if(colorRecord.titleFontSize != null) {
            document.documentElement.style.setProperty('--titleFontSize',colorRecord.titleFontSize);   
         }
   
         //header
         if(colorRecord.headerCellBGColor != null) {
            document.documentElement.style.setProperty('--headerCellBGColor',colorRecord.headerCellBGColor);   
         }
   
         if(colorRecord.headerCellColor != null) {
            document.documentElement.style.setProperty('--headerCellColor',colorRecord.headerCellColor);   
         }
   
         if(colorRecord.headerFontSize != null) {
            document.documentElement.style.setProperty('--headerFontSize',colorRecord.headerFontSize);   
         }
   
          //hover
          if(colorRecord.hoverBGColor != null) {
            document.documentElement.style.setProperty('--hoverBGColor',colorRecord.hoverBGColor);   
         }
   
         if(colorRecord.hoverColor != null) {
            document.documentElement.style.setProperty('--hoverColor',colorRecord.hoverColor);   
         }
   
         if(colorRecord.hoverFontSize != null) {
            document.documentElement.style.setProperty('--hoverFontSize',colorRecord.hoverFontSize);   
         }
      };
      writeStyleVariables();
   },[colorChoice, colorRecords]);

   //subcomponents
   function title() {
      return (
         <h1 className="multdiv_h1">Interactive Multiplication and Division Chart</h1>
      );
   };

   function options() {
      return(
        <div className="multdiv_options_div">
         <ul className="multdiv_ul">
            <li className="multdiv_li padding-right">
               <b className="multdiv_options_b">Change table dimensions: </b>
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
         <ul className="multdiv_ul">
            <li className="multdiv_li padding-right">
               <b className="multdiv_options_b">Pick a color theme: </b>
            </li>
            <li className="multdiv_li">
               <select className="multdiv_options_select" onChange={event => 
                  setColorChoice(event.target.value)}>
                  {colorChoiceOptions()}
               </select>
            </li>
         </ul>
        </div>
        
      );
   };

   function colorChoiceOptions() {
      const choices = colorRecords.map(record => {
         if(record.desc !== "Default") {
            return (
               <option key={record._id} value={record.desc}>{record.desc}</option>
            );
         } else {
            return false;
         }
         
      });
      choices.unshift(<option key="default" value="Default">Default</option>);
      return choices;
   };

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
      const {int1, int2, callerElement} = tooltipData;

      if(int1 === "" || int2 === "") {
         return("");  //don't show the hover div at all.
      } else {
         const cellWidth = parseInt(getComputedStyle(callerElement).getPropertyValue('--cellWidth'));
         const rect = callerElement.getBoundingClientRect();
         const left = rect.left + window.scrollX + .75 * cellWidth;
         const top = rect.top + window.scrollY + .75 * cellWidth;
         
         const result = int1 * int2;
         return(
            <div className="multdiv_tooltip multdiv_display_flex" style={{'top':top, 'left': left}}>
               {mathEquations(int1,int2,result)}
            </div>
         );
      };
   };

   function mathEquations(int1, int2, result) {
      if(int1 === int2) {
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
      
   };


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

      //tooltip content
      const data_row = target.getAttribute('data-row');
      const data_col = target.getAttribute('data-col');
      
      setTooltipData({int1: data_col, int2: data_row, callerElement: target});
   };

   function clearHighlightHover(event) {
      event.target.classList.remove("multdiv_highlighted_target");
      const affectedCells = document.querySelectorAll('.multdiv_highlighted');
      affectedCells.forEach(cell => cell.classList.remove("multdiv_highlighted"));
      
      setTooltipData({int1: "", int2: "", callerElement: ""});
   };

   
   //component's body
   return (
      <div className="multdiv_div">
         {title()}
         {options()}
         <table className="multdiv_table">
            <thead>
               {tableHeaderRow()}
            </thead>
            <tbody>
               {tableBody()}
            </tbody>
         </table>
         <div className="multdiv_bottom_padding">filler</div>
         {hoverTooltip()}
      </div>
   );
};
