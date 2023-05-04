import React from "react";

// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import "./navbar.css"
import "./multDivChart.css";

// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";

// Here, we display our Navbar
export default function Navbar() {
   return (
      <div>
         <nav className="navbar navbar-expand-lg">
            <NavLink className="navbar-brand" to="/">
               <ul className="imc_navbar_title_ul">
                  <li className="imc_navbar_title_li">Interactive</li>
                  <li className="imc_navbar_title_li">Math</li>
                  <li className="imc_navbar_title_li">Charts</li>
               </ul>
            </NavLink>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
               <ul className="navbar-nav ml-auto">
                  <li className="nav-item imc_navbar_navlink_li first">
                     <NavLink className="nav-link imc_navbar_navlink" to="/create">
                        Create Record
                     </NavLink>
                  </li>
                  <li className="nav-item imc_navbar_navlink_li">
                     <NavLink className="nav-link imc_navbar_navlink" to="/multdivchart">
                        Multiplication & Division Table
                     </NavLink>
                  </li>
               </ul>
            </div>
         </nav>
      </div>
   );
}