import React, { useState } from "react";
import { Routes, Route} from "react-router-dom";
import './App.css';
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Main from "../Main/Main"
import TimeBooking from "../TimeBooking/TimeBooking"
import GiftBooking from "../GiftBooking/GiftBooking"
// import GiftBookingDigital from "GiftBookingDigital/GiftBookingDigital"
// import GiftBookingPhysical from "GiftBookingPhysical/GiftBookingPhysical"

function App() {
  const [activeSection, setActiveSection] = useState("1");

  return (
    <div className="App">
      <Header activeSection={activeSection} setActiveSection={setActiveSection}/>
      <Routes>
      <Route exact path="/portraits" element={<Main activeSection={activeSection} setActiveSection={setActiveSection} />}/>
      <Route exact path="/book/time" element={<TimeBooking/>} />
      <Route exact path="/book/gift" element={<GiftBooking/>} />
      <Route path="/book/gift/physical" element={<GiftBooking />} />
      <Route path="/book/gift/digital" element={<GiftBooking />} />
      {/* <Route exact path="/book/gift/digital" element={<GiftBookingDigital/>} />
      <Route exact path="/book/gift/physical" element={<GiftBookingPhysical/>} /> */}
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
