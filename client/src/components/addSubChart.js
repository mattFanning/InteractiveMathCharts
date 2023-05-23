import React, { useEffect, useRef, useState } from "react";
import "./addSubChart.css";

export default function AddSubChart() {
   
   //ref
   const headerLabels = useRef(['ones', 'tens', 'hundreds', 'thousands',
      'ten thousands', 'hundred thousands', 'millions']);
   const validInput = useRef(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);
   const controlInputs = useRef(['Backspace', 'Tab']);
   let referenceRow = useRef(-1);

   //state
   const [unitCount, setUnitCount] = useState(7);
   const [rowCount, setRowCount] = useState(2);
   const [activeLabels, setActiveLabels] = useState([]);
   const [inputReferences, setInputReferences] = useState([]);
   
   
   
   //effect
   useEffect(() => {
      setActiveLabels(headerLabels.current.slice(0, unitCount).reverse());
   }, [unitCount]);

   useEffect(() => {
      setInputReferences(new Array(rowCount).fill(
         new Array(unitCount).fill(null)
      ));
   }, [rowCount, unitCount]);


   //subcomponents
   function title() {
      return (
         <h1>AddSubChart</h1>  //TODO: fill me
      );
   }

   function options() {
      return "";  //TODO: fill me
   }

   function tableHeader() {
      return (
         <thead>
            <tr>
               {headerCells()}
            </tr>
         </thead>
      );
   }

   function headerCells() {
      return activeLabels.map(label => {
         return <th key={label} className="tableCell">{label}</th>;
      });
   }

   function tableBody() {
      return (
         <tbody>
            {tableBodyRows()}
         </tbody>
      );
   }

   function tableBodyRows() {
      const rows = [];
      for (let i = 0; i < rowCount; i++) {
         referenceRow = i;
         rows.push(<tr key={i}>{tableBodyCells()}</tr>);
      }
      return rows;
   }

   function tableBodyCells() {
      const refs = inputReferences;
      const row = referenceRow;

      return activeLabels.map((label, index) => {
         return <td key={label} className="tableCell">
            <input type="text" className="cellInput" onKeyDown={onlyNumbers}></input>
         </td>
      });
   }

   function onlyNumbers(event) {
      if(validInput.current.includes(event.key)) {
         event.target.value = "";
      } else if (!controlInputs.current.includes(event.key)) {
         event.preventDefault();
      }
   } 

   function tableFooter() {

      return (
         <tfoot>
         </tfoot>
      );  //TODO: fill me
   }

   //AddSubChart's formula
   return (
      <div>
         {title()}
         {options()}
         <table className="">
            {tableHeader()}
            {tableBody()}
            {tableFooter()}
         </table>
      </div>
   );
}