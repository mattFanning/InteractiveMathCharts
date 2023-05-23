import { useEffect, useState } from "react";
import "./countingChart.css";

export default function CountingChart() {
   //states
   const [tableSize, setTableSize] = useState(100);
   const COLUMN_SIZE = 10;  //not changeable
   const [cellData, setCellData] = useState([[1]]); // 2d array
   
   const [colorRecords, setColorRecords] = useState([]);
   const [colorChoice, setColorChoice] = useState("Balloon");

   const [tooltipData, setTooltipData] = useState({});

   //fills in cellData state when tableState changes
   useEffect(() => {
      function fillTableData() {
         const data = [];
         let rows = tableSize / COLUMN_SIZE;
         
         let cellCounter = 0;
         for(let j = 0; j < rows; j++) {
            data[j] = [];
            for(let i = 0; i < COLUMN_SIZE; i++) {
               if(cellCounter < tableSize) {
                  data[j][i] = j * COLUMN_SIZE + i +1;
                  cellCounter++
               }
               
            }
         }
         setCellData(data);
      };
      fillTableData();
   },[tableSize]);

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

         const componentRoot = document.querySelector('.counting_div');

         //title
         if(colorRecord.titleFontColor != null) {
            componentRoot.style.setProperty('--titleFontColor',colorRecord.titleFontColor);   
         }
   
         if(colorRecord.titleFontBGColor != null) {
            componentRoot.style.setProperty('--titleFontBGColor',colorRecord.titleFontBGColor);   
         }
   
         if(colorRecord.titleFontSize != null) {
            componentRoot.style.setProperty('--titleFontSize',colorRecord.titleFontSize);   
         }
   
         //header
         if(colorRecord.headerCellBGColor != null) {
            componentRoot.style.setProperty('--headerCellBGColor',colorRecord.headerCellBGColor);   
         }
   
         if(colorRecord.headerCellColor != null) {
            componentRoot.style.setProperty('--headerCellColor',colorRecord.headerCellColor);   
         }
   
         if(colorRecord.headerFontSize != null) {
            componentRoot.style.setProperty('--headerFontSize',colorRecord.headerFontSize);   
         }
   
          //hover
          if(colorRecord.hoverBGColor != null) {
            componentRoot.style.setProperty('--hoverBGColor',colorRecord.hoverBGColor);   
         }
   
         if(colorRecord.hoverColor != null) {
            componentRoot.style.setProperty('--hoverColor',colorRecord.hoverColor);   
         }
   
         if(colorRecord.hoverFontSize != null) {
            componentRoot.style.setProperty('--hoverFontSize',colorRecord.hoverFontSize);   
         }
      };
      writeStyleVariables();
   },[colorChoice, colorRecords]);

   //sub components
   function title() {
      return(
         <h1 className="counting_h1">Counting & Grouping Chart</h1>
      );
   };

   function options() {
      return(
         <div className="counting_options_div">
            <ul className="counting_ul">
               <li className="counting_li padding-right">
                  <b className="counting_options_b">Change number of cells</b>
               </li>
               <li className="counting_li">
               <input type="number" className="counting_input" name="numOfCells" 
                  min="1" max="200" value={tableSize} onKeyDown={()=>{return false}} onChange={event => 
                     setTableSize(event.target.value)
               }>
               </input>
               </li>
            </ul>
            <ul className="counting_ul">
            <li className="counting_li padding-right">
               <b className="counting_options_b">Pick a color theme: </b>
            </li>
            <li className="counting_li">
               <select className="counting_options_select" onChange={event => 
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
         if(record.desc !== "Balloon") {
            return (
               <option key={record._id} value={record.desc}>{record.desc}</option>
            );
         } else {
            return false;
         }
         
      });
      choices.unshift(<option key="balloon" value="Balloon">Balloon</option>);
      return choices;
   }

   function tableBody() {
      return cellData.map(row => {
         return(
            <tr key={row[0]} className="counting_tr">
               {tableBodyCells(row)}
            </tr>
         );
      });
   };

   function tableBodyCells(row) {
      return row.map(cell => {
         return(<td key={cell} className="counting_td"
            onMouseOver={highlightHover} onMouseLeave={clearHighlightHover}>{cell}</td>);
      });
   };
 
   function hoverTooltip() {
      if(Object.keys(tooltipData).length === 0) {
         return("");  //don't show the hover div at all.
      }
      const elem = tooltipData.callerElement;
      const cellWidth = parseInt(getComputedStyle(elem).getPropertyValue('--cellWidth'));
      const rect = elem.getBoundingClientRect();
      const left = rect.left + window.scrollX + .75 * cellWidth;
      const top = rect.top + window.scrollY + .75 * cellWidth;
      
      return (
         <div className="counting_tooltip counting_display_flex" style={{'top':top, 'left': left}}>
            {tooltipContent(elem)}
         </div>
      );
   };

   function tooltipContent(elem) {
      const textValue = parseInt(elem.textContent);
      return(
         <div className="counting_tooltip_text_group">
            <b className="counting_tooltip_text">{textValue}</b>
            <hr className="counting_tooltip_line_bold"></hr>
            <b className="counting_tooltip_text">{Math.floor(textValue / COLUMN_SIZE)} groups of 10</b>
            <b className="counting_tooltip_text">+</b>
            <b className="counting_tooltip_text">{textValue % COLUMN_SIZE} groups of 1</b>
         </div>
      );
   }


   //handlers
   function highlightHover(event) {
      const target = event.target;
      target.classList.add('chosen');
      
      document.querySelectorAll('td.counting_td').forEach(td => {
            const td_val = parseInt(td.textContent);
            const target_val = parseInt(target.textContent);
            if(td_val <= target_val) {
               if(Math.floor((td_val -1) / COLUMN_SIZE) === Math.floor(target_val / COLUMN_SIZE)) {
                  td.classList.add('one');
               } else {
                  td.classList.add('ten');
                  if(!(td_val % COLUMN_SIZE === 0)) {
                     td.classList.add('hidefont')
                  }
               }
            }   
      });

      setTooltipData({callerElement: target});
   };

   function clearHighlightHover(event) {
      document.querySelectorAll('td.counting_td.ten, td.counting_td.one').forEach(td => {
         td.classList.remove('ten', 'one', 'chosen', 'hidefont');
      });

      setTooltipData({});
   };

   return (
      <div className="counting_div">
         {title()}
         {options()}
         <table className="counting_table">
            <tbody>
               {tableBody()}
            </tbody>
         </table>
         <div className="counting_bottom_padding">filler</div>
         {hoverTooltip()}
      </div>
   );
}