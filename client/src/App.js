import React from "react";

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import Welcome from "./components/welcome";
import MultDivChart from "./components/multDivChart";
import CountingChart from "./components/countingChart";

const App = () => {
   return (
      <div>
         <Navbar />
         <Routes>
            <Route exact path="/" element={<Welcome />} />
            <Route path="/multdivchart" element={<MultDivChart />} />
            <Route path="/countingchart" element={<CountingChart />} />
         </Routes>
      </div>
   );
};

export default App;