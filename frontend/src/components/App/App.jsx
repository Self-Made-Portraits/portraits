import React, { useState } from "react";
import './App.css';
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import Main from "../Main/Main"

function App() {
  const [activeSection, setActiveSection] = useState("1");

  return (
    <div className="App">
      <Header activeSection={activeSection} setActiveSection={setActiveSection}/>
      <Main activeSection={activeSection} setActiveSection={setActiveSection}/>
      <Footer/>
    </div>
  );
}

export default App;
